import {
  collection,
  doc,
  getDocs,
  getDoc,
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

const SETS_COL = "questionSets";
const TESTS_COL = "tests";

export async function getQuestionSets(filters = {}) {
  let q = collection(db, SETS_COL);
  const constraints = [];

  if (filters.subjectId && filters.subjectId !== "all") {
    constraints.push(where("subjectId", "==", filters.subjectId));
  }
  if (filters.subject && filters.subject !== "all" && !filters.subjectId) {
    constraints.push(where("subject", "==", filters.subject));
  }
  if (filters.status && filters.status !== "all") {
    constraints.push(where("status", "==", filters.status));
  }

  const qRef = constraints.length > 0 ? query(q, ...constraints) : q;
  const snapshot = await getDocs(qRef);

  let list = snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data()
  }));

  if (filters.search) {
    const term = filters.search.toLowerCase();
    list = list.filter(
      (s) =>
        s.title?.toLowerCase().includes(term) ||
        s.subject?.toLowerCase().includes(term) ||
        s.description?.toLowerCase().includes(term)
    );
  }

  list.sort((a, b) => {
    // Sort by subject first, then by setNumber ascending
    const subjCompare = (a.subject || "").localeCompare(b.subject || "");
    if (subjCompare !== 0) return subjCompare;
    const numA = Number(a.setNumber) || 0;
    const numB = Number(b.setNumber) || 0;
    if (numA !== numB) return numA - numB;
    const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt || 0).getTime();
    const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt || 0).getTime();
    return timeB - timeA;
  });

  return list;
}

