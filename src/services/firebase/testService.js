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
 * Publishes test: generates sanitized questions snapshot and private answer key
 */
export async function publishTest(testId) {
  const user = auth.currentUser;
  const test = await getTestById(testId);
  if (!test) throw new Error("Test not found");

  const questionIds = test.questionIds || [];
  if (questionIds.length === 0) {
    throw new Error("Cannot publish a test with no questions assigned.");
  }

  const sanitizedQuestions = [];
  const secureAnswers = {};

  for (const qid of questionIds) {
    const q = await getQuestionById(qid);
    if (q) {
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

  const totalMaxMarks = sanitizedQuestions.reduce(
    (acc, curr) => acc + (curr.positiveMarks || 4),
    0
  );

  const batch = writeBatch(db);

  // Update test
  const testRef = doc(db, TESTS_COL, testId);
  batch.update(testRef, {
    publicationStatus: "published",
    publishedQuestionsSnapshot: sanitizedQuestions,
    questionCount: sanitizedQuestions.length,
    maximumMarks: totalMaxMarks,
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
    details: { testId, title: test.title, questionCount: sanitizedQuestions.length },
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
 * Fetch tests available for students
 */
export async function getStudentAvailableTests() {
  const q = query(
    collection(db, TESTS_COL),
    where("publicationStatus", "in", ["published", "scheduled"])
  );
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
