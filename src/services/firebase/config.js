import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const getEnv = (key, fallback) => {
  if (typeof import.meta !== "undefined" && import.meta?.env?.[key]) {
    return import.meta.env[key];
  }
  if (typeof process !== "undefined" && process?.env?.[key]) {
    return process.env[key];
  }
  return fallback;
};

const firebaseConfig = {
  apiKey: getEnv("VITE_FIREBASE_API_KEY", "AIzaSyDC55H0zV6cUTJSF9IOxuXWiW9a6gK0miY"),
  authDomain: getEnv("VITE_FIREBASE_AUTH_DOMAIN", "quiz-master-portal.firebaseapp.com"),
  projectId: getEnv("VITE_FIREBASE_PROJECT_ID", "quiz-master-portal"),
  storageBucket: getEnv("VITE_FIREBASE_STORAGE_BUCKET", "quiz-master-portal.firebasestorage.app"),
  messagingSenderId: getEnv("VITE_FIREBASE_MESSAGING_SENDER_ID", "439258848801"),
  appId: getEnv("VITE_FIREBASE_APP_ID", "1:439258848801:web:5f4392d08ec1426f140d60"),
  measurementId: getEnv("VITE_FIREBASE_MEASUREMENT_ID", "G-JZ2XJFV26Y"),
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export { firebaseConfig };

export default app;
