import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  writeBatch,
  serverTimestamp,
  getDocs,
  query,
  where
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

async function getOrCreateUser(email, password, profile) {
  let user;
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    user = cred.user;
    console.log(`[Created Auth User] ${email} (UID: ${user.uid})`);
  } catch (err) {
    if (err.code === "auth/email-already-in-use") {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      user = cred.user;
      console.log(`[Existing Auth User] ${email} (UID: ${user.uid})`);
    } else {
      throw err;
    }
  }

  // Set Firestore profile
  const userRef = doc(db, "users", user.uid);
  await setDoc(userRef, {
    uid: user.uid,
    email,
    ...profile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }, { merge: true });

  return user;
}

const SAMPLE_QUESTIONS = [
  {
    questionText: "A particle of mass 2 kg is moving in a straight line with a velocity of 5 m/s. A constant force acts on it for 4 seconds and increases its velocity to 13 m/s. The magnitude of the force is:",
    subject: "Physics",
    topic: "Laws of Motion",
    difficulty: "medium",
    positiveMarks: 4,
    negativeMarks: 1,
    unansweredMarks: 0,
    questionType: "single_choice",
    options: [
      { id: "A", text: "4 N" },
      { id: "B", text: "8 N" },
      { id: "C", text: "12 N" },
      { id: "D", text: "16 N" }
    ],
    correctAnswer: "A",
    explanation: "Acceleration a = (v - u)/t = (13 - 5)/4 = 8/4 = 2 m/s². The magnitude of the force is F = m * a = 2 kg * 2 m/s² = 4 N."
  },
  {
    questionText: "A particle starts from rest and moves with a uniform acceleration of 2 m/s² for 10 seconds. What is the total distance traversed by the particle?",
    subject: "Physics",
    topic: "Kinematics",
    difficulty: "easy",
    positiveMarks: 4,
    negativeMarks: 1,
    unansweredMarks: 0,
    questionType: "single_choice",
    options: [
      { id: "A", text: "50 meters" },
      { id: "B", text: "100 meters" },
      { id: "C", text: "150 meters" },
      { id: "D", text: "200 meters" }
    ],
    correctAnswer: "B",
    explanation: "Using s = ut + (1/2)at² where u = 0, a = 2 m/s², t = 10 s: s = 0 + 0.5 * 2 * (10)² = 100 meters."
  },
  {
    questionText: "What is the magnetic field at the center of a circular coil of radius R carrying a steady current I?",
    subject: "Physics",
    topic: "Magnetism",
    difficulty: "medium",
    positiveMarks: 4,
    negativeMarks: 1,
    unansweredMarks: 0,
    questionType: "single_choice",
    options: [
      { id: "A", text: "μ₀I / (2R)" },
      { id: "B", text: "μ₀I / (4πR)" },
      { id: "C", text: "μ₀I / (2πR)" },
      { id: "D", text: "μ₀I / R²" }
    ],
    correctAnswer: "A",
    explanation: "According to the Biot-Savart law, the magnetic field at the center of a circular current loop is B = (μ₀ * I) / (2 * R)."
  },
  {
    questionText: "Which of the following compounds exhibits optical isomerism due to the presence of a chiral carbon center?",
    subject: "Chemistry",
    topic: "Organic Chemistry",
    difficulty: "medium",
    positiveMarks: 4,
    negativeMarks: 1,
    unansweredMarks: 0,
    questionType: "single_choice",
    options: [
      { id: "A", text: "Ethanol" },
      { id: "B", text: "2-Chlorobutane" },
      { id: "C", text: "Propan-2-ol" },
      { id: "D", text: "Methanol" }
    ],
    correctAnswer: "B",
    explanation: "In 2-chlorobutane (CH₃-CH(Cl)-CH₂-CH₃), the C-2 carbon is bonded to four distinct groups (-H, -Cl, -CH₃, -CH₂CH₃), making it chiral."
  },
  {
    questionText: "What is the oxidation state of Chromium (Cr) in Potassium Dichromate (K₂Cr₂O₇)?",
    subject: "Chemistry",
    topic: "Redox Reactions",
    difficulty: "easy",
    positiveMarks: 4,
    negativeMarks: 1,
    unansweredMarks: 0,
    questionType: "single_choice",
    options: [
      { id: "A", text: "+3" },
      { id: "B", text: "+4" },
      { id: "C", text: "+6" },
      { id: "D", text: "+7" }
    ],
    correctAnswer: "C",
    explanation: "Let oxidation state of Cr be x. 2(+1) + 2(x) + 7(-2) = 0 => 2 + 2x - 14 = 0 => 2x = 12 => x = +6."
  },
  {
    questionText: "If the matrix A = [[cos θ, -sin θ], [sin θ, cos θ]], what is the determinant of matrix A?",
    subject: "Mathematics",
    topic: "Matrices & Determinants",
    difficulty: "easy",
    positiveMarks: 4,
    negativeMarks: 1,
    unansweredMarks: 0,
    questionType: "single_choice",
    options: [
      { id: "A", text: "0" },
      { id: "B", text: "1" },
      { id: "C", text: "-1" },
      { id: "D", text: "cos(2θ)" }
    ],
    correctAnswer: "B",
    explanation: "det(A) = (cos θ)(cos θ) - (-sin θ)(sin θ) = cos² θ + sin² θ = 1."
  },
  {
    questionText: "What is the derivative of f(x) = ln(sec x + tan x) with respect to x?",
    subject: "Mathematics",
    topic: "Calculus",
    difficulty: "medium",
    positiveMarks: 4,
    negativeMarks: 1,
    unansweredMarks: 0,
    questionType: "single_choice",
    options: [
      { id: "A", text: "sec x" },
      { id: "B", text: "tan x" },
      { id: "C", text: "sec² x" },
      { id: "D", text: "sec x tan x" }
    ],
    correctAnswer: "A",
    explanation: "d/dx [ln(sec x + tan x)] = (sec x tan x + sec² x) / (sec x + tan x) = sec x(tan x + sec x)/(sec x + tan x) = sec x."
  },
  {
    questionText: "Which data structure follows the Last-In-First-Out (LIFO) property and is utilized for subroutine call management?",
    subject: "Computer Science",
    topic: "Data Structures",
    difficulty: "easy",
    positiveMarks: 4,
    negativeMarks: 1,
    unansweredMarks: 0,
    questionType: "single_choice",
    options: [
      { id: "A", text: "Queue" },
      { id: "B", text: "Stack" },
      { id: "C", text: "Binary Search Tree" },
      { id: "D", text: "Circular Linked List" }
    ],
    correctAnswer: "B",
    explanation: "A Stack is a LIFO data structure universally used by CPU execution architectures to manage return addresses and activation frames."
  },
  {
    questionText: "In relational database management systems, what property of ACID transactions guarantees that committed operations persist even across power failures?",
    subject: "Computer Science",
    topic: "Databases",
    difficulty: "medium",
    positiveMarks: 4,
    negativeMarks: 1,
    unansweredMarks: 0,
    questionType: "single_choice",
    options: [
      { id: "A", text: "Atomicity" },
      { id: "B", text: "Consistency" },
      { id: "C", text: "Isolation" },
      { id: "D", text: "Durability" }
    ],
    correctAnswer: "D",
    explanation: "Durability guarantees that once a transaction commits, its effects survive system crashes, reboots, and storage failures via write-ahead logging (WAL)."
  }
];

