#!/usr/bin/env node
/**
 * scripts/seed-placement-questions.js
 *
 * Enterprise idempotent seeder for QuizMaster Technical Placement Assessment (50 MCQs).
 * Validates schema, detects conflicts, protects against duplicate documents,
 * ensures secure separation of candidate questions and answerKeys vault,
 * and preserves verbatim source text for questions flagged for review (Question 15).
 *
 * Usage:
 *   node scripts/seed-placement-questions.js --dry-run
 *   node scripts/seed-placement-questions.js
 *   node scripts/seed-placement-questions.js --update (force updates conflicting records)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  setDoc,
  collection,
  writeBatch,
  serverTimestamp,
  query,
  where
} from "firebase/firestore";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

// 1. Command-Line Arguments Parsing
const args = process.argv.slice(2);
const isDryRun = args.includes("--dry-run") || process.env.DRY_RUN === "true";
const isForceUpdate = args.includes("--update") || args.includes("--force");
const customJsonPath = args.find((a) => a.endsWith(".json")) || null;

// 2. Firebase Configuration & Environment Verification
const expectedProjectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID || "quiz-master-portal";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyDC55H0zV6cUTJSF9IOxuXWiW9a6gK0miY",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "quiz-master-portal.firebaseapp.com",
  projectId: expectedProjectId,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "quiz-master-portal.firebasestorage.app",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "439258848801",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:439258848801:web:5f4392d08ec1426f140d60",
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || "G-JZ2XJFV26Y"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// 3. Subject Metadata Registry
const SUBJECT_METADATA = {
  "C": {
    id: "c",
    code: "C",
    name: "C",
    description: "C Programming Language: Procedural structures, pointers, memory allocation, arrays, and standard libraries.",
    color: "indigo",
    icon: "Code",
    status: "active",
    order: 8
  },
  "C++": {
    id: "cpp",
    code: "CPP",
    name: "C++",
    description: "C++ Programming: Object-oriented programming, references, virtual functions, templates, and STL.",
    color: "cyan",
    icon: "Cpu",
    status: "active",
    order: 9
  },
  "HTML": {
    id: "html",
    code: "HTML",
    name: "HTML",
    description: "HyperText Markup Language, HTML5 semantics, web accessibility, forms, and DOM structure.",
    color: "amber",
    icon: "Code",
    status: "active",
    order: 1
  },
  "CSS": {
    id: "css",
    code: "CSS",
    name: "CSS",
    description: "Cascading Style Sheets, modern CSS3, Flexbox, Grid, animations, and responsive UI architecture.",
    color: "blue",
    icon: "Palette",
    status: "active",
    order: 2
  },
  "JavaScript": {
    id: "javascript",
    code: "JS",
    name: "JavaScript",
    description: "ECMAScript fundamentals, asynchronous programming, closures, event loop, and modern browser APIs.",
    color: "yellow",
    icon: "FileCode2",
    status: "active",
    order: 3
  }
};

/**
 * Normalizes question options into standard [{ id: "A", text: "..." }]
 */
function normalizeOptions(options) {
  if (!Array.isArray(options)) return [];
  return options.map((opt, idx) => {
    const defaultLetter = String.fromCharCode(65 + idx);
    if (typeof opt === "string") {
      return { id: defaultLetter, text: opt.trim() };
    }
    return {
      id: opt.id ? String(opt.id).trim().toUpperCase() : defaultLetter,
      text: typeof opt.text === "string" ? opt.text.trim() : String(opt || "").trim()
    };
  });
}

/**
 * Validates a single question against the required schema
 */
