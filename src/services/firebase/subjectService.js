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
  serverTimestamp
} from "firebase/firestore";
import { db, auth } from "./config.js";

const SUBJECTS_COL = "subjects";

/**
 * Fetch all subjects with optional status filter
 */
export async function getSubjects(filterStatus = null) {
  let q = collection(db, SUBJECTS_COL);
  if (filterStatus && filterStatus !== "all") {
    q = query(q, where("status", "==", filterStatus));
  }
  const snapshot = await getDocs(q);
  const list = snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data()
  }));

  list.sort((a, b) => {
    const orderA = a.order !== undefined ? a.order : 999;
    const orderB = b.order !== undefined ? b.order : 999;
    if (orderA !== orderB) return orderA - orderB;
    return (a.name || "").localeCompare(b.name || "");
  });

  return list;
}

/**
 * Fetch single subject by ID
 */
export async function getSubjectById(id) {
  const docRef = doc(db, SUBJECTS_COL, id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

/**
 * Create a new subject
 */
export async function createSubject(data) {
  const user = auth.currentUser;
  const code = (data.code || data.name || "").trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
  const payload = {
    name: data.name.trim(),
    code: code || "SUBJ",
    description: data.description?.trim() || "",
    status: data.status || "active", // "active" | "inactive"
    color: data.color || "blue",
    icon: data.icon || "BookOpen",
    setCount: Number(data.setCount) || 0,
    questionCount: Number(data.questionCount) || 0,
    order: Number(data.order) || 0,
    createdBy: user?.uid || "admin",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  // If a custom ID is provided (e.g. "html" or slug), use setDoc, else addDoc
  const customId = data.id ? String(data.id).toLowerCase().trim() : null;
  if (customId) {
    const docRef = doc(db, SUBJECTS_COL, customId);
    await setDoc(docRef, payload, { merge: true });
    return { id: customId, ...payload };
  } else {
    const docRef = await addDoc(collection(db, SUBJECTS_COL), payload);
    return { id: docRef.id, ...payload };
  }
}

/**
 * Update an existing subject
 */
export async function updateSubject(id, data) {
  const docRef = doc(db, SUBJECTS_COL, id);
  const payload = {
    ...data,
    updatedAt: serverTimestamp()
  };
  if (data.code) {
    payload.code = data.code.trim().toUpperCase();
  }
  await updateDoc(docRef, payload);
  return { id, ...payload };
}

/**
 * Delete a subject with dependency check
 */
export async function deleteSubject(id) {
  // Check if any question sets exist for this subject
  const qSets = query(collection(db, "questionSets"), where("subjectId", "==", id));
  const setSnap = await getDocs(qSets);
  if (!setSnap.empty) {
    throw new Error(`Cannot delete subject: ${setSnap.size} question set(s) are linked to it. Delete or reassign the sets first.`);
  }

  // Check if any questions exist for this subject
  const qQuestions = query(collection(db, "questions"), where("subjectId", "==", id));
  const qSnap = await getDocs(qQuestions);
  if (!qSnap.empty) {
    throw new Error(`Cannot delete subject: ${qSnap.size} question(s) are linked to it.`);
  }

  const docRef = doc(db, SUBJECTS_COL, id);
  await deleteDoc(docRef);
  return id;
}

/**
 * Recalculate set & question counts for all subjects
 */
export async function syncSubjectCounts() {
  const subjectsSnap = await getDocs(collection(db, SUBJECTS_COL));
  const setsSnap = await getDocs(collection(db, "questionSets"));
  const questionsSnap = await getDocs(collection(db, "questions"));

  const setCounts = {};
  setsSnap.docs.forEach((d) => {
    const data = d.data();
    const sid = data.subjectId || (data.subject ? data.subject.toLowerCase() : null);
    if (sid) {
      setCounts[sid] = (setCounts[sid] || 0) + 1;
    }
  });

  const questionCounts = {};
  questionsSnap.docs.forEach((d) => {
    const data = d.data();
    const sid = data.subjectId || (data.subject ? data.subject.toLowerCase() : null);
    if (sid) {
      questionCounts[sid] = (questionCounts[sid] || 0) + 1;
    }
  });

  for (const sDoc of subjectsSnap.docs) {
    const sid = sDoc.id;
    const currentData = sDoc.data();
    const altKey = currentData.name ? currentData.name.toLowerCase() : sid;
    const actualSets = setCounts[sid] || setCounts[altKey] || 0;
    const actualQuestions = questionCounts[sid] || questionCounts[altKey] || 0;

    await updateDoc(sDoc.ref, {
      setCount: actualSets,
      questionCount: actualQuestions,
      updatedAt: serverTimestamp()
    });
  }
}
