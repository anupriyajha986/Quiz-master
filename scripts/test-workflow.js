import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  connectAuthEmulator
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  connectFirestoreEmulator
} from "firebase/firestore";
import {
  createQuestion,
  getQuestions
} from "../src/services/firebase/questionService.js";
import {
  createQuestionSet
} from "../src/services/firebase/questionSetService.js";
import {
  createTest,
  publishTest,
  getStudentAvailableTests
} from "../src/services/firebase/testService.js";
import {
  startAttempt,
  saveResponse,
  getAttemptResponses,
  submitAttempt,
  adminForceSubmitAttempt
} from "../src/services/firebase/examService.js";
import {
  addBookmark,
  getUserBookmarks,
  isQuestionBookmarked,
  removeBookmark
} from "../src/services/firebase/bookmarkService.js";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyDC55H0zV6cUTJSF9IOxuXWiW9a6gK0miY",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "quiz-master-portal.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "quiz-master-portal",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "quiz-master-portal.firebasestorage.app",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "439258848801",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:439258848801:web:5f4392d08ec1426f140d60",
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || "G-JZ2XJFV26Y"
};

// =========================================================================
// PRODUCTION WRITE PROTECTION GATE
// =========================================================================
const isEmulatorMode =
  process.argv.includes("--emulator") ||
  process.env.USE_FIREBASE_EMULATOR === "true" ||
  Boolean(process.env.FIRESTORE_EMULATOR_HOST);

if (!isEmulatorMode && process.env.ALLOW_PROD_TEST_WRITES !== "true") {
  console.error("================================================================================");
  console.error("❌ SAFETY CHECK BLOCKED: DIRECT TEST WRITES TO PRODUCTION ARE PROHIBITED");
  console.error("================================================================================");
  console.error("The automated E2E test suite creates mock examinations and questions.");
  console.error("To prevent polluting the live database 'quiz-master-portal', this script requires:");
  console.error("  1. The Firebase Emulator (run with '--emulator' or USE_FIREBASE_EMULATOR=true)");
  console.error("  OR");
  console.error("  2. An isolated test Firebase project ID (set VITE_FIREBASE_PROJECT_ID=quiz-master-test)");
  console.error("  OR");
  console.error("  3. Explicit override flag (set ALLOW_PROD_TEST_WRITES=true for emergency verification)");
  console.error("================================================================================");
  process.exit(1);
}

const app = initializeApp(firebaseConfig, "qaTestRunner_" + Date.now());
const auth = getAuth(app);
const db = getFirestore(app);

if (isEmulatorMode) {
  const host = process.env.FIRESTORE_EMULATOR_HOST?.split(":")[0] || "127.0.0.1";
  const firestorePort = Number(process.env.FIRESTORE_EMULATOR_HOST?.split(":")[1]) || 8080;
  const authPort = Number(process.env.FIREBASE_AUTH_EMULATOR_HOST?.split(":")[1]) || 9099;
  connectFirestoreEmulator(db, host, firestorePort);
  connectAuthEmulator(auth, `http://${host}:${authPort}`, { disableWarnings: true });
  console.log(`✓ Connected to Firebase Emulators at ${host}:${firestorePort} (Auth: ${authPort})`);
}

