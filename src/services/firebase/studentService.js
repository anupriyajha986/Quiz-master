import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  query,
  where,
  serverTimestamp
} from "firebase/firestore";
import { initializeApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { db, firebaseConfig } from "./config.js";

const USERS_COL = "users";

export async function getAllStudents(filters = {}) {
  const q = query(collection(db, USERS_COL), where("role", "==", "student"));
  const snap = await getDocs(q);
  let students = snap.docs.map((d) => ({ uid: d.id, ...d.data() }));

  if (filters.status && filters.status !== "all") {
    students = students.filter((s) => s.accountStatus === filters.status);
  }

  if (filters.search) {
    const term = filters.search.toLowerCase();
    students = students.filter(
      (s) =>
        s.fullName?.toLowerCase().includes(term) ||
        s.email?.toLowerCase().includes(term) ||
        s.normalizedRollNumber?.toLowerCase().includes(term) ||
        s.instituteName?.toLowerCase().includes(term)
    );
  }

  students.sort((a, b) => {
    const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt || 0).getTime();
    const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt || 0).getTime();
    return timeB - timeA;
  });

  return students;
}

export async function getStudentById(uid) {
  const snap = await getDoc(doc(db, USERS_COL, uid));
  if (!snap.exists()) return null;
  return { uid: snap.id, ...snap.data() };
}

export async function setStudentStatus(uid, status) {
  const ref = doc(db, USERS_COL, uid);
  await updateDoc(ref, {
    accountStatus: status,
    updatedAt: serverTimestamp()
  });
  return { uid, status };
}

export async function getStudentAttempts(uid) {
  const q = query(collection(db, "attempts"), where("studentUid", "==", uid));
  const snap = await getDocs(q);
  const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  list.sort((a, b) => new Date(b.startedAt || 0) - new Date(a.startedAt || 0));
  return list;
}

export async function getStudentResults(uid) {
  if (!uid) return [];

  // Query results by studentUid (existing schema) and studentId (new schema)
  const qUid = query(
    collection(db, "results"),
    where("studentUid", "==", uid)
  );

  const qId = query(
    collection(db, "results"),
    where("studentId", "==", uid)
  );

  const [snapUid, snapId] = await Promise.all([
    getDocs(qUid).catch((err) => {
      console.warn("Could not query results by studentUid:", err);
      return { docs: [] };
    }),
    getDocs(qId).catch((err) => {
      console.warn("Could not query results by studentId:", err);
      return { docs: [] };
    })
  ]);

  const map = new Map();
  [...snapUid.docs, ...snapId.docs].forEach((d) => {
    map.set(d.id, { id: d.id, ...d.data() });
  });

  const list = Array.from(map.values()).filter((r) => {
    // Only exclude if explicitly hidden or archived
    return r.publicationStatus !== "hidden" && r.publicationStatus !== "archived";
  });

  list.sort((a, b) => {
    const timeA = new Date(a.evaluatedAt || a.submittedAt || 0).getTime();
    const timeB = new Date(b.evaluatedAt || b.submittedAt || 0).getTime();
    return timeB - timeA;
  });

  return list;
}

/**
 * Provisions a new candidate account by administrator without terminating current admin session
 */
export async function createStudentByAdmin(studentData, adminContext = {}) {
  if (!studentData.email || !studentData.password || !studentData.fullName) {
    throw new Error("Full name, email, and password are required.");
  }

  const secondaryAppName = `AdminProvisioning_${Date.now()}`;
  const secondaryApp = initializeApp(firebaseConfig, secondaryAppName);
  const secondaryAuth = getAuth(secondaryApp);

  try {
    const cred = await createUserWithEmailAndPassword(
      secondaryAuth,
      studentData.email.trim(),
      studentData.password
    );
    const newUid = cred.user.uid;

    const normalizedRoll = (studentData.rollNumber || "").trim().toUpperCase();
    const userData = {
      uid: newUid,
      email: studentData.email.trim(),
      fullName: studentData.fullName.trim(),
      normalizedRollNumber: normalizedRoll,
      instituteName: (studentData.instituteName || "").trim(),
      phone: (studentData.phone || "").trim(),
      role: "student",
      accountStatus: "active",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdByAdmin: {
        adminUid: adminContext.adminUid || "admin",
        adminEmail: adminContext.adminEmail || "",
        at: new Date().toISOString()
      }
    };

    await setDoc(doc(db, USERS_COL, newUid), userData);

    // Write audit log
    await addDoc(collection(db, "auditLogs"), {
      action: "CREATE_STUDENT",
      actorUid: adminContext.adminUid || "admin",
      actorEmail: adminContext.adminEmail || "admin",
      actorName: adminContext.adminName || "Administrator",
      details: {
        studentUid: newUid,
        email: studentData.email.trim(),
        fullName: studentData.fullName.trim(),
        rollNumber: normalizedRoll,
        institute: studentData.instituteName || ""
      },
      timestamp: serverTimestamp()
    });

    await signOut(secondaryAuth);
    return { uid: newUid, ...userData };
  } finally {
    try {
      await deleteApp(secondaryApp);
    } catch (e) {
      // Ignored
    }
  }
}

/**
 * Updates candidate profile details by administrator
 */
export async function updateStudent(uid, data, adminContext = {}) {
  const ref = doc(db, USERS_COL, uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Student not found.");

  const payload = {
    updatedAt: serverTimestamp()
  };

  if (data.fullName !== undefined) payload.fullName = data.fullName.trim();
  if (data.rollNumber !== undefined) payload.normalizedRollNumber = data.rollNumber.trim().toUpperCase();
  if (data.instituteName !== undefined) payload.instituteName = data.instituteName.trim();
  if (data.phone !== undefined) payload.phone = data.phone.trim();
  if (data.accountStatus !== undefined) payload.accountStatus = data.accountStatus;

  await updateDoc(ref, payload);

  // Write audit log
  await addDoc(collection(db, "auditLogs"), {
    action: "UPDATE_STUDENT",
    actorUid: adminContext.adminUid || "admin",
    actorEmail: adminContext.adminEmail || "admin",
    actorName: adminContext.adminName || "Administrator",
    details: {
      studentUid: uid,
      updatedFields: Object.keys(payload)
    },
    timestamp: serverTimestamp()
  });

  return { uid, ...payload };
}

/**
 * Deletes candidate account record from Firestore by administrator
 */
export async function deleteStudent(uid, adminContext = {}) {
  const ref = doc(db, USERS_COL, uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Student not found.");
  const studentData = snap.data();

  // Delete user document in Firestore
  await deleteDoc(ref);

  // Write audit log
  await addDoc(collection(db, "auditLogs"), {
    action: "DELETE_STUDENT",
    actorUid: adminContext.adminUid || "admin",
    actorEmail: adminContext.adminEmail || "admin",
    actorName: adminContext.adminName || "Administrator",
    details: {
      studentUid: uid,
      email: studentData.email,
      fullName: studentData.fullName
    },
    timestamp: serverTimestamp()
  });

  return uid;
}

