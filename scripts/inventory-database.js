import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyDC55H0zV6cUTJSF9IOxuXWiW9a6gK0miY",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "quiz-master-portal.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "quiz-master-portal",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "quiz-master-portal.firebasestorage.app",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "439258848801",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:439258848801:web:5f4392d08ec1426f140d60",
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || "G-JZ2XJFV26Y"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const COLLECTIONS = [
  "users",
  "questions",
  "questionSets",
  "tests",
  "answerKeys",
  "attempts",
  "results",
  "notifications",
  "bookmarks",
  "auditLogs"
];

async function inventory() {
  console.log("Connecting to Firebase Project:", firebaseConfig.projectId);
  // Sign in as Super Admin to read protected collections
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || "Anupriya@123";
  await signInWithEmailAndPassword(auth, "Anupriyajha986@gmail.com", superAdminPassword);
  console.log("✓ Authenticated as Super Admin (Anupriyajha986@gmail.com) for inventory scan.\n");

  const report = {};
  let totalDocs = 0;

  for (const colName of COLLECTIONS) {
    try {
      const snap = await getDocs(collection(db, colName));
      report[colName] = {
        count: snap.size,
        docs: snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      };
      totalDocs += snap.size;
      console.log(`- ${colName.padEnd(16)}: ${snap.size} documents`);

      // If attempts, check for subcollection responses
      if (colName === "attempts") {
        let totalResponses = 0;
        for (const attDoc of snap.docs) {
          const respSnap = await getDocs(collection(db, "attempts", attDoc.id, "responses"));
          totalResponses += respSnap.size;
        }
        console.log(`  -> attempts/responses subcollection: ${totalResponses} documents across all attempts`);
        report["attempts_responses"] = { count: totalResponses };
      }
    } catch (err) {
      console.warn(`! Could not scan ${colName}:`, err.message);
      report[colName] = { count: 0, error: err.message };
    }
  }

  console.log(`\nTotal Top-Level Documents Scanned: ${totalDocs}`);
  return report;
}

inventory()
  .then((report) => {
    process.exit(0);
  })
  .catch((err) => {
    console.error("Inventory error:", err);
    process.exit(1);
  });
