import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp
} from "firebase/firestore";
import { db, auth } from "./config.js";

const BOOKMARKS_COL = "bookmarks";

/**
 * Fetch all bookmarks for a student
 */
export async function getUserBookmarks(studentUid) {
  const uid = studentUid || auth.currentUser?.uid;
  if (!uid) return [];

  const q = query(
    collection(db, BOOKMARKS_COL),
    where("studentUid", "==", uid)
  );

  const snap = await getDocs(q);
  const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  list.sort((a, b) => {
    const tA = a.createdAt?.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt || 0).getTime();
    const tB = b.createdAt?.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt || 0).getTime();
    return tB - tA;
  });

  return list;
}

/**
 * Add a new bookmark
 */
export async function addBookmark(data) {
  const user = auth.currentUser;
  if (!user) throw new Error("Authentication required to bookmark questions.");

  const studentUid = data.studentUid || user.uid;

  // Check if already bookmarked
  if (data.questionId) {
    const existingQ = query(
      collection(db, BOOKMARKS_COL),
      where("studentUid", "==", studentUid),
      where("questionId", "==", data.questionId)
    );
    const existingSnap = await getDocs(existingQ);
    if (!existingSnap.empty) {
      return existingSnap.docs[0].id;
    }
  }

  const payload = {
    studentUid,
    questionId: data.questionId || "",
    questionText: data.questionText || "",
    subject: data.subject || "General",
    testId: data.testId || "",
    testTitle: data.testTitle || "Mock Test",
    options: data.options || [],
    selectedAnswer: data.selectedAnswer !== undefined ? data.selectedAnswer : null,
    correctAnswer: data.correctAnswer !== undefined ? data.correctAnswer : null,
    explanation: data.explanation || "",
    notes: data.notes || "",
    createdAt: serverTimestamp()
  };

  const docRef = await addDoc(collection(db, BOOKMARKS_COL), payload);
  return docRef.id;
}

/**
 * Remove a bookmark by ID
 */
export async function removeBookmark(bookmarkId) {
  const ref = doc(db, BOOKMARKS_COL, bookmarkId);
  await deleteDoc(ref);
  return bookmarkId;
}

/**
 * Check if a question is bookmarked
 */
export async function isQuestionBookmarked(studentUid, questionId) {
  const uid = studentUid || auth.currentUser?.uid;
  if (!uid || !questionId) return false;

  const q = query(
    collection(db, BOOKMARKS_COL),
    where("studentUid", "==", uid),
    where("questionId", "==", questionId)
  );
  const snap = await getDocs(q);
  return !snap.empty ? snap.docs[0].id : null;
}
