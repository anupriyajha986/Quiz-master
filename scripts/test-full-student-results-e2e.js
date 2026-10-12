import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc, setDoc, collection, getDocs, query, where } from "firebase/firestore";
import { startAttempt, saveResponse, submitAttempt } from "../src/services/firebase/examService.js";
import { getTestById, getStudentAvailableTests } from "../src/services/firebase/testService.js";
import { getStudentResults } from "../src/services/firebase/studentService.js";
import { getResultById, getResultByAttemptId, getAllResults } from "../src/services/firebase/analyticsService.js";
import { auth, db } from "../src/services/firebase/config.js";

async function runE2ETests() {
  console.log("================================================================================");
  console.log("       QuizMaster Student Results & Scorecard Fix — Full E2E Verification        ");
  console.log("================================================================================\n");

  let studentAResultId = null;
  let studentAAttemptId = null;

  // --------------------------------------------------------------------------
  // TEST 1: Student A Login & Exam Attempt Initialization
  // --------------------------------------------------------------------------
  console.log("--- TEST 1: Student A Login & Exam Initialization ---");
  const studentACred = await signInWithEmailAndPassword(auth, "student@quizmaster.com", "Student@12345");
  const studentAUid = studentACred.user.uid;
  console.log("✓ Student A authenticated:", studentACred.user.email, "(UID:", studentAUid, ")");

  const studentProfile = {
    fullName: "Aryan Sharma",
    normalizedRollNumber: "QM2026-001",
    instituteName: "QuizMaster Tech Academy"
  };

  const availableTests = await getStudentAvailableTests();
  let testId = null;
  let test = null;
  let attemptObj = null;

  for (const t of availableTests) {
    try {
      const fullTest = await getTestById(t.id);
      if (!fullTest || (fullTest.publishedQuestionsSnapshot?.length || 0) < 2) continue;
      const keyDoc = await getDoc(doc(db, "answerKeys", t.id));
      if (!keyDoc.exists()) continue;

      const res = await startAttempt(t.id, studentProfile, fullTest);
      testId = t.id;
      test = fullTest;
      attemptObj = res;
      break;
    } catch (err) {
      // Continue to next available test if attempt limit reached
      continue;
    }
  }

  if (!attemptObj) {
    throw new Error("No eligible published test found with available attempts for Student A.");
  }

  console.log("✓ Examination loaded:", test.title, `(${test.questionCount || test.publishedQuestionsSnapshot.length} questions, Max: ${test.maximumMarks})`);
  const { attempt, isResumed } = attemptObj;
  studentAAttemptId = attempt.id;
  console.log("✓ Attempt record active:", studentAAttemptId, `(Resumed: ${isResumed})`);

  // --------------------------------------------------------------------------
  // TEST 2: Answer Evaluation & Atomic Result Submission
  // --------------------------------------------------------------------------
  console.log("\n--- TEST 2: Answer Evaluation & Result Submission ---");
  // Answer key for html-set-2:
  // Let's inspect questions and answer key:
  const questions = test.publishedQuestionsSnapshot;
  const keyDoc = await getDoc(doc(db, "answerKeys", testId));
  const answers = keyDoc.data()?.answers || {};

  const q1 = questions[0];
  const q2 = questions[1];
  const q1Correct = answers[q1.id]?.correctAnswer || "A";
  const q2Correct = answers[q2.id]?.correctAnswer || "A";
  const q2Wrong = ["A", "B", "C", "D"].find(opt => String(opt).toUpperCase() !== String(q2Correct).toUpperCase()) || "INCORRECT_ANSWER";

  const responses = {
    [q1.id]: { selectedAnswer: q1Correct, markedForReview: false },
    [q2.id]: { selectedAnswer: q2Wrong, markedForReview: false }
  };

  await saveResponse(studentAAttemptId, q1.id, responses[q1.id]);
  await saveResponse(studentAAttemptId, q2.id, responses[q2.id]);
  console.log(`✓ Saved answers: Q1 -> '${q1Correct}' (Correct), Q2 -> '${q2Wrong}' (Incorrect)`);

  const submissionResult = await submitAttempt(studentAAttemptId, responses, test, studentProfile);
  studentAResultId = submissionResult.resultId;
  console.log("✓ Submission succeeded! Result returned:", {
    resultId: submissionResult.resultId,
    totalScore: submissionResult.totalScore,
    maximumMarks: submissionResult.maximumMarks,
    positiveMarks: submissionResult.positiveMarks,
    negativeMarks: submissionResult.negativeMarks,
    percentage: submissionResult.percentage,
    accuracy: submissionResult.accuracy,
    timeTaken: submissionResult.timeTaken,
    resultStatus: submissionResult.resultStatus,
    studentUid: submissionResult.studentUid,
    studentId: submissionResult.studentId
  });

  // Verify marking math: +4 (correct) - 1 (incorrect) = 3 marks
  if (submissionResult.totalScore === 3 &&
      submissionResult.positiveMarks === 4 &&
      submissionResult.negativeMarks === 1 &&
      submissionResult.correctCount === 1 &&
      submissionResult.incorrectCount === 1) {
    console.log("✓ MARKING SCHEME VERIFIED: Correct (+4), Incorrect (-1), Unanswered (0) => Final Score: 3");
  } else {
    throw new Error(`Marking calculation failed! Expected 3, got ${submissionResult.totalScore}`);
  }

  // Verify ownership identifiers
  if (submissionResult.studentUid === studentAUid && submissionResult.studentId === studentAUid) {
    console.log("✓ OWNERSHIP IDENTIFIERS VERIFIED: Both studentUid and studentId match authenticated UID.");
  } else {
    throw new Error("Student ownership mismatch in result data!");
  }

  // --------------------------------------------------------------------------
  // TEST 3: Submission Idempotency & Duplicate Prevention
  // --------------------------------------------------------------------------
  console.log("\n--- TEST 3: Submission Idempotency & Refresh Resilience ---");
  const secondSubmission = await submitAttempt(studentAAttemptId, responses, test, studentProfile);
  console.log("✓ Re-submission returned resultId:", secondSubmission.resultId, "(alreadySubmitted:", secondSubmission.alreadySubmitted, ")");
  if (secondSubmission.resultId === studentAResultId) {
    console.log("✓ IDEMPOTENCY CONFIRMED: Repeated submission safely returned the same document ID without duplicates.");
  } else {
    throw new Error("Duplicate result document created on repeated submission!");
  }

  // --------------------------------------------------------------------------
  // TEST 4: Student Results History Query
  // --------------------------------------------------------------------------
  console.log("\n--- TEST 4: Student Results Query & Dashboard Data ---");
  const myResults = await getStudentResults(studentAUid);
  console.log(`✓ Fetched ${myResults.length} result(s) for Student A.`);
  const foundNewResult = myResults.find((r) => r.id === studentAResultId);
  if (foundNewResult) {
    console.log("✓ New exam result is immediately present in Student Results dashboard!");
    console.log("  - Title:", foundNewResult.testTitle);
    console.log("  - Score:", `${foundNewResult.totalScore} / ${foundNewResult.maximumMarks}`);
    console.log("  - Percentage:", `${foundNewResult.percentage}%`);
    console.log("  - Status:", foundNewResult.resultStatus);
    console.log("  - Time Taken:", foundNewResult.timeTaken);
  } else {
    throw new Error("Newly submitted result not found in student results list!");
  }

  // Verify all results in myResults belong exclusively to Student A
  const otherStudentResults = myResults.filter((r) => r.studentUid !== studentAUid && r.studentId !== studentAUid);
  if (otherStudentResults.length === 0) {
    console.log("✓ PRIVACY VERIFIED: Student A dashboard contains ONLY Student A's results (zero leakage).");
  } else {
    throw new Error(`Data leakage! Found ${otherStudentResults.length} foreign results in Student A's dashboard.`);
  }

  // --------------------------------------------------------------------------
  // TEST 5: Detailed Scorecard Document Retrieval
  // --------------------------------------------------------------------------
  console.log("\n--- TEST 5: Scorecard Direct Fetch & Resolution by Attempt ID ---");
  const scorecardDoc = await getResultById(studentAResultId);
  if (scorecardDoc && scorecardDoc.id === studentAResultId) {
    console.log("✓ getResultById succeeded: Scorecard document loaded with", scorecardDoc.evaluatedResponses?.length || 0, "evaluated responses.");
  } else {
    throw new Error("Could not retrieve scorecard document by result ID!");
  }

  const scorecardByAttempt = await getResultByAttemptId(studentAAttemptId);
  if (scorecardByAttempt && scorecardByAttempt.id === studentAResultId) {
    console.log("✓ getResultByAttemptId succeeded: Resolved scorecard seamlessly from attempt ID.");
  } else {
    throw new Error("Could not resolve scorecard by attempt ID!");
  }

  // --------------------------------------------------------------------------
  // TEST 6: Security Rules & Cross-Student Isolation Enforcement
  // --------------------------------------------------------------------------
  console.log("\n--- TEST 6: Security Rules & Cross-Student Authorization ---");
  let studentBCred;
  try {
    studentBCred = await signInWithEmailAndPassword(auth, "student2@quizmaster.com", "Student2@12345");
  } catch (err) {
    if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found") {
      studentBCred = await createUserWithEmailAndPassword(auth, "student2@quizmaster.com", "Student2@12345");
      await setDoc(doc(db, "users", studentBCred.user.uid), {
        uid: studentBCred.user.uid,
        email: "student2@quizmaster.com",
        fullName: "Priya Verma",
        role: "student",
        accountStatus: "active"
      });
    } else {
      throw err;
    }
  }
  const studentBUid = studentBCred.user.uid;
  console.log("✓ Student B authenticated:", studentBCred.user.email, "(UID:", studentBUid, ")");

  // Security Check 6a: Student B cannot read Student A's scorecard document
  console.log("Testing 6a: Can Student B read Student A's scorecard document?");
  try {
    const foreignSnap = await getDoc(doc(db, "results", studentAResultId));
    if (foreignSnap.exists()) {
      throw new Error("SECURITY VIOLATION: Student B was able to read Student A's result document!");
    }
  } catch (err) {
    if (err.code === "permission-denied" || err.message?.includes("Missing or insufficient permissions") || err.message?.includes("permission")) {
      console.log("✓ ACCESS DENIED (Expected): Firestore security rules blocked Student B from reading Student A's result doc.");
    } else {
      throw err;
    }
  }

  // Security Check 6b: Student B cannot alter Student A's stored score
  console.log("Testing 6b: Can Student B modify Student A's score in Firestore?");
  try {
    await updateDoc(doc(db, "results", studentAResultId), { totalScore: 100, percentage: 100 });
    throw new Error("SECURITY VIOLATION: Student B was able to modify Student A's score in Firestore!");
  } catch (err) {
    if (err.code === "permission-denied" || err.message?.includes("Missing or insufficient permissions") || err.message?.includes("permission")) {
      console.log("✓ ACCESS DENIED (Expected): Firestore security rules blocked tampering with results.");
    } else {
      throw err;
    }
  }

  // Security Check 6c: Student B cannot fabricate a result document for an attempt they don't own
  console.log("Testing 6c: Can Student B forge a result document for Student A's attempt?");
  try {
    await setDoc(doc(db, "results", "fabricated_result_test"), {
      resultId: "fabricated_result_test",
      attemptId: studentAAttemptId,
      testId: "html-set-2",
      totalScore: 999,
      maximumMarks: 80,
      studentUid: studentBUid,
      studentId: studentBUid
    });
    throw new Error("SECURITY VIOLATION: Student B forged a result doc for Student A's attempt!");
  } catch (err) {
    if (err.code === "permission-denied" || err.message?.includes("Missing or insufficient permissions") || err.message?.includes("permission")) {
      console.log("✓ ACCESS DENIED (Expected): Firestore rules blocked result creation because attempt is not owned by Student B.");
    } else {
      throw err;
    }
  }

  // Security Check 6d: Student B's dashboard only shows Student B's results
  console.log("Testing 6d: Does Student B see Student A's results in their dashboard query?");
  const studentBResults = await getStudentResults(studentBUid);
  const leakedA = studentBResults.find((r) => r.id === studentAResultId);
  if (!leakedA) {
    console.log("✓ DASHBOARD ISOLATION VERIFIED: Student B sees 0 results from Student A.");
  } else {
    throw new Error("SECURITY VIOLATION: Student A's result leaked into Student B's dashboard!");
  }

  // --------------------------------------------------------------------------
  // TEST 7: Administrator Comprehensive Visibility
  // --------------------------------------------------------------------------
  console.log("\n--- TEST 7: Admin Comprehensive Result Access ---");
  const adminCred = await signInWithEmailAndPassword(auth, "admin@quizmaster.com", "Admin@12345");
  console.log("✓ Administrator authenticated:", adminCred.user.email, "(UID:", adminCred.user.uid, ")");

  const allAdminResults = await getAllResults();
  console.log(`✓ Admin fetched total ${allAdminResults.length} results across all students.`);
  const adminFoundStudentAResult = allAdminResults.find((r) => r.id === studentAResultId);
  if (adminFoundStudentAResult) {
    console.log("✓ ADMIN VISIBILITY VERIFIED: Admin successfully accessed Student A's newly submitted result:", {
      id: adminFoundStudentAResult.id,
      studentName: adminFoundStudentAResult.studentName,
      testTitle: adminFoundStudentAResult.testTitle,
      score: `${adminFoundStudentAResult.totalScore} / ${adminFoundStudentAResult.maximumMarks}`
    });
  } else {
    throw new Error("Admin could not locate Student A's result!");
  }

  console.log("\n================================================================================");
  console.log("               ALL 7 END-TO-END VERIFICATION TESTS PASSED 100%!                ");
  console.log("================================================================================\n");
}

runE2ETests().then(() => process.exit(0)).catch((err) => {
  console.error("\n❌ E2E Verification Test Failed:", err);
  process.exit(1);
});
