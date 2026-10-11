import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./config.js";

/**
 * Register a new student account
 */
export async function registerStudent({ email, password, fullName, rollNumber, instituteName, phone }) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Set displayName in Firebase Auth
  await updateProfile(user, { displayName: fullName });

  // Store user profile in Firestore with role = 'student'
  const normalizedRoll = (rollNumber || "").trim().toUpperCase();
  const userData = {
    uid: user.uid,
    email: user.email,
    fullName: fullName.trim(),
    normalizedRollNumber: normalizedRoll,
    instituteName: (instituteName || "").trim(),
    phone: (phone || "").trim(),
    role: "student",
    accountStatus: "active",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  await setDoc(doc(db, "users", user.uid), userData);

  return { user, profile: userData };
}

/**
 * Sign in user and retrieve profile
 */
export async function loginUser(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (!userDoc.exists()) {
    throw new Error("User record not found in system database.");
  }

  const profile = userDoc.data();
  if (profile.accountStatus === "inactive") {
    await signOut(auth);
    throw new Error("This account has been deactivated by the administrator.");
  }

  return { user, profile };
}

/**
 * Log out current user
 */
export async function logoutUser() {
  await signOut(auth);
}

/**
 * Send password reset email
 */
export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email);
}

/**
 * Fetch user profile by UID
 */
export async function getUserProfile(uid) {
  const userDoc = await getDoc(doc(db, "users", uid));
  if (userDoc.exists()) {
    return { uid: userDoc.id, ...userDoc.data() };
  }
  return null;
}

/**
 * Update student profile (allowed fields)
 */
export async function updateUserProfile(uid, data) {
  const ref = doc(db, "users", uid);
  const updateData = {
    fullName: data.fullName,
    instituteName: data.instituteName,
    phone: data.phone,
    updatedAt: serverTimestamp()
  };
  await updateDoc(ref, updateData);
  return updateData;
}
