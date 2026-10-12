import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getUserNotifications } from "../../services/firebase/notificationService";
import {
  GraduationCap,
  LayoutGrid,
  Compass,
  FileCheck2,
  Clock,
  Award,
  BarChart2,
  History,
  Bookmark,
  Bell,
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  ArrowRight,
  BookOpen
} from "lucide-react";

export default function StudentSidebar({ onCloseMobile }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, userProfile, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    async function loadNotifCount() {
      if (!currentUser?.uid) return;
      try {
        const notifs = await getUserNotifications(currentUser.uid);
        const unread = notifs.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error("Failed to load notifications count in sidebar:", err);
      }
    }
    loadNotifCount();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navItems = [
    { label: "Dashboard", path: "/student/dashboard", icon: LayoutGrid },
    { label: "Explore Exams", path: "/student/exams", icon: Compass },
    { label: "My Exams", path: "/student/my-exams", icon: BookOpen },
    { label: "Active Attempts", path: "/student/active-attempts", icon: Clock },
    { label: "Results & Scorecards", path: "/student/results", icon: Award },
    { label: "Performance Analytics", path: "/student/analytics", icon: BarChart2 },
    { label: "Practice History", path: "/student/history", icon: History },
    { label: "Bookmarks & Review", path: "/student/bookmarks", icon: Bookmark }
  ];

  const accountItems = [
    { label: "Notifications", path: "/student/notifications", icon: Bell, badge: unreadCount > 0 ? (unreadCount > 9 ? "9+" : unreadCount) : null },
    { label: "My Profile", path: "/student/profile", icon: User },
    { label: "Settings", path: "/student/settings", icon: Settings },
    { label: "Help & Support", path: "/student/help", icon: HelpCircle }
  ];

  const displayName = userProfile?.fullName || currentUser?.displayName || currentUser?.email?.split("@")[0] || "Student";
  const studentSubtitle = userProfile?.class || userProfile?.course || (userProfile?.normalizedRollNumber ? `Roll: ${userProfile.normalizedRollNumber}` : "Registered Student");
  const userInitials = displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "S";

  return (
    <aside className="w-60 bg-white border-r border-[#E5ECF5] flex flex-col h-full min-h-screen select-none">
      {/* Brand Header */}
      <div className="h-18 px-6 flex items-center border-b border-[#E5ECF5]/60 shrink-0">
        <Link to="/student/dashboard" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#0866F5] flex items-center justify-center text-white shadow-xs">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="text-xl font-black tracking-tight text-[#111A36]">
            QuizMaster
          </span>
        </Link>
      </div>

      {/* Navigation Scrollable Body */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 scrollbar-none">
        {/* Main Navigation Group */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/student/dashboard" && location.pathname.startsWith(item.path + "/"));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-[#0866F5] text-white shadow-xs"
                    : "text-[#17233F] hover:bg-[#F3F7FD] hover:text-[#0866F5]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-[#64748B]"}`} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Account Section Divider & Navigation */}
        <div className="space-y-1 pt-2">
          <div className="px-3.5 pb-2 text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
            Account
          </div>
          {accountItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-[#0866F5] text-white shadow-xs"
                    : "text-[#17233F] hover:bg-[#F3F7FD] hover:text-[#0866F5]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-[#64748B]"}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center ${
                      isActive ? "bg-white text-[#0866F5]" : "bg-[#EF4444] text-white"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Keep Practicing Motivational Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#EAF2FF] to-[#DBEAFE] p-4 border border-[#BFDBFE]/60 shadow-2xs">
          <p className="text-[11px] font-black text-[#111A36] leading-tight">
            Keep Practicing
          </p>
          <p className="text-[11px] font-extrabold text-[#0866F5] mt-0.5">
            Achieve Your Goals
          </p>

          <div className="flex items-end justify-between mt-3">
            <Link
              to="/student/exams"
              onClick={onCloseMobile}
              className="w-8 h-8 rounded-full bg-[#0866F5] hover:bg-[#0754D1] text-white flex items-center justify-center transition-all shadow-xs"
              aria-label="Explore Exams"
            >
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Clean Student Studying SVG Graphic */}
            <div className="w-16 h-14 shrink-0 flex items-end justify-end">
              <svg viewBox="0 0 80 70" className="w-full h-full fill-none">
                <circle cx="50" cy="22" r="12" fill="#0866F5" opacity="0.9" />
                <path d="M35 48 C35 34 65 34 65 48 Z" fill="#111A36" />
                <path d="M25 55 L50 62 L75 55 L50 50 Z" fill="#F59E0B" />
                <rect x="42" y="46" width="16" height="18" rx="2" fill="#FFFFFF" stroke="#0866F5" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom User Profile Row & Log Out */}
      <div className="p-4 border-t border-[#E5ECF5] bg-white space-y-2 shrink-0">
        <Link
          to="/student/profile"
          onClick={onCloseMobile}
          className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F3F7FD] transition-colors group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {userProfile?.photoURL || currentUser?.photoURL ? (
              <img
                src={userProfile?.photoURL || currentUser?.photoURL}
                alt={displayName}
                className="w-9 h-9 rounded-full object-cover border border-[#E5ECF5]"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#0866F5] text-white flex items-center justify-center text-xs font-black shadow-2xs shrink-0">
                {userInitials}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-black text-[#111A36] truncate leading-tight group-hover:text-[#0866F5]">
                {displayName}
              </p>
              <p className="text-[10px] font-semibold text-[#64748B] truncate mt-0.5">
                {studentSubtitle}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#94A3B8] shrink-0 group-hover:text-[#0866F5]" />
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[#64748B] hover:text-[#EF4444] hover:bg-[#FEE2E2]/40 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
