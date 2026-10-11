import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute, AdminRoute, PermissionRoute } from "./ProtectedRoute";

// Route Loading Spinner
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
      <div className="w-10 h-10 border-4 border-[#2563EB]/20 border-t-[#2563EB] rounded-full animate-spin mb-4" />
      <p className="text-xs font-semibold text-[#64748B] tracking-wide animate-pulse">Loading QuizMaster...</p>
    </div>
  );
}

// Layouts
const AdminLayout = lazy(() => import("../layouts/AdminLayout"));
const StudentLayout = lazy(() => import("../layouts/StudentLayout"));

// Public Pages
const LandingPage = lazy(() => import("../pages/public/LandingPage"));
const LoginPage = lazy(() => import("../pages/public/LoginPage"));
const RegisterPage = lazy(() => import("../pages/public/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("../pages/public/ForgotPasswordPage"));

// Student Pages
const StudentDashboard = lazy(() => import("../pages/student/StudentDashboard"));
const AvailableExams = lazy(() => import("../pages/student/AvailableExams"));
const ExamInstructions = lazy(() => import("../pages/student/ExamInstructions"));
const ExamLivePage = lazy(() => import("../pages/student/ExamLivePage"));
const StudentResults = lazy(() => import("../pages/student/StudentResults"));
const StudentResultDetail = lazy(() => import("../pages/student/StudentResultDetail"));
const StudentProfile = lazy(() => import("../pages/student/StudentProfile"));
const StudentNotifications = lazy(() => import("../pages/student/StudentNotifications"));
const StudentAnalytics = lazy(() => import("../pages/student/StudentAnalytics"));
const StudentHistory = lazy(() => import("../pages/student/StudentHistory"));
const StudentBookmarks = lazy(() => import("../pages/student/StudentBookmarks"));
const StudentSettings = lazy(() => import("../pages/student/StudentSettings"));
const StudentHelp = lazy(() => import("../pages/student/StudentHelp"));
const StudentActiveAttempts = lazy(() => import("../pages/student/StudentActiveAttempts"));

// Admin Pages
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const QuestionBank = lazy(() => import("../pages/admin/QuestionBank"));
const QuestionSetManagement = lazy(() => import("../pages/admin/QuestionSetManagement"));
const TestManagement = lazy(() => import("../pages/admin/TestManagement"));
const TestCreateWizard = lazy(() => import("../pages/admin/TestCreateWizard"));
const ExamSchedule = lazy(() => import("../pages/admin/ExamSchedule"));
const LiveAttemptsMonitor = lazy(() => import("../pages/admin/LiveAttemptsMonitor"));
const StudentManagement = lazy(() => import("../pages/admin/StudentManagement"));
const AdminUsers = lazy(() => import("../pages/admin/AdminUsers"));
const AdminResults = lazy(() => import("../pages/admin/AdminResults"));
const AdminResultDetail = lazy(() => import("../pages/admin/AdminResultDetail"));
const AdminAnalytics = lazy(() => import("../pages/admin/AdminAnalytics"));
const ReportsExports = lazy(() => import("../pages/admin/ReportsExports"));
const AdminNotifications = lazy(() => import("../pages/admin/AdminNotifications"));
const AdminSettings = lazy(() => import("../pages/admin/AdminSettings"));
const AuditLogs = lazy(() => import("../pages/admin/AuditLogs"));
const AdminHelp = lazy(() => import("../pages/admin/AdminHelp"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Live Exam Page (Distraction-free, protected) */}
      <Route
        path="/student/attempts/:attemptId"
        element={
          <ProtectedRoute>
            <ExamLivePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/exams/:examId/attempt/:attemptId"
        element={
          <ProtectedRoute>
            <ExamLivePage />
          </ProtectedRoute>
        }
      />

      {/* Student Portal Routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="exams" element={<AvailableExams />} />
        <Route path="my-exams" element={<AvailableExams />} />
        <Route path="active-attempts" element={<StudentActiveAttempts />} />
        <Route path="exams/:testId/instructions" element={<ExamInstructions />} />
        <Route path="results" element={<StudentResults />} />
        <Route path="results/:resultId" element={<StudentResultDetail />} />
        <Route path="analytics" element={<StudentAnalytics />} />
        <Route path="history" element={<StudentHistory />} />
        <Route path="bookmarks" element={<StudentBookmarks />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="settings" element={<StudentSettings />} />
        <Route path="help" element={<StudentHelp />} />
        <Route path="notifications" element={<StudentNotifications />} />
      </Route>

      {/* Admin Console Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route
          path="questions"
          element={
            <PermissionRoute permission="questions.view">
              <QuestionBank />
            </PermissionRoute>
          }
        />
        <Route
          path="question-sets"
          element={
            <PermissionRoute permission="sets.view">
              <QuestionSetManagement />
            </PermissionRoute>
          }
        />
        <Route
          path="exams"
          element={
            <PermissionRoute permission="exams.view">
              <TestManagement />
            </PermissionRoute>
          }
        />
        <Route
          path="tests"
          element={
            <PermissionRoute permission="exams.view">
              <TestManagement />
            </PermissionRoute>
          }
        />
        <Route
          path="tests/create"
          element={
            <PermissionRoute permission="exams.create">
              <TestCreateWizard />
            </PermissionRoute>
          }
        />
        <Route
          path="exam-schedule"
          element={
            <PermissionRoute permission="exams.view">
              <ExamSchedule />
            </PermissionRoute>
          }
        />
        <Route
          path="live-attempts"
          element={
            <PermissionRoute permission="attempts.view">
              <LiveAttemptsMonitor />
            </PermissionRoute>
          }
        />
        <Route
          path="attempts"
          element={
            <PermissionRoute permission="attempts.view">
              <LiveAttemptsMonitor />
            </PermissionRoute>
          }
        />
        <Route
          path="students"
          element={
            <PermissionRoute permission="students.view">
              <StudentManagement />
            </PermissionRoute>
          }
        />
        <Route
          path="admin-users"
          element={
            <PermissionRoute permission="admins.manage">
              <AdminUsers />
            </PermissionRoute>
          }
        />
        <Route
          path="results"
          element={
            <PermissionRoute permission="results.view">
              <AdminResults />
            </PermissionRoute>
          }
        />
        <Route
          path="results/:resultId"
          element={
            <PermissionRoute permission="results.view">
              <AdminResultDetail />
            </PermissionRoute>
          }
        />
        <Route
          path="analytics"
          element={
            <PermissionRoute permission="analytics.view">
              <AdminAnalytics />
            </PermissionRoute>
          }
        />
        <Route
          path="reports"
          element={
            <PermissionRoute permission="reports.export">
              <ReportsExports />
            </PermissionRoute>
          }
        />
        <Route
          path="notifications"
          element={
            <PermissionRoute permission="notifications.manage">
              <AdminNotifications />
            </PermissionRoute>
          }
        />
        <Route
          path="settings"
          element={
            <PermissionRoute permission="settings.manage">
              <AdminSettings />
            </PermissionRoute>
          }
        />
        <Route
          path="audit-logs"
          element={
            <PermissionRoute permission="auditLogs.view">
              <AuditLogs />
            </PermissionRoute>
          }
        />
        <Route path="help" element={<AdminHelp />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Suspense>
  );
}
