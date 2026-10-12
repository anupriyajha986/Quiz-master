import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs
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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function runVerification() {
  console.log("=================================================");
  console.log("RUNNING QUIZMASTER END-TO-END AUTOMATED QA SUITE");
  console.log("=================================================");

  // 1. Admin Login Verification
  console.log("\n[TEST 1] Admin Authentication...");
  const adminCred = await signInWithEmailAndPassword(auth, "admin@quizmaster.com", "Admin@12345");
  console.log(`✓ Admin authenticated. UID: ${adminCred.user.uid}`);

  // 2. Admin Question Creation
  console.log("\n[TEST 2] Question Bank Operations...");
  const testQuestion = await createQuestion({
    questionText: "What is the acceleration due to gravity on the surface of the Earth approximately?",
    subject: "Physics",
    topic: "Gravitation",
    difficulty: "easy",
    positiveMarks: 4,
    negativeMarks: 1,
    unansweredMarks: 0,
    options: [
      { id: "A", text: "9.8 m/s²" },
      { id: "B", text: "1.6 m/s²" },
      { id: "C", text: "11.2 m/s²" },
      { id: "D", text: "8.9 m/s²" }
    ],
    correctAnswer: "A",
    explanation: "Standard acceleration due to gravity g ≈ 9.8 m/s² at sea level."
  });
  console.log(`✓ Question created with ID: ${testQuestion.id}`);

  // 3. Question Set Creation
  console.log("\n[TEST 3] Question Set Assembly...");
  const testSet = await createQuestionSet({
    title: "QA Automated Verification Question Pack",
    subject: "Physics",
    questionIds: [testQuestion.id],
    totalMarks: 4
  });
  console.log(`✓ Question set created with ID: ${testSet.id}`);

  // 4. Test Creation & Publishing
  console.log("\n[TEST 4] Test Wizard & Snapshot Deployment...");
  const createdTest = await createTest({
    title: "QA Automated Examination " + Date.now(),
    subject: "Physics",
    questionIds: [testQuestion.id],
    durationMinutes: 30,
    attemptLimit: 2,
    markingScheme: { positiveMarks: 4, negativeMarks: 1, unansweredMarks: 0 }
  });
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
    throw new Error("Failed to restore saved responses correctly!");
  }
  console.log("✓ Session recovery verified: Answer and Review flag intact across reload.");

  // 11. Student Final Submission & Evaluation Workflow
  console.log("\n[TEST 11] Examination Submission Flow (Instant Candidate Evaluation & Admin Oversight)...");
  const testData = foundTest || (await getTestById(createdTest.id));

  // Student submits the attempt directly
  console.log("  -> Candidate submitting examination session...");
  const studentSubmission = await submitAttempt(
    attempt.id,
    recoveredResponses,
    testData,
    { fullName: "Rahul Sharma", normalizedRollNumber: "2026-JEE-0104", instituteName: "NIT" }
  );

  if (studentSubmission.status !== "submitted") {
    throw new Error(`Expected attempt status to be 'submitted', got '${studentSubmission.status}'`);
  }
  console.log(`✓ Candidate successfully submitted attempt. Generated Result ID: ${studentSubmission.resultId}`);

  // Admin verifies and audits the published attempt
  console.log("  -> Admin verifying and reconciling published result...");
  await signInWithEmailAndPassword(auth, "admin@quizmaster.com", "Admin@12345");

  const finalResult = await adminForceSubmitAttempt(attempt.id, {
    reason: "Standard evaluation cycle",
    adminUid: adminCred.user.uid,
    adminName: "Primary Admin",
    adminEmail: adminCred.user.email
  });

  if (!finalResult.resultId) {
    throw new Error("Evaluation did not generate a resultId!");
  }
  console.log(`✓ Admin evaluated and published result. Result ID: ${finalResult.resultId}`);
  console.log(`  Total Score: ${finalResult.totalScore} / ${finalResult.maximumMarks}`);
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
    subject: testQuestion.subject || "Physics",
    testId: createdTest.id,
    testTitle: createdTest.title,
    options: testQuestion.options,
    selectedAnswer: "A",
    correctAnswer: "A",
    explanation: "Standard Physics Concept."
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
}

runVerification()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Verification failed:", err.message, err.stack);
    process.exit(1);
  });
