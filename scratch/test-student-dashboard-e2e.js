import { auth, db } from '../src/services/firebase/config.js';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getStudentAvailableTests, getTestById } from '../src/services/firebase/testService.js';
import { 
  startAttempt, 
  saveResponse, 
  getAttemptResponses, 
  submitAttempt,
  getAttemptById 
} from '../src/services/firebase/examService.js';
import { 
  getStudentDashboardStats, 
  getResultById
} from '../src/services/firebase/analyticsService.js';
import { getStudentResults } from '../src/services/firebase/studentService.js';
import { 
  addBookmark, 
  getUserBookmarks, 
  removeBookmark 
} from '../src/services/firebase/bookmarkService.js';

async function runStudentDashboardVerification() {
  console.log("==================================================================");
  console.log("QUIZMASTER — COMPLETE STUDENT DASHBOARD VERIFICATION SUITE");
  console.log("==================================================================");

  // 1. Authenticate as Student
  console.log("\n[TEST 1] Student Authentication...");
  const cred = await signInWithEmailAndPassword(auth, "student@quizmaster.com", "Student@12345");
  const studentUid = cred.user.uid;
  console.log(`✓ Student authenticated. UID: ${studentUid}, Email: ${cred.user.email}`);

  // 2. Tab 1: Dashboard Overview Query
  console.log("\n[TEST 2] Tab 1: Dashboard Overview Data Engine...");
  const stats = await getStudentDashboardStats(studentUid);
  console.log(`✓ Dashboard stats successfully fetched without permission errors:`);
  console.log(`  - Total Available Tests: ${stats.availableTestsCount}`);
  console.log(`  - Completed Tests: ${stats.completedTestsCount}`);
  console.log(`  - Average Score: ${stats.averagePercentage}%`);
  console.log(`  - Highest Score: ${stats.highestPercentage}%`);
  console.log(`  - Lowest Score: ${stats.lowestPercentage}%`);
  console.log(`  - Overall Accuracy: ${stats.overallAccuracy}%`);
  console.log(`  - Score Trends count: ${stats.scoreTrends.length}`);
  console.log(`  - Recent Results count: ${stats.recentResults.length}`);

  if (stats.completedTestsCount < 1) {
    throw new Error("Student has no completed tests, expected positive count.");
  }

  // 3. Tab 2: Explore Exams
  console.log("\n[TEST 3] Tab 2: Explore Exams (Available Examinations)...");
  const available = await getStudentAvailableTests();
  console.log(`✓ Retrieved ${available.length} published tests available to student.`);
  if (available.length === 0) throw new Error("No available tests found!");

  // Find a test that student can attempt or has in-progress attempt
  let selectedTest = null;
  let fullTest = null;
  let attemptObj = null;
  let resumeStatus = false;

  for (const t of available) {
    try {
      const ft = await getTestById(t.id);
      const res = await startAttempt(t.id, studentProfile, ft);
      selectedTest = t;
      fullTest = ft;
      attemptObj = res.attempt;
      resumeStatus = res.isResumed;
      break;
    } catch (e) {
      // If attempt limit reached, check next test
      continue;
    }
  }

  if (!selectedTest) {
    throw new Error("No tests available with remaining attempts!");
  }

  console.log(`  Selected available test: "${selectedTest.title}" (ID: ${selectedTest.id})`);
  console.log(`✓ Full test loaded with ${fullTest.publishedQuestionsSnapshot?.length || 0} questions.`);
  console.log(`✓ Attempt handled: ID=${attemptObj.id}, Resumed=${resumeStatus}, Status=${attemptObj.status}`);

  const attempt = attemptObj;

  if (attempt.status === 'in_progress') {
    const q1 = fullTest.publishedQuestionsSnapshot[0];
    if (q1) {
      await saveResponse(attempt.id, q1.id, {
        selectedAnswer: "A",
        markedForReview: true
      });
      console.log(`✓ Saved response for question ${q1.id}`);

      const savedResponses = await getAttemptResponses(attempt.id);
      if (savedResponses[q1.id]?.selectedAnswer !== "A") {
        throw new Error("Response was not saved or recovered correctly!");
      }
      console.log(`✓ Verified response recovery from subcollection: selectedAnswer=${savedResponses[q1.id].selectedAnswer}`);
    }
  }

  // 5. Tab 5: Results & Scorecards
  console.log("\n[TEST 5] Tab 5: Results & Scorecards Module...");
  const results = await getStudentResults(studentUid);
  console.log(`✓ Fetched ${results.length} published scorecards for student.`);
  if (results.length > 0) {
    const firstResult = results[0];
    const singleResult = await getResultById(firstResult.id);
    console.log(`✓ Single scorecard loaded: "${singleResult.testTitle}"`);
    console.log(`  Score: ${singleResult.totalScore}/${singleResult.maximumMarks} (${singleResult.percentage}%)`);
    console.log(`  Accuracy: ${singleResult.accuracy}%, Correct: ${singleResult.correctCount}, Incorrect: ${singleResult.incorrectCount}`);
  }

  // 6. Tab 6: Performance Analytics Data Validity
  console.log("\n[TEST 6] Tab 6: Performance Analytics Aggregations...");
  console.log(`✓ Subject performance breakdowns:`);
  Object.entries(stats.subjectStats || {}).forEach(([subj, data]) => {
    console.log(`  - ${subj}: ${data.count} tests, avg ${data.averagePercentage}%`);
  });

  // 7. Tab 8: Bookmarks & Revision Vault
  console.log("\n[TEST 7] Tab 8: Bookmarks & Revision Vault CRUD...");
  const dummyBookmark = {
    studentUid,
    questionId: "test_q_" + Date.now(),
    examId: selectedTest.id,
    examTitle: selectedTest.title,
    subject: selectedTest.subject,
    text: "What is the time complexity of QuickSort in the average case?",
    options: ["O(n log n)", "O(n^2)", "O(n)", "O(log n)"],
    correctAnswer: "O(n log n)",
    notes: "Review quicksort partition strategies"
  };

  const createdBmId = await addBookmark(dummyBookmark);
  console.log(`✓ Bookmark created with ID: ${createdBmId}`);

  const studentBookmarks = await getUserBookmarks(studentUid);
  console.log(`✓ Student bookmarks count: ${studentBookmarks.length}`);
  const foundBm = studentBookmarks.find(b => b.id === createdBmId);
  if (!foundBm) throw new Error("Created bookmark was not found in getUserBookmarks!");

  await removeBookmark(createdBmId);
  console.log(`✓ Bookmark cleanly deleted.`);

  console.log("\n==================================================================");
  console.log("ALL STUDENT DASHBOARD INTEGRATION CHECKS PASSED SUCCESSFULLY!");
  console.log("==================================================================");
}

runStudentDashboardVerification()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("FATAL VERIFICATION ERROR:", err);
    process.exit(1);
  });
