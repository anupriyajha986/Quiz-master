import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, getDocs, doc, updateDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDC55H0zV6cUTJSF9IOxuXWiW9a6gK0miY",
  authDomain: "quiz-master-portal.firebaseapp.com",
  projectId: "quiz-master-portal",
  storageBucket: "quiz-master-portal.firebasestorage.app",
  messagingSenderId: "439258848801",
  appId: "1:439258848801:web:5f4392d08ec1426f140d60"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function migrate() {
  console.log("=== QuizMaster Historical Results Migration ===");
  const cred = await signInWithEmailAndPassword(auth, "Anupriyajha986@gmail.com", "Anupriya@123");
  console.log("Authenticated as Super Admin:", cred.user.uid);

  const resultsSnap = await getDocs(collection(db, "results"));
  console.log(`Found ${resultsSnap.size} result documents to inspect.`);

  let migratedCount = 0;
  let alreadyUpToDateCount = 0;

  for (const docSnap of resultsSnap.docs) {
    const data = docSnap.data();
    const id = docSnap.id;
    const updates = {};

    // 1. Map studentId if missing
    if (!data.studentId && data.studentUid) {
      updates.studentId = data.studentUid;
    }

    // 2. Map attempted question counts
    const correct = Number(data.correctCount) || 0;
    const incorrect = Number(data.incorrectCount) || 0;
    const unanswered = Number(data.unansweredCount) || 0;
    const attempted = correct + incorrect;

    if (data.attemptedCount === undefined) updates.attemptedCount = attempted;
    if (data.attemptedQuestions === undefined) updates.attemptedQuestions = attempted;
    if (data.correctAnswers === undefined) updates.correctAnswers = correct;
    if (data.incorrectAnswers === undefined) updates.incorrectAnswers = incorrect;
    if (data.unansweredQuestions === undefined) updates.unansweredQuestions = unanswered;

    // 3. Positive and negative marks
    if (data.positiveMarks === undefined) updates.positiveMarks = correct * 4;
    if (data.negativeMarks === undefined) updates.negativeMarks = incorrect * 1;

    // 4. Score aliases
    if (data.finalScore === undefined && data.totalScore !== undefined) {
      updates.finalScore = data.totalScore;
    }
    if (data.maximumPossibleMarks === undefined && data.maximumMarks !== undefined) {
      updates.maximumPossibleMarks = data.maximumMarks;
    }

    // 5. Title & ID aliases
    if (data.examTitle === undefined && data.testTitle) {
      updates.examTitle = data.testTitle;
    }
    if (data.examId === undefined && data.testId) {
      updates.examId = data.testId;
    }

    // 6. Result status
    if (!data.resultStatus) {
      const pct = Number(data.percentage) || 0;
      updates.resultStatus = pct >= 40 ? "passed" : "failed";
    }
    if (!data.status) {
      updates.status = "evaluated";
    }

    // 7. Publication status
    if (!data.publicationStatus) {
      updates.publicationStatus = "published";
    }

    // 8. Time taken fallback
    if (!data.timeTaken) {
      updates.timeTaken = "Completed";
    }

    if (Object.keys(updates).length > 0) {
      console.log(`Migrating doc ${id} (${data.testTitle || "Test"}):`, Object.keys(updates));
      await updateDoc(doc(db, "results", id), updates);
      migratedCount++;
    } else {
      alreadyUpToDateCount++;
    }
  }

  console.log("\n=== Migration Summary ===");
  console.log(`Total inspected: ${resultsSnap.size}`);
  console.log(`Migrated: ${migratedCount}`);
  console.log(`Already up to date: ${alreadyUpToDateCount}`);
  console.log("Migration finished successfully!");
}

migrate().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
