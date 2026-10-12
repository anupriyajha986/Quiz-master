import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  serverTimestamp,
  writeBatch
} from "firebase/firestore";
import { db, auth } from "./config.js";
import { getTestById } from "./testService.js";

const ATTEMPTS_COL = "attempts";
const RESULTS_COL = "results";

/**
 * Checks if the student has an active non-expired attempt for this test
 */
export async function getActiveAttempt(testId, studentUid) {
  const q = query(
    collection(db, ATTEMPTS_COL),
    where("testId", "==", testId),
    where("studentUid", "==", studentUid)
  );
  const snap = await getDocs(q);
  const attempts = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  const now = Date.now();
  const active = attempts.find((a) => {
    if (a.status !== "in_progress") return false;
    const deadline = a.deadlineAt?.toMillis
      ? a.deadlineAt.toMillis()
      : new Date(a.deadlineAt).getTime();
    return deadline > now;
  });

  return active || null;
}

/**
 * Gets student's past attempts for a given test
 */
export async function getStudentAttemptsForTest(testId, studentUid) {
  const q = query(
    collection(db, ATTEMPTS_COL),
    where("testId", "==", testId),
    where("studentUid", "==", studentUid)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Explicitly initializes a new examination attempt.
 * Must only be invoked when the user clicks 'Start Test' on the instructions screen!
 */
export async function startAttempt(testId, studentProfile, preloadedTest = null) {
  const user = auth.currentUser;
  if (!user) throw new Error("Must be authenticated to start examination.");

  const existingActive = await getActiveAttempt(testId, user.uid);
  if (existingActive) {
    return { attempt: existingActive, isResumed: true };
  }

  let test = preloadedTest;
  if (!test) {
    let retries = 3;
    while (retries > 0) {
      try {
        test = await getTestById(testId);
        if (test) break;
      } catch (err) {
        retries--;
        if (retries === 0) throw err;
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  }
  if (!test) throw new Error("Examination not found.");
  if (test.publicationStatus !== "published") {
    throw new Error("This examination is not currently active.");
  }
  if (test.status === "archived" || test.status === "disabled") {
    throw new Error("This examination has been archived or disabled.");
  }

  const now = new Date();
  if (test.startAt) {
    const startDate = new Date(test.startAt);
    if (now < startDate) {
      throw new Error(`This examination has not started yet. Scheduled to open at ${startDate.toLocaleString()}.`);
    }
  }
  if (test.endAt) {
    const endDate = new Date(test.endAt);
    if (now > endDate) {
      throw new Error(`This examination window closed at ${endDate.toLocaleString()}.`);
    }
  }

  console.log("  -> startAttempt: checking past attempts...");
  const pastAttempts = await getStudentAttemptsForTest(testId, user.uid);
  const completed = pastAttempts.filter(
    (a) => a.status === "submitted" || a.status === "expired"
  );
  const attemptLimit = Number(test.attemptLimit) || 1;
  if (completed.length >= attemptLimit) {
    throw new Error(`You have reached the maximum allowed attempts (${attemptLimit}) for this examination.`);
  }

  console.log("  -> startAttempt: writing new attempt doc...");
  const durationMinutes = Number(test.durationMinutes) || 60;
  const startedAtDate = new Date();
  const deadlineAtDate = new Date(startedAtDate.getTime() + durationMinutes * 60 * 1000);

  const attemptRef = doc(collection(db, ATTEMPTS_COL));
  const attemptData = {
    testId,
    testTitle: test.title,
    studentUid: user.uid,
    studentName: studentProfile?.fullName || user.displayName || "Student",
    studentRollNumber: studentProfile?.normalizedRollNumber || "",
    instituteName: studentProfile?.instituteName || "",
    status: "in_progress",
    startedAt: startedAtDate.toISOString(),
    deadlineAt: deadlineAtDate.toISOString(),
    durationMinutes,
    lastActivityAt: serverTimestamp(),
    responseSummary: {
      answered: 0,
      unanswered: test.publishedQuestionsSnapshot?.length || 0,
      markedForReview: 0
    }
  };

  await setDoc(attemptRef, attemptData);
  console.log("  -> startAttempt: success!");

  return {
    attempt: { id: attemptRef.id, ...attemptData },
    isResumed: false
  };
}

/**
 * Persists an answer response to Firestore
 */
export async function saveResponse(attemptId, questionId, responseData) {
  const respRef = doc(db, `${ATTEMPTS_COL}/${attemptId}/responses`, questionId);
  const payload = {
    questionId,
    selectedAnswer: responseData.selectedAnswer !== undefined ? responseData.selectedAnswer : null,
    markedForReview: !!responseData.markedForReview,
    savedAt: new Date().toISOString()
  };

  await setDoc(respRef, payload, { merge: true });

  // Update attempt activity
  const attemptRef = doc(db, ATTEMPTS_COL, attemptId);
  await updateDoc(attemptRef, {
    lastActivityAt: serverTimestamp()
  });

  return payload;
}

/**
 * Retrieves all saved responses for an attempt (used for refresh/recovery)
 */
export async function getAttemptResponses(attemptId) {
  const snapshot = await getDocs(
    collection(db, `${ATTEMPTS_COL}/${attemptId}/responses`)
  );
  const responses = {};
  snapshot.docs.forEach((docSnap) => {
    responses[docSnap.id] = docSnap.data();
  });
  return responses;
}

/**
 * Persists candidate scratchpad notes to the attempt doc
 */
export async function saveAttemptNotes(attemptId, notes) {
  const attemptRef = doc(db, ATTEMPTS_COL, attemptId);
  await updateDoc(attemptRef, {
    candidateNotes: notes,
    lastActivityAt: serverTimestamp()
  });
  return notes;
}

/**
 * Retrieves candidate scratchpad notes
 */
export async function getAttemptNotes(attemptId) {
  const attemptRef = doc(db, ATTEMPTS_COL, attemptId);
  const snap = await getDoc(attemptRef);
  if (snap.exists()) {
    return snap.data().candidateNotes || "";
  }
  return "";
}

/**
 * Retrieves a single attempt by ID
 */
export async function getAttemptById(attemptId) {
  const attemptRef = doc(db, ATTEMPTS_COL, attemptId);
  const snap = await getDoc(attemptRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

/**
 * Reliable submission & evaluation of an exam attempt.
 * Students can finalize and record their attempt without requiring answerKey access.
 * If called with admin authority or via Cloud Functions, authoritative evaluation is executed immediately.
 */
export async function submitAttempt(attemptId, responses, test, studentProfile) {
  const user = auth.currentUser;
  if (!user) throw new Error("Unauthenticated submission. Please sign in to submit.");

  const attemptRef = doc(db, ATTEMPTS_COL, attemptId);
  const attemptSnap = await getDoc(attemptRef);
  if (!attemptSnap.exists()) throw new Error("Attempt not found.");

  const attempt = attemptSnap.data();

  // Check caller role
  let isCallerAdmin = false;
  try {
    const userSnap = await getDoc(doc(db, "users", user.uid));
    if (userSnap.exists() && userSnap.data()?.role === "admin") {
      isCallerAdmin = true;
    }
  } catch {
    isCallerAdmin = false;
  }

  // Verify ownership
  if (attempt.studentUid !== user.uid && !isCallerAdmin) {
    throw new Error("Unauthorized attempt finalization.");
  }

  // Idempotent return if already submitted
  const deterministicResultId = attempt.resultId || `result_${attemptId}`;
  if (attempt.status === "submitted") {
    try {
      const detSnap = await getDoc(doc(db, RESULTS_COL, deterministicResultId));
      if (detSnap.exists()) {
        return { resultId: detSnap.id, ...detSnap.data(), alreadySubmitted: true };
      }
    } catch (e) {
      console.warn("Could not check deterministic result doc:", e);
    }
    const qResult = query(collection(db, RESULTS_COL), where("attemptId", "==", attemptId));
    const rSnap = await getDocs(qResult);
    if (!rSnap.empty) {
      return { resultId: rSnap.docs[0].id, ...rSnap.docs[0].data(), alreadySubmitted: true };
    }
    return {
      attemptId,
      status: "submitted",
      evaluationStatus: "pending",
      alreadySubmitted: true
    };
  }

  // Reconcile and count questions
  let resolvedTest = test;
  if (!resolvedTest || !resolvedTest.publishedQuestionsSnapshot || resolvedTest.publishedQuestionsSnapshot.length === 0) {
    try {
      const testSnap = await getDoc(doc(db, "tests", attempt.testId));
      if (testSnap.exists()) {
        resolvedTest = { id: testSnap.id, ...testSnap.data(), ...(resolvedTest || {}) };
      }
    } catch (e) {
      console.warn("Could not fetch test during submitAttempt:", e);
    }
  }

  const questions = resolvedTest?.publishedQuestionsSnapshot || [];
  let answeredCount = 0;
  let unansweredCount = 0;
  questions.forEach((q) => {
    const resp = responses ? responses[q.id] : null;
    if (resp && resp.selectedAnswer !== null && resp.selectedAnswer !== undefined && resp.selectedAnswer !== "") {
      answeredCount++;
    } else {
      unansweredCount++;
    }
  });

  // Authoritative submission timestamp and elapsed time calculation
  const startMs = attempt.startedAt ? new Date(attempt.startedAt).getTime() : Date.now();
  const submitMs = Date.now();
  const elapsedSec = Math.max(0, Math.floor((submitMs - startMs) / 1000));
  const elapsedMins = Math.floor(elapsedSec / 60);
  const remSec = elapsedSec % 60;
  const timeTakenFormatted = `${elapsedMins}m ${remSec}s`;
  const submittedTimestamp = new Date().toISOString();

  // Execute authoritative evaluation against answerKeys vault BEFORE updating Firestore
  try {
    const answerKeyDoc = await getDoc(doc(db, "answerKeys", attempt.testId));
    const answerKeyData = answerKeyDoc.exists() ? (answerKeyDoc.data().answers || {}) : {};

    const evaluation = evaluateTestResponses(
      questions,
      resolvedTest?.markingScheme || { positiveMarks: 4, negativeMarks: 1, unansweredMarks: 0 },
      responses,
      answerKeyData
    );

    const testTitle = resolvedTest?.title || resolvedTest?.name || attempt.testTitle || "Examination";
    const testSubject = resolvedTest?.subject || attempt.subject || "General";
    const studentUid = user.uid; // Always authenticated Firebase UID
    const studentId = user.uid;  // Interoperability with queries expecting studentId

    const passPct = Number(resolvedTest?.passPercentage || resolvedTest?.passingPercentage || resolvedTest?.cutoffPercentage) || 40;
    const resultStatus = evaluation.percentage >= passPct ? "passed" : "failed";

    const resultRef = doc(db, RESULTS_COL, deterministicResultId);
    const resultData = {
      resultId: deterministicResultId,
      id: deterministicResultId,
      attemptId,
      testId: attempt.testId,
      examId: attempt.testId,
      testTitle,
      examTitle: testTitle,
      subject: testSubject,
      studentUid,
      studentId,
      studentName: studentProfile?.fullName || attempt.studentName || user.displayName || "Student",
      rollNumber: studentProfile?.normalizedRollNumber || attempt.studentRollNumber || "",
      instituteName: studentProfile?.instituteName || attempt.instituteName || "",
      totalQuestions: questions.length,
      attemptedCount: evaluation.attemptedCount,
      attemptedQuestions: evaluation.attemptedCount,
      correctCount: evaluation.correctCount,
      correctAnswers: evaluation.correctCount,
      incorrectCount: evaluation.incorrectCount,
      incorrectAnswers: evaluation.incorrectCount,
      unansweredCount: evaluation.unansweredCount,
      unansweredQuestions: evaluation.unansweredCount,
      positiveMarks: evaluation.positiveMarks,
      negativeMarks: evaluation.negativeMarks,
      totalScore: evaluation.totalScore,
      finalScore: evaluation.totalScore,
      maximumMarks: evaluation.totalMaxMarks,
      maximumPossibleMarks: evaluation.totalMaxMarks,
      percentage: evaluation.percentage,
      accuracy: evaluation.accuracy,
      timeTaken: timeTakenFormatted,
      timeTakenSeconds: elapsedSec,
      resultStatus,
      status: "evaluated",
      subjectBreakdown: evaluation.subjectBreakdown || {},
      evaluatedResponses: resolvedTest?.resultSettings?.showExplanations !== false ? (evaluation.evaluatedResponses || []) : [],
      submittedAt: submittedTimestamp,
      evaluatedAt: new Date().toISOString(),
      publicationStatus: resolvedTest?.resultSettings?.showResultImmediately !== false ? "published" : "hidden"
    };

    // Atomic batch write: Write result doc AND transition attempt to submitted in the same atomic commit
    const batch = writeBatch(db);
    batch.set(resultRef, resultData);
    batch.update(attemptRef, {
      status: "submitted",
      submittedAt: submittedTimestamp,
      lastActivityAt: serverTimestamp(),
      resultId: deterministicResultId,
      responseSummary: {
        answered: answeredCount,
        unanswered: unansweredCount,
        markedForReview: 0
      }
    });

    const notifRef = doc(collection(db, "notifications"));
    batch.set(notifRef, {
      recipientUid: studentUid,
      title: `Result Available: ${testTitle}`,
      message: `You scored ${evaluation.totalScore}/${evaluation.totalMaxMarks} (${evaluation.percentage}%). Click to view full report.`,
      type: "result",
      referenceId: deterministicResultId,
      isRead: false,
      createdAt: serverTimestamp()
    });

    await batch.commit();
    return { success: true, resultId: deterministicResultId, ...resultData };
  } catch (evalErr) {
    console.error("Evaluation failure in submitAttempt:", evalErr);
    const testTitle = resolvedTest?.title || resolvedTest?.name || attempt.testTitle || "Examination";

    // Fallback: Transition attempt to submitted if evaluation failed
    try {
      await updateDoc(attemptRef, {
        status: "submitted",
        submittedAt: submittedTimestamp,
        lastActivityAt: serverTimestamp(),
        responseSummary: {
          answered: answeredCount,
          unanswered: unansweredCount,
          markedForReview: 0
        }
      });
    } catch (attErr) {
      console.warn("Could not update attempt in fallback:", attErr);
    }

    // Fallback confirmation notification
    try {
      const notifRef = doc(collection(db, "notifications"));
      await setDoc(notifRef, {
        recipientUid: user.uid,
        title: `Examination Submitted: ${testTitle}`,
        message: `Your examination session was submitted successfully (${answeredCount} answered, ${unansweredCount} unattempted). Scorecard will be published upon evaluation.`,
        type: "exam_submission",
        referenceId: attemptId,
        isRead: false,
        createdAt: serverTimestamp()
      });
    } catch (notifErr) {
      console.warn("Notification notice:", notifErr);
    }

    return {
      success: true,
      attemptId,
      testId: attempt.testId,
      testTitle,
      status: "submitted",
      evaluationStatus: "pending",
      answeredCount,
      unansweredCount,
      submittedAt: submittedTimestamp
    };
  }
}

/**
 * Internal authoritative evaluation engine shared between candidate submission and admin reconciliation
 */
export function evaluateTestResponses(questions, markingScheme, responses, answerKeyData) {
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;
  let positiveMarks = 0;
  let negativeMarks = 0;
  let totalScore = 0;
  let totalMaxMarks = 0;

  const subjectBreakdown = {};
  const evaluatedResponses = [];

  for (const q of questions) {
    const qid = q.id;
    const studentResp = responses ? responses[qid] : null;
    const selectedAnswer = studentResp?.selectedAnswer;
    const key = answerKeyData ? answerKeyData[qid] : null;
    const correctAnswer = key?.correctAnswer;

    const pos = Number(q.positiveMarks) || Number(markingScheme?.positiveMarks) || 4;
    const neg = Number(q.negativeMarks) || Number(markingScheme?.negativeMarks) || 1;
    const unans = Number(q.unansweredMarks) || Number(markingScheme?.unansweredMarks) || 0;

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
      const studentArr = Array.isArray(selectedAnswer) ? [...selectedAnswer].sort().join(",") : selectedAnswer;
      const correctArr = [...correctAnswer].sort().join(",");
      if (studentArr === correctArr) {
        correctCount++;
        marksAwarded = pos;
        positiveMarks += pos;
        status = "correct";
        subjectBreakdown[subj].correct += 1;
      } else {
        incorrectCount++;
        marksAwarded = -neg;
        negativeMarks += neg;
        status = "incorrect";
        subjectBreakdown[subj].incorrect += 1;
      }
    } else {
      if (String(selectedAnswer).trim().toLowerCase() === String(correctAnswer).trim().toLowerCase()) {
        correctCount++;
        marksAwarded = pos;
        positiveMarks += pos;
        status = "correct";
        subjectBreakdown[subj].correct += 1;
      } else {
        incorrectCount++;
        marksAwarded = -neg;
        negativeMarks += neg;
        status = "incorrect";
        subjectBreakdown[subj].incorrect += 1;
      }
    }

    totalScore += marksAwarded;
    subjectBreakdown[subj].score += marksAwarded;

    evaluatedResponses.push({
      questionId: qid,
      questionText: q.questionText,
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

  return {
    correctCount,
    incorrectCount,
    unansweredCount,
    attemptedCount,
    positiveMarks,
    negativeMarks,
    totalScore,
    totalMaxMarks,
    percentage,
    accuracy,
    subjectBreakdown,
    evaluatedResponses
  };
}

/**
 * Authoritative admin force-submit / session recovery
 */
export async function adminForceSubmitAttempt(attemptId, { reason, adminUid, adminName, adminEmail } = {}) {
  const attemptRef = doc(db, ATTEMPTS_COL, attemptId);
  const attemptSnap = await getDoc(attemptRef);
  if (!attemptSnap.exists()) throw new Error("Attempt not found.");

  const attempt = attemptSnap.data();
  if (attempt.status === "submitted") {
    const qResult = query(collection(db, RESULTS_COL), where("attemptId", "==", attemptId));
    const rSnap = await getDocs(qResult);
    if (!rSnap.empty) {
      if (!attempt.resultId) {
        await updateDoc(attemptRef, { resultId: rSnap.docs[0].id });
      }
      return { resultId: rSnap.docs[0].id, ...rSnap.docs[0].data(), alreadySubmitted: true };
    }
  }

  const test = await getTestById(attempt.testId);
  if (!test) throw new Error("Associated examination record not found.");

  // Fetch saved responses from subcollection
  const responses = await getAttemptResponses(attemptId);

  // Fetch private answer key
  const answerKeyDoc = await getDoc(doc(db, "answerKeys", attempt.testId));
  const answerKeyData = answerKeyDoc.exists() ? answerKeyDoc.data().answers : {};

  const evaluation = evaluateTestResponses(
    test.publishedQuestionsSnapshot || [],
    test.markingScheme || { positiveMarks: 4, negativeMarks: 1, unansweredMarks: 0 },
    responses,
    answerKeyData
  );

  const studentUid = attempt.studentUid;
  const passPct = Number(test?.passPercentage || test?.passingPercentage || test?.cutoffPercentage) || 40;
  const resultStatus = evaluation.percentage >= passPct ? "passed" : "failed";

  const startMs = attempt.startedAt ? new Date(attempt.startedAt).getTime() : Date.now();
  const submitMs = attempt.submittedAt ? new Date(attempt.submittedAt).getTime() : Date.now();
  const elapsedSec = Math.max(0, Math.floor((submitMs - startMs) / 1000));
  const elapsedMins = Math.floor(elapsedSec / 60);
  const remSec = elapsedSec % 60;
  const timeTakenFormatted = `${elapsedMins}m ${remSec}s`;

  const batch = writeBatch(db);

  const resultId = attempt.resultId || `result_${attemptId}`;
  const resultRef = doc(db, RESULTS_COL, resultId);
  const resultData = {
    resultId,
    id: resultId,
    attemptId,
    testId: attempt.testId,
    examId: attempt.testId,
    testTitle: test.title,
    examTitle: test.title,
    subject: test.subject || "General",
    studentUid,
    studentId: studentUid,
    studentName: attempt.studentName || "Student",
    rollNumber: attempt.studentRollNumber || "",
    instituteName: attempt.instituteName || "",
    totalQuestions: (test.publishedQuestionsSnapshot || []).length,
    attemptedCount: evaluation.attemptedCount,
    attemptedQuestions: evaluation.attemptedCount,
    correctCount: evaluation.correctCount,
    correctAnswers: evaluation.correctCount,
    incorrectCount: evaluation.incorrectCount,
    incorrectAnswers: evaluation.incorrectCount,
    unansweredCount: evaluation.unansweredCount,
    unansweredQuestions: evaluation.unansweredCount,
    positiveMarks: evaluation.positiveMarks,
    negativeMarks: evaluation.negativeMarks,
    totalScore: evaluation.totalScore,
    finalScore: evaluation.totalScore,
    maximumMarks: evaluation.totalMaxMarks,
    maximumPossibleMarks: evaluation.totalMaxMarks,
    percentage: evaluation.percentage,
    accuracy: evaluation.accuracy,
    timeTaken: timeTakenFormatted,
    timeTakenSeconds: elapsedSec,
    resultStatus,
    status: "evaluated",
    subjectBreakdown: evaluation.subjectBreakdown,
    evaluatedResponses: test.resultSettings?.showExplanations !== false ? evaluation.evaluatedResponses : [],
    submittedAt: attempt.submittedAt || new Date().toISOString(),
    evaluatedAt: new Date().toISOString(),
    publicationStatus: test.resultSettings?.showResultImmediately !== false ? "published" : "hidden",
    reconciledByAdmin: true,
    reconciliationReason: reason || "Administrative intervention / session reconciliation"
  };

  batch.set(resultRef, resultData);

  // Update attempt
  batch.update(attemptRef, {
    status: "submitted",
    submittedAt: attempt.submittedAt || new Date().toISOString(),
    resultId: resultRef.id,
    reconciledBy: {
      adminUid: adminUid || "admin",
      adminName: adminName || "Administrator",
      adminEmail: adminEmail || "",
      reason: reason || "Administrative force-submit / session recovery",
      at: new Date().toISOString()
    },
    responseSummary: {
      answered: evaluation.correctCount + evaluation.incorrectCount,
      unanswered: evaluation.unansweredCount,
      markedForReview: 0
    }
  });

  // Audit log
  const auditRef = doc(collection(db, "auditLogs"));
  batch.set(auditRef, {
    action: "FORCE_SUBMIT_ATTEMPT",
    actorUid: adminUid || "admin",
    actorEmail: adminEmail || "admin",
    actorName: adminName || "Administrator",
    details: {
      attemptId,
      testId: attempt.testId,
      testTitle: test.title,
      studentUid,
      studentName: attempt.studentName,
      reason: reason || "Candidate session reconciliation",
      totalScore: evaluation.totalScore,
      maximumMarks: evaluation.totalMaxMarks
    },
    timestamp: serverTimestamp()
  });

  // Notification for student
  const notifRef = doc(collection(db, "notifications"));
  batch.set(notifRef, {
    recipientUid: studentUid,
    title: `Examination Finalized: ${test.title}`,
    message: `Your examination session was authoritatively finalized by administration (${reason || "Session completed"}). Score: ${evaluation.totalScore}/${evaluation.totalMaxMarks} (${evaluation.percentage}%).`,
    type: "result",
    referenceId: resultRef.id,
    isRead: false,
    createdAt: serverTimestamp()
  });

  await batch.commit();

  return { resultId: resultRef.id, ...resultData };
}

/**
 * Fetch all attempts for admin monitoring
 */
export async function getAllAttempts(filterTestId = null) {
  let q = collection(db, ATTEMPTS_COL);
  if (filterTestId && filterTestId !== "all") {
    q = query(q, where("testId", "==", filterTestId));
  }
  const snap = await getDocs(q);
  const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  list.sort((a, b) => {
    const timeA = new Date(a.startedAt || 0).getTime();
    const timeB = new Date(b.startedAt || 0).getTime();
    return timeB - timeA;
  });

  return list;
}
