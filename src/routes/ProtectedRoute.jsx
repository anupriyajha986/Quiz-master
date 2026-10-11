import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

function RouteLoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin mb-3" />
      <p className="text-xs font-semibold text-[#64748B] tracking-wide">
        Verifying authorization...
      </p>
    </div>
  );
}

/**
 * Basic authentication guard
 */
export function ProtectedRoute({ children }) {
  const { currentUser, isActive, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <RouteLoadingScreen />;
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isActive) {
    return (
      <Navigate
        to="/login"
        state={{ error: "This account has been deactivated. Please contact an administrator." }}
        replace
      />
    );
  }

  return children;
}

/**
 * Strict Administrator route guard
 * Allows super_admin, admin, manager, evaluator
 * Redirects students to /student/dashboard
 */
export function AdminRoute({ children }) {
  const { currentUser, isAdmin, isStudent, isActive, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <RouteLoadingScreen />;
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isActive) {
    return (
      <Navigate
        to="/login"
        state={{ error: "This account has been deactivated. Please contact an administrator." }}
        replace
      />
    );
  }

  if (!isAdmin) {
    if (isStudent) {
      return <Navigate to="/student/dashboard" replace />;
    }
    return (
      <Navigate
        to="/login"
        state={{ error: "Unauthorized access: Administrator role required." }}
        replace
      />
    );
  }

  return children;
}

/**
 * Strict Student route guard
 * Allows only authorized active students
 * Automatically redirects Admins to /admin/dashboard
 */
export function StudentRoute({ children }) {
  const { currentUser, isStudent, isAdmin, isActive, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <RouteLoadingScreen />;
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isActive) {
    return (
      <Navigate
        to="/login"
        state={{ error: "This account has been deactivated. Please contact an administrator." }}
        replace
      />
    );
  }

  // If an administrator accesses student routes, guide them to Admin Console
  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (!isStudent) {
    return (
      <Navigate
        to="/login"
        state={{ error: "Access denied: Student account required." }}
        replace
      />
    );
  }

  return children;
}

/**
 * Fine-grained RBAC permission guard within Admin console
 */
export function PermissionRoute({ permission, children }) {
  const { currentUser, isAdmin, hasPermission, isActive, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <RouteLoadingScreen />;
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isActive) {
    return (
      <Navigate
        to="/login"
        state={{ error: "This account has been deactivated. Please contact an administrator." }}
        replace
      />
    );
  }

  if (!isAdmin) {
    return <Navigate to="/student/dashboard" replace />;
  }

  if (permission && !hasPermission(permission)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}