export async function getQuestionSetById(id) {
  const docRef = doc(db, SETS_COL, id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function createQuestionSet(data) {
  const user = auth.currentUser;
  const questionIds = Array.isArray(data.questionIds) ? data.questionIds : [];
  const setNumber = Number(data.setNumber) || 1;
  const durationMinutes = Number(data.durationMinutes) || 40;
  const positiveMarks = Number(data.markingScheme?.positiveMarks) || 4;
  const negativeMarks = Number(data.markingScheme?.negativeMarks) || 1;
  const totalMarks = Number(data.totalMarks) || (questionIds.length * positiveMarks);

  const payload = {
    title: data.title?.trim() || `${data.subject || "Subject"} Set ${setNumber}`,
    setNumber,
    subjectId: (data.subjectId || data.subject || "").toLowerCase().trim(),
    subject: data.subject?.trim() || "General",
    description: data.description?.trim() || `Comprehensive assessment set ${setNumber}`,
    instructions: data.instructions?.trim() || "Read each question carefully. Select the correct option. Mark questions for review if needed.",
    durationMinutes,
    questionIds,
    questionCount: questionIds.length,
    totalMarks,
    difficulty: data.difficulty || "Medium",
    markingScheme: {
      positiveMarks,
      negativeMarks,
      unansweredMarks: Number(data.markingScheme?.unansweredMarks) || 0
    },
    attemptLimit: Number(data.attemptLimit) || 2,
    status: data.status || "draft", // "draft" | "published" | "archived"
    publicationStatus: data.status === "published" ? "published" : "draft",
    publishedQuestionsSnapshot: [],
    createdBy: user?.uid || "admin",
    updatedBy: user?.uid || "admin",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  const customId = data.id ? String(data.id).trim() : null;
  let docId;
  if (customId) {
    const docRef = doc(db, SETS_COL, customId);
    await setDoc(docRef, payload, { merge: true });
    docId = customId;
  } else {
    const docRef = await addDoc(collection(db, SETS_COL), payload);
    docId = docRef.id;
  }

  // If status is published, publish snapshot immediately
  if (payload.status === "published" && questionIds.length > 0) {
    await publishQuestionSet(docId);
  }

  return { id: docId, ...payload };
}

export async function updateQuestionSet(id, data) {
  const user = auth.currentUser;
  const docRef = doc(db, SETS_COL, id);
  const questionIds = Array.isArray(data.questionIds) ? data.questionIds : undefined;

  const payload = {
    ...data,
    updatedBy: user?.uid || "admin",
    updatedAt: serverTimestamp()
  };

  if (questionIds !== undefined) {
    payload.questionIds = questionIds;
    payload.questionCount = questionIds.length;
    const pos = Number(data.markingScheme?.positiveMarks) || 4;
    payload.totalMarks = Number(data.totalMarks) || (questionIds.length * pos);
  }

  if (data.status) {
    payload.publicationStatus = data.status === "published" ? "published" : "draft";
  }

  await updateDoc(docRef, payload);

  // If set is published, re-generate snapshot
  const snap = await getDoc(docRef);
  if (snap.exists() && snap.data().publicationStatus === "published") {
    await publishQuestionSet(id);
  }

  return { id, ...payload };
}

export async function deleteQuestionSet(id) {
  // Check if any student attempts exist for this set
  const attemptsQ = query(collection(db, "attempts"), where("testId", "==", id));
  const attemptsSnap = await getDocs(attemptsQ);
  if (!attemptsSnap.empty) {
    throw new Error(`Cannot delete set: ${attemptsSnap.size} student attempt(s) are linked to it. Consider archiving the set instead.`);
  }

  const batch = writeBatch(db);
  batch.delete(doc(db, SETS_COL, id));
  // Clean up tests entry if mirror exists
  batch.delete(doc(db, TESTS_COL, id));
  batch.delete(doc(db, "answerKeys", id));
  await batch.commit();

  return id;
}

export async function archiveQuestionSet(id) {
  const user = auth.currentUser;
  const batch = writeBatch(db);
  const setRef = doc(db, SETS_COL, id);
  batch.update(setRef, {
    status: "archived",
    publicationStatus: "archived",
    updatedBy: user?.uid || "admin",
    updatedAt: serverTimestamp()
  });

  const testRef = doc(db, TESTS_COL, id);
  const testSnap = await getDoc(testRef);
  if (testSnap.exists()) {
    batch.update(testRef, {
      publicationStatus: "archived",
      updatedAt: serverTimestamp()
    });
  }

  await batch.commit();
  return id;
}

export async function duplicateQuestionSet(id) {
  const orig = await getQuestionSetById(id);
  if (!orig) throw new Error("Original set not found.");

  const duplicateData = {
    ...orig,
    title: `${orig.title} (Copy)`,
    status: "draft",
    publicationStatus: "draft",
    publishedQuestionsSnapshot: []
  };
  delete duplicateData.id;
  delete duplicateData.createdAt;
  delete duplicateData.updatedAt;

  return await createQuestionSet(duplicateData);
}

/**
 * Publishes question set: generates sanitized candidate snapshot and secures answer key
 */
export async function publishQuestionSet(setId) {
  const user = auth.currentUser;
  const set = await getQuestionSetById(setId);
  if (!set) throw new Error("Question set not found");

  const questionIds = set.questionIds || [];
  if (questionIds.length === 0) {
    throw new Error("Cannot publish a question set with no questions assigned.");
  }

  const sanitizedQuestions = [];
  const secureAnswers = {};

  for (const qid of questionIds) {
    const q = await getQuestionById(qid);
    if (q) {
      // Map option labels if needed
      const opts = (q.options || []).map((opt, idx) => {
        if (typeof opt === "string") {
          return { id: String.fromCharCode(65 + idx), text: opt };
        }
        return opt;
      });

      sanitizedQuestions.push({
        id: q.id,
        questionText: q.questionText,
        questionType: q.questionType || "single_choice",
        options: opts,
        subject: q.subject || set.subject || "General",
        topic: q.topic || "",
        difficulty: q.difficulty || "medium",
        positiveMarks: Number(q.positiveMarks) || Number(set.markingScheme?.positiveMarks) || 4,
        negativeMarks: Number(q.negativeMarks) || Number(set.markingScheme?.negativeMarks) || 1,
        unansweredMarks: Number(q.unansweredMarks) || Number(set.markingScheme?.unansweredMarks) || 0,
        imageUrl: q.imageUrl || null
      });

      // Format correct answer for authoritative evaluation
      let correctAns = q.correctAnswer;
      if (correctAns === undefined && q.correctOptionIndex !== undefined) {
        correctAns = String.fromCharCode(65 + Number(q.correctOptionIndex));
      }

      secureAnswers[q.id] = {
        correctAnswer: correctAns,
        correctOptionIndex: q.correctOptionIndex !== undefined ? q.correctOptionIndex : null,
        explanation: q.explanation || ""
      };
    }
  }

  const totalMaxMarks = sanitizedQuestions.reduce(
    (acc, curr) => acc + (curr.positiveMarks || 4),
    0
  );

  const batch = writeBatch(db);

  // 1. Update question set document
  const setRef = doc(db, SETS_COL, setId);
  batch.update(setRef, {
    status: "published",
    publicationStatus: "published",
    publishedQuestionsSnapshot: sanitizedQuestions,
    questionCount: sanitizedQuestions.length,
    totalMarks: totalMaxMarks,
    updatedBy: user?.uid || "admin",
    updatedAt: serverTimestamp()
  });

  // 2. Mirror into tests collection for full backward & forward exam compatibility
  const testRef = doc(db, TESTS_COL, setId);
  batch.set(testRef, {
    title: set.title,
    description: set.description || "",
    subjectId: set.subjectId || (set.subject || "").toLowerCase(),
    subject: set.subject || "General",
    instructions: set.instructions || "Read all instructions carefully before starting.",
    questionIds: set.questionIds || [],
    durationMinutes: Number(set.durationMinutes) || 40,
    maximumMarks: totalMaxMarks,
    markingScheme: set.markingScheme || { positiveMarks: 4, negativeMarks: 1, unansweredMarks: 0 },
    attemptLimit: Number(set.attemptLimit) || 2,
    navigationSettings: { allowRevisit: true, reviewAllowed: true },
    resultSettings: { showResultImmediately: true, showLeaderboard: true, showExplanations: true },
    publicationStatus: "published",
    publishedQuestionsSnapshot: sanitizedQuestions,
    questionCount: sanitizedQuestions.length,
    setId,
    setNumber: set.setNumber || 1,
    createdBy: set.createdBy || user?.uid || "admin",
    updatedAt: serverTimestamp()
  }, { merge: true });

  // 3. Store authoritative answer key in answerKeys vault (Admins only)
  const answerKeyRef = doc(db, "answerKeys", setId);
  batch.set(answerKeyRef, {
    testId: setId,
    setId,
    answers: secureAnswers,
    publishedAt: serverTimestamp()
  });

  // 4. Audit Log
  const auditRef = doc(collection(db, "auditLogs"));
  batch.set(auditRef, {
    action: "PUBLISH_QUESTION_SET",
    actorUid: user?.uid || "admin",
    actorEmail: user?.email || "admin",
    details: { setId, title: set.title, subject: set.subject, questionCount: sanitizedQuestions.length },
    timestamp: serverTimestamp()
  });

  // 5. Broadcast notification to all students
  const notifRef = doc(collection(db, "notifications"));
  batch.set(notifRef, {
    recipientUid: "all",
    title: `New Exam Set Published: ${set.title}`,
    message: `${set.subject} - ${set.title} is now available (${sanitizedQuestions.length} Questions, ${set.durationMinutes || 40} mins, ${totalMaxMarks} Marks).`,
    type: "exam",
    referenceId: setId,
    isRead: false,
    createdAt: serverTimestamp()
  });

  await batch.commit();

  return {
    setId,
    questionCount: sanitizedQuestions.length,
    maximumMarks: totalMaxMarks
  };
}

export async function unpublishQuestionSet(setId) {
  const user = auth.currentUser;
  const batch = writeBatch(db);

  const setRef = doc(db, SETS_COL, setId);
  batch.update(setRef, {
    status: "draft",
    publicationStatus: "draft",
    updatedBy: user?.uid || "admin",
    updatedAt: serverTimestamp()
  });

  const testRef = doc(db, TESTS_COL, setId);
  const testSnap = await getDoc(testRef);
  if (testSnap.exists()) {
    batch.update(testRef, {
      publicationStatus: "draft",
      updatedAt: serverTimestamp()
    });
  }

  await batch.commit();
  return setId;
}