async function seed() {
  console.log("=== QuizMaster Platform Seed & Provisioning ===");

  // 1. Provision Admin
  const adminUser = await getOrCreateUser(
    "admin@quizmaster.com",
    "Admin@12345",
    {
      fullName: "System Administrator",
      role: "admin",
      accountStatus: "active",
      instituteName: "QuizMaster Central Exam Board"
    }
  );

  // 2. Provision Student
  const studentUser = await getOrCreateUser(
    "student@quizmaster.com",
    "Student@12345",
    {
      fullName: "Rahul Sharma",
      role: "student",
      normalizedRollNumber: "2026-JEE-0104",
      instituteName: "National Institute of Technology",
      phone: "+91 98765 43210",
      accountStatus: "active"
    }
  );

  // Re-authenticate as Administrator to perform administrative seed writes
  console.log("Authenticating as Admin to seed questions and tests...");
  await signInWithEmailAndPassword(auth, "admin@quizmaster.com", "Admin@12345");

  // 3. Seed Questions
  console.log("Seeding question bank...");
  const questionIds = [];
  const secureAnswers = {};
  const sanitizedQuestions = [];

  for (const q of SAMPLE_QUESTIONS) {
    const qRef = doc(collection(db, "questions"));
    const qId = qRef.id;
    questionIds.push(qId);

    const questionDocData = {
      ...q,
      status: "active",
      createdBy: adminUser.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(qRef, questionDocData);

    sanitizedQuestions.push({
      id: qId,
      questionText: q.questionText,
      questionType: q.questionType,
      options: q.options,
      subject: q.subject,
      topic: q.topic,
      difficulty: q.difficulty,
      positiveMarks: q.positiveMarks,
      negativeMarks: q.negativeMarks,
      unansweredMarks: q.unansweredMarks,
      imageUrl: null
    });

    secureAnswers[qId] = {
      correctAnswer: q.correctAnswer,
      explanation: q.explanation
    };
  }

  // 4. Create Question Set
  console.log("Creating curated Question Set...");
  const setRef = doc(collection(db, "questionSets"));
  await setDoc(setRef, {
    title: "JEE Main 2026 Model Paper - General Science & Engineering",
    description: "Curated model paper with Physics, Chemistry, Mathematics, and Computer Science fundamentals.",
    subject: "Combined",
    questionIds,
    questionCount: questionIds.length,
    totalMarks: questionIds.length * 4,
    status: "active",
    version: 1,
    createdBy: adminUser.uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  // 5. Create & Publish Test
  console.log("Creating & Publishing Grand Mock Test...");
  const testRef = doc(collection(db, "tests"));
  const testId = testRef.id;

  const testData = {
    title: "JEE Main Mock Test 01",
    description: "Official JEE Main Computer-Based Examination replicating standard test specifications.",
    subject: "Physics • Chemistry • Mathematics",
    instructions: "1. Total duration of the examination is 180 minutes (3 Hours).\n2. Each correct response carries +4 marks, while incorrect responses incur a -1 penalty.\n3. The authoritative timer begins when you click Start Test.\n4. You may review and clear responses at any point before submitting.",
    questionIds,
    questionCount: sanitizedQuestions.length,
    maximumMarks: sanitizedQuestions.length * 4,
    durationMinutes: 180,
    attemptLimit: 3,
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
    publicationStatus: "published",
    publishedQuestionsSnapshot: sanitizedQuestions,
    createdBy: adminUser.uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  await setDoc(testRef, testData);

  // 6. Secure Answer Key
  const answerKeyRef = doc(db, "answerKeys", testId);
  await setDoc(answerKeyRef, {
    testId,
    answers: secureAnswers,
    publishedAt: serverTimestamp()
  });

  // 7. Audit Log
  const auditRef = doc(collection(db, "auditLogs"));
  await setDoc(auditRef, {
    action: "SYSTEM_INITIALIZATION",
    actorUid: adminUser.uid,
    actorEmail: "admin@quizmaster.com",
    details: { testId, questionCount: sanitizedQuestions.length },
    timestamp: serverTimestamp()
  });

  // 8. Notification
  const notifRef = doc(collection(db, "notifications"));
  await setDoc(notifRef, {
    recipientUid: "all",
    title: "Grand Mock Test 2026 is Live!",
    message: "The JEE Main All India Grand Mock Test 2026 is now available. Click to attempt.",
    type: "exam",
    referenceId: testId,
    isRead: false,
    createdAt: serverTimestamp()
  });

  console.log("\n=======================================================");
  console.log("QUIZMASTER PORTAL PROVISIONING COMPLETED SUCCESSFULLY!");
  console.log("=======================================================");
  console.log("Admin Account:   admin@quizmaster.com   / Admin@12345");
  console.log("Student Account: student@quizmaster.com / Student@12345");
  console.log(`Published Test:  ${testData.title} (ID: ${testId})`);
  console.log("=======================================================\n");
}

seed().then(() => process.exit(0)).catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
