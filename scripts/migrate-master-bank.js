import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  writeBatch,
  serverTimestamp,
  getDocs,
  getDoc
} from "firebase/firestore";
import fs from "fs";

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

const SUBJECT_METADATA = {
  "HTML": {
    id: "html",
    code: "HTML",
    name: "HTML",
    description: "HyperText Markup Language, Semantic Elements, Forms & Media",
    color: "orange",
    icon: "FileCode2",
    order: 1
  },
  "CSS": {
    id: "css",
    code: "CSS",
    name: "CSS",
    description: "Cascading Style Sheets, Box Model, Flexbox, Grid & Responsive Design",
    color: "blue",
    icon: "Palette",
    order: 2
  },
  "JavaScript": {
    id: "javascript",
    code: "JS",
    name: "JavaScript",
    description: "ECMAScript Core, Modern APIs, DOM Manipulation, Async/Await & Closures",
    color: "yellow",
    icon: "Code",
    order: 3
  }
};

async function runMigration() {
  console.log("===============================================================");
  console.log("QUIZMASTER — MASTER QUESTION BANK & SET REGISTRY MIGRATION");
  console.log("===============================================================");
  console.log("Connecting to Firebase Project:", firebaseConfig.projectId);

  // Authenticate as Super Admin
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || "Anupriya@123";
  const cred = await signInWithEmailAndPassword(auth, "Anupriyajha986@gmail.com", superAdminPassword);
  console.log(`✓ Authenticated as Super Admin: ${cred.user.email} (UID: ${cred.user.uid})\n`);

  // Load JSON source
  const bankData = JSON.parse(fs.readFileSync("scripts/master-question-bank.json", "utf8"));
  const categories = Object.keys(bankData);
  console.log(`Found ${categories.length} Subject Categories in Source File:`, categories);

  const report = {
    subjectsCreated: 0,
    setsCreated: 0,
    questionsImported: 0,
    skipped: 0,
    errors: [],
    breakdown: {}
  };

  // 1. Create / Update Subjects
  for (const catName of categories) {
    const meta = SUBJECT_METADATA[catName] || {
      id: catName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      code: catName.substring(0, 4).toUpperCase(),
      name: catName,
      description: `${catName} Comprehensive Exam Bank`,
      color: "indigo",
      icon: "BookOpen",
      order: 10
    };

    const subjRef = doc(db, "subjects", meta.id);
    const setsObj = bankData[catName] || {};
    const setKeys = Object.keys(setsObj);
    let totalCatQuestions = 0;
    setKeys.forEach((sk) => {
      totalCatQuestions += setsObj[sk].length;
    });

    await setDoc(subjRef, {
      name: meta.name,
      code: meta.code,
      description: meta.description,
      status: "active",
      color: meta.color,
      icon: meta.icon,
      order: meta.order,
      setCount: setKeys.length,
      questionCount: totalCatQuestions,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp()
    }, { merge: true });

    report.subjectsCreated++;
    report.breakdown[catName] = { sets: setKeys.length, questions: totalCatQuestions };
    console.log(`✓ Subject Registered: ${meta.name} (Code: ${meta.code}) -> ${setKeys.length} Sets, ${totalCatQuestions} Questions`);
  }

  // 2. Iterate Sets and Questions
  for (const catName of categories) {
    const meta = SUBJECT_METADATA[catName];
    const subjectId = meta.id;
    const setsObj = bankData[catName];

    for (const [setNumStr, rawQuestions] of Object.entries(setsObj)) {
      const setNum = parseInt(setNumStr, 10);
      const setId = `${subjectId}-set-${setNum}`;
      const setTitle = `${catName} — Set ${setNum}`;

      console.log(`\n  Processing ${setTitle} (${rawQuestions.length} questions)...`);

      const questionIds = [];
      const sanitizedQuestions = [];
      const secureAnswers = {};

      // Write questions in batch
      const qBatch = writeBatch(db);

      for (let i = 0; i < rawQuestions.length; i++) {
        const q = rawQuestions[i];
        const qId = q.id || `${subjectId}-s${setNum}-q${String(i + 1).padStart(2, "0")}`;
        questionIds.push(qId);

        // Format options array
        const formattedOptions = (q.options || []).map((optText, optIdx) => ({
          id: String.fromCharCode(65 + optIdx),
          text: String(optText || "").trim()
        }));

        // In existing dataset: answer is 0-based option index (e.g. 0 -> 'A', 1 -> 'B', 2 -> 'C', 3 -> 'D')
        const answerIdx = Number(q.answer);
        const correctLetter = String.fromCharCode(65 + answerIdx);

        // Validate
        if (answerIdx < 0 || answerIdx >= formattedOptions.length) {
          report.errors.push(`Invalid answer index for question ${qId}: ${answerIdx}`);
        }

        const positiveMarks = 4;
        const negativeMarks = 1;
        const unansweredMarks = 0;

        // Firestore question document
        const qDocRef = doc(db, "questions", qId);
        qBatch.set(qDocRef, {
          id: qId,
          questionText: q.question.trim(),
          questionType: "single_choice",
          options: formattedOptions,
          correctAnswer: correctLetter,
          correctOptionIndex: answerIdx,
          explanation: q.explanation?.trim() || "",
          subjectId,
          subject: catName,
          setId,
          setNumber: setNum,
          difficulty: q.difficulty || "Easy",
          positiveMarks,
          negativeMarks,
          unansweredMarks,
          status: "active",
          createdBy: "admin",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }, { merge: true });

        // Sanitized Question for students (NO correctAnswer, NO explanation!)
        sanitizedQuestions.push({
          id: qId,
          questionText: q.question.trim(),
          questionType: "single_choice",
          options: formattedOptions,
          subject: catName,
          difficulty: q.difficulty || "Easy",
          positiveMarks,
          negativeMarks,
          unansweredMarks,
          imageUrl: null
        });

        // Secret Answer Key entry
        secureAnswers[qId] = {
          correctAnswer: correctLetter,
          correctOptionIndex: answerIdx,
          explanation: q.explanation?.trim() || ""
        };

        report.questionsImported++;
      }

      await qBatch.commit();
      console.log(`    ✓ Saved ${questionIds.length} question docs in 'questions' collection`);

      const durationMinutes = 40;
      const totalMarks = questionIds.length * 4;

      // Write questionSets document
      const setRef = doc(db, "questionSets", setId);
      await setDoc(setRef, {
        id: setId,
        title: setTitle,
        setNumber: setNum,
        subjectId,
        subject: catName,
        description: `Comprehensive evaluation set covering core ${catName} competencies.`,
        instructions: "Read all questions carefully. Standard JEE Main scheme applies: +4 for correct, -1 for incorrect, 0 for unattempted.",
        durationMinutes,
        questionIds,
        questionCount: questionIds.length,
        totalMarks,
        difficulty: rawQuestions[0]?.difficulty || "Easy",
        markingScheme: { positiveMarks: 4, negativeMarks: 1, unansweredMarks: 0 },
        attemptLimit: 2,
        status: "published",
        publicationStatus: "published",
        publishedQuestionsSnapshot: sanitizedQuestions,
        createdBy: "admin",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });

      // Mirror in tests collection
      const testRef = doc(db, "tests", setId);
      await setDoc(testRef, {
        id: setId,
        title: setTitle,
        description: `Comprehensive evaluation set covering core ${catName} competencies.`,
        subjectId,
        subject: catName,
        instructions: "Read all questions carefully. Standard JEE Main scheme applies: +4 for correct, -1 for incorrect, 0 for unattempted.",
        questionIds,
        durationMinutes,
        maximumMarks: totalMarks,
        markingScheme: { positiveMarks: 4, negativeMarks: 1, unansweredMarks: 0 },
        attemptLimit: 2,
        navigationSettings: { allowRevisit: true, reviewAllowed: true },
        resultSettings: { showResultImmediately: true, showLeaderboard: true, showExplanations: true },
        publicationStatus: "published",
        publishedQuestionsSnapshot: sanitizedQuestions,
        questionCount: sanitizedQuestions.length,
        setId,
        setNumber: setNum,
        createdBy: "admin",
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp()
      }, { merge: true });

      // Write Answer Key in vault
      const answerKeyRef = doc(db, "answerKeys", setId);
      await setDoc(answerKeyRef, {
        testId: setId,
        setId,
        answers: secureAnswers,
        publishedAt: serverTimestamp()
      }, { merge: true });

      report.setsCreated++;
      console.log(`    ✓ Set Published: ${setId} | Total Marks: ${totalMarks} | AnswerKey Vault Locked.`);
    }
  }

  // Record Audit Log for migration
  const auditRef = doc(collection(db, "auditLogs"));
  await setDoc(auditRef, {
    action: "MASTER_QUESTION_BANK_MIGRATION",
    actorUid: cred.user.uid,
    actorEmail: cred.user.email,
    details: {
      subjectsCreated: report.subjectsCreated,
      setsCreated: report.setsCreated,
      questionsImported: report.questionsImported,
      breakdown: report.breakdown
    },
    timestamp: serverTimestamp()
  });

  console.log("\n===============================================================");
  console.log("MIGRATION COMPLETED SUCCESSFULLY!");
  console.log("===============================================================");
  console.log(`- Subjects Registered: ${report.subjectsCreated}`);
  console.log(`- Question Sets Created & Published: ${report.setsCreated}`);
  console.log(`- Total Questions Imported & Validated: ${report.questionsImported}`);
  console.log("- Errors Encountered:", report.errors.length === 0 ? "None (0)" : report.errors);
  console.log("Breakdown by Subject:", report.breakdown);
}

runMigration()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Migration error:", err);
    process.exit(1);
  });
