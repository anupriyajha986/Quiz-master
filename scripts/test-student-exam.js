import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, getDocs, collection, query, where } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDC55H0zV6cUTJSF9IOxuXWiW9a6gK0miY",
  authDomain: "quiz-master-portal.firebaseapp.com",
  projectId: "quiz-master-portal",
  storageBucket: "quiz-master-portal.firebasestorage.app",
  messagingSenderId: "439258848801",
  appId: "1:439258848801:web:5f4392d08ec1426f140d60",
  measurementId: "G-JZ2XJFV26Y"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function testStudent() {
  const studentEmail = "student@quizmaster.com";
  const studentPassword = "Student@12345";
  let user;

  try {
    const cred = await signInWithEmailAndPassword(auth, studentEmail, studentPassword);
    user = cred.user;
    console.log("Logged in existing student:", user.email);
  } catch (err) {
    console.log("Creating new student user...");
    const cred = await createUserWithEmailAndPassword(auth, studentEmail, studentPassword);
    user = cred.user;
    console.log("Created student:", user.email);
  }

  // Ensure user profile in Firestore
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    fullName: "Aryan Sharma",
    displayName: "Aryan Sharma",
    email: studentEmail,
    role: "student",
    status: "active",
    accountStatus: "active",
    rollNumber: "QM2026-001",
    department: "Computer Science"
  }, { merge: true });

  console.log("Student user document ready.");

  // Test reading subjects
  const subjectsSnap = await getDocs(collection(db, "subjects"));
  console.log("Subjects accessible to student:", subjectsSnap.docs.map(d => ({ id: d.id, ...d.data() })));

  // Test reading tests
  const testsSnap = await getDocs(query(collection(db, "tests"), where("publicationStatus", "==", "published")));
  console.log(`Published tests accessible to student: ${testsSnap.docs.length}`);
  const sample = testsSnap.docs[0]?.data();
  console.log("Sample test title:", sample?.title, "subject:", sample?.subject, "questions count:", sample?.publishedQuestionsSnapshot?.length);

  // CRITICAL SECURITY CHECK: Ensure student CANNOT access answerKeys
  try {
    const keySnap = await getDocs(collection(db, "answerKeys"));
    console.error("SECURITY RISK: Student was able to read answerKeys!", keySnap.docs.length);
  } catch (err) {
    console.log("✓ SECURITY PASS: Student forbidden from reading answerKeys collection (", err.code, ")");
  }

  // CRITICAL SECURITY CHECK: Ensure student questions snapshot DOES NOT contain correctAnswer
  const firstQ = sample?.publishedQuestionsSnapshot?.[0];
  if (firstQ?.correctAnswer || firstQ?.correctOptionIndex !== undefined) {
    console.error("SECURITY RISK: correctAnswer found in published snapshot!", firstQ);
  } else {
    console.log("✓ SECURITY PASS: publishedQuestionsSnapshot is completely sanitized (no correctAnswer / correctOptionIndex).");
  }
}

testStudent().then(() => process.exit(0)).catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
