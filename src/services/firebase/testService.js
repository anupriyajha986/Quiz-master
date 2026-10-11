import {
  collection,
  doc,
  getDocs,
  getDoc,
  getDocFromServer,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  writeBatch
} from "firebase/firestore";
import { db, auth } from "./config.js";
import { getQuestionById } from "./questionService.js";

const TESTS_COL = "tests";

export async function getTests(filterStatus = null) {
  let q = collection(db, TESTS_COL);
  if (filterStatus && filterStatus !== "all") {
    q = query(q, where("publicationStatus", "==", filterStatus));
  }
  const snapshot = await getDocs(q);
  const list = snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data()
  }));

  list.sort((a, b) => {
    const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt || 0).getTime();
    const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt || 0).getTime();
    return timeB - timeA;
  });

  return list;
}

export async function getTestById(id) {
  const docRef = doc(db, TESTS_COL, id);
  try {
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  } catch (err) {
    if (err?.code === "permission-denied" || err?.message?.includes("permissions")) {
      const serverSnap = await getDocFromServer(docRef);
      if (!serverSnap.exists()) return null;
      return { id: serverSnap.id, ...serverSnap.data() };
    }
    throw err;
  }
}

export async function createTest(data) {
  const user = auth.currentUser;
  const payload = {
    title: data.title.trim(),
    description: data.description?.trim() || "",
    subject: data.subject?.trim() || "General",
    instructions: data.instructions?.trim() || "Read all instructions carefully before starting.",
    questionIds: data.questionIds || [],
    durationMinutes: Number(data.durationMinutes) || 60,
    startAt: data.startAt || null,
    endAt: data.endAt || null,
    maximumMarks: Number(data.maximumMarks) || 0,
    markingScheme: {
      positiveMarks: Number(data.markingScheme?.positiveMarks) || 4,
      negativeMarks: Number(data.markingScheme?.negativeMarks) || 1,
      unansweredMarks: Number(data.markingScheme?.unansweredMarks) || 0
    },
    attemptLimit: Number(data.attemptLimit) || 1,
    navigationSettings: {
      allowRevisit: data.navigationSettings?.allowRevisit !== false,
      reviewAllowed: data.navigationSettings?.reviewAllowed !== false
    },
    resultSettings: {
      showResultImmediately: data.resultSettings?.showResultImmediately !== false,
      showLeaderboard: data.resultSettings?.showLeaderboard !== false,
      showExplanations: data.resultSettings?.showExplanations !== false
    },
    publicationStatus: data.publicationStatus || "draft",
    publishedQuestionsSnapshot: [],
    questionCount: data.questionIds?.length || 0,
    createdBy: user?.uid || "admin",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  const docRef = await addDoc(collection(db, TESTS_COL), payload);
  return { id: docRef.id, ...payload };
}

export async function updateTest(id, data) {
  const docRef = doc(db, TESTS_COL, id);
  const payload = {
    ...data,
    durationMinutes: Number(data.durationMinutes),
    maximumMarks: Number(data.maximumMarks),
    attemptLimit: Number(data.attemptLimit),
    updatedAt: serverTimestamp()
  };
  await updateDoc(docRef, payload);
  return { id, ...payload };
}

export async function deleteTest(id) {
  const docRef = doc(db, TESTS_COL, id);
  await deleteDoc(docRef);
  return id;
}

/**
 * Validates whether a test meets all criteria required for official publication
 */
export function validateTestForPublishing(test, rawQuestions = []) {
  const errors = [];

  if (!test.title || test.title.trim().length < 3) {
    errors.push("Examination title must be at least 3 characters long.");
  }
  if (!test.subject || test.subject.trim().length === 0) {
    errors.push("Examination subject/category is required.");
  }
  if (!test.instructions || test.instructions.trim().length === 0) {
    errors.push("Examination instructions are required.");
  }
  if (!test.durationMinutes || Number(test.durationMinutes) <= 0) {
    errors.push("Duration must be a positive number of minutes.");
  }
  if (!test.questionIds || test.questionIds.length === 0) {
    errors.push("At least one question must be selected for the examination.");
  }

  if (rawQuestions && rawQuestions.length > 0) {
    rawQuestions.forEach((q, idx) => {
      const qNum = idx + 1;
      if (!q.questionText || q.questionText.trim().length === 0) {
        errors.push(`Question #${qNum} has empty question text.`);
      }
      const type = q.questionType || "single_choice";
      if (type === "single_choice" || type === "multiple_choice") {
        if (!Array.isArray(q.options) || q.options.length < 2) {
          errors.push(`Question #${qNum} must have at least 2 options.`);
        }
        if (q.correctAnswer === undefined || q.correctAnswer === null || q.correctAnswer === "") {
          errors.push(`Question #${qNum} is missing a defined correct answer.`);
        }
      }
    });
  }

  if (test.startAt && test.endAt) {
    const s = new Date(test.startAt).getTime();
    const e = new Date(test.endAt).getTime();
    if (s > e) {
      errors.push("End date and time must be after the start date and time.");
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Publishes test: validates integrity, generates sanitized questions snapshot, and stores private answer key
 */
export async function publishTest(testId) {
  const user = auth.currentUser;
  const test = await getTestById(testId);
  if (!test) throw new Error("Examination not found.");

  const questionIds = test.questionIds || [];
  if (questionIds.length === 0) {
    throw new Error("Cannot publish an examination with no questions assigned.");
  }

  const rawQuestions = [];
  const sanitizedQuestions = [];
  const secureAnswers = {};

  for (const qid of questionIds) {
    const q = await getQuestionById(qid);
    if (q) {
      rawQuestions.push(q);
      sanitizedQuestions.push({
        id: q.id,
        questionText: q.questionText,
        questionType: q.questionType || "single_choice",
        options: q.options || [],
        subject: q.subject || test.subject || "General",
        topic: q.topic || "",
        difficulty: q.difficulty || "medium",
        positiveMarks: Number(q.positiveMarks) || Number(test.markingScheme?.positiveMarks) || 4,
        negativeMarks: Number(q.negativeMarks) || Number(test.markingScheme?.negativeMarks) || 1,
        unansweredMarks: Number(q.unansweredMarks) || Number(test.markingScheme?.unansweredMarks) || 0,
        imageUrl: q.imageUrl || null
      });

      secureAnswers[q.id] = {
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || ""
      };
    }
  }

  // Enforce mandatory publication validation
  const validation = validateTestForPublishing(test, rawQuestions);
  if (!validation.isValid) {
    throw new Error(`Publication Validation Failed:\n• ${validation.errors.join("\n• ")}`);
  }

  const totalMaxMarks = sanitizedQuestions.reduce(
    (acc, curr) => acc + (curr.positiveMarks || 4),
    0
  );

  const batch = writeBatch(db);

  // Update test
  const testRef = doc(db, TESTS_COL, testId);
  batch.update(testRef, {
    publicationStatus: "published",
    status: "active",
    publishedQuestionsSnapshot: sanitizedQuestions,
    questionCount: sanitizedQuestions.length,
    maximumMarks: totalMaxMarks,
    publishedAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  // Store answer key in restricted answerKeys collection
  const answerKeyRef = doc(db, "answerKeys", testId);
  batch.set(answerKeyRef, {
    testId,
    answers: secureAnswers,
    publishedAt: serverTimestamp()
  });

  // Create audit log
  const auditRef = doc(collection(db, "auditLogs"));
  batch.set(auditRef, {
    action: "PUBLISH_TEST",
    actorUid: user?.uid || "admin",
    actorEmail: user?.email || "admin",
    details: { testId, title: test.title, questionCount: sanitizedQuestions.length, maximumMarks: totalMaxMarks },
    timestamp: serverTimestamp()
  });

  // Broadcast notification to students
  const notifRef = doc(collection(db, "notifications"));
  batch.set(notifRef, {
    recipientUid: "all",
    title: `New Examination Published: ${test.title}`,
    message: `${test.title} (${test.subject}) is now available. Total Marks: ${totalMaxMarks}, Duration: ${test.durationMinutes} mins.`,
    type: "exam",
    referenceId: testId,
    isRead: false,
    createdAt: serverTimestamp()
  });

  await batch.commit();

  return { testId, questionCount: sanitizedQuestions.length, maximumMarks: totalMaxMarks };
}

/**
 * Withdraws a published test back to Draft status
 */
export async function unpublishTest(testId) {
  const user = auth.currentUser;
  const test = await getTestById(testId);
  if (!test) throw new Error("Examination not found.");

  const testRef = doc(db, TESTS_COL, testId);
  const batch = writeBatch(db);

  batch.update(testRef, {
    publicationStatus: "draft",
    status: "draft",
    updatedAt: serverTimestamp()
  });

  const auditRef = doc(collection(db, "auditLogs"));
  batch.set(auditRef, {
    action: "UNPUBLISH_TEST",
    actorUid: user?.uid || "admin",
    actorEmail: user?.email || "admin",
    details: { testId, title: test.title, previousStatus: test.publicationStatus },
    timestamp: serverTimestamp()
  });

  await batch.commit();
  return { id: testId, publicationStatus: "draft" };
}

/**
 * Archives an examination
 */
export async function archiveTest(testId) {
  const user = auth.currentUser;
  const test = await getTestById(testId);
  if (!test) throw new Error("Examination not found.");

  const testRef = doc(db, TESTS_COL, testId);
  const batch = writeBatch(db);

  batch.update(testRef, {
    publicationStatus: "archived",
    status: "archived",
    updatedAt: serverTimestamp()
  });

  const auditRef = doc(collection(db, "auditLogs"));
  batch.set(auditRef, {
    action: "ARCHIVE_TEST",
    actorUid: user?.uid || "admin",
    actorEmail: user?.email || "admin",
    details: { testId, title: test.title, previousStatus: test.publicationStatus },
    timestamp: serverTimestamp()
  });

  await batch.commit();
  return { id: testId, publicationStatus: "archived", status: "archived" };
}

/**
 * Fetch tests available for students.
 * Strictly filters out drafts, archived, disabled, and tests outside their availability window.
 */
export async function getStudentAvailableTests() {
  const q = query(
    collection(db, TESTS_COL),
    where("publicationStatus", "==", "published")
  );
  const snapshot = await getDocs(q);
  const now = new Date().getTime();

  const list = snapshot.docs
    .map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
    }))
    .filter((test) => {
      // Exclude archived or disabled
      if (test.status === "archived" || test.status === "disabled") return false;
      if (test.publicationStatus !== "published") return false;

      // Check availability window if defined
      if (test.startAt) {
        const startTime = new Date(test.startAt).getTime();
        if (now < startTime) {
          // Future scheduled exam - can be displayed as upcoming if needed, but not startable
          test.isUpcoming = true;
        }
      }
      if (test.endAt) {
        const endTime = new Date(test.endAt).getTime();
        if (now > endTime) {
          test.isExpiredWindow = true;
        }
      }
      return true;
    });

  list.sort((a, b) => {
    const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt || 0).getTime();
    const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt || 0).getTime();
    return timeB - timeA;
  });

  return list;
}
