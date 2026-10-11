import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "../../services/firebase/config";
import { getUserNotifications } from "../../services/firebase/notificationService";
import {
  Menu,
  Search,
  Bell,
  Maximize2,
  Minimize2,
  ChevronDown,
  User,
  Settings,
  ScrollText,
  LogOut,
  X,
  FileText,
  HelpCircle,
  Award,
  Users,
  CheckCircle2
} from "lucide-react";

export default function AdminHeader({ onToggleMobileSidebar }) {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const searchInputRef = useRef(null);

  // Keyboard shortcut Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Global Multi-Resource Search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const handler = setTimeout(async () => {
      try {
        const qLower = searchQuery.toLowerCase();
        const results = [];

        // 1. Search Tests
        const testsSnap = await getDocs(query(collection(db, "tests"), limit(20)));
        testsSnap.docs.forEach((d) => {
          const t = d.data();
          if (
            t.title?.toLowerCase().includes(qLower) ||
            t.subject?.toLowerCase().includes(qLower)
          ) {
            results.push({
              id: d.id,
              type: "exam",
              title: t.title,
              subtitle: `Exam • ${t.subject || "General"}`,
              link: `/admin/tests`
            });
          }
        });

        // 2. Search Students
        const usersSnap = await getDocs(query(collection(db, "users"), limit(20)));
        usersSnap.docs.forEach((d) => {
          const u = d.data();
          if (
            u.fullName?.toLowerCase().includes(qLower) ||
            u.email?.toLowerCase().includes(qLower) ||
            u.rollNumber?.toLowerCase().includes(qLower)
          ) {
            results.push({
              id: d.id,
              type: "student",
              title: u.fullName || u.email,
              subtitle: `Student • ${u.email}`,
              link: `/admin/students`
            });
          }
        });

        // 3. Search Questions
        const qSnap = await getDocs(query(collection(db, "questions"), limit(20)));
        qSnap.docs.forEach((d) => {
          const qu = d.data();
          if (
            qu.questionText?.toLowerCase().includes(qLower) ||
            qu.subject?.toLowerCase().includes(qLower) ||
            qu.topic?.toLowerCase().includes(qLower)
          ) {
            results.push({
              id: d.id,
              type: "question",
              title: qu.questionText?.slice(0, 50) + "...",
              subtitle: `Question • ${qu.subject} - ${qu.topic || "General"}`,
              link: `/admin/questions`
            });
          }
        });

        setSearchResults(results.slice(0, 6));
        setIsSearching(false);
        setSearchOpen(true);
      } catch (err) {
        console.error("Search failed:", err);
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn("Fullscreen request error:", err);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const adminName = userProfile?.fullName || currentUser?.displayName || "Admin";
  const adminEmail = currentUser?.email || userProfile?.email || "";

  useEffect(() => {
    async function loadNotifs() {
      if (!currentUser) return;
      try {
        const notifs = await getUserNotifications(currentUser.uid);
        setNotifications(notifs || []);
      } catch (err) {
        console.error("Failed to load admin notifications:", err);
      }
    }
    loadNotifs();
  }, [currentUser]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="h-18 bg-white border-b border-[#E5EAF2] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Left: Mobile Sidebar Trigger & Global Search */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xl">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-[#64748B] hover:text-[#172B4D] hover:bg-[#F6F8FC] transition-colors"
          aria-label="Open Navigation Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div ref={searchRef} className="relative w-full">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchQuery.trim()) setSearchOpen(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") setSearchOpen(false);
              }}
              placeholder="Search students, exams, questions or results..."
              className="w-full bg-[#F6F8FC] border border-transparent focus:border-[#2563EB] focus:bg-white rounded-xl pl-10 pr-16 py-2 text-xs font-medium text-[#172B4D] placeholder-[#94A3B8] outline-none transition-all shadow-inner/5"
            />
            {searchQuery ? (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSearchOpen(false);
                }}
                className="absolute right-3 text-[#94A3B8] hover:text-[#172B4D]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-0.5 absolute right-2.5 px-1.5 py-0.5 rounded-md bg-white border border-[#E2E8F0] text-[10px] font-bold text-[#94A3B8] pointer-events-none shadow-2xs">
                Ctrl + K
              </span>
            )}
          </div>

          {/* Search Dropdown Results */}
          {searchOpen && (
            <div className="absolute left-0 right-0 mt-2 bg-white border border-[#E5EAF2] rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-2.5 border-b border-[#F1F5F9] text-[11px] font-bold text-[#64748B] flex items-center justify-between">
                <span>Matching Resources</span>
                {isSearching && (
                  <span className="text-[10px] text-[#2563EB]">Searching...</span>
                )}
              </div>

              {searchResults.length > 0 ? (
                <div className="divide-y divide-[#F8FAFC]">
                  {searchResults.map((item) => {
                    const TypeIcon =
                      item.type === "exam"
                        ? FileText
                        : item.type === "student"
                        ? Users
                        : item.type === "question"
                        ? HelpCircle
                        : Award;

                    return (
                      <button
                        key={`${item.type}-${item.id}`}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery("");
                          navigate(item.link);
                        }}
                        className="w-full p-3 text-left hover:bg-[#F6F8FC] flex items-center gap-3 transition-colors group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                          <TypeIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[#172B4D] group-hover:text-[#2563EB] truncate">
                            {item.title}
                          </p>
                          <p className="text-[10px] text-[#64748B] truncate">
                            {item.subtitle}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : searchQuery && !isSearching ? (
                <div className="p-6 text-center text-xs text-[#64748B]">
                  No matching records found for "{searchQuery}".
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* Right Controls: Notifications, Fullscreen, Admin Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notifications Button */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-xl text-[#64748B] hover:text-[#172B4D] hover:bg-[#F6F8FC] transition-colors relative"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#DC2626] text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E5EAF2] rounded-2xl shadow-xl overflow-hidden z-50">
              <div className="p-3 border-b border-[#F1F5F9] flex items-center justify-between">
                <span className="text-xs font-bold text-[#172B4D]">
                  System Notifications
                </span>
                <span className="text-[10px] font-bold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded-full">
                  {unreadCount} New
                </span>
              </div>
              <div className="divide-y divide-[#F8FAFC] max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-[#64748B]">
                    No system notifications.
                  </div>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      className="p-3 hover:bg-[#F6F8FC] transition-colors flex items-start gap-2.5 cursor-pointer"
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                          !n.isRead ? "bg-[#2563EB]" : "bg-[#CBD5E1]"
                        }`}
                      />
                      <div>
                        <p className="text-xs font-semibold text-[#172B4D] leading-tight">
                          {n.title}
                        </p>
                        <p className="text-[10px] text-[#94A3B8] mt-1">
                          {n.createdAt?.toMillis
                            ? new Date(n.createdAt.toMillis()).toLocaleDateString("en-GB")
                            : "Recent"}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-2 border-t border-[#F1F5F9] bg-[#F8FAFC] text-center">
                <Link
                  to="/admin/notifications"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-xs font-bold text-[#2563EB] hover:underline"
                >
                  View All Announcements &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="hidden sm:flex p-2 rounded-xl text-[#64748B] hover:text-[#172B4D] hover:bg-[#F6F8FC] transition-colors"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          aria-label="Toggle Fullscreen"
        >
          {isFullscreen ? (
            <Minimize2 className="w-4.5 h-4.5" />
          ) : (
            <Maximize2 className="w-4.5 h-4.5" />
          )}
        </button>

        {/* Admin Profile Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-1.5 sm:px-2 sm:py-1 rounded-xl hover:bg-[#F6F8FC] border border-transparent hover:border-[#E5EAF2] transition-colors"
          >
            <img
              src="/images/admin/admin-avatar-header.jpg"
              alt={adminName}
              className="w-8 h-8 rounded-full object-cover border border-[#BFDBFE] shrink-0"
              onError={(e) => {
                e.currentTarget.src = "/images/landing/avatar-arjun.jpg";
              }}
            />
            <div className="hidden md:block text-left leading-tight">
              <span className="text-xs font-bold text-[#172B4D] block truncate">
                {adminName}
              </span>
              <span className="text-[10px] text-[#64748B] block truncate max-w-[130px]">
                {adminEmail}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
          </button>

          {/* Profile Dropdown Menu */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-[#E5EAF2] rounded-2xl shadow-xl overflow-hidden z-50">
              <div className="p-3 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                <p className="text-xs font-bold text-[#172B4D]">{adminName}</p>
                <p className="text-[10px] text-[#64748B] truncate">{adminEmail}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] text-[9px] font-black uppercase">
                  Super Admin
                </span>
              </div>
              <div className="p-1 space-y-0.5">
                <Link
                  to="/admin/settings"
                  onClick={() => setProfileOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#172B4D] hover:bg-[#F6F8FC] rounded-xl transition-colors"
                >
                  <Settings className="w-4 h-4 text-[#64748B]" />
                  <span>Platform Settings</span>
                </Link>
                <Link
                  to="/admin/audit-logs"
                  onClick={() => setProfileOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#172B4D] hover:bg-[#F6F8FC] rounded-xl transition-colors"
                >
                  <ScrollText className="w-4 h-4 text-[#64748B]" />
                  <span>Audit Logs</span>
                </Link>
              </div>
              <div className="p-1 border-t border-[#F1F5F9]">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#DC2626] hover:bg-[#FEF2F2] rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
