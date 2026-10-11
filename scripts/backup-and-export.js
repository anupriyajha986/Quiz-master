import fs from "fs";
import path from "path";
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

async function createBackup() {
  console.log("==================================================");
  console.log("QUIZMASTER PRE-RESET FULL DATABASE BACKUP UTILITY");
  console.log("==================================================");
  console.log("Target Project ID:", firebaseConfig.projectId);

  if (firebaseConfig.projectId !== "quiz-master-portal") {
    throw new Error(`Safety abort: target project ${firebaseConfig.projectId} does not match expected 'quiz-master-portal'`);
  }

  await signInWithEmailAndPassword(auth, "admin@quizmaster.com", "Admin@12345");
  console.log("✓ Authenticated as administrative user.");

  const backupDir = path.resolve(process.cwd(), "backups");
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupData = {
    metadata: {
      projectId: firebaseConfig.projectId,
      timestamp: new Date().toISOString(),
      generator: "QuizMaster Safe Backup Utility"
    },
    collections: {},
    summary: {}
  };

  let totalDocs = 0;

  for (const colName of COLLECTIONS) {
    console.log(`Exporting collection: ${colName}...`);
    const snap = await getDocs(collection(db, colName));
    const items = [];

    for (const d of snap.docs) {
      const docData = { _id: d.id, ...d.data() };

      // Handle subcollections if attempts
      if (colName === "attempts") {
        const respSnap = await getDocs(collection(db, "attempts", d.id, "responses"));
        docData._subcollections = {
          responses: respSnap.docs.map((r) => ({ _id: r.id, ...r.data() }))
        };
      }

      items.push(docData);
    }

    backupData.collections[colName] = items;
    backupData.summary[colName] = items.length;
    totalDocs += items.length;
    console.log(`  -> Saved ${items.length} records.`);
  }

  const backupFile = path.join(backupDir, `backup_${timestamp}.json`);
  fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2), "utf8");

  console.log("\n--------------------------------------------------");
  console.log("BACKUP VERIFICATION CHECK");
  console.log("--------------------------------------------------");
  if (!fs.existsSync(backupFile)) {
    throw new Error("Backup file verification failed: file not found on disk!");
  }

  const fileStats = fs.statSync(backupFile);
  if (fileStats.size < 100) {
    throw new Error(`Backup file is suspiciously small (${fileStats.size} bytes).`);
  }

  const readBack = JSON.parse(fs.readFileSync(backupFile, "utf8"));
  if (readBack.metadata.projectId !== firebaseConfig.projectId) {
    throw new Error("Backup validation failed: project ID mismatch.");
  }

  console.log(`✓ Backup successfully written and verified on disk!`);
  console.log(`  Path: ${backupFile}`);
  console.log(`  Size: ${(fileStats.size / 1024).toFixed(2)} KB`);
  console.log(`  Total Top-Level Records Backed Up: ${totalDocs}`);

  // Create deletion manifest
  const manifest = {
    manifestVersion: "1.0",
    createdAt: new Date().toISOString(),
    targetProjectId: firebaseConfig.projectId,
    backupFileLocation: backupFile,
    recordCountsBeforeReset: backupData.summary,
    deletionScope: [
      {
        collection: "questions",
        action: "DELETE_ALL",
        rationale: "Reset application questions"
      },
      {
        collection: "answerKeys",
        action: "DELETE_ALL",
        rationale: "Reset test answer keys"
      },
      {
        collection: "questionSets",
        action: "DELETE_ALL",
        rationale: "Reset question sets"
      },
      {
        collection: "tests",
        action: "DELETE_ALL",
        rationale: "Reset published and draft examinations"
      },
      {
        collection: "attempts",
        action: "DELETE_ALL_RECURSIVE",
        includesSubcollections: ["responses"],
        rationale: "Reset active and completed exam attempts and responses"
      },
      {
        collection: "results",
        action: "DELETE_ALL",
        rationale: "Reset scorecards and evaluation results"
      },
      {
        collection: "notifications",
        action: "DELETE_ALL",
        rationale: "Reset notification logs and alerts"
      },
      {
        collection: "bookmarks",
        action: "DELETE_ALL",
        rationale: "Reset student bookmarks"
      },
      {
        collection: "users",
        action: "DELETE_ALL_EXCEPT_SYSTEM",
        rationale: "Remove obsolete students and demo staff; re-provision Super Admin Anupriya Jha"
      }
    ],
    preservedScope: [
      {
        collection: "auditLogs",
        action: "PRESERVE",
        rationale: "Retain security and operational audit trail"
      },
      {
        item: "Firebase Project Configuration (.env, firebase.json)",
        action: "PRESERVE"
      },
      {
        item: "Firestore Security Rules & Indexes",
        action: "PRESERVE_AND_UPGRADE"
      }
    ]
  };

  const manifestFile = path.join(backupDir, "deletion_manifest.json");
  fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2), "utf8");
  console.log(`✓ Deletion manifest created: ${manifestFile}`);
  console.log("==================================================\n");

  return { backupFile, manifestFile, summary: backupData.summary };
}

createBackup()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Backup failed:", err);
    process.exit(1);
  });
