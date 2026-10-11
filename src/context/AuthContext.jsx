import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../services/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { loginUser, registerStudent, logoutUser } from "../services/firebase/authService";
import { ALL_PERMISSION_IDS } from "../constants/permissions";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (user) => {
    if (!user) {
      setUserProfile(null);
      setLoading(false);
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserProfile(data);
      } else {
        setUserProfile(null);
      }
    } catch (err) {
      console.error("Error loading profile:", err);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchProfile(user);
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    const res = await loginUser(email, password);
    setCurrentUser(res.user);
    setUserProfile(res.profile);
    return res;
  };

  const register = async (data) => {
    const res = await registerStudent(data);
    setCurrentUser(res.user);
    setUserProfile(res.profile);
    return res;
  };

  const logout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setUserProfile(null);
  };

  const refreshProfile = async () => {
    if (currentUser) {
      await fetchProfile(currentUser);
    }
  };

  const rawRole = (userProfile?.role || "").trim().toLowerCase();
  const isSuperAdmin = rawRole === "super_admin";
  const isAdmin = ["admin", "super_admin", "manager", "evaluator"].includes(rawRole);
  const isStudent = rawRole === "student";
  const isActive = userProfile?.accountStatus !== "inactive";

  const hasPermission = (permissionId) => {
    if (!userProfile) return false;
    if (isSuperAdmin) return true;
    if (!isActive) return false;
    const perms = Array.isArray(userProfile.permissions) ? userProfile.permissions : [];
    return perms.includes(permissionId);
  };

  const value = {
    currentUser,
    userProfile,
    role: rawRole,
    isAdmin,
    isSuperAdmin,
    isStudent,
    isActive,
    permissions: isSuperAdmin ? ALL_PERMISSION_IDS : (userProfile?.permissions || []),
    hasPermission,
    loading,
    login,
    register,
    logout,
    refreshProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
