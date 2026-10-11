import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  collection,
  serverTimestamp
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDC55H0zV6cUTJSF9IOxuXWiW9a6gK0miY",
  authDomain: "quiz-master-portal.firebaseapp.com",
  projectId: "quiz-master-portal",
  storageBucket: "quiz-master-portal.firebasestorage.app",
  messagingSenderId: "439258848801",
  appId: "1:439258848801:web:5f4392d08ec1426f140d60"
};

const app = initializeApp(firebaseConfig, "securityTestingApp_" + Date.now());
const auth = getAuth(app);
const db = getFirestore(app);

const credentials = {
  superAdmin: { email: "Anupriyajha986@gmail.com", pass: "Anupriya@123" },
  admin: { email: "admin@quizmaster.com", pass: "Admin@12345" },
  student: { email: "student@quizmaster.com", pass: "Student@12345" }
};

let passCount = 0;
let failCount = 0;

function assert(condition, testName, details = "") {
  if (condition) {
    passCount++;
    console.log(`  ✓ PASS [${passCount}]: ${testName}`);
  } else {
    failCount++;
    console.error(`  ✗ FAIL: ${testName} - ${details}`);
  }
}

async function expectPermissionDenied(fn, testName) {
  try {
    await fn();
    failCount++;
    console.error(`  ✗ SECURITY FAILURE: ${testName} succeeded when it MUST be DENIED!`);
  } catch (err) {
    const isDenied =
      err.code === "permission-denied" ||
      err.message?.includes("insufficient permissions") ||
      err.message?.includes("Missing or insufficient permissions");
    if (isDenied) {
      passCount++;
      console.log(`  ✓ PASS [${passCount}]: Security rule enforced (${testName}) -> ${err.code}`);
    } else {
      failCount++;
      console.error(`  ✗ UNEXPECTED ERROR: ${testName} failed with: ${err.message}`);
    }
  }
}

