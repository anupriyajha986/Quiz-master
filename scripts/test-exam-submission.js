import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { startAttempt, saveResponse, submitAttempt } from "../src/services/firebase/examService.js";
import { getTestById } from "../src/services/firebase/testService.js";

const firebaseConfig = {
  apiKey: "AIzaSyDC55H0zV6cUTJSF9IOxuXWiW9a6gK0miY",
  authDomain: "quiz-master-portal.firebaseapp.com",
  projectId: "quiz-master-portal",
  storageBucket: "quiz-master-portal.firebasestorage.app",
  messagingSenderId: "439258848801",
  appId: "1:439258848801:web:5f4392d08ec1426f140d60",
  measurementId: "G-JZ2XJFV26Y"
};

async function testExamWorkflow() {
  console.log("=== Testing End-to-End Student Exam Submission & Evaluation ===");
  const { auth, db } = await import("../src/services/firebase/config.js");

  const cred = await signInWithEmailAndPassword(auth, "student@quizmaster.com", "Student@12345");
  console.log("✓ Student logged in:", cred.user.email);

  const testId = "html-set-1";
  const test = await getTestById(testId);
  console.log("✓ Loaded test:", test.title, `(${test.questionCount} questions, ${test.maximumMarks} marks)`);

  const studentProfile = {
    fullName: "Aryan Sharma",
    normalizedRollNumber: "QM2026-001",
    instituteName: "QuizMaster Tech Academy"
  };

  // Start Attempt
  const { attempt, isResumed } = await startAttempt(testId, studentProfile);
  console.log("✓ Attempt initialized:", attempt.id, `(Resumed: ${isResumed})`);

  // Question 1: In html-set-1, Q1: What does HTML stand for?
  // Options: A: Home Tool..., B: Hyperlinks..., C: Hyper Text Markup Language..., D: High Tech...
  // Correct answer is C. Let's answer "C" for Q1 -> +4 marks.
  // Question 2: Let's answer "B" (incorrect) -> -1 mark.
  // Remaining 18 questions: Unanswered -> 0 marks.
  // Expected total score: +4 - 1 = 3 marks out of 80.
  const q1 = test.publishedQuestionsSnapshot[0];
  const q2 = test.publishedQuestionsSnapshot[1];

  const responses = {
    [q1.id]: { selectedAnswer: "C", markedForReview: false },
    [q2.id]: { selectedAnswer: "B", markedForReview: false }
  };

  await saveResponse(attempt.id, q1.id, responses[q1.id]);
  await saveResponse(attempt.id, q2.id, responses[q2.id]);
  console.log("✓ Responses saved for Q1 (C) and Q2 (B)");

  // Submit attempt
  const result = await submitAttempt(attempt.id, responses, test, studentProfile);
  console.log("✓ Attempt submitted! Result returned:", {
    resultId: result.resultId,
    totalScore: result.totalScore,
    maximumMarks: result.maximumMarks,
    correctCount: result.correctCount,
    incorrectCount: result.incorrectCount,
    unansweredCount: result.unansweredCount,
    percentage: result.percentage
  });

  if (result.totalScore === 3 && result.correctCount === 1 && result.incorrectCount === 1 && result.unansweredCount === 18) {
    console.log("✓ SCORE VERIFICATION PERFECT: +4 for correct, -1 for incorrect, 0 for unanswered = 3/80 marks!");
  } else {
    console.error("Score mismatch!", result);
  }

  // Check stored Result in Firestore
  const resultDoc = await getDoc(doc(db, "results", result.resultId));
  console.log("✓ Stored result doc in Firestore exists:", resultDoc.exists());
  console.log("✓ Result publication status:", resultDoc.data()?.publicationStatus);
}

testExamWorkflow().then(() => process.exit(0)).catch((err) => {
  console.error("Exam test failed:", err);
  process.exit(1);
});
