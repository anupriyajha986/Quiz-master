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

const QUESTIONS_COL = "questions";

/**
 * Standardizes option representation to [{ id: "A", text: "..." }, ...]
 */
export function formatOptions(options) {
  if (!Array.isArray(options)) return [];
  return options.map((opt, idx) => {
    const defaultLetter = String.fromCharCode(65 + idx);
    if (typeof opt === "string") {
      return { id: defaultLetter, text: opt };
    }
    return {
      id: opt.id || defaultLetter,
      text: typeof opt.text === "string" ? opt.text : String(opt || "")
    };
  });
}

export async function getQuestions(filters = {}) {
  try {
    let q = collection(db, QUESTIONS_COL);
    const constraints = [];

    if (filters.subjectId && filters.subjectId !== "all") {
      constraints.push(where("subjectId", "==", filters.subjectId));
    } else if (filters.subject && filters.subject !== "all") {
      constraints.push(where("subject", "==", filters.subject));
    }

    if (filters.setId && filters.setId !== "all") {
      constraints.push(where("setId", "==", filters.setId));
    }
    if (filters.difficulty && filters.difficulty !== "all") {
      constraints.push(where("difficulty", "==", filters.difficulty));
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
        (item) =>
          item.questionText?.toLowerCase().includes(term) ||
          item.subject?.toLowerCase().includes(term) ||
          item.topic?.toLowerCase().includes(term) ||
          item.options?.some((o) => (o.text || "").toLowerCase().includes(term))
      );
    }

    list.sort((a, b) => {
      const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt || 0).getTime();
      const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt || 0).getTime();
      return timeB - timeA;
    });

    return list;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
}

