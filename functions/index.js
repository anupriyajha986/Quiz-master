const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

/**
 * Publishes a test by creating an immutable sanitized question snapshot
 * and storing the secure answer key in answerKeys/{testId}.
 */
exports.publishTest = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "User must be authenticated.");
  }

  // Check admin role
  const userDoc = await db.collection("users").doc(request.auth.uid).get();
  const userData = userDoc.data();
  if (!userData || userData.role !== "admin") {
    throw new HttpsError("permission-denied", "Only administrators can publish examinations.");
  }

  const { testId } = request.data;
  if (!testId) {
    throw new HttpsError("invalid-argument", "Missing testId parameter.");
  }

  const testRef = db.collection("tests").doc(testId);
  const testDoc = await testRef.get();
  if (!testDoc.exists) {
    throw new HttpsError("not-found", "Test not found.");
  }

  const test = testDoc.data();
  const questionIds = test.questionIds || [];
  if (questionIds.length === 0) {
    throw new HttpsError("failed-precondition", "Cannot publish a test with no questions.");
  }

  // Fetch all questions
  const sanitizedQuestions = [];
  const secureAnswers = {};

  for (const qid of questionIds) {
    const qDoc = await db.collection("questions").doc(qid).get();
    if (qDoc.exists) {
      const q = qDoc.data();
      sanitizedQuestions.push({
        id: qDoc.id,
        questionText: q.questionText,
        questionType: q.questionType || "single_choice",
        options: q.options || [],
        subject: q.subject || "General",
        topic: q.topic || "",
        difficulty: q.difficulty || "medium",
        positiveMarks: Number(q.positiveMarks) || Number(test.markingScheme?.positiveMarks) || 4,
        negativeMarks: Number(q.negativeMarks) || Number(test.markingScheme?.negativeMarks) || 1,
        unansweredMarks: Number(q.unansweredMarks) || Number(test.markingScheme?.unansweredMarks) || 0,
        imageUrl: q.imageUrl || null
      });

      secureAnswers[qDoc.id] = {
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || ""
      };
    }
  }

  // Calculate maximum marks
  const totalMaxMarks = sanitizedQuestions.reduce((acc, curr) => acc + (curr.positiveMarks || 4), 0);

  const batch = db.batch();

  // Update test with sanitized questions snapshot
  batch.update(testRef, {
    publicationStatus: "published",
    publishedQuestionsSnapshot: sanitizedQuestions,
    questionCount: sanitizedQuestions.length,
    maximumMarks: totalMaxMarks,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  // Save secure answer key
  const answerKeyRef = db.collection("answerKeys").doc(testId);
  batch.set(answerKeyRef, {
    testId,
    answers: secureAnswers,
    publishedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  // Log action
  const auditRef = db.collection("auditLogs").doc();
  batch.set(auditRef, {
    action: "PUBLISH_TEST",
    actorUid: request.auth.uid,
    actorEmail: request.auth.token.email || userData.email,
    details: { testId, title: test.title, questionCount: sanitizedQuestions.length },
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  });

  await batch.commit();

  return { success: true, testId, questionCount: sanitizedQuestions.length, maximumMarks: totalMaxMarks };
});

/**
 * Initializes a new examination attempt or resumes an active eligible one.
 */
exports.initializeAttempt = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "User must be authenticated.");
  }

  const { testId } = request.data;
  const studentUid = request.auth.uid;

  if (!testId) {
    throw new HttpsError("invalid-argument", "Missing testId.");
  }

  // Verify test exists and is published
  const testDoc = await db.collection("tests").doc(testId).get();
  if (!testDoc.exists) {
    throw new HttpsError("not-found", "Test not found.");
  }

  const test = testDoc.data();
  if (test.publicationStatus !== "published") {
    throw new HttpsError("failed-precondition", "Test is not currently available for examination.");
  }

  // Check student account status
  const studentDoc = await db.collection("users").doc(studentUid).get();
  const student = studentDoc.data();
  if (!student || student.accountStatus === "inactive") {
    throw new HttpsError("permission-denied", "Student account is inactive or restricted.");
  }

  // Check existing attempts
  const attemptsQuery = await db.collection("attempts")
    .where("testId", "==", testId)
    .where("studentUid", "==", studentUid)
    .get();

  const existingAttempts = attemptsQuery.docs.map(d => ({ id: d.id, ...d.data() }));

  // Check if there is an in-progress attempt that hasn't expired
  const now = Date.now();
  const activeAttempt = existingAttempts.find(a => {
    if (a.status !== "in_progress") return false;
    const deadline = a.deadlineAt?.toMillis ? a.deadlineAt.toMillis() : new Date(a.deadlineAt).getTime();
    return deadline > now;
  });

  if (activeAttempt) {
    return {
      attemptId: activeAttempt.id,
      isResumed: true,
      deadlineAt: activeAttempt.deadlineAt.toDate ? activeAttempt.deadlineAt.toDate().toISOString() : activeAttempt.deadlineAt,
      startedAt: activeAttempt.startedAt.toDate ? activeAttempt.startedAt.toDate().toISOString() : activeAttempt.startedAt,
      durationMinutes: test.durationMinutes || 60
    };
  }

  // Check attempt limit
  const attemptLimit = Number(test.attemptLimit) || 1;
  const completedAttempts = existingAttempts.filter(a => a.status === "submitted" || a.status === "expired");
  if (completedAttempts.length >= attemptLimit) {
    throw new HttpsError("resource-exhausted", `Maximum attempt limit (${attemptLimit}) reached for this examination.`);
  }

  // Create new attempt with authoritative server-calculated deadline
  const durationMinutes = Number(test.durationMinutes) || 60;
  const startedAtDate = new Date();
  const deadlineAtDate = new Date(startedAtDate.getTime() + durationMinutes * 60 * 1000);

  const attemptRef = db.collection("attempts").doc();
  const attemptData = {
    testId,
    studentUid,
    studentName: student.fullName || "Student",
    studentRollNumber: student.normalizedRollNumber || "",
    status: "in_progress",
    startedAt: admin.firestore.Timestamp.fromDate(startedAtDate),
    deadlineAt: admin.firestore.Timestamp.fromDate(deadlineAtDate),
    durationMinutes,
    lastActivityAt: admin.firestore.FieldValue.serverTimestamp(),
    responseSummary: {
      answered: 0,
      unanswered: test.publishedQuestionsSnapshot?.length || 0,
      markedForReview: 0
    }
  };

  await attemptRef.set(attemptData);

  return {
    attemptId: attemptRef.id,
    isResumed: false,
    startedAt: startedAtDate.toISOString(),
    deadlineAt: deadlineAtDate.toISOString(),
    durationMinutes
  };
});

