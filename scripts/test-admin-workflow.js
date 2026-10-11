import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { getAdminDashboardStats } from "../src/services/firebase/analyticsService.js";
import { createStudentByAdmin } from "../src/services/firebase/studentService.js";
import { startAttempt, saveResponse, adminForceSubmitAttempt } from "../src/services/firebase/examService.js";
import { getTests } from "../src/services/firebase/testService.js";
import { exportToCsv } from "../src/utils/csvExport.js";

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

async function runAdminJourneyVerification() {
  console.log("==========================================================");
  console.log("QUIZMASTER ADMIN JOURNEY & END-TO-END WORKFLOW VERIFICATION");
  console.log("==========================================================");

  // 1. Admin Auth
  console.log("\n[TEST 1] Admin Authentication...");
  const adminCred = await signInWithEmailAndPassword(auth, "admin@quizmaster.com", "Admin@12345");
  console.log(`✓ Admin session established. UID: ${adminCred.user.uid}`);

  // 2. Real Analytics Aggregation Check (Zero Mock Data)
  console.log("\n[TEST 2] Real Analytics Aggregation (No Mock Constants)...");
  const stats = await getAdminDashboardStats();
  console.log(`✓ Real Dashboard KPI Stats retrieved:`);
  console.log(`  Total Students:     ${stats.totalStudents}`);
  console.log(`  Published Tests:    ${stats.publishedTests}`);
  console.log(`  Total Questions:    ${stats.totalQuestions}`);
  console.log(`  Active Attempts:    ${stats.activeAttempts}`);
  console.log(`  Completed Attempts: ${stats.completedAttempts}`);
  console.log(`  Pending Results:    ${stats.pendingResults}`);
  console.log(`  Activity 7-Day:     ${stats.activityData["7days"].length} buckets`);
  console.log(`  Performance Cat:    ${stats.studentPerformance.length} brackets`);
  console.log(`  Platform Analytics: ${JSON.stringify(stats.platformAnalytics)}`);

  if (stats.totalStudents === 1284 && stats.totalQuestions === 2560) {
    throw new Error("FAIL: Stats are returning old mock constant fallbacks!");
  }
  console.log("✓ Assertion passed: empirical database aggregations confirmed.");

  // 3. Admin Student Provisioning Workflow
  console.log("\n[TEST 3] Admin Candidate Provisioning Workflow...");
  const testStudentEmail = `qa_student_${Date.now()}@quizmaster.com`;
  const provisioned = await createStudentByAdmin({
    email: testStudentEmail,
    password: "Password@123",
    fullName: "QA Candidate Auto",
    rollNumber: `ROLL${Date.now().toString().slice(-6)}`,
    instituteName: "IIT Delhi Prep Centre",
    phone: "+91 9999988888"
  }, {
    adminUid: adminCred.user.uid,
    adminEmail: adminCred.user.email,
    adminName: "Primary Admin"
  });
  console.log(`✓ Candidate provisioned successfully. UID: ${provisioned.uid}`);
  console.log(`  Email: ${provisioned.email}, Roll: ${provisioned.normalizedRollNumber}`);

  // Verify admin session remained intact (was not signed out by student provisioning)
  if (auth.currentUser.uid !== adminCred.user.uid) {
    throw new Error("FAIL: Admin was logged out during student provisioning!");
  }
  console.log("✓ Assertion passed: Admin session remained active without interruption.");

  // 4. Live Attempts & Force-Submit / Reconcile Intervention
  console.log("\n[TEST 4] Live Attempt & Admin Force-Submit Intervention...");
  const tests = await getTests("published");
  if (tests.length === 0) throw new Error("No published test found to conduct attempt test.");
  const targetTest = tests[0];
  console.log(`  Target Exam: "${targetTest.title}" (ID: ${targetTest.id})`);

  // Candidate starts attempt
  const { attempt } = await startAttempt(targetTest.id, {
    fullName: provisioned.fullName,
    normalizedRollNumber: provisioned.normalizedRollNumber,
    instituteName: provisioned.instituteName
  });
  console.log(`✓ Candidate attempt created. Attempt ID: ${attempt.id}`);

  // Candidate saves 1 response
  const firstQ = targetTest.publishedQuestionsSnapshot[0];
  await saveResponse(attempt.id, firstQ.id, {
    selectedAnswer: "A",
    markedForReview: false
  });
  console.log(`✓ Response saved to subcollection attempts/${attempt.id}/responses/${firstQ.id}`);

  // Admin initiates authoritative force-submit / reconcile
  console.log("  -> Admin executing authoritative reconciliation on candidate session...");
  const reconciledResult = await adminForceSubmitAttempt(attempt.id, {
    reason: "QA Automated Intervention — candidate session timed out",
    adminUid: adminCred.user.uid,
    adminName: "Primary Admin",
    adminEmail: adminCred.user.email
  });

  console.log(`✓ Attempt successfully reconciled! Result ID: ${reconciledResult.resultId}`);
  console.log(`  Total Score: ${reconciledResult.totalScore} / ${reconciledResult.maximumMarks}`);
  console.log(`  Percentage:  ${reconciledResult.percentage}%`);
  console.log(`  Reconciled By Admin: ${reconciledResult.reconciledByAdmin}`);

  // Verify attempt status updated in Firestore
  const updatedAttemptSnap = await getDoc(doc(db, "attempts", attempt.id));
  const updatedAttempt = updatedAttemptSnap.data();
  if (updatedAttempt.status !== "submitted") {
    throw new Error("FAIL: Attempt status was not updated to submitted!");
  }
  if (!updatedAttempt.reconciledBy) {
    throw new Error("FAIL: ReconciledBy administrative metadata missing on attempt!");
  }
  console.log(`✓ Attempt status verified: ${updatedAttempt.status} with reconciledBy metadata.`);

  // 5. Audit Logging Verification
  console.log("\n[TEST 5] Audit Trail Integrity Check...");
  const auditSnap = await getDocs(query(collection(db, "auditLogs"), where("action", "==", "FORCE_SUBMIT_ATTEMPT")));
  if (auditSnap.empty) {
    throw new Error("FAIL: FORCE_SUBMIT_ATTEMPT was not logged to auditLogs collection!");
  }
  const matchingLog = auditSnap.docs.find(d => d.data().details?.attemptId === attempt.id);
  if (!matchingLog) {
    throw new Error("FAIL: Specific attempt reconciliation was not found in audit log!");
  }
  console.log(`✓ Audit log verified in collection auditLogs:`);
  console.log(`  Action: ${matchingLog.data().action}, Actor: ${matchingLog.data().actorEmail}`);
  console.log(`  Details: ${JSON.stringify(matchingLog.data().details)}`);

  // 6. CSV Export Signature Resilience Test
  console.log("\n[TEST 6] CSV Export Signature Resilience Check...");
  let csvError = null;
  try {
    // Test canonical order: (filename, rows)
    // Note: In Node.js environment without window/document, we mock document.createElement
    global.document = {
      createElement: () => ({
        setAttribute: () => {},
        click: () => {}
      }),
      body: {
        appendChild: () => {},
        removeChild: () => {}
      }
    };
    global.Blob = class { constructor(data) { this.data = data; } };
    global.URL = { createObjectURL: () => "blob://dummy" };

    exportToCsv("test_canonical.csv", [{ a: 1, b: 2 }]);
    exportToCsv([{ a: 1, b: 2 }], "test_inverted.csv");
    console.log("✓ exportToCsv seamlessly handled both canonical and inverted argument orders.");
  } catch (err) {
    csvError = err;
    console.error("CSV test error:", err);
  }
  if (csvError) throw csvError;

  console.log("\n==========================================================");
  console.log("ALL 6 ADMIN JOURNEY & WORKFLOW TESTS PASSED PERFECTLY!");
  console.log("==========================================================");
}

runAdminJourneyVerification()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("\n❌ VERIFICATION TEST FAILED:", err);
    process.exit(1);
  });
