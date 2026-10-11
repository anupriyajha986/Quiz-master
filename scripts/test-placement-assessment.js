import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, getDocs, collection, query, where, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../src/services/firebase/config.js";
import { getStudentAvailableTests, getTestById } from "../src/services/firebase/testService.js";
import { startAttempt, saveResponse, submitAttempt, adminForceSubmitAttempt } from "../src/services/firebase/examService.js";
import { getQuestions, getQuestionById } from "../src/services/firebase/questionService.js";
import { getQuestionSetById } from "../src/services/firebase/questionSetService.js";

async function testPlacementAssessmentSystem() {
  console.log("================================================================================");
  console.log(" TESTING TECHNICAL PLACEMENT ASSESSMENT (50 MCQs) INTEGRATION");
  console.log("================================================================================");

  // 1. Authenticate as Admin to verify Firestore Data
  console.log("\n[1] AUTHENTICATING AS ADMIN...");
  const adminCred = await signInWithEmailAndPassword(auth, "Anupriyajha986@gmail.com", "Anupriya@123");
  console.log(`✓ Admin logged in: ${adminCred.user.email} (${adminCred.user.uid})`);

  // Clear past attempts on placement test so test suite is idempotent
  const pastAttempts = await getDocs(
    query(collection(db, "attempts"), where("testId", "==", "placement-technical-50"), where("studentUid", "==", "UIcXC7lcWIW3KA4aGu5Wx196yqm2"))
  );
  for (const adoc of pastAttempts.docs) {
    await deleteDoc(doc(db, "attempts", adoc.id));
  }
  await updateDoc(doc(db, "tests", "placement-technical-50"), { maxAttempts: 5 });

  // 2. Verify Question Set
  console.log("\n[2] VERIFYING QUESTION SET 'placement-technical-50'...");
  const setDoc = await getQuestionSetById("placement-technical-50");
  if (!setDoc) throw new Error("Question set 'placement-technical-50' not found!");
  console.log(`✓ Set Title        : ${setDoc.title}`);
  console.log(`✓ Total Questions  : ${setDoc.questionCount} (Expected: 50)`);
  console.log(`✓ Maximum Marks    : ${setDoc.totalMarks} (Expected: 200)`);
  console.log(`✓ Duration         : ${setDoc.durationMinutes} mins (Expected: 60)`);
  console.log(`✓ Status           : ${setDoc.publicationStatus}`);
  if (setDoc.questionCount !== 50 || setDoc.totalMarks !== 200) {
    throw new Error(`Set metadata mismatch: count=${setDoc.questionCount}, marks=${setDoc.totalMarks}`);
  }

  // 3. Verify Questions in Firestore
  console.log("\n[3] VERIFYING QUESTIONS COLLECTION...");
  const questionsInSet = await getQuestions({ setId: "placement-technical-50" });
  console.log(`✓ Total Questions in Set: ${questionsInSet.length}`);

  const subjectsCount = {};
  questionsInSet.forEach((q) => {
    subjectsCount[q.subject] = (subjectsCount[q.subject] || 0) + 1;
  });
  console.log("✓ Subject Distribution:");
  Object.entries(subjectsCount).forEach(([s, count]) => {
    console.log(`  - ${s.padEnd(12)}: ${count}`);
    if (count !== 10) {
      throw new Error(`Subject ${s} does not have exactly 10 questions! (Found ${count})`);
    }
  });

  // 4. Inspect Question 15 Special Case
  console.log("\n[4] AUDITING QUESTION 15 (placement50-cpp-q15)...");
  const q15 = await getQuestionById("placement50-cpp-q15");
  if (!q15) throw new Error("Question 15 'placement50-cpp-q15' not found in questions collection!");
  console.log(`✓ Question ID           : ${q15.id}`);
  console.log(`✓ Review Required Flag  : ${q15.reviewRequired} (Expected: true)`);
  console.log(`✓ Correct Answer Option : ${q15.correctAnswer} (${q15.options.find(o => o.id === q15.correctAnswer)?.text})`);
  console.log(`✓ Verbatim Code Check   :`);
  if (!q15.questionText.includes("int &r; = x;")) {
    throw new Error("Question 15 syntax was altered! Must contain verbatim 'int &r; = x;'.");
  }
  console.log(`    Contains verbatim 'int &r; = x;' without alteration: PASS`);

  // 5. Security Audit on Student Question Snapshot & Answer Keys
  console.log("\n[5] SECURITY AUDIT: CANDIDATE SNAPSHOT VS ANSWER KEYS VAULT...");
  const testDoc = await getTestById("placement-technical-50");
  if (!testDoc) throw new Error("Test doc 'placement-technical-50' not found!");
  const snapshot = testDoc.publishedQuestionsSnapshot || [];
  console.log(`✓ Candidate Snapshot Question Count: ${snapshot.length}`);
  if (snapshot.length !== 50) throw new Error("Snapshot must contain exactly 50 questions!");

  // Verify NO answers leaked in student snapshot
  let leaksCount = 0;
  snapshot.forEach((sq) => {
    if (sq.correctAnswer || sq.correctOptionId || sq.correctOptionIndex !== undefined || sq.explanation) {
      console.error(`LEAK DETECTED in question ${sq.id}!`, sq);
      leaksCount++;
    }
  });
  if (leaksCount > 0) {
    throw new Error(`SECURITY FAIL: ${leaksCount} questions in candidate snapshot contain answer data!`);
  }
  console.log("✓ SECURITY PASS: Candidate question snapshot is 100% sanitized (0 answers / explanations exposed).");

  // Verify Answer Keys Vault
  const keySnap = await getDoc(doc(db, "answerKeys", "placement-technical-50"));
  if (!keySnap.exists()) throw new Error("Answer key vault 'placement-technical-50' not found!");
  const vaultAnswers = keySnap.data().answers || {};
  const keyCount = Object.keys(vaultAnswers).length;
  console.log(`✓ Locked Answer Keys Vault: ${keyCount} authoritative answers registered.`);
  if (keyCount !== 50) throw new Error(`Answer key vault has ${keyCount} answers, expected 50!`);

  // 6. Student Examination Experience & Evaluation Test
  console.log("\n[6] TESTING STUDENT EXAM ATTEMPT & LIVE EVALUATION...");
  const studentCred = await signInWithEmailAndPassword(auth, "student@quizmaster.com", "Student@12345");
  console.log(`✓ Student authenticated: ${studentCred.user.email}`);

  // Check available exams
  const availableExams = await getStudentAvailableTests();
  const placementExam = availableExams.find((e) => e.id === "placement-technical-50");
  if (!placementExam) throw new Error("Placement exam not visible in student available tests!");
  console.log(`✓ Exam found in student exam hall: "${placementExam.title}" (${placementExam.questionCount} Qs, ${placementExam.durationMinutes} mins)`);

  const studentProfile = {
    fullName: "Placement Candidate",
    normalizedRollNumber: "QM-PLACE-2026",
    instituteName: "QuizMaster College of Technology"
  };

  // Start attempt
  const { attempt, isResumed } = await startAttempt("placement-technical-50", studentProfile);
  console.log(`✓ Student Attempt Initialized: ID=${attempt.id} (Status: ${attempt.status}, Resumed: ${isResumed})`);

  // Simulate responses:
  // Q1 (placement50-c-q01): Correct is C. Answer "C" -> +4
  // Q15 (placement50-cpp-q15): Correct is D. Answer "D" -> +4
  // Q2 (placement50-c-q02): Correct is B. Answer "A" (Incorrect) -> -1
  // Remaining 47 questions: Unanswered -> 0
  // Expected Score: 4 + 4 - 1 = 7 out of 200 marks.
  const studentResponses = {
    "placement50-c-q01": { selectedAnswer: "C", markedForReview: false },
    "placement50-cpp-q15": { selectedAnswer: "D", markedForReview: true },
    "placement50-c-q02": { selectedAnswer: "A", markedForReview: false }
  };

  await saveResponse(attempt.id, "placement50-c-q01", studentResponses["placement50-c-q01"]);
  await saveResponse(attempt.id, "placement50-cpp-q15", studentResponses["placement50-cpp-q15"]);
  await saveResponse(attempt.id, "placement50-c-q02", studentResponses["placement50-c-q02"]);
  console.log("✓ Responses saved in Cloud Firestore attempt session.");

  // Submit attempt as candidate
  const submission = await submitAttempt(attempt.id, studentResponses, placementExam, studentProfile);
  console.log(`✓ Exam Submitted by Candidate: Status: ${submission.status}`);

  // Authoritative scorecard evaluation by Admin
  console.log("✓ Authenticating as Admin for authoritative scorecard evaluation...");
  await signInWithEmailAndPassword(auth, "Anupriyajha986@gmail.com", "Anupriya@123");
  const result = await adminForceSubmitAttempt(attempt.id, {
    reason: "Automated placement test scorecard evaluation",
    adminUid: "e9jDBfRPpngJE3vXYily6ek7bts1",
    adminEmail: "Anupriyajha986@gmail.com",
    adminName: "Super Admin"
  });

  console.log("✓ Exam Evaluated by Backend Engine & Published:");
  console.log(`  - Result ID    : ${result.resultId}`);
  console.log(`  - Score        : ${result.totalScore} / ${result.maximumMarks}`);
  console.log(`  - Correct      : ${result.correctCount} (Expected: 2)`);
  console.log(`  - Incorrect    : ${result.incorrectCount} (Expected: 1)`);
  console.log(`  - Unanswered   : ${result.unansweredCount} (Expected: 47)`);
  console.log(`  - Percentage   : ${result.percentage}%`);

  if (result.totalScore !== 7 || result.correctCount !== 2 || result.incorrectCount !== 1 || result.unansweredCount !== 47) {
    throw new Error(`Evaluation score mismatch! Got ${result.totalScore}, expected 7 (+4 +4 -1 = 7).`);
  }
  console.log("✓ SCORE VERIFICATION PERFECT: +4 (Q1) + +4 (Q15) - 1 (Q2) = 7/200 marks!");

  // Verify Firestore Result doc
  const resSnap = await getDoc(doc(db, "results", result.resultId));
  if (!resSnap.exists()) throw new Error("Result document not found in Firestore results collection!");
  console.log(`✓ Firestore Results Document verified: "${resSnap.data().testTitle}" for student "${resSnap.data().studentName}"`);

  console.log("\n================================================================================");
  console.log(" ALL INTEGRATION & VERIFICATION CHECKS PASSED WITH 100% SUCCESS!");
  console.log("================================================================================");
}

testPlacementAssessmentSystem().then(() => process.exit(0)).catch((err) => {
  console.error("\n[TEST FAILED]:", err);
  process.exit(1);
});