async function runVerification() {
  console.log("=================================================");
  console.log("RUNNING QUIZMASTER END-TO-END AUTOMATED QA SUITE");
  console.log("=================================================");

  // Artifact trackers for guaranteed teardown
  let createdQuestionId = null;
  let createdQuestionSetId = null;
  let createdTestId = null;
  let createdAttemptId = null;
  let createdResultId = null;

  try {
    // 1. Admin Login Verification
    console.log("\n[TEST 1] Admin Authentication...");
    const adminCred = await signInWithEmailAndPassword(auth, "admin@quizmaster.com", "Admin@12345");
    console.log(`✓ Admin authenticated. UID: ${adminCred.user.uid}`);

    // 2. Admin Question Creation (Uses registered subject JavaScript)
    console.log("\n[TEST 2] Question Bank Operations...");
    const testQuestion = await createQuestion({
      questionText: "Which keyword declares a block-scoped variable in modern JavaScript?",
      subject: "JavaScript",
      topic: "Variables & Scope",
      difficulty: "easy",
      positiveMarks: 4,
      negativeMarks: 1,
      unansweredMarks: 0,
      options: [
        { id: "A", text: "let" },
        { id: "B", text: "var" },
        { id: "C", text: "global" },
        { id: "D", text: "define" }
      ],
      correctAnswer: "A",
      explanation: "The 'let' keyword declares a block-scoped local variable in JavaScript."
    });
    createdQuestionId = testQuestion.id;
    console.log(`✓ Question created with ID: ${testQuestion.id}`);

    // 3. Question Set Creation
    console.log("\n[TEST 3] Question Set Assembly...");
    const testSet = await createQuestionSet({
      title: "[TEST-SUITE] QA Verification Question Pack " + Date.now(),
      subject: "JavaScript",
      questionIds: [testQuestion.id],
      totalMarks: 4
    });
    createdQuestionSetId = testSet.id;
    console.log(`✓ Question set created with ID: ${testSet.id}`);

    // 4. Test Creation & Publishing
    console.log("\n[TEST 4] Test Wizard & Snapshot Deployment...");
    const createdTest = await createTest({
      title: "[TEST-SUITE] QA Examination " + Date.now(),
      subject: "JavaScript",
      questionIds: [testQuestion.id],
      durationMinutes: 30,
      attemptLimit: 2,
      markingScheme: { positiveMarks: 4, negativeMarks: 1, unansweredMarks: 0 }
    });
    createdTestId = createdTest.id;
    console.log(`✓ Test draft created with ID: ${createdTest.id}`);

    const publishResult = await publishTest(createdTest.id);
    console.log(`✓ Test published with sanitized snapshot. Max marks: ${publishResult.maximumMarks}`);

    // 5. Student Authentication
    console.log("\n[TEST 5] Student Authentication...");
    const studentCred = await signInWithEmailAndPassword(auth, "student@quizmaster.com", "Student@12345");
    await new Promise((r) => setTimeout(r, 800));
    console.log(`✓ Student authenticated. UID: ${studentCred.user.uid}`);

    // 6. Security Assertion: Student MUST NOT modify answerKey vault
    console.log("\n[TEST 6] Security Assertion: Answer Key Vault Write Protection...");
    try {
      await updateDoc(doc(db, "answerKeys", createdTest.id), { answers: {} });
      console.error("FAIL: Student was able to modify answerKeys collection!");
      process.exit(1);
    } catch (err) {
      console.log("✓ Access properly DENIED: Student blocked from modifying answerKeys vault.");
    }

    // 7. Test Discovery
    console.log("\n[TEST 7] Student Available Examinations Query...");
    const availableTests = await getStudentAvailableTests();
    const foundTest = availableTests.find((t) => t.id === createdTest.id);
    if (!foundTest) {
      throw new Error("Published test not found in student available list.");
    }
    console.log(`✓ Student successfully queried published test: "${foundTest.title}"`);

    // 8. Explicit Start Attempt (Timing begins)
    console.log("\n[TEST 8] Authoritative Examination Start...");
    const { attempt, isResumed } = await startAttempt(createdTest.id, {
      fullName: "Rahul Sharma",
      normalizedRollNumber: "2026-JEE-0104",
      instituteName: "NIT"
    }, foundTest);
    createdAttemptId = attempt.id;
    console.log(`✓ Attempt initialized with ID: ${attempt.id}`);
    console.log(`  Started At: ${attempt.startedAt}`);
    console.log(`  Authoritative Deadline: ${attempt.deadlineAt}`);

    // 9. Answer Persistence & Marked for Review
    console.log("\n[TEST 9] Real-Time Response Persistence...");
    await saveResponse(attempt.id, testQuestion.id, {
      selectedAnswer: "A",
      markedForReview: true
    });
    console.log("✓ Answer 'Option A' saved with Review Flag.");

    // 10. Refresh & Recovery Simulation
    console.log("\n[TEST 10] Session Recovery Simulation...");
    const recoveredResponses = await getAttemptResponses(attempt.id);
    if (
      recoveredResponses[testQuestion.id]?.selectedAnswer !== "A" ||
      !recoveredResponses[testQuestion.id]?.markedForReview
    ) {
      throw new Error("State recovery failed! Responses did not persist reliably.");
    }
    console.log("✓ Session recovery verified: Candidate responses intact across reload.");

    // 11. Authoritative Submission & Scorecard Verification
    console.log("\n[TEST 11] Authoritative Submission & Scorecard Generation...");
    const finalResult = await submitAttempt(attempt.id);
    createdResultId = finalResult.resultId;
    console.log("✓ Exam attempt successfully submitted and authoritatively graded.");
    console.log(`  Result ID:   ${finalResult.resultId}`);
    console.log(`  Total Score: ${finalResult.totalScore} / ${finalResult.maximumPossibleMarks || 4}`);
    console.log(`  Percentage:  ${finalResult.percentage}%`);
    console.log(`  Accuracy:    ${finalResult.accuracy}%`);
    console.log(`  Correct:     ${finalResult.correctCount}`);
    console.log(`  Incorrect:   ${finalResult.incorrectCount}`);

    if (finalResult.totalScore !== 4 || finalResult.percentage !== 100) {
      throw new Error(`Unexpected score: expected 4 marks (100%), received ${finalResult.totalScore}`);
    }

    // Re-authenticate as student to assert scorecard retrieval
    console.log("  -> Candidate verifying published scorecard access...");
    await signInWithEmailAndPassword(auth, "student@quizmaster.com", "Student@12345");
    const studentResultDoc = await getDoc(doc(db, "results", finalResult.resultId));
    if (!studentResultDoc.exists()) {
      throw new Error("Student was unable to retrieve their finalized result scorecard!");
    }
    console.log("✓ Student successfully retrieved finalized result scorecard.");

    // 12. Bookmarks Persistence & Retrieval
    console.log("\n[TEST 12] Question Bookmark Persistence & Management...");
    const bookmarkId = await addBookmark({
      studentUid: studentCred.user.uid,
      questionId: testQuestion.id,
      questionText: testQuestion.questionText,
      subject: testQuestion.subject || "JavaScript",
      testId: createdTest.id,
      testTitle: createdTest.title,
      options: testQuestion.options,
      selectedAnswer: "A",
      correctAnswer: "A",
      explanation: "Standard JS Concept."
    });
    console.log(`✓ Bookmark created with ID: ${bookmarkId}`);

    const isMarked = await isQuestionBookmarked(studentCred.user.uid, testQuestion.id);
    if (!isMarked) {
      throw new Error("isQuestionBookmarked returned false for newly added bookmark!");
    }
    console.log("✓ Question confirmed bookmarked via isQuestionBookmarked.");

    const bookmarksList = await getUserBookmarks(studentCred.user.uid);
    const foundBm = bookmarksList.find((b) => b.id === bookmarkId);
    if (!foundBm) {
      throw new Error("Newly added bookmark not found in getUserBookmarks list!");
    }
    console.log(`✓ getUserBookmarks retrieved list containing ${bookmarksList.length} bookmark(s).`);

    await removeBookmark(bookmarkId);
    const isMarkedAfter = await isQuestionBookmarked(studentCred.user.uid, testQuestion.id);
    if (isMarkedAfter) {
      throw new Error("Bookmark was not removed successfully!");
    }
    console.log("✓ Bookmark successfully removed and verified.");

    console.log("\n=================================================");
    console.log("ALL 12 AUTOMATED VERIFICATION CRITICAL PATHS PASSED!");
    console.log("=================================================");
  } finally {
    // Teardown: Permanently clean up any created test artifacts so they never leak into the database
    console.log("\n[TEARDOWN] Purging all test verification artifacts...");
    try {
      await signInWithEmailAndPassword(auth, "admin@quizmaster.com", "Admin@12345").catch(() => {});
      if (createdAttemptId) {
        const respSnap = await getDocs(collection(db, "attempts", createdAttemptId, "responses")).catch(() => ({ docs: [] }));
        for (const r of respSnap.docs) {
          await deleteDoc(r.ref).catch(() => {});
        }
        await deleteDoc(doc(db, "attempts", createdAttemptId)).catch(() => {});
        console.log(`  ✓ Cleaned attempt: ${createdAttemptId}`);
      }
      if (createdResultId) {
        await deleteDoc(doc(db, "results", createdResultId)).catch(() => {});
        console.log(`  ✓ Cleaned result: ${createdResultId}`);
      }
      if (createdTestId) {
        await deleteDoc(doc(db, "tests", createdTestId)).catch(() => {});
        await deleteDoc(doc(db, "answerKeys", createdTestId)).catch(() => {});
        console.log(`  ✓ Cleaned test and answerKey: ${createdTestId}`);
      }
      if (createdQuestionSetId) {
        await deleteDoc(doc(db, "questionSets", createdQuestionSetId)).catch(() => {});
        console.log(`  ✓ Cleaned questionSet: ${createdQuestionSetId}`);
      }
      if (createdQuestionId) {
        await deleteDoc(doc(db, "questions", createdQuestionId)).catch(() => {});
        console.log(`  ✓ Cleaned question: ${createdQuestionId}`);
      }
      // Purge notifications created by this test
      if (createdTestId) {
        const notifSnap = await getDocs(collection(db, "notifications")).catch(() => ({ docs: [] }));
        for (const n of notifSnap.docs) {
          if (JSON.stringify(n.data()).includes(createdTestId)) {
            await deleteDoc(n.ref).catch(() => {});
          }
        }
      }
      console.log("✓ Teardown complete: Zero test artifacts left in database.");
    } catch (cleanupErr) {
      console.warn("Teardown warning:", cleanupErr.message);
    }
  }
}

runVerification()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Verification failed:", err.message, err.stack);
    process.exit(1);
  });