/**
 * Trusted evaluation and finalization of an attempt.
 */
exports.submitAttempt = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "User must be authenticated.");
  }

  const { attemptId, responses } = request.data;
  const studentUid = request.auth.uid;

  if (!attemptId) {
    throw new HttpsError("invalid-argument", "Missing attemptId.");
  }

  const attemptRef = db.collection("attempts").doc(attemptId);
  const attemptDoc = await attemptRef.get();
  if (!attemptDoc.exists) {
    throw new HttpsError("not-found", "Attempt not found.");
  }

  const attempt = attemptDoc.data();
  if (attempt.studentUid !== studentUid) {
    throw new HttpsError("permission-denied", "Unauthorized attempt finalization.");
  }

  if (attempt.status === "submitted") {
    // Idempotent return of existing result
    const existingResultQuery = await db.collection("results").where("attemptId", "==", attemptId).get();
    if (!existingResultQuery.empty) {
      return { success: true, resultId: existingResultQuery.docs[0].id, alreadySubmitted: true };
    }
  }

  // Get test and secure answer key
  const testDoc = await db.collection("tests").doc(attempt.testId).get();
  const test = testDoc.data();

  const answerKeyDoc = await db.collection("answerKeys").doc(attempt.testId).get();
  const answerKeyData = answerKeyDoc.exists ? answerKeyDoc.data().answers : {};

  const questions = test.publishedQuestionsSnapshot || [];
  const markingScheme = test.markingScheme || { positiveMarks: 4, negativeMarks: 1, unansweredMarks: 0 };

  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;
  let totalScore = 0;
  let totalMaxMarks = 0;

  const subjectBreakdown = {};
  const evaluatedResponses = [];

  for (const q of questions) {
    const qid = q.id;
    const studentResp = responses ? responses[qid] : null;
    const selectedAnswer = studentResp?.selectedAnswer;
    const key = answerKeyData[qid];
    const correctAnswer = key?.correctAnswer;

    const pos = Number(q.positiveMarks) || Number(markingScheme.positiveMarks) || 4;
    const neg = Number(q.negativeMarks) || Number(markingScheme.negativeMarks) || 1;
    const unans = Number(q.unansweredMarks) || Number(markingScheme.unansweredMarks) || 0;

    totalMaxMarks += pos;
    const subj = q.subject || "General";
    if (!subjectBreakdown[subj]) {
      subjectBreakdown[subj] = { total: 0, correct: 0, incorrect: 0, unanswered: 0, score: 0, maxScore: 0 };
    }
    subjectBreakdown[subj].total += 1;
    subjectBreakdown[subj].maxScore += pos;

    let status = "unanswered";
    let marksAwarded = unans;

    if (selectedAnswer === undefined || selectedAnswer === null || selectedAnswer === "") {
      unansweredCount++;
      marksAwarded = unans;
      status = "unanswered";
      subjectBreakdown[subj].unanswered += 1;
    } else if (Array.isArray(correctAnswer)) {
      // Multiple-correct comparison
      const studentArr = Array.isArray(selectedAnswer) ? selectedAnswer.sort().join(",") : selectedAnswer;
      const correctArr = correctAnswer.sort().join(",");
      if (studentArr === correctArr) {
        correctCount++;
        marksAwarded = pos;
        status = "correct";
        subjectBreakdown[subj].correct += 1;
      } else {
        incorrectCount++;
        marksAwarded = -neg;
        status = "incorrect";
        subjectBreakdown[subj].incorrect += 1;
      }
    } else {
      // Single-choice / True-False
      if (String(selectedAnswer).trim().toLowerCase() === String(correctAnswer).trim().toLowerCase()) {
        correctCount++;
        marksAwarded = pos;
        status = "correct";
        subjectBreakdown[subj].correct += 1;
      } else {
        incorrectCount++;
        marksAwarded = -neg;
        status = "incorrect";
        subjectBreakdown[subj].incorrect += 1;
      }
    }

    totalScore += marksAwarded;
    subjectBreakdown[subj].score += marksAwarded;

    evaluatedResponses.push({
      questionId: qid,
      selectedAnswer: selectedAnswer || null,
      correctAnswer: correctAnswer || null,
      isCorrect: status === "correct",
      status,
      marksAwarded,
      explanation: key?.explanation || ""
    });
  }

  const percentage = totalMaxMarks > 0 ? Number(((totalScore / totalMaxMarks) * 100).toFixed(2)) : 0;
  const attemptedCount = correctCount + incorrectCount;
  const accuracy = attemptedCount > 0 ? Number(((correctCount / attemptedCount) * 100).toFixed(2)) : 0;

  const batch = db.batch();

  // Create result document
  const resultRef = db.collection("results").doc();
  const resultData = {
    resultId: resultRef.id,
    attemptId,
    testId: attempt.testId,
    testTitle: test.title,
    studentUid,
    studentName: attempt.studentName || "Student",
    rollNumber: attempt.studentRollNumber || "",
    instituteName: (await db.collection("users").doc(studentUid).get()).data()?.instituteName || "",
    totalQuestions: questions.length,
    correctCount,
    incorrectCount,
    unansweredCount,
    totalScore,
    maximumMarks: totalMaxMarks,
    percentage,
    accuracy,
    subjectBreakdown,
    evaluatedResponses: test.resultSettings?.showExplanations ? evaluatedResponses : [],
    evaluatedAt: admin.firestore.FieldValue.serverTimestamp(),
    publicationStatus: test.resultSettings?.showResultImmediately !== false ? "published" : "hidden"
  };

  batch.set(resultRef, resultData);

  // Update attempt status
  batch.update(attemptRef, {
    status: "submitted",
    submittedAt: admin.firestore.FieldValue.serverTimestamp(),
    resultId: resultRef.id,
    responseSummary: {
      answered: correctCount + incorrectCount,
      unanswered: unansweredCount,
      markedForReview: 0
    }
  });

  // Create notification for student
  const notifRef = db.collection("notifications").doc();
  batch.set(notifRef, {
    recipientUid: studentUid,
    title: `Result Available: ${test.title}`,
    message: `You scored ${totalScore}/${totalMaxMarks} (${percentage}%). Click to view detailed analysis.`,
    type: "result",
    referenceId: resultRef.id,
    isRead: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });

  await batch.commit();

  return {
    success: true,
    resultId: resultRef.id,
    totalScore,
    maximumMarks: totalMaxMarks,
    percentage,
    accuracy
  };
});
