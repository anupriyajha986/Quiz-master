import { initializeApp, deleteApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  deleteUser
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from "firebase/firestore";
import { ALL_PERMISSION_IDS } from "../src/constants/permissions.js";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyDC55H0zV6cUTJSF9IOxuXWiW9a6gK0miY",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "quiz-master-portal.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "quiz-master-portal",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "quiz-master-portal.firebasestorage.app",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "439258848801",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:439258848801:web:5f4392d08ec1426f140d60",
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || "G-JZ2XJFV26Y"
};

const app = initializeApp(firebaseConfig, "mainApp");
const auth = getAuth(app);
const db = getFirestore(app);

const SUPER_ADMIN_EMAIL = "Anupriyajha986@gmail.com";
const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD || "Anupriya@123";

const TEST_STAFF_EMAIL = `test_staff_${Date.now()}@quizmaster.com`;
const TEST_STAFF_PASSWORD = "StaffTest@123456";

let passedCount = 0;
let totalCount = 0;

function assert(condition, message) {
  totalCount++;
  if (!condition) {
    console.error(`  FAIL [${totalCount}]: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  passedCount++;
  console.log(`  PASS [${totalCount}]: ${message}`);
}

async function runSuperAdminWorkflowVerification() {
  console.log("==================================================");
  console.log("QUIZMASTER E2E SUPER ADMIN WORKFLOW & SECURITY VERIFICATION");
  console.log("==================================================");
  console.log("Firebase Project:", firebaseConfig.projectId);

  let secondaryApp = null;
  let testStaffUid = null;
  let testStaffAuthUser = null;

  try {
    // ----------------------------------------------------
    // TEST 1: Super Admin Authentication
    // ----------------------------------------------------
    console.log("\n[Step 1] Authenticating as Super Admin...");
    const superAdminCred = await signInWithEmailAndPassword(auth, SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD);
    const superAdminUid = superAdminCred.user.uid;
    assert(superAdminUid.length > 0, `Super Admin signed in successfully (UID: ${superAdminUid})`);
    assert(superAdminCred.user.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase(), "Super Admin email verified");

    // ----------------------------------------------------
    // TEST 2: Verify Super Admin Permissions & Role
    // ----------------------------------------------------
    console.log("\n[Step 2] Inspecting Super Admin profile in Firestore...");
    const superAdminSnap = await getDoc(doc(db, "users", superAdminUid));
    assert(superAdminSnap.exists(), "Super Admin user document exists in Firestore");

    const superAdminData = superAdminSnap.data();
    assert(superAdminData.role === "super_admin", "Super Admin role is 'super_admin'");
    assert(superAdminData.accountStatus === "active", "Super Admin accountStatus is 'active'");
    assert(Array.isArray(superAdminData.permissions), "Super Admin permissions is an array");
    assert(
      superAdminData.permissions.length === ALL_PERMISSION_IDS.length,
      `Super Admin holds all ${ALL_PERMISSION_IDS.length} feature permissions (actual: ${superAdminData.permissions.length})`
    );
    assert(superAdminData.permissions.includes("admins.manage"), "Super Admin holds 'admins.manage' permission");

    // ----------------------------------------------------
    // TEST 3: Create Ordinary Admin with Restricted Permissions
    // ----------------------------------------------------
    console.log(`\n[Step 3] Creating ordinary admin (${TEST_STAFF_EMAIL}) with restricted permissions...`);
    const initialStaffPermissions = [
      "dashboard.view",
      "questions.view",
      "questions.create",
      "exams.view",
      "exams.create"
    ];

    // Secondary app pattern (as used in adminStaffService.js)
    secondaryApp = initializeApp(firebaseConfig, `secondaryApp_${Date.now()}`);
    const secondaryAuth = getAuth(secondaryApp);

    const staffCred = await createUserWithEmailAndPassword(
      secondaryAuth,
      TEST_STAFF_EMAIL,
      TEST_STAFF_PASSWORD
    );
    testStaffAuthUser = staffCred.user;
    testStaffUid = staffCred.user.uid;
    assert(testStaffUid.length > 0, `Staff account created in Firebase Auth (UID: ${testStaffUid})`);

    // Super Admin writes staff profile to Firestore
    const staffProfile = {
      uid: testStaffUid,
      email: TEST_STAFF_EMAIL,
      fullName: "Test Staff Member",
      displayName: "Test Staff Member",
      role: "admin",
      roleTitle: "Staff Admin",
      accountStatus: "active",
      permissions: initialStaffPermissions,
      createdByUid: superAdminUid,
      createdByEmail: SUPER_ADMIN_EMAIL,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(doc(db, "users", testStaffUid), staffProfile);
    console.log("Staff profile written to Firestore by Super Admin.");

    const staffSnap1 = await getDoc(doc(db, "users", testStaffUid));
    assert(staffSnap1.exists(), "Staff user document exists in Firestore");
    assert(staffSnap1.data().role === "admin", "Staff user has role 'admin'");
    assert(
      staffSnap1.data().permissions.length === 5,
      "Staff user has exactly 5 assigned permissions"
    );
    assert(
      !staffSnap1.data().permissions.includes("admins.manage"),
      "Staff user does NOT have 'admins.manage' permission"
    );

    // ----------------------------------------------------
    // TEST 4: Super Admin Updates Ordinary Admin Permissions
    // ----------------------------------------------------
    console.log("\n[Step 4] Super Admin updating staff permissions...");
    const updatedStaffPermissions = [
      ...initialStaffPermissions,
      "questions.edit",
      "questions.archive"
    ];

    await updateDoc(doc(db, "users", testStaffUid), {
      permissions: updatedStaffPermissions,
      updatedAt: serverTimestamp()
    });

    const staffSnap2 = await getDoc(doc(db, "users", testStaffUid));
    assert(
      staffSnap2.data().permissions.length === 7,
      `Staff permissions updated to 7 items (actual: ${staffSnap2.data().permissions.length})`
    );
    assert(
      staffSnap2.data().permissions.includes("questions.edit"),
      "Staff permissions now include 'questions.edit'"
    );

    // ----------------------------------------------------
    // TEST 5: Super Admin Toggles Staff Status (Suspend / Reactivate)
    // ----------------------------------------------------
    console.log("\n[Step 5] Super Admin toggling staff account status...");
    // Suspend
    await updateDoc(doc(db, "users", testStaffUid), {
      accountStatus: "inactive",
      updatedAt: serverTimestamp()
    });
    let staffSnap3 = await getDoc(doc(db, "users", testStaffUid));
    assert(staffSnap3.data().accountStatus === "inactive", "Staff status successfully set to 'inactive'");

    // Reactivate
    await updateDoc(doc(db, "users", testStaffUid), {
      accountStatus: "active",
      updatedAt: serverTimestamp()
    });
    staffSnap3 = await getDoc(doc(db, "users", testStaffUid));
    assert(staffSnap3.data().accountStatus === "active", "Staff status successfully restored to 'active'");

    // ----------------------------------------------------
    // TEST 6: Security Assertions — Ordinary Admin Restrictions
    // ----------------------------------------------------
    console.log("\n[Step 6] Testing security restrictions as ordinary staff admin...");
    // Sign in on secondary auth as staff
    await signInWithEmailAndPassword(secondaryAuth, TEST_STAFF_EMAIL, TEST_STAFF_PASSWORD);
    const staffDb = getFirestore(secondaryApp);

    // Security Check A: Ordinary admin CANNOT promote self to super_admin
    console.log("Current user in secondaryAuth:", secondaryAuth.currentUser?.email, "UID:", secondaryAuth.currentUser?.uid);
    let selfPromotionFailedAsExpected = false;
    try {
      const res = await updateDoc(doc(staffDb, "users", testStaffUid), {
        role: "super_admin"
      });
      console.log("UNEXPECTED: updateDoc succeeded with result:", res);
    } catch (err) {
      console.log("EXPECTED REJECTION CAUGHT:", err.code, err.message);
      selfPromotionFailedAsExpected = true;
    }
    assert(
      selfPromotionFailedAsExpected,
      "Security Rule Enforced: Ordinary admin CANNOT promote self to 'super_admin'"
    );

    // Security Check B: Ordinary admin CANNOT delete Super Admin profile
    let deleteSuperAdminFailedAsExpected = false;
    try {
      await deleteDoc(doc(staffDb, "users", superAdminUid));
    } catch (err) {
      deleteSuperAdminFailedAsExpected = true;
    }
    assert(
      deleteSuperAdminFailedAsExpected,
      "Security Rule Enforced: Ordinary admin CANNOT delete Super Admin account"
    );

    // Security Check C: Ordinary admin CANNOT demote Super Admin
    let demoteSuperAdminFailedAsExpected = false;
    try {
      await updateDoc(doc(staffDb, "users", superAdminUid), {
        role: "student"
      });
    } catch (err) {
      demoteSuperAdminFailedAsExpected = true;
    }
    assert(
      demoteSuperAdminFailedAsExpected,
      "Security Rule Enforced: Ordinary admin CANNOT demote Super Admin"
    );

    // ----------------------------------------------------
    // TEST 7: Cleanup
    // ----------------------------------------------------
    console.log("\n[Step 7] Cleaning up test staff user...");
    // Delete Firestore profile as Super Admin
    await deleteDoc(doc(db, "users", testStaffUid));
    const cleanupCheck = await getDoc(doc(db, "users", testStaffUid));
    assert(!cleanupCheck.exists(), "Test staff profile cleanly deleted from Firestore");

    // Delete Auth user
    if (testStaffAuthUser) {
      await deleteUser(testStaffAuthUser).catch(() => {});
      console.log("Test staff user removed from Firebase Auth.");
    }

    console.log("\n==================================================");
    console.log(`ALL TESTS PASSED: ${passedCount}/${totalCount}`);
    console.log("==================================================");
  } finally {
    if (secondaryApp) {
      await deleteApp(secondaryApp).catch(() => {});
    }
    await deleteApp(app).catch(() => {});
  }
}

runSuperAdminWorkflowVerification()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("\nVerification failure:", err);
    process.exit(1);
  });
