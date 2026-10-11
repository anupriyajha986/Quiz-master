import {
  collection,
  doc,
  getDocs,
  updateDoc,
  query,
  where,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "./config.js";

const NOTIF_COL = "notifications";

export async function getUserNotifications(studentUid) {
  // Fetch broadcast ("all") and student specific
  const [allSnap, userSnap] = await Promise.all([
    getDocs(query(collection(db, NOTIF_COL), where("recipientUid", "==", "all"))),
    getDocs(query(collection(db, NOTIF_COL), where("recipientUid", "==", studentUid)))
  ]);

  const all = [...allSnap.docs, ...userSnap.docs].map((d) => ({
    id: d.id,
    ...d.data()
  }));

  all.sort((a, b) => {
    const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt || 0).getTime();
    const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt || 0).getTime();
    return timeB - timeA;
  });

  return all;
}

export async function markNotificationAsRead(id) {
  const ref = doc(db, NOTIF_COL, id);
  await updateDoc(ref, { isRead: true });
  return id;
}

export async function createNotification(data) {
  const ref = await addDoc(collection(db, NOTIF_COL), {
    recipientUid: data.recipientUid || "all",
    title: data.title,
    message: data.message,
    type: data.type || "general",
    referenceId: data.referenceId || null,
    isRead: false,
    createdAt: serverTimestamp()
  });
  return ref.id;
}
