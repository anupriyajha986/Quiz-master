import fs from "fs";
import path from "path";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  writeBatch,
  deleteDoc,
  setDoc,
  serverTimestamp
} from "firebase/firestore";

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

const ALL_PERMISSIONS = [
  "dashboard.view",
  "questions.view",
  "questions.create",
  "questions.edit",
  "questions.archive",
  "questions.import",
  "questions.export",
  "sets.view",
  "sets.manage",
  "exams.view",
  "exams.create",
  "exams.edit",
  "exams.publish",
  "attempts.view",
  "attempts.intervene",
  "students.view",
  "students.manage",
  "results.view",
  "results.evaluate",
  "results.publish",
  "analytics.view",
  "reports.export",
  "notifications.manage",
  "settings.manage",
  "admins.manage",
  "auditLogs.view"
];

async function runReset() {
  const isDryRun = process.argv.includes("--dry-run");
  const isExecute = process.argv.includes("--execute");

  console.log("==================================================");
  console.log("QUIZMASTER CONTROLLED DATABASE RESET & SUPER ADMIN PROVISIONING");
  console.log("==================================================");
  console.log(`Execution Mode: ${isDryRun ? "DRY-RUN (No Deletions)" : isExecute ? "EXECUTE (DESTRUCTIVE RESET)" : "UNKNOWN"}`);
  console.log("Target Project ID:", firebaseConfig.projectId);

  // 1. Mandatory Project Verification
  if (firebaseConfig.projectId !== "quiz-master-portal") {
    throw new Error(`ABORT: Target project ID '${firebaseConfig.projectId}' does not match verified project 'quiz-master-portal'`);
  }

  // 2. Safeguard Flag Verification
  if (isExecute && process.env.ALLOW_QUIZMASTER_DATA_RESET !== "true") {
    throw new Error("ABORT: Destructive execution requires ALLOW_QUIZMASTER_DATA_RESET='true' environment variable.");
  }

  // 3. Backup Verification
  const backupDir = path.resolve(process.cwd(), "backups");
  const manifestPath = path.join(backupDir, "deletion_manifest.json");
  if (!fs.existsSync(manifestPath)) {
    throw new Error("ABORT: No valid deletion_manifest.json found. Run backup-and-export.js first!");
  }
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  console.log(`✓ Verified backup manifest at: ${manifestPath}`);
  console.log(`  Source Backup: ${manifest.backupFileLocation}`);

  // 4. Authenticate as admin
  await signInWithEmailAndPassword(auth, "admin@quizmaster.com", "Admin@12345");
  console.log("✓ Authenticated administrative session.");

  const targetCollections = [
    "questions",
    "answerKeys",
    "questionSets",
    "tests",
    "results",
    "notifications",
    "bookmarks"
  ];

  const dryRunReport = {};

  // Scan target standard collections
  for (const col of targetCollections) {
    const snap = await getDocs(collection(db, col));
    dryRunReport[col] = snap.size;
  }

  // Scan attempts and nested responses
  const attemptsSnap = await getDocs(collection(db, "attempts"));
  dryRunReport["attempts"] = attemptsSnap.size;
  let subResponsesCount = 0;
  for (const att of attemptsSnap.docs) {
    const respSnap = await getDocs(collection(db, "attempts", att.id, "responses"));
    subResponsesCount += respSnap.size;
  }
  dryRunReport["attempts/responses"] = subResponsesCount;

  // Scan users
  const usersSnap = await getDocs(collection(db, "users"));
  const usersToDelete = usersSnap.docs.filter((d) => {
    const email = (d.data().email || "").toLowerCase();
    return email !== "anupriyajha986@gmail.com";
  });
  dryRunReport["users_to_remove"] = usersToDelete.length;
  dryRunReport["users_to_preserve_or_provision"] = usersSnap.size - usersToDelete.length;

  console.log("\n--------------------------------------------------");
  console.log("DATA RESET SCOPE SUMMARY");
  console.log("--------------------------------------------------");
  for (const [k, v] of Object.entries(dryRunReport)) {
    console.log(`- ${k.padEnd(28)}: ${v} records`);
  }

  if (isDryRun || !isExecute) {
    console.log("\n[DRY RUN COMPLETE] No records were deleted. To execute, run with --execute and ALLOW_QUIZMASTER_DATA_RESET=true");
    return;
  }

  // 5. Execute Deletions
  console.log("\nExecuting Destructive Reset in Bounded Batches...");

  // A. Standard collections
  for (const col of targetCollections) {
    const snap = await getDocs(collection(db, col));
    console.log(`Deleting ${snap.size} records from collection '${col}'...`);
    let batch = writeBatch(db);
    let count = 0;

    for (const d of snap.docs) {
      batch.delete(doc(db, col, d.id));
      count++;
      if (count % 450 === 0) {
        await batch.commit();
        batch = writeBatch(db);
      }
    }
    if (count % 450 !== 0 && count > 0) {
      await batch.commit();
    }
    console.log(`✓ Cleaned '${col}'.`);
  }

  // B. Attempts and recursive subcollections
  console.log(`Deleting ${attemptsSnap.size} attempts and their subcollections...`);
  for (const att of attemptsSnap.docs) {
    const respSnap = await getDocs(collection(db, "attempts", att.id, "responses"));
    for (const r of respSnap.docs) {
      await deleteDoc(doc(db, "attempts", att.id, "responses", r.id));
    }
    await deleteDoc(doc(db, "attempts", att.id));
  }
  console.log("✓ Cleaned 'attempts' and all nested 'responses'.");

  // C. Users cleanup (remove obsolete students & test accounts)
  console.log(`Removing ${usersToDelete.length} obsolete users...`);
  for (const u of usersToDelete) {
    await deleteDoc(doc(db, "users", u.id));
  }
  console.log("✓ Obsolete user profiles removed from Firestore.");

  // D. Provision Anupriya Jha as authoritative Super Admin
  console.log("\nProvisioning Anupriya Jha as initial Super Admin...");
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || "Anupriya@123";
  const superAdminCred = await signInWithEmailAndPassword(auth, "Anupriyajha986@gmail.com", superAdminPassword);
  console.log(`✓ Authenticated directly as Super Admin (${superAdminCred.user.email}).`);

  const anupriyaUid = superAdminCred.user.uid;
  const superAdminProfile = {
    uid: anupriyaUid,
    displayName: "Anupriya Jha",
    fullName: "Anupriya Jha",
    email: "Anupriyajha986@gmail.com",
    role: "super_admin",
    roleTitle: "Super Administrator",
    isMainAdmin: true,
    accountStatus: "active",
    permissions: ALL_PERMISSIONS,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastLoginAt: new Date().toISOString()
  };

  await setDoc(doc(db, "users", anupriyaUid), superAdminProfile, { merge: true });
  console.log(`✓ Super Admin profile established for Anupriya Jha (UID: ${anupriyaUid}) with all ${ALL_PERMISSIONS.length} permissions.`);

  // E. Record Database Reset in Audit Log
  const auditDocRef = doc(collection(db, "auditLogs"));
  await setDoc(auditDocRef, {
    action: "DATABASE_RESET_EXECUTED",
    actorUid: anupriyaUid,
    actorEmail: "Anupriyajha986@gmail.com",
    actorName: "Anupriya Jha",
    details: {
      projectId: firebaseConfig.projectId,
      resetReport: dryRunReport,
      backupFile: manifest.backupFileLocation,
      preservedAuditTrailCount: manifest.recordCountsBeforeReset.auditLogs,
      timestamp: new Date().toISOString()
    },
    timestamp: serverTimestamp()
  });
  console.log("✓ Audit log recorded for database reset execution.");

  console.log("\n==================================================");
  console.log("QUIZMASTER DATABASE RESET COMPLETED SUCCESSFULLY!");
  console.log("==================================================");
}

runReset()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Reset error:", err);
    process.exit(1);
  });
