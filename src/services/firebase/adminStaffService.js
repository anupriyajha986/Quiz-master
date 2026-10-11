import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  query,
  where,
  serverTimestamp
} from "firebase/firestore";
import { initializeApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { db, firebaseConfig } from "./config.js";
import { resetPassword } from "./authService.js";
import { ALL_PERMISSION_IDS, DEFAULT_ADMIN_PERMISSIONS } from "../../constants/permissions.js";

/**
 * Fetch all administrative staff accounts
 */
export async function getAdminStaffMembers() {
  const q = query(
    collection(db, "users"),
    where("role", "in", ["super_admin", "admin", "manager", "evaluator", "support"])
  );
  const snap = await getDocs(q);
  const list = snap.docs.map((d) => ({ id: d.id, uid: d.id, ...d.data() }));

  // Sort: super_admin first, then by createdAt desc
  list.sort((a, b) => {
    if (a.role === "super_admin") return -1;
    if (b.role === "super_admin") return 1;
    const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt || 0).getTime();
    const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt || 0).getTime();
    return timeB - timeA;
  });

  return list;
}

/**
 * Create a new admin staff member with feature-level permissions
 * Uses secondary Firebase Auth instance to avoid interrupting caller's session.
 */
export async function createAdminStaffMember(
  {
    fullName,
    email,
    password,
    role = "admin",
    roleTitle = "Administrator",
    permissions = DEFAULT_ADMIN_PERMISSIONS,
    accountStatus = "active"
  },
  currentAdmin = {}
) {
  if (!fullName || !fullName.trim()) throw new Error("Staff member full name is required.");
  if (!email || !email.trim()) throw new Error("Staff member work email is required.");
  if (!password || password.length < 6) throw new Error("Password must be at least 6 characters.");

  const normalizedEmail = email.trim().toLowerCase();

  // Super Admin creation is strictly protected
  if (role === "super_admin") {
    throw new Error("Additional Super Admin accounts cannot be created via the standard administrative form.");
  }

  // Ensure at least one permission is assigned
  const assignedPermissions = Array.isArray(permissions) && permissions.length > 0
    ? permissions
    : DEFAULT_ADMIN_PERMISSIONS;

  const secondaryAppName = `StaffProvisioning_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const secondaryApp = initializeApp(firebaseConfig, secondaryAppName);
  const secondaryAuth = getAuth(secondaryApp);

  try {
    const cred = await createUserWithEmailAndPassword(
      secondaryAuth,
      normalizedEmail,
      password
    );
    const newUid = cred.user.uid;

    const staffRecord = {
      uid: newUid,
      email: normalizedEmail,
      fullName: fullName.trim(),
      displayName: fullName.trim(),
      role,
      roleTitle,
      accountStatus,
      permissions: assignedPermissions,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdByAdmin: {
        adminUid: currentAdmin.uid || "system",
        adminEmail: currentAdmin.email || "super_admin",
        adminName: currentAdmin.fullName || currentAdmin.displayName || "Super Admin",
        at: new Date().toISOString()
      }
    };

    await setDoc(doc(db, "users", newUid), staffRecord);

    // Audit log
    await addDoc(collection(db, "auditLogs"), {
      action: "PROVISION_ADMIN_STAFF",
      actorUid: currentAdmin.uid || "system",
      actorEmail: currentAdmin.email || "super_admin",
      actorName: currentAdmin.fullName || currentAdmin.displayName || "Super Admin",
      details: {
        staffUid: newUid,
        email: normalizedEmail,
        fullName: fullName.trim(),
        role,
        roleTitle,
        permissionsCount: assignedPermissions.length,
        accountStatus
      },
      timestamp: serverTimestamp()
    });

    await signOut(secondaryAuth);
    return { uid: newUid, ...staffRecord };
  } finally {
    try {
      await deleteApp(secondaryApp);
    } catch {
      // Ignored
    }
  }
}

/**
 * Update administrative staff role, permissions, and status
 */
export async function updateAdminStaffPermissions(
  staffUid,
  { role, roleTitle, permissions, accountStatus },
  currentAdmin = {}
) {
  if (!staffUid) throw new Error("Staff UID is required.");

  const staffRef = doc(db, "users", staffUid);
  const snap = await getDoc(staffRef);
  if (!snap.exists()) throw new Error("Staff member record not found.");

  const existing = snap.data();

  // Super Admin protection
  const isTargetSuperAdmin = existing.role === "super_admin";

  if (isTargetSuperAdmin) {
    if (role && role !== "super_admin") {
      throw new Error("The initial Super Admin role cannot be demoted or altered.");
    }
    if (accountStatus === "inactive") {
      throw new Error("The initial Super Admin account cannot be suspended or deactivated.");
    }
  }

  const updates = {
    updatedAt: serverTimestamp()
  };

  if (role) updates.role = role;
  if (roleTitle) updates.roleTitle = roleTitle;
  if (Array.isArray(permissions)) updates.permissions = permissions;
  if (accountStatus) updates.accountStatus = accountStatus;

  await updateDoc(staffRef, updates);

  // Audit log
  await addDoc(collection(db, "auditLogs"), {
    action: "UPDATE_STAFF_PERMISSIONS",
    actorUid: currentAdmin.uid || "system",
    actorEmail: currentAdmin.email || "super_admin",
    actorName: currentAdmin.fullName || currentAdmin.displayName || "Super Admin",
    details: {
      targetUid: staffUid,
      targetEmail: existing.email,
      previousRole: existing.role,
      newRole: role || existing.role,
      permissionsCount: Array.isArray(permissions) ? permissions.length : existing.permissions?.length || 0,
      accountStatus: accountStatus || existing.accountStatus
    },
    timestamp: serverTimestamp()
  });

  return { uid: staffUid, ...updates };
}

/**
 * Toggle administrative staff account status (active <-> inactive)
 */
export async function toggleAdminStaffStatus(staffUid, newStatus, currentAdmin = {}) {
  return updateAdminStaffPermissions(staffUid, { accountStatus: newStatus }, currentAdmin);
}

/**
 * Send password recovery/reset email to staff member
 */
export async function sendStaffPasswordResetEmail(email) {
  if (!email) throw new Error("Email address is required.");
  await resetPassword(email);
  return true;
}
