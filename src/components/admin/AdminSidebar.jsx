import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  GraduationCap,
  LayoutDashboard,
  HelpCircle,
  FolderKanban,
  FileText,
  Calendar,
  Activity,
  Award,
  Users,
  ShieldCheck,
  BarChart3,
  FileSpreadsheet,
  Bell,
  Settings,
  ScrollText,
  LifeBuoy,
  LogOut,
  ChevronRight,
  ArrowRight,
  X
} from "lucide-react";

export default function AdminSidebar({ onCloseMobile }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, userProfile, isSuperAdmin, hasPermission, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const navItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard, permission: "dashboard.view" },
    { label: "Question Bank", path: "/admin/questions", icon: HelpCircle, permission: "questions.view" },
    { label: "Question Sets", path: "/admin/question-sets", icon: FolderKanban, permission: "sets.view" },
    { label: "Exam Management", path: "/admin/exams", icon: FileText, altPath: "/admin/tests", permission: "exams.view" },
    { label: "Exam Schedule", path: "/admin/exam-schedule", icon: Calendar, permission: "exams.view" },
    { label: "Live Attempts", path: "/admin/live-attempts", icon: Activity, altPath: "/admin/attempts", permission: "attempts.view" },
    { label: "Results & Evaluation", path: "/admin/results", icon: Award, permission: "results.view" },
    { label: "Students", path: "/admin/students", icon: Users, permission: "students.view" },
    { label: "Admin Users & Roles", path: "/admin/admin-users", icon: ShieldCheck, permission: "admins.manage" },
    { label: "Analytics", path: "/admin/analytics", icon: BarChart3, permission: "analytics.view" },
    { label: "Reports & Exports", path: "/admin/reports", icon: FileSpreadsheet, permission: "reports.export" },
    { label: "Notifications", path: "/admin/notifications", icon: Bell, permission: "notifications.manage" },
    { label: "Platform Settings", path: "/admin/settings", icon: Settings, permission: "settings.manage" },
    { label: "Audit Logs", path: "/admin/audit-logs", icon: ScrollText, permission: "auditLogs.view" },
    { label: "Help & Support", path: "/admin/help", icon: LifeBuoy }
  ];

  const visibleNavItems = navItems.filter((item) => !item.permission || hasPermission(item.permission));

  const adminName = userProfile?.fullName || currentUser?.displayName || (isSuperAdmin ? "Super Admin" : "Admin");
  const adminEmail = currentUser?.email || userProfile?.email || "";

  return (
    <aside className="w-full h-full bg-white border-r border-[#E5EAF2] flex flex-col select-none overflow-y-auto">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#F1F5F9] flex items-center justify-between shrink-0">
        <div>
          <Link
            to="/admin/dashboard"
            onClick={onCloseMobile}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-xs group-hover:bg-[#1D4ED8] transition-colors">
              <GraduationCap className="w-5 h-5 fill-current" />
            </div>
            <span className="font-black text-lg tracking-tight text-[#172B4D]">
              QuizMaster
            </span>
          </Link>
          <div className="mt-1">
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black tracking-wide uppercase border ${
                isSuperAdmin
                  ? "bg-[#FEF3C7] border-[#FDE68A] text-[#B45309]"
                  : "bg-[#EFF6FF] border-[#BFDBFE] text-[#2563EB]"
              }`}
            >
              {isSuperAdmin ? "Super Admin" : "Admin Panel"}
            </span>
          </div>
        </div>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#172B4D] hover:bg-[#F6F8FC] lg:hidden"
            aria-label="Close navigation sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {visibleNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.path ||
            (item.altPath && location.pathname.startsWith(item.altPath)) ||
            location.pathname.startsWith(`${item.path}/`);

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? "bg-[#2563EB] text-white shadow-xs"
                  : "text-[#64748B] hover:bg-[#F6F8FC] hover:text-[#172B4D]"
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? "text-white" : "text-[#94A3B8] group-hover:text-[#2563EB]"
                }`}
              />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Promotional Card at Bottom */}
      <div className="p-3 shrink-0">
        <div className="relative rounded-2xl bg-gradient-to-br from-[#EBF2FE] to-[#F1F6FF] border border-[#D9E6FC] p-3.5 overflow-hidden shadow-2xs">
          <div className="relative z-10 max-w-[140px]">
            <h4 className="text-[11px] font-black text-[#172B4D] leading-tight mb-2">
              Build Better Exams for a Brighter Future
            </h4>
            <Link
              to="/admin/tests/create"
              onClick={onCloseMobile}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[10px] font-bold shadow-2xs transition-all"
            >
              <span>Create New Exam</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </Link>
          </div>

          <img
            src="/images/admin/admin-promo-char.png"
            alt="Admin illustration"
            className="absolute right-0 bottom-0 w-16 h-18 object-contain object-bottom pointer-events-none opacity-90"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      </div>

      {/* Admin Profile Pill & Logout */}
      <div className="p-3 border-t border-[#F1F5F9] shrink-0 space-y-2">
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#F6F8FC] border border-[#E5EAF2]">
          <div className="w-8 h-8 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] flex items-center justify-center font-bold text-xs shrink-0">
            {adminName.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[#172B4D] truncate leading-tight">
              {adminName}
            </p>
            <p className="text-[10px] text-[#64748B] font-medium truncate">
              {isSuperAdmin ? "Super Administrator" : (userProfile?.roleTitle || "Administrator")}
            </p>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#DC2626] hover:bg-[#FEF2F2] transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
