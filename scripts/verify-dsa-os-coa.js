import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../src/services/firebase/config.js";
import { startAttempt, saveResponse, submitAttempt } from "../src/services/firebase/examService.js";
import { getTestById } from "../src/services/firebase/testService.js";

async function verifySubjects() {
  console.log("=== Verifying DSA, OS, and COA Exams ===");
  const cred = await signInWithEmailAndPassword(auth, "student@quizmaster.com", "Student@12345");
  console.log("✓ Logged in as student:", cred.user.email);

  const testIds = ["dsa-set-1", "operating-systems-set-1", "coa-set-1"];

  for (const testId of testIds) {
    console.log(`\n--- Testing ${testId} ---`);
    const test = await getTestById(testId);
    console.log(`✓ Test fetched: "${test.title}"`);
    console.log(`  Questions snapshot count: ${test.publishedQuestionsSnapshot?.length}`);
    if (!test.publishedQuestionsSnapshot || test.publishedQuestionsSnapshot.length === 0) {
      throw new Error(`Test snapshot is empty for ${testId}!`);
    }

    const studentProfile = {
      fullName: "Test Candidate",
      normalizedRollNumber: "QM-VERIFY-001",
      instituteName: "Quiz Master Academy"
    };

    const { attempt, isResumed } = await startAttempt(testId, studentProfile);
    console.log(`✓ Attempt started: ${attempt.id} (resumed: ${isResumed}, status: ${attempt.status})`);

    const q1 = test.publishedQuestionsSnapshot[0];
    const responses = {
      [q1.id]: { selectedAnswer: "A", markedForReview: false }
    };
    await saveResponse(attempt.id, q1.id, responses[q1.id]);
    console.log(`✓ Saved response for Q1 (${q1.id})`);

    const submitRes = await submitAttempt(attempt.id, responses, test, studentProfile);
    console.log(`✓ Attempt submitted successfully!`);
    console.log(`  Result ID: ${submitRes.resultId}`);
    console.log(`  Total Score: ${submitRes.totalScore} / ${submitRes.maximumMarks}`);
    console.log(`  Correct: ${submitRes.correctCount}, Incorrect: ${submitRes.incorrectCount}, Unanswered: ${submitRes.unansweredCount}`);

    // Verify Firestore doc
    const resultSnap = await getDoc(doc(db, "results", submitRes.resultId));
    if (!resultSnap.exists()) {
      throw new Error(`Result doc ${submitRes.resultId} does not exist in Firestore!`);
    }
    console.log(`✓ Firestore results doc verified:`, resultSnap.data().testTitle);
  }

  console.log("\n==========================================");
  console.log("ALL TESTS (DSA, OS, COA) PASSED PERFECTLY!");
  console.log("==========================================");
}

verifySubjects().then(() => process.exit(0)).catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