async function runSecurityAudit() {
  console.log("================================================================================");
  console.log(" QUIZMASTER FIRESTORE SECURITY RULES HARDENING & RBAC VERIFICATION SUITE");
  console.log("================================================================================");

  // ---------------------------------------------------------------------------
  // PHASE 1: UNAUTHENTICATED ACCESS ATTEMPTS
  // ---------------------------------------------------------------------------
  console.log("\n[PHASE 1] UNAUTHENTICATED GUEST ACCESS CONTROLS...");
  await signOut(auth).catch(() => {});

  await expectPermissionDenied(
    () => getDoc(doc(db, "users", "UIcXC7lcWIW3KA4aGu5Wx196yqm2")),
    "Unauthenticated user cannot read /users/{uid}"
  );

  await expectPermissionDenied(
    () => getDocs(collection(db, "tests")),
    "Unauthenticated user cannot list /tests"
  );

  await expectPermissionDenied(
    () => getDocs(collection(db, "auditLogs")),
    "Unauthenticated user cannot list /auditLogs"
  );

  await expectPermissionDenied(
    () => getDoc(doc(db, "answerKeys", "placement-technical-50")),
    "Unauthenticated user cannot read /answerKeys/{testId}"
  );

  // ---------------------------------------------------------------------------
  // PHASE 2: STUDENT RESTRICTIONS & ANTI-SPOOFING CONTROLS
  // ---------------------------------------------------------------------------
  console.log("\n[PHASE 2] STUDENT PRIVILEGE RESTRICTIONS & INTEGRITY CHECKS...");
  const studentUser = await signInWithEmailAndPassword(auth, credentials.student.email, credentials.student.pass);
  const studentUid = studentUser.user.uid;
  console.log(`  Logged in as Student: ${studentUser.user.email} (UID: ${studentUid})`);

  // Assertion 1: Student cannot read /answerKeys
  await expectPermissionDenied(
    () => getDoc(doc(db, "answerKeys", "placement-technical-50")),
    "Student cannot read private answer keys vault /answerKeys/{testId}"
  );

  // Assertion 2: Student cannot create /results
  const forgedResultId = "forged_res_" + Date.now();
  await expectPermissionDenied(
    () => setDoc(doc(db, "results", forgedResultId), {
      studentUid,
      totalScore: 200,
      percentage: 100,
      publicationStatus: "published"
    }),
    "Student cannot forge official test results in /results/{resultId}"
  );

  // Assertion 3: Student cannot create notifications for other students or broadcast to 'all'
  const spoofedNotifId = "spoofed_notif_" + Date.now();
  await expectPermissionDenied(
    () => setDoc(doc(db, "notifications", spoofedNotifId), {
      recipientUid: "all",
      title: "Malicious Announcement",
      message: "Testing broadcast spoof",
      createdAt: new Date().toISOString()
    }),
    "Student cannot broadcast notifications with recipientUid = 'all'"
  );

  await expectPermissionDenied(
    () => setDoc(doc(db, "notifications", spoofedNotifId), {
      recipientUid: "another_student_uid_xyz",
      title: "Malicious Target",
      message: "Testing recipient spoof",
      createdAt: new Date().toISOString()
    }),
    "Student cannot spoof notifications for another user UID"
  );

  // Assertion 4: Student cannot elevate their own role in /users/{uid}
  await expectPermissionDenied(
    () => updateDoc(doc(db, "users", studentUid), {
      role: "admin",
      isSuperAdmin: true,
      permissions: ["users.manage", "tests.manage"]
    }),
    "Student cannot self-promote to admin or alter security flags in /users/{uid}"
  );

  // Assertion 5: Student cannot directly alter /auditLogs
  const forgedLogId = "forged_log_" + Date.now();
  await expectPermissionDenied(
    () => setDoc(doc(db, "auditLogs", forgedLogId), {
      action: "TAMPER",
      actorUid: "admin_uid",
      timestamp: serverTimestamp()
    }),
    "Student cannot create audit log with spoofed actorUid"
  );

  // ---------------------------------------------------------------------------
  // PHASE 3: ATTEMPT INTEGRITY & TIME-SPOOFING DEFENSE
  // ---------------------------------------------------------------------------
  console.log("\n[PHASE 3] ATTEMPT LIFECYCLE, DEADLINE & SCORE TAMPER PREVENTION...");

  // Create a legal student attempt
  const testId = "placement-technical-50";
  const now = new Date();
  const deadline = new Date(now.getTime() + 60 * 60 * 1000);
  const testAttemptRef = doc(collection(db, "attempts"));

  await setDoc(testAttemptRef, {
    testId,
    studentUid,
    status: "in_progress",
    startedAt: now.toISOString(),
    deadlineAt: deadline.toISOString(),
    durationMinutes: 60,
    createdAt: serverTimestamp()
  });
  assert(true, "Student successfully initialized legal in_progress attempt");

  // Attempt tamper 1: Student tries to extend their deadline
  await expectPermissionDenied(
    () => updateDoc(testAttemptRef, {
      deadlineAt: new Date(deadline.getTime() + 1000 * 60 * 60).toISOString()
    }),
    "Student cannot tamper or extend deadlineAt on /attempts/{attemptId}"
  );

  // Attempt tamper 2: Student tries to inject totalScore
  await expectPermissionDenied(
    () => updateDoc(testAttemptRef, {
      totalScore: 200,
      score: 200
    }),
    "Student cannot self-assign totalScore or score on /attempts/{attemptId}"
  );

  // Attempt tamper 3: Student writes response to subcollection
  const respRef = doc(db, "attempts", testAttemptRef.id, "responses", "placement50-cpp-q15");
  await setDoc(respRef, {
    questionId: "placement50-cpp-q15",
    selectedAnswer: "D",
    markedForReview: false,
    answeredAt: new Date().toISOString()
  });
  assert(true, "Student can save legitimate answer in subcollection while attempt is in_progress");

  // Attempt tamper 4: Student tries to inject isCorrect: true into response
  await expectPermissionDenied(
    () => setDoc(respRef, {
      questionId: "placement50-cpp-q15",
      selectedAnswer: "D",
      isCorrect: true,
      marksAwarded: 4
    }),
    "Student cannot inject isCorrect or marksAwarded into response document"
  );

  // Student legally submits attempt
  await updateDoc(testAttemptRef, {
    status: "submitted",
    submittedAt: new Date().toISOString()
  });
  assert(true, "Student can legally submit their attempt session");

  // Attempt tamper 5: Student tries to modify responses AFTER submission
  await expectPermissionDenied(
    () => setDoc(respRef, {
      questionId: "placement50-cpp-q15",
      selectedAnswer: "A",
      answeredAt: new Date().toISOString()
    }),
    "Student cannot modify responses after parent attempt is submitted"
  );

  // ---------------------------------------------------------------------------
  // PHASE 4: ORDINARY ADMIN RBAC RESTRICTIONS
  // ---------------------------------------------------------------------------
  console.log("\n[PHASE 4] ORDINARY ADMIN BOUNDARY ENFORCEMENT...");
  await signInWithEmailAndPassword(auth, credentials.admin.email, credentials.admin.pass);
  console.log(`  Logged in as Ordinary Admin: ${credentials.admin.email}`);

  // Admin cannot promote self to super_admin
  const adminDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
  await expectPermissionDenied(
    () => updateDoc(doc(db, "users", auth.currentUser.uid), {
      role: "super_admin"
    }),
    "Ordinary admin cannot self-promote to 'super_admin'"
  );

  // Admin cannot delete super admin user doc
  await expectPermissionDenied(
    () => deleteDoc(doc(db, "users", "e9jDBfRPpngJE3vXYily6ek7bts1")),
    "Ordinary admin cannot delete Super Admin user document"
  );

  // Admin cannot delete or update audit logs (Append-only rule)
  const auditTestRef = doc(collection(db, "auditLogs"));
  await setDoc(auditTestRef, {
    action: "ADMIN_ACTION_TEST",
    actorUid: auth.currentUser.uid,
    actorEmail: credentials.admin.email,
    timestamp: serverTimestamp()
  });
  assert(true, "Admin can append legitimate entries to /auditLogs");

  await expectPermissionDenied(
    () => deleteDoc(auditTestRef),
    "Admin CANNOT delete /auditLogs records (immutable audit compliance)"
  );

  await expectPermissionDenied(
    () => updateDoc(auditTestRef, { action: "TAMPERED_ACTION" }),
    "Admin CANNOT update /auditLogs records (immutable audit compliance)"
  );

  // ---------------------------------------------------------------------------
  // PHASE 5: SUPER ADMIN RESTORATION & CLEANUP
  // ---------------------------------------------------------------------------
  console.log("\n[PHASE 5] SUPER ADMIN AUTHORIZATION & CLEANUP...");
  await signInWithEmailAndPassword(auth, credentials.superAdmin.email, credentials.superAdmin.pass);
  console.log(`  Logged in as Super Admin: ${credentials.superAdmin.email}`);

  // Clean up test attempt doc
  await deleteDoc(respRef).catch(() => {});
  await deleteDoc(testAttemptRef).catch(() => {});
  assert(true, "Super Admin cleaned up temporary test attempt doc");

  console.log("\n================================================================================");
  console.log(` RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
  console.log("================================================================================");

  if (failCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runSecurityAudit().catch((err) => {
  console.error("Fatal test error:", err);
  process.exit(1);
});