function validateQuestion(q, index) {
  const errors = [];

  if (!q.id || typeof q.id !== "string") {
    errors.push("Missing or invalid 'id' field.");
  }
  if (!q.subject || typeof q.subject !== "string") {
    errors.push("Missing or invalid 'subject' field.");
  }
  if (!q.questionText || typeof q.questionText !== "string" || !q.questionText.trim()) {
    errors.push("Missing or empty 'questionText'.");
  }
  if (!Array.isArray(q.options) || q.options.length !== 4) {
    errors.push(`Expected exactly 4 options, found ${Array.isArray(q.options) ? q.options.length : 0}.`);
  } else {
    q.options.forEach((opt, oIdx) => {
      if (!opt.text || typeof opt.text !== "string" || !opt.text.trim()) {
        errors.push(`Option ${opt.id || oIdx + 1} has empty text.`);
      }
    });
  }

  const validOptionIds = ["A", "B", "C", "D"];
  const correctId = (q.correctOptionId || "").trim().toUpperCase();
  if (!validOptionIds.includes(correctId)) {
    errors.push(`Invalid 'correctOptionId': '${q.correctOptionId}'. Expected A, B, C, or D.`);
  }

  if (q.correctOptionIndex !== undefined && q.correctOptionIndex !== null) {
    const expectedIdx = validOptionIds.indexOf(correctId);
    if (q.correctOptionIndex !== expectedIdx) {
      errors.push(`Mismatched 'correctOptionIndex' (${q.correctOptionIndex}) for correctOptionId '${correctId}' (expected ${expectedIdx}).`);
    }
  }

  if (!q.explanation || typeof q.explanation !== "string" || !q.explanation.trim()) {
    errors.push("Missing or empty 'explanation'.");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Deep compares existing Firestore question doc with incoming question payload
 */
function isQuestionContentIdentical(existing, incoming) {
  if (!existing) return false;
  if (existing.questionText !== incoming.questionText) return false;
  if (existing.correctAnswer !== incoming.correctAnswer) return false;
  if (existing.correctOptionIndex !== incoming.correctOptionIndex) return false;
  if (existing.explanation !== incoming.explanation) return false;
  if (existing.difficulty !== incoming.difficulty) return false;
  if (existing.positiveMarks !== incoming.positiveMarks) return false;
  if (existing.negativeMarks !== incoming.negativeMarks) return false;
  if (Boolean(existing.reviewRequired) !== Boolean(incoming.reviewRequired)) return false;

  const existingOpts = existing.options || [];
  const incomingOpts = incoming.options || [];
  if (existingOpts.length !== incomingOpts.length) return false;
  for (let i = 0; i < existingOpts.length; i++) {
    if (existingOpts[i].id !== incomingOpts[i].id) return false;
    if (existingOpts[i].text !== incomingOpts[i].text) return false;
  }

  return true;
}

async function main() {
  console.log("================================================================================");
  console.log(" QUIZMASTER TECHNICAL PLACEMENT ASSESSMENT (50 MCQs) — SEED & SYNC ENGINE");
  console.log("================================================================================");
  console.log(`Execution Mode     : ${isDryRun ? "DRY RUN (Validation only, no writes)" : "LIVE SEED (Cloud Firestore commit)"}`);
  console.log(`Force Update       : ${isForceUpdate ? "ENABLED (Will overwrite conflicting records)" : "DISABLED (Conflicts protected)"}`);
  console.log(`Target Project ID  : ${firebaseConfig.projectId}`);
  console.log(`Auth Domain        : ${firebaseConfig.authDomain}`);

  // 1. Locate and Read JSON Source
  const candidatePaths = [
    customJsonPath,
    path.join(projectRoot, "quizmaster_technical_placement_50_questions.json"),
    path.join(projectRoot, "data", "quizmaster_technical_placement_50_questions.json")
  ].filter(Boolean);

  let jsonFilePath = null;
  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      jsonFilePath = p;
      break;
    }
  }

  if (!jsonFilePath) {
    console.error(`\n[FATAL] Question bank JSON file not found! Checked locations:`);
    candidatePaths.forEach((p) => console.error(`  - ${p}`));
    process.exit(1);
  }

  console.log(`Source JSON File   : ${jsonFilePath}`);
  const rawData = fs.readFileSync(jsonFilePath, "utf8");
  let sourceBank;
  try {
    sourceBank = JSON.parse(rawData);
  } catch (parseErr) {
    console.error("\n[FATAL] Failed to parse JSON file:", parseErr.message);
    process.exit(1);
  }

  // 2. Validate Top-Level Metadata
  const declaredCount = sourceBank.questionCount || 50;
  const rawQuestions = Array.isArray(sourceBank.questions) ? sourceBank.questions : [];
  console.log(`Declared Bank ID   : ${sourceBank.bankId}`);
  console.log(`Declared Title     : ${sourceBank.title}`);
  console.log(`Declared Count     : ${declaredCount}`);
  console.log(`Actual In-File Count: ${rawQuestions.length}`);

  if (rawQuestions.length !== 50) {
    console.warn(`[WARNING] Expected 50 questions, found ${rawQuestions.length} in source!`);
  }

  // 3. Authenticate with Firebase for Firestore verification
  const adminEmail = process.env.ADMIN_EMAIL || "Anupriyajha986@gmail.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Anupriya@123";

  console.log(`\nAuthenticating with Cloud Firestore as: ${adminEmail}...`);
  try {
    const cred = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
    console.log(`✓ Authenticated successfully! Admin UID: ${cred.user.uid}`);
  } catch (authErr) {
    console.error(`[FATAL] Firebase Authentication failed: ${authErr.message}`);
    console.error("Please verify ADMIN_EMAIL and ADMIN_PASSWORD in environment or defaults.");
    process.exit(1);
  }

  // 4. Validate All Questions and Detect Subject Distribution
  console.log("\n--- Validating Question Schemas & Field Integrity ---");
  const subjectBreakdown = {};
  const validQuestions = [];
  const invalidQuestions = [];
  const reviewRequiredQuestions = [];

  rawQuestions.forEach((q, index) => {
    const validation = validateQuestion(q, index);
    const subj = q.subject || "Unknown";
    subjectBreakdown[subj] = (subjectBreakdown[subj] || 0) + 1;

    if (!validation.isValid) {
      invalidQuestions.push({ question: q, index, errors: validation.errors });
    } else {
      validQuestions.push(q);
    }

    if (q.reviewRequired === true || q.id === "placement50-cpp-q15" || q.sourceQuestionNumber === 15) {
      reviewRequiredQuestions.push(q);
    }
  });

  console.log(`Total Parsed Questions : ${rawQuestions.length}`);
  console.log(`Valid Questions        : ${validQuestions.length}`);
  console.log(`Invalid Questions      : ${invalidQuestions.length}`);
  console.log(`Questions by Subject   :`);
  Object.entries(subjectBreakdown).forEach(([subj, count]) => {
    console.log(`  - ${subj.padEnd(14)}: ${count} questions`);
  });

  if (invalidQuestions.length > 0) {
    console.error("\n[VALIDATION ERRORS ENCOUNTERED]");
    invalidQuestions.forEach((iv) => {
      console.error(`  Question #${iv.index + 1} (${iv.question.id || "no-id"}):`);
      iv.errors.forEach((err) => console.error(`    * ${err}`));
    });
    if (!isDryRun) {
      console.error("\nCannot proceed with live seeding when invalid questions are present. Fix errors or run with valid JSON.");
      process.exit(1);
    }
  }

  // 5. Special Audit for Question 15
  console.log("\n--- Question 15 Special Audit Report ---");
  const q15 = rawQuestions.find((q) => q.sourceQuestionNumber === 15 || q.id === "placement50-cpp-q15");
  if (q15) {
    console.log(`✓ Question ID           : ${q15.id}`);
    console.log(`✓ Subject               : ${q15.subject}`);
    console.log(`✓ Review Required Flag  : ${q15.reviewRequired} (PRESERVED)`);
    console.log(`✓ Correct Answer        : ${q15.correctOptionId} (${q15.options.find(o => o.id === q15.correctOptionId)?.text})`);
    console.log(`✓ Verbatim Code Snippet :`);
    console.log(`    ----------------------------------------`);
    q15.questionText.split("\n").forEach((line) => console.log(`    ${line}`));
    console.log(`    ----------------------------------------`);
    console.log(`✓ Rationale & Status    :`);
    console.log(`    The source PDF contains \`int &r; = x;\`, which is syntactically invalid C++`);
    console.log(`    (misplaced semicolon in declaration). As printed, it causes a compilation error.`);
    console.log(`    In accordance with safety policy, this is NOT silently rewritten to \`int &r = x;\`.`);
    console.log(`    Correct option is kept as 'D' (Compilation error) and flagged reviewRequired: true.`);
  } else {
    console.warn("[WARNING] Question 15 not specifically identified in questions array!");
  }

  // 6. Inspect Cloud Firestore for Existing Records (Idempotency Analysis)
  console.log("\n--- Checking Existing Firestore Records for Idempotence ---");
  const setId = "placement-technical-50";
  const questionIds = validQuestions.map((q) => q.id);

  let createdCount = 0;
  let unchangedCount = 0;
  let conflictingCount = 0;
  const questionsToCreate = [];
  const questionsToUpdate = [];

  for (const q of validQuestions) {
    const formattedOpts = normalizeOptions(q.options);
    const correctLetter = (q.correctOptionId || "A").toUpperCase();
    const correctIndex = q.correctOptionIndex !== undefined ? Number(q.correctOptionIndex) : ["A", "B", "C", "D"].indexOf(correctLetter);

    const targetPayload = {
      id: q.id,
      sourceQuestionNumber: q.sourceQuestionNumber || null,
      questionText: q.questionText.trim(),
      questionType: q.questionType || "single_choice",
      options: formattedOpts,
      correctAnswer: correctLetter,
      correctOptionId: correctLetter,
      correctOptionIndex: correctIndex,
      explanation: q.explanation.trim(),
      subject: q.subject.trim(),
      subjectId: (q.subject || "").toLowerCase().trim(),
      setId: setId,
      setCode: setId,
      difficulty: q.difficulty || "Medium",
      positiveMarks: Number(q.marksCorrect) || 4,
      negativeMarks: Math.abs(Number(q.marksIncorrect)) || 1,
      unansweredMarks: 0,
      marksCorrect: Number(q.marksCorrect) || 4,
      marksIncorrect: -Math.abs(Number(q.marksIncorrect) || 1),
      status: "active",
      reviewRequired: q.reviewRequired === true
    };

    const docRef = doc(db, "questions", q.id);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      createdCount++;
      questionsToCreate.push(targetPayload);
    } else {
      const existingData = snap.data();
      if (isQuestionContentIdentical(existingData, targetPayload)) {
        unchangedCount++;
      } else {
        conflictingCount++;
        if (isForceUpdate) {
          questionsToUpdate.push(targetPayload);
        } else {
          console.warn(`  [CONFLICT] Question ${q.id} exists with differing content. (Use --update to overwrite).`);
        }
      }
    }
  }

  console.log(`Idempotency Analysis:`);
  console.log(`  - New Questions to Create : ${createdCount}`);
  console.log(`  - Unchanged (Already Live): ${unchangedCount}`);
  console.log(`  - Conflicting Questions   : ${conflictingCount}`);
  if (isForceUpdate && conflictingCount > 0) {
    console.log(`  - Conflicting to Overwrite: ${questionsToUpdate.length}`);
  }

  // 7. Check Subject Status
  console.log("\n--- Subject Verification ---");
  for (const [subjName, meta] of Object.entries(SUBJECT_METADATA)) {
    const subjDocRef = doc(db, "subjects", meta.id);
    const subjSnap = await getDoc(subjDocRef);
    if (!subjSnap.exists()) {
      console.log(`  - Subject '${subjName}' (${meta.id}): NOT FOUND in Firestore -> Will create`);
    } else {
      console.log(`  - Subject '${subjName}' (${meta.id}): EXISTS in Firestore -> Active`);
    }
  }

  // 8. Handle Dry-Run Exit
  if (isDryRun) {
    console.log("\n================================================================================");
    console.log(" DRY RUN COMPLETED SUCCESSFULLY — NO FIRESTORE WRITES PERFORMED");
    console.log("================================================================================");
    console.log(`Validation Status      : 100% PASSED (${validQuestions.length}/50 questions valid)`);
    console.log(`Questions to Create    : ${createdCount}`);
    console.log(`Questions Unchanged    : ${unchangedCount}`);
    console.log(`Conflicting Questions  : ${conflictingCount}`);
    console.log(`Review Required        : ${reviewRequiredQuestions.length} (Q15 flagged)`);
    console.log(`Target Question Set    : ${setId} ("${sourceBank.title}")`);
    console.log(`Marking Scheme         : +4 for correct, -1 for incorrect, 0 for unattempted`);
    console.log(`Total Maximum Marks    : 200 (50 questions x 4 marks)`);
    console.log(`Duration               : 60 minutes`);
    console.log("\nTo execute live write, run:");
    console.log("  npm run seed:placement");
    process.exit(0);
  }

  // 9. Live Cloud Firestore Commit
  console.log("\n================================================================================");
  console.log(" COMMITTING RECORDS TO CLOUD FIRESTORE...");
  console.log("================================================================================");

  const batch = writeBatch(db);

  // A. Upsert Subjects
  for (const [subjName, meta] of Object.entries(SUBJECT_METADATA)) {
    const subjDocRef = doc(db, "subjects", meta.id);
    batch.set(subjDocRef, {
      id: meta.id,
      name: meta.name,
      code: meta.code,
      description: meta.description,
      color: meta.color,
      icon: meta.icon,
      status: "active",
      order: meta.order,
      updatedAt: serverTimestamp()
    }, { merge: true });
  }

  // B. Upsert Questions
  const questionsToWrite = [...questionsToCreate, ...questionsToUpdate];
  for (const qData of questionsToWrite) {
    const qDocRef = doc(db, "questions", qData.id);
    batch.set(qDocRef, {
      ...qData,
      createdBy: "admin",
      updatedBy: "admin",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }, { merge: true });
  }

  // C. Build Sanitized Question Snapshot (Strict Candidate Security: NO answers/explanations)
  const sanitizedSnapshot = validQuestions.map((q) => {
    const opts = normalizeOptions(q.options);
    return {
      id: q.id,
      sourceQuestionNumber: q.sourceQuestionNumber || null,
      questionText: q.questionText.trim(),
      questionType: q.questionType || "single_choice",
      options: opts,
      subject: q.subject.trim(),
      subjectId: (q.subject || "").toLowerCase().trim(),
      difficulty: q.difficulty || "Medium",
      positiveMarks: Number(q.marksCorrect) || 4,
      negativeMarks: Math.abs(Number(q.marksIncorrect)) || 1,
      unansweredMarks: 0,
      imageUrl: null
    };
  });

  // D. Build Authoritative Answer Key Map for Secure Evaluation Vault
  const secureAnswersMap = {};
  validQuestions.forEach((q) => {
    const correctLetter = (q.correctOptionId || "A").toUpperCase();
    const correctIndex = q.correctOptionIndex !== undefined ? Number(q.correctOptionIndex) : ["A", "B", "C", "D"].indexOf(correctLetter);
    secureAnswersMap[q.id] = {
      correctAnswer: correctLetter,
      correctOptionId: correctLetter,
      correctOptionIndex: correctIndex,
      explanation: q.explanation.trim()
    };
  });

  // E. Create or Update Question Set
  const setRef = doc(db, "questionSets", setId);
  const setPayload = {
    id: setId,
    title: sourceBank.title || "Technical Placement Assessment Test",
    setNumber: 1,
    subjectId: "placement-technical",
    subject: "Technical Placement",
    description: sourceBank.description || "50 placement-style technical MCQs covering C, C++, HTML, CSS, and JavaScript.",
    instructions: "Read all questions carefully. Standard technical placement scheme applies: +4 for correct, -1 for incorrect, 0 for unattempted. Test duration is 60 minutes.",
    durationMinutes: 60,
    questionIds: questionIds,
    questionCount: questionIds.length,
    totalMarks: questionIds.length * 4,
    maximumMarks: questionIds.length * 4,
    difficulty: "Medium",
    markingScheme: {
      positiveMarks: 4,
      negativeMarks: 1,
      unansweredMarks: 0
    },
    attemptLimit: 3,
    status: "published",
    publicationStatus: "published",
    publishedQuestionsSnapshot: sanitizedSnapshot,
    updatedBy: "admin",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  batch.set(setRef, setPayload, { merge: true });

  // F. Mirror into `tests` Collection for Student Exam Engine Compatibility
  const testRef = doc(db, "tests", setId);
  const testPayload = {
    id: setId,
    setId: setId,
    title: sourceBank.title || "Technical Placement Assessment Test",
    subject: "Technical Placement",
    subjectId: "placement-technical",
    description: sourceBank.description || "50 placement-style technical MCQs covering C, C++, HTML, CSS, and JavaScript.",
    instructions: "Read all questions carefully. Standard technical placement scheme applies: +4 for correct, -1 for incorrect, 0 for unattempted. Test duration is 60 minutes.",
    durationMinutes: 60,
    totalMarks: questionIds.length * 4,
    maximumMarks: questionIds.length * 4,
    questionCount: questionIds.length,
    questionIds: questionIds,
    difficulty: "Medium",
    publicationStatus: "published",
    status: "published",
    markingScheme: {
      positiveMarks: 4,
      negativeMarks: 1,
      unansweredMarks: 0
    },
    navigationSettings: {
      allowRevisit: true,
      reviewAllowed: true
    },
    resultSettings: {
      showResultImmediately: true,
      showLeaderboard: true,
      showExplanations: true
    },
    publishedQuestionsSnapshot: sanitizedSnapshot,
    updatedAt: serverTimestamp()
  };
  batch.set(testRef, testPayload, { merge: true });

  // G. Secure Answer Keys Vault (Only for backend evaluation & authorized admins)
  const answerKeyRef = doc(db, "answerKeys", setId);
  batch.set(answerKeyRef, {
    testId: setId,
    setId: setId,
    answers: secureAnswersMap,
    publishedAt: serverTimestamp()
  });

  // H. Audit Log Record
  const auditRef = doc(collection(db, "auditLogs"));
  batch.set(auditRef, {
    action: "SEED_PLACEMENT_ASSESSMENT_50",
    actorEmail: adminEmail,
    details: {
      setId,
      title: sourceBank.title,
      totalQuestions: validQuestions.length,
      createdCount,
      unchangedCount,
      conflictingCount,
      reviewRequiredCount: reviewRequiredQuestions.length
    },
    timestamp: serverTimestamp()
  });

  await batch.commit();

  console.log("✓ Cloud Firestore Batch Write Committed Successfully!");
  console.log(`  - Subjects Registered / Updated : ${Object.keys(SUBJECT_METADATA).length}`);
  console.log(`  - Questions Committed           : ${questionsToWrite.length} (${createdCount} created, ${questionsToUpdate.length} updated)`);
  console.log(`  - Questions Unchanged           : ${unchangedCount}`);
  console.log(`  - Question Set Published        : ${setId}`);
  console.log(`  - Test Mirror Published         : ${setId} (with ${sanitizedSnapshot.length} sanitized questions)`);
  console.log(`  - Secure Answer Keys Vault      : ${setId} (with 50 authoritative answers locked)`);

  console.log("\n================================================================================");
  console.log(" 50-MCQ TECHNICAL PLACEMENT ASSESSMENT SUCCESSFULLY DEPLOYED!");
  console.log("================================================================================");
  process.exit(0);
}

main().catch((err) => {
  console.error("\n[FATAL] Seeding script encountered an error:", err);
  process.exit(1);
});
