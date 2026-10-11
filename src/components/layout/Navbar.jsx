import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  GraduationCap,
  Bell,
  LogOut,
  User,
  Shield,
  Menu,
  X,
  ChevronDown
} from "lucide-react";

export default function Navbar({ onToggleSidebar, showMenuButton = false }) {
  const { currentUser, userProfile, isAdmin, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E2E8F0] shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand & Mobile Sidebar Toggle */}
        <div className="flex items-center gap-3">
          {showMenuButton && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-[#64748B] hover:text-[#111827] hover:bg-[#F8FAFC] transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-[#111827] leading-none">
                QuizMaster
              </span>
              <span className="text-[10px] font-semibold text-[#64748B] tracking-wider uppercase mt-0.5">
                Examination Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Right: Actions and User */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <>
              {/* Notifications Link */}
              <Link
                to={isAdmin ? "/admin/notifications" : "/student/notifications"}
                className="relative p-2 rounded-xl text-[#64748B] hover:text-[#111827] hover:bg-[#F8FAFC] transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
              </Link>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-3 rounded-xl hover:bg-[#F8FAFC] border border-transparent hover:border-[#E2E8F0] transition-all"
                >
                  <div className="flex flex-col text-right hidden sm:flex">
                    <span className="text-xs font-bold text-[#111827] leading-none">
                      {userProfile?.fullName || currentUser.email?.split("@")[0]}
                    </span>
                    <span className="text-[10px] font-semibold text-[#64748B] uppercase mt-0.5">
                      {isAdmin ? "Administrator" : "Student"}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] flex items-center justify-center font-bold text-xs">
                    {userProfile?.fullName?.[0]?.toUpperCase() || "U"}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
                </button>

                {dropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E2E8F0] rounded-2xl shadow-lg py-1.5 z-50">
                      <div className="px-4 py-2.5 border-b border-[#E2E8F0]">
                        <p className="text-xs text-[#64748B]">Signed in as</p>
                        <p className="text-xs font-bold text-[#111827] truncate mt-0.5">
                          {currentUser.email}
                        </p>
                      </div>

                      {isAdmin ? (
                        <>
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#111827] hover:bg-[#F8FAFC]"
                          >
                            <Shield className="w-4 h-4 text-[#2563EB]" />
                            Admin Console
                          </Link>
                          <Link
                            to="/admin/settings"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#111827] hover:bg-[#F8FAFC]"
                          >
                            <User className="w-4 h-4 text-[#64748B]" />
                            System Settings
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/student/dashboard"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#111827] hover:bg-[#F8FAFC]"
                          >
                            <GraduationCap className="w-4 h-4 text-[#2563EB]" />
                            Student Dashboard
                          </Link>
                          <Link
                            to="/student/profile"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#111827] hover:bg-[#F8FAFC]"
                          >
                            <User className="w-4 h-4 text-[#64748B]" />
                            Profile & Details
                          </Link>
                        </>
                      )}

                      <div className="border-t border-[#E2E8F0] my-1" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#DC2626] hover:bg-[#FEF2F2] transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs font-bold text-[#111827] hover:text-[#2563EB] px-3 py-2 rounded-xl transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-xs font-bold bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-3.5 py-2 rounded-xl transition-colors shadow-2xs"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
