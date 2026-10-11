import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getStudentAvailableTests } from "../../services/firebase/testService";
import { getUserNotifications } from "../../services/firebase/notificationService";
import {
  Search,
  Bell,
  Menu,
  ChevronDown,
  User,
  Settings,
  HelpCircle,
  LogOut,
  X,
  BookOpen
} from "lucide-react";

export default function StudentHeader({ onToggleMobileSidebar }) {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [allTests, setAllTests] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const searchRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    async function loadTestsForSearch() {
      try {
        const tests = await getStudentAvailableTests();
        setAllTests(tests || []);
      } catch (err) {
        console.error("Failed to load tests for search:", err);
      }
    }
    loadTestsForSearch();
  }, []);

  useEffect(() => {
    async function loadNotificationsCount() {
      if (!currentUser?.uid) return;
      try {
        const notifs = await getUserNotifications(currentUser.uid);
        const unread = notifs.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error("Failed to load notification count:", err);
      }
    }
    loadNotificationsCount();
  }, [currentUser]);

  // Handle Search Input
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const handler = setTimeout(() => {
      const q = searchQuery.toLowerCase();
      const filtered = allTests.filter(
        (t) =>
          t.title?.toLowerCase().includes(q) ||
          t.subject?.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q)
      );
      setSearchResults(filtered.slice(0, 5));
      setIsSearching(false);
      setSearchOpen(true);
    }, 200);

    return () => clearTimeout(handler);
  }, [searchQuery, allTests]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const displayName = userProfile?.fullName || currentUser?.displayName || currentUser?.email?.split("@")[0] || "Student";
  const userInitials = displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "S";

  return (
    <header className="h-18 bg-white border-b border-[#E5ECF5] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Left: Mobile Sidebar Trigger & Search Bar */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xl">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-[#64748B] hover:text-[#111A36] hover:bg-[#F3F7FD] transition-colors"
          aria-label="Open Navigation Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Field */}
        <div ref={searchRef} className="relative w-full">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchQuery.trim()) setSearchOpen(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") setSearchOpen(false);
              }}
              placeholder="Search exams, subjects or topics..."
              className="w-full bg-[#F3F7FD] border border-transparent focus:border-[#0866F5] focus:bg-white rounded-xl pl-10 pr-9 py-2 text-xs font-medium text-[#111A36] placeholder-[#94A3B8] outline-none transition-all shadow-inner/5"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSearchOpen(false);
                }}
                className="absolute right-3 text-[#94A3B8] hover:text-[#111A36]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Dropdown Results */}
          {searchOpen && (
            <div className="absolute left-0 right-0 mt-2 bg-white border border-[#E5ECF5] rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-2 border-b border-[#F1F5F9] text-[11px] font-bold text-[#64748B] flex items-center justify-between">
                <span>Matching Examinations</span>
                {isSearching && <span className="text-[10px] text-[#0866F5]">Searching...</span>}
              </div>

              {searchResults.length > 0 ? (
                <div className="divide-y divide-[#F8FAFC]">
                  {searchResults.map((test) => (
                    <button
                      key={test.id}
                      onClick={() => {
                        setSearchOpen(false);
                        navigate(`/student/exams/${test.id}/instructions`);
                      }}
                      className="w-full text-left p-3 hover:bg-[#F3F7FD] flex items-center justify-between transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#EAF2FF] text-[#0866F5] flex items-center justify-center shrink-0">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#111A36] group-hover:text-[#0866F5]">
                            {test.title}
                          </p>
                          <p className="text-[10px] text-[#64748B]">
                            {test.subject || "General"} &bull; {test.maximumMarks || 0} Marks
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-[#0866F5] bg-[#EAF2FF] px-2 py-0.5 rounded-full">
                        View
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-[#64748B]">
                  No exams found matching "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right: Notifications & Profile Menu */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Notification Bell */}
        <Link
          to="/student/notifications"
          className="relative p-2 rounded-xl text-[#64748B] hover:text-[#0866F5] hover:bg-[#F3F7FD] transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-[#EF4444] text-white text-[9px] font-black flex items-center justify-center border-2 border-white shadow-2xs">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>

        {/* Profile Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-[#F3F7FD] transition-colors cursor-pointer"
            aria-label="User Profile Menu"
          >
            {userProfile?.photoURL || currentUser?.photoURL ? (
              <img
                src={userProfile?.photoURL || currentUser?.photoURL}
                alt={displayName}
                className="w-8 h-8 rounded-full object-cover border border-[#E5ECF5]"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#0866F5] text-white flex items-center justify-center text-xs font-black shadow-2xs">
                {userInitials}
              </div>
            )}
            <span className="text-xs font-bold text-[#111A36] hidden sm:inline-block">
              {displayName}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-[#E5ECF5] rounded-2xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2.5 border-b border-[#F1F5F9]">
                <p className="text-xs font-bold text-[#111A36] truncate">{displayName}</p>
                <p className="text-[10px] text-[#64748B] truncate">{currentUser?.email}</p>
              </div>

              <div className="py-1">
                <Link
                  to="/student/profile"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#17233F] hover:bg-[#F3F7FD] hover:text-[#0866F5] transition-colors"
                >
                  <User className="w-4 h-4 text-[#64748B]" />
                  <span>My Profile</span>
                </Link>

                <Link
                  to="/student/settings"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#17233F] hover:bg-[#F3F7FD] hover:text-[#0866F5] transition-colors"
                >
                  <Settings className="w-4 h-4 text-[#64748B]" />
                  <span>Settings</span>
                </Link>

                <Link
                  to="/student/help"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#17233F] hover:bg-[#F3F7FD] hover:text-[#0866F5] transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-[#64748B]" />
                  <span>Help & Support</span>
                </Link>
              </div>

              <div className="border-t border-[#F1F5F9] pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[#EF4444] hover:bg-[#FEE2E2]/40 transition-colors cursor-pointer"
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
