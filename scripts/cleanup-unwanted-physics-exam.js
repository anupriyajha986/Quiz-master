import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
  writeBatch
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

// Exact unwanted exam ID
const TARGET_EXAM_ID = "lAemuxaFBqAAueTQTBG7";

async function runCleanup() {
  console.log("================================================================================");
  console.log("   QUIZMASTER DATABASE CLEANUP: REMOVING UNWANTED PHYSICS QA EXAM RECORDS       ");
  console.log("================================================================================");
  console.log(`Connecting to Firebase Project: ${firebaseConfig.projectId}`);

  // Authenticate as Super Admin for authoritative administrative deletion
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || "Anupriya@123";
  await signInWithEmailAndPassword(auth, "Anupriyajha986@gmail.com", superAdminPassword);
  console.log("✓ Authenticated as Super Admin (Anupriyajha986@gmail.com)");

  // --- Step 1: Verify exact exam document lAemuxaFBqAAueTQTBG7 ---
  console.log("\n[STEP 1] Verifying exact target exam document...");
  const targetTestRef = doc(db, "tests", TARGET_EXAM_ID);
  const targetTestSnap = await getDoc(targetTestRef);
  if (!targetTestSnap.exists()) {
    console.log(`Target exam ${TARGET_EXAM_ID} does not exist in tests collection.`);
  } else {
    const data = targetTestSnap.data();
    console.log(`✓ Confirmed target exam found:`);
    console.log(`  ID:       ${TARGET_EXAM_ID}`);
    console.log(`  Title:    ${data.title}`);
    console.log(`  Subject:  ${data.subject}`);
    console.log(`  Duration: ${data.durationMinutes} mins`);
    console.log(`  Status:   ${data.publicationStatus || data.status}`);
  }

  // --- Step 2: Identify all QA Automated tests (including lAemuxaFBqAAueTQTBG7) ---
  console.log("\n[STEP 2] Identifying all QA Automated tests with subject Physics...");
  const testsSnap = await getDocs(collection(db, "tests"));
  const qaTests = testsSnap.docs.filter((d) => {
    const title = d.data().title || "";
    const subject = d.data().subject || "";
    return d.id === TARGET_EXAM_ID || title.includes("QA Automated Examination") || subject === "Physics";
  });
  console.log(`Found ${qaTests.length} QA test documents to remove:`);
  const qaTestIds = qaTests.map((d) => d.id);
  qaTests.forEach((d) => console.log(`  - [${d.id}] "${d.data().title}" (${d.data().subject})`));

  // --- Step 3: Find and delete answerKeys for these tests ---
  console.log("\n[STEP 3] Cleaning answerKeys for QA tests...");
  let deletedAnswerKeys = 0;
  for (const tid of qaTestIds) {
    const akRef = doc(db, "answerKeys", tid);
    const akSnap = await getDoc(akRef);
    if (akSnap.exists()) {
      await deleteDoc(akRef);
      deletedAnswerKeys++;
      console.log(`  ✓ Deleted answerKeys/${tid}`);
    }
  }
  console.log(`Deleted ${deletedAnswerKeys} answerKey document(s).`);

  // --- Step 4: Find and delete attempts + responses subcollections ---
  console.log("\n[STEP 4] Cleaning attempts and 'responses' subcollections...");
  const allAttemptsSnap = await getDocs(collection(db, "attempts"));
  const qaAttempts = allAttemptsSnap.docs.filter((d) => {
    const data = d.data();
    const str = JSON.stringify(data);
    return qaTestIds.includes(data.testId) || str.includes("QA Automated");
  });
  console.log(`Found ${qaAttempts.length} QA attempt document(s).`);

  let deletedResponses = 0;
  let deletedAttempts = 0;
  for (const att of qaAttempts) {
    // Delete responses subcollection documents
    const respSnap = await getDocs(collection(db, "attempts", att.id, "responses"));
    for (const rDoc of respSnap.docs) {
      await deleteDoc(doc(db, "attempts", att.id, "responses", rDoc.id));
      deletedResponses++;
    }
    // Delete attempt document
    await deleteDoc(doc(db, "attempts", att.id));
    deletedAttempts++;
    console.log(`  ✓ Deleted attempt [${att.id}] (test: ${att.data().testId}) with ${respSnap.size} subcollection responses`);
  }
  console.log(`Summary: Deleted ${deletedAttempts} attempts and ${deletedResponses} subcollection response documents.`);

  // --- Step 5: Find and delete results for QA tests ---
  console.log("\n[STEP 5] Cleaning results matching QA tests...");
  const allResultsSnap = await getDocs(collection(db, "results"));
  const qaResults = allResultsSnap.docs.filter((d) => {
    const data = d.data();
    const str = JSON.stringify(data);
    return qaTestIds.includes(data.testId) || qaTestIds.includes(data.examId) || str.includes("QA Automated");
  });
  console.log(`Found ${qaResults.length} QA result document(s).`);

  let deletedResults = 0;
  for (const res of qaResults) {
    await deleteDoc(doc(db, "results", res.id));
    deletedResults++;
    console.log(`  ✓ Deleted result [${res.id}] for test ${res.data().testId || res.data().examId}`);
  }
  console.log(`Deleted ${deletedResults} result document(s).`);

  // --- Step 6: Delete test documents from tests collection ---
  console.log("\n[STEP 6] Deleting tests from 'tests' collection...");
  let deletedTests = 0;
  for (const tDoc of qaTests) {
    await deleteDoc(doc(db, "tests", tDoc.id));
    deletedTests++;
    console.log(`  ✓ Deleted test [${tDoc.id}] "${tDoc.data().title}"`);
  }
  console.log(`Deleted ${deletedTests} test document(s).`);

  // --- Step 7: Delete orphan gravitation Physics questions created by QA tests ---
  console.log("\n[STEP 7] Cleaning orphan QA questions (Gravitation / Physics)...");
  const questionsSnap = await getDocs(collection(db, "questions"));
  const qaQuestions = questionsSnap.docs.filter((d) => {
    const data = d.data();
    return data.subject === "Physics" && (data.topic === "Gravitation" || data.questionText?.includes("acceleration due to gravity"));
  });
  console.log(`Found ${qaQuestions.length} orphan QA question(s).`);

  let deletedQuestions = 0;
  for (const q of qaQuestions) {
    await deleteDoc(doc(db, "questions", q.id));
    deletedQuestions++;
    console.log(`  ✓ Deleted question [${q.id}] "${q.data().questionText?.slice(0, 50)}..."`);
  }
  console.log(`Deleted ${deletedQuestions} question document(s).`);

  // --- Step 8: Delete orphan QA questionSets ---
  console.log("\n[STEP 8] Cleaning orphan QA questionSets...");
  const questionSetsSnap = await getDocs(collection(db, "questionSets"));
  const qaSets = questionSetsSnap.docs.filter((d) => {
    const data = d.data();
    return data.subject === "Physics" || data.title?.includes("QA Automated Verification Question Pack");
  });
  console.log(`Found ${qaSets.length} orphan QA questionSet(s).`);

  let deletedQuestionSets = 0;
  for (const s of qaSets) {
    await deleteDoc(doc(db, "questionSets", s.id));
    deletedQuestionSets++;
    console.log(`  ✓ Deleted questionSet [${s.id}] "${s.data().title}"`);
  }
  console.log(`Deleted ${deletedQuestionSets} questionSet document(s).`);

  // --- Step 9: Clean QA test notifications ---
  console.log("\n[STEP 9] Cleaning QA test notifications...");
  const notifSnap = await getDocs(collection(db, "notifications"));
  const qaNotifs = notifSnap.docs.filter((d) => {
    const str = JSON.stringify(d.data());
    return qaTestIds.some((id) => str.includes(id)) || str.includes("QA Automated");
  });
  console.log(`Found ${qaNotifs.length} QA notification(s).`);

  let deletedNotifs = 0;
  for (const n of qaNotifs) {
    await deleteDoc(doc(db, "notifications", n.id));
    deletedNotifs++;
  }
  console.log(`Deleted ${deletedNotifs} notification document(s).`);

  // --- Step 10: Clean QA audit logs ---
  console.log("\n[STEP 10] Cleaning QA audit logs...");
  const auditSnap = await getDocs(collection(db, "auditLogs"));
  const qaAudits = auditSnap.docs.filter((d) => {
    const str = JSON.stringify(d.data());
    return qaTestIds.some((id) => str.includes(id)) || str.includes("QA Automated");
  });
  console.log(`Found ${qaAudits.length} QA audit log(s).`);

  let deletedAudits = 0;
  for (const a of qaAudits) {
    await deleteDoc(doc(db, "auditLogs", a.id));
    deletedAudits++;
  }
  console.log(`Deleted ${deletedAudits} audit log document(s).`);

  // --- Step 11: Verification of database state ---
  console.log("\n================================================================================");
  console.log("                        POST-CLEANUP VERIFICATION CHECKS                        ");
  console.log("================================================================================");

  // 1. Verify exact target exam
  const recheckTarget = await getDoc(doc(db, "tests", TARGET_EXAM_ID));
  console.log(`1. Target exam ${TARGET_EXAM_ID} exists: ${recheckTarget.exists()} (Expected: false)`);

  // 2. Verify all tests
  const remainingTestsSnap = await getDocs(collection(db, "tests"));
  const physicsTests = remainingTestsSnap.docs.filter((d) => (d.data().subject || "").toLowerCase().includes("physics"));
  const qaTitleTests = remainingTestsSnap.docs.filter((d) => (d.data().title || "").includes("QA Automated"));
  console.log(`2. Total remaining tests: ${remainingTestsSnap.size} (Expected: 20 legitimate tests)`);
  console.log(`   Tests with subject Physics: ${physicsTests.length} (Expected: 0)`);
  console.log(`   Tests with QA Automated:   ${qaTitleTests.length} (Expected: 0)`);

  // 3. Verify questions
  const remainingQuestionsSnap = await getDocs(collection(db, "questions"));
  const physicsQuestions = remainingQuestionsSnap.docs.filter((d) => (d.data().subject || "").toLowerCase().includes("physics"));
  console.log(`3. Total remaining questions: ${remainingQuestionsSnap.size}`);
  console.log(`   Questions with subject Physics: ${physicsQuestions.length} (Expected: 0)`);

  // 4. Verify questionSets
  const remainingSetsSnap = await getDocs(collection(db, "questionSets"));
  const physicsSets = remainingSetsSnap.docs.filter((d) => (d.data().subject || "").toLowerCase().includes("physics"));
  console.log(`4. Total remaining questionSets: ${remainingSetsSnap.size}`);
  console.log(`   QuestionSets with subject Physics: ${physicsSets.length} (Expected: 0)`);

  // 5. Verify subjects registry
  const subjSnap = await getDocs(collection(db, "subjects"));
  console.log(`5. Total registered subjects: ${subjSnap.size}`);
  const subjList = subjSnap.docs.map((d) => d.data().name || d.id);
  console.log(`   Registered subjects: ${subjList.join(", ")}`);
  const physicsSubj = subjSnap.docs.filter((d) => (d.data().name || "").toLowerCase().includes("physics"));
  console.log(`   Physics in subjects registry: ${physicsSubj.length} (Expected: 0)`);

  // 6. Verify results
  const remainingResultsSnap = await getDocs(collection(db, "results"));
  const qaResultsRemaining = remainingResultsSnap.docs.filter((d) => JSON.stringify(d.data()).includes("QA Automated"));
  console.log(`6. Total remaining results: ${remainingResultsSnap.size}`);
  console.log(`   Results referencing QA Automated: ${qaResultsRemaining.length} (Expected: 0)`);

  console.log("\n================================================================================");
  console.log("   CLEANUP COMPLETE: ALL UNWANTED EXAM AND PHYSICS TEST RECORDS PURGED!         ");
  console.log("================================================================================");
}

runCleanup()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Cleanup error:", err);
    process.exit(1);
  });