export async function getQuestionById(id) {
  const docRef = doc(db, QUESTIONS_COL, id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function createQuestion(data) {
  const user = auth.currentUser;
  const formattedOptions = formatOptions(data.options);

  // Compute correctAnswer letter and 0-based index
  let correctAnswer = data.correctAnswer;
  let correctOptionIndex = data.correctOptionIndex;

  if (correctOptionIndex !== undefined && correctOptionIndex !== null) {
    correctOptionIndex = Number(correctOptionIndex);
    if (!correctAnswer) {
      correctAnswer = String.fromCharCode(65 + correctOptionIndex);
    }
  } else if (correctAnswer) {
    // Resolve letter (e.g. 'A', 'B', 'C') to index
    const upper = String(correctAnswer).trim().toUpperCase();
    const idx = formattedOptions.findIndex((o) => o.id.toUpperCase() === upper);
    if (idx !== -1) {
      correctOptionIndex = idx;
    }
  }

  const payload = {
    questionText: data.questionText.trim(),
    questionType: data.questionType || "single_choice",
    options: formattedOptions,
    correctAnswer: correctAnswer || "A",
    correctOptionIndex: correctOptionIndex !== undefined ? correctOptionIndex : 0,
    explanation: data.explanation || "",
    subjectId: (data.subjectId || data.subject || "").toLowerCase().trim(),
    subject: data.subject?.trim() || "General",
    setId: data.setId || null,
    setNumber: data.setNumber !== undefined ? Number(data.setNumber) : null,
    topic: data.topic?.trim() || "",
    difficulty: data.difficulty || "medium",
    positiveMarks: Number(data.positiveMarks) || 4,
    negativeMarks: Number(data.negativeMarks) || 1,
    unansweredMarks: Number(data.unansweredMarks) || 0,
    imageUrl: data.imageUrl || null,
    status: data.status || "active",
    reviewRequired: Boolean(data.reviewRequired),
    sourceQuestionNumber: data.sourceQuestionNumber !== undefined ? data.sourceQuestionNumber : null,
    createdBy: user?.uid || "admin",
    updatedBy: user?.uid || "admin",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  const customId = data.id ? String(data.id).trim() : null;
  let docId;
  if (customId) {
    const docRef = doc(db, QUESTIONS_COL, customId);
    await setDoc(docRef, payload, { merge: true });
    docId = customId;
  } else {
    const docRef = await addDoc(collection(db, QUESTIONS_COL), payload);
    docId = docRef.id;
  }

  // If setId provided, automatically append questionId to questionSets
  if (payload.setId) {
    try {
      const setRef = doc(db, "questionSets", payload.setId);
      const setSnap = await getDoc(setRef);
      if (setSnap.exists()) {
        const currentIds = setSnap.data().questionIds || [];
        if (!currentIds.includes(docId)) {
          const updatedIds = [...currentIds, docId];
          await updateDoc(setRef, {
            questionIds: updatedIds,
            questionCount: updatedIds.length,
            updatedAt: serverTimestamp()
          });
        }
      }
    } catch (setErr) {
      console.warn("Could not sync set questionIds:", setErr);
    }
  }

  return { id: docId, ...payload };
}

export async function updateQuestion(id, data) {
  const user = auth.currentUser;
  const docRef = doc(db, QUESTIONS_COL, id);
  const formattedOptions = data.options ? formatOptions(data.options) : undefined;

  let correctAnswer = data.correctAnswer;
  let correctOptionIndex = data.correctOptionIndex;

  if (correctOptionIndex !== undefined && correctOptionIndex !== null) {
    correctOptionIndex = Number(correctOptionIndex);
    if (!correctAnswer) {
      correctAnswer = String.fromCharCode(65 + correctOptionIndex);
    }
  } else if (correctAnswer && formattedOptions) {
    const upper = String(correctAnswer).trim().toUpperCase();
    const idx = formattedOptions.findIndex((o) => o.id.toUpperCase() === upper);
    if (idx !== -1) {
      correctOptionIndex = idx;
    }
  }

  const payload = {
    ...data,
    updatedBy: user?.uid || "admin",
    updatedAt: serverTimestamp()
  };

  if (formattedOptions) payload.options = formattedOptions;
  if (correctAnswer !== undefined) payload.correctAnswer = correctAnswer;
  if (correctOptionIndex !== undefined) payload.correctOptionIndex = correctOptionIndex;
  if (data.positiveMarks !== undefined) payload.positiveMarks = Number(data.positiveMarks);
  if (data.negativeMarks !== undefined) payload.negativeMarks = Number(data.negativeMarks);
  if (data.unansweredMarks !== undefined) payload.unansweredMarks = Number(data.unansweredMarks);
  if (data.reviewRequired !== undefined) payload.reviewRequired = Boolean(data.reviewRequired);

  await updateDoc(docRef, payload);
  return { id, ...payload };
}

export async function deleteQuestion(id) {
  const docRef = doc(db, QUESTIONS_COL, id);
  const qSnap = await getDoc(docRef);
  if (qSnap.exists()) {
    const qData = qSnap.data();
    if (qData.setId) {
      try {
        const setRef = doc(db, "questionSets", qData.setId);
        const setSnap = await getDoc(setRef);
        if (setSnap.exists()) {
          const currentIds = setSnap.data().questionIds || [];
          const updatedIds = currentIds.filter((qid) => qid !== id);
          await updateDoc(setRef, {
            questionIds: updatedIds,
            questionCount: updatedIds.length,
            updatedAt: serverTimestamp()
          });
        }
      } catch (err) {
        console.warn("Could not remove question from set on delete:", err);
      }
    }
  }

  await deleteDoc(docRef);
  return id;
}

export async function duplicateQuestion(id) {
  const orig = await getQuestionById(id);
  if (!orig) throw new Error("Original question not found");

  const duplicateData = {
    ...orig,
    questionText: `${orig.questionText} (Copy)`
  };
  delete duplicateData.id;
  delete duplicateData.createdAt;
  delete duplicateData.updatedAt;

  return await createQuestion(duplicateData);
}

/**
 * Bulk imports questions in safe chunks (up to 400 per batch)
 */
export async function importQuestionsBulk(questionsList, context = {}) {
  const user = auth.currentUser;
  const createdIds = [];
  const chunkSize = 400;

  for (let i = 0; i < questionsList.length; i += chunkSize) {
    const chunk = questionsList.slice(i, i + chunkSize);
    const batch = writeBatch(db);

    for (const q of chunk) {
      const docId = q.id || doc(collection(db, QUESTIONS_COL)).id;
      createdIds.push(docId);
      const formattedOptions = formatOptions(q.options);

      let correctAns = q.correctAnswer;
      let correctIdx = q.correctOptionIndex;

      if (q.answer !== undefined && correctIdx === undefined) {
        correctIdx = Number(q.answer);
      }
      if (correctIdx !== undefined && !correctAns) {
        correctAns = String.fromCharCode(65 + Number(correctIdx));
      }

      const qDocRef = doc(db, QUESTIONS_COL, docId);
      batch.set(qDocRef, {
        questionText: (q.questionText || q.question || "").trim(),
        questionType: q.questionType || "single_choice",
        options: formattedOptions,
        correctAnswer: correctAns || "A",
        correctOptionIndex: correctIdx !== undefined ? correctIdx : 0,
        explanation: q.explanation || "",
        subjectId: (q.subjectId || context.subjectId || q.category || context.subject || "General").toLowerCase().trim(),
        subject: q.subject || context.subject || q.category || "General",
        setId: q.setId || context.setId || null,
        setNumber: q.setNumber || q.set || context.setNumber || null,
        topic: q.topic || "",
        difficulty: q.difficulty || "medium",
        positiveMarks: Number(q.positiveMarks) || 4,
        negativeMarks: Number(q.negativeMarks) || 1,
        unansweredMarks: Number(q.unansweredMarks) || 0,
        imageUrl: q.imageUrl || null,
        status: q.status || "active",
        createdBy: user?.uid || "admin",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });
    }

    await batch.commit();
  }

  // If a destination set was provided, append imported questions to that set
  if (context.setId) {
    try {
      const setRef = doc(db, "questionSets", context.setId);
      const setSnap = await getDoc(setRef);
      if (setSnap.exists()) {
        const existing = setSnap.data().questionIds || [];
        const merged = Array.from(new Set([...existing, ...createdIds]));
        await updateDoc(setRef, {
          questionIds: merged,
          questionCount: merged.length,
          totalMarks: merged.length * 4,
          updatedAt: serverTimestamp()
        });
      }
    } catch (setErr) {
      console.warn("Could not update set after bulk import:", setErr);
    }
  }

  return createdIds;
}
