import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAdminDashboardStats } from "../../services/firebase/analyticsService";
import { useAuth } from "../../context/AuthContext";
import {
  Users,
  FileText,
  HelpCircle,
  Play,
  CheckCircle2,
  BarChart2,
  TrendingUp,
  TrendingDown,
  Calendar,
  Target,
  Plus,
  Upload,
  UserCheck,
  Award,
  ChevronDown,
  MoreHorizontal,
  ArrowRight,
  Clock,
  Eye,
  CheckCircle,
  AlertCircle,
  FileSpreadsheet,
  ShieldCheck,
  Layers,
  BookOpen
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30days");
  const [analyticsDateRange, setAnalyticsDateRange] = useState("7days");
  const [actionMenuOpenId, setActionMenuOpenId] = useState(null);

  const { userProfile, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getAdminDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to load admin stats:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const adminName = userProfile?.fullName || currentUser?.displayName || "Admin";

  const chartData = stats?.activityData?.[dateRange] || [];

  const studentPerformance = stats?.studentPerformance || [
    { name: "Excellent (80-100%)", value: 0, color: "#16A34A" },
    { name: "Good (60-80%)", value: 0, color: "#2563EB" },
    { name: "Average (40-60%)", value: 0, color: "#F59E0B" },
    { name: "Needs Improvement", value: 0, color: "#DC2626" }
  ];

  const recentExams = stats?.recentExams || [];
  const recentStudents = stats?.recentStudents || [];
  const liveAttempts = stats?.liveAttempts || [];
  const currentPlatformAnalytics =
    stats?.platformAnalytics?.[analyticsDateRange] ||
    stats?.platformAnalytics || {
      examAttempts: "0",
      submissions: "0",
      completionRate: "0%",
      averageScore: "0%",
      trends: {
        attempts: { value: "0%", isUp: true },
        submissions: { value: "0%", isUp: true },
        completion: { value: "0%", isUp: true },
        averageScore: { value: "0%", isUp: true }
      }
    };

  // Custom Recharts Tooltip
  const CustomActivityTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-[#E5EAF2] p-3 rounded-xl shadow-xl text-xs space-y-1.5 min-w-[130px]">
          <p className="font-bold text-[#172B4D] border-b border-[#F1F5F9] pb-1">
            {label}, {new Date().getFullYear()}
          </p>
          <div className="flex items-center justify-between text-[#2563EB]">
            <span className="flex items-center gap-1 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
              Started:
            </span>
            <span className="font-bold">{payload[0]?.value}</span>
          </div>
          <div className="flex items-center justify-between text-[#16A34A]">
            <span className="flex items-center gap-1 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
              Submitted:
            </span>
            <span className="font-bold">{payload[1]?.value}</span>
          </div>
          <div className="flex items-center justify-between text-[#9333EA]">
            <span className="flex items-center gap-1 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#9333EA]" />
              Published:
            </span>
            <span className="font-bold">{payload[2]?.value}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Banner Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div className="lg:col-span-8 bg-[#F8FAFC] border border-[#E5EAF2] rounded-2xl h-52 p-6 flex flex-col justify-between" />
          <div className="lg:col-span-4 bg-[#F8FAFC] border border-[#E5EAF2] rounded-2xl h-52 p-6 flex flex-col justify-between" />
        </div>

        {/* 12 KPI Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-[#F8FAFC] border border-[#E5EAF2] rounded-2xl p-4 h-28 flex flex-col justify-between" />
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div className="lg:col-span-5 bg-[#F8FAFC] border border-[#E5EAF2] rounded-2xl h-72 p-5" />
          <div className="lg:col-span-4 bg-[#F8FAFC] border border-[#E5EAF2] rounded-2xl h-72 p-5" />
          <div className="lg:col-span-3 bg-[#F8FAFC] border border-[#E5EAF2] rounded-2xl h-72 p-5" />
        </div>

        {/* Tables Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div className="lg:col-span-7 bg-[#F8FAFC] border border-[#E5EAF2] rounded-2xl h-64 p-5" />
          <div className="lg:col-span-5 bg-[#F8FAFC] border border-[#E5EAF2] rounded-2xl h-64 p-5" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Welcome Banner + Today's Goal Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Welcome Banner (8 cols) */}
        <div className="lg:col-span-8 bg-gradient-to-r from-[#EFF6FF] via-[#F4F8FE] to-[#EFF6FF] border border-[#DCE7F9] rounded-2xl p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between shadow-2xs">
          <div className="relative z-10 max-w-md">
            <span className="text-xs font-bold text-[#64748B] block mb-1">
              Welcome back,
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#172B4D] tracking-tight flex items-center gap-2 mb-2">
              <span>{adminName}!</span>
              <span className="text-2xl">👋</span>
            </h1>
            <p className="text-xs text-[#64748B] font-medium leading-relaxed mb-6">
              Manage examinations, students, and monitor platform performance from one place.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/admin/tests/create"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Exam</span>
              </Link>
              <Link
                to="/admin/questions"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#F8FAFC] border border-[#BFDBFE] text-[#2563EB] text-xs font-bold shadow-2xs transition-all"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Add Question</span>
              </Link>
            </div>
          </div>

          {/* Right Admin Illustration Asset */}
          <div className="hidden sm:block absolute right-0 bottom-0 top-0 w-80 pointer-events-none">
            <img
              src="/images/admin/admin-banner-illustration.png"
              alt="Admin Character at Desk"
              className="w-full h-full object-contain object-right-bottom"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        </div>

        {/* Today's Goal Card (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-[#E5EAF2] rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-2 text-xs font-bold text-[#172B4D]">
              <Calendar className="w-4 h-4 text-[#2563EB]" />
              <span>
                {new Date().toLocaleDateString("en-GB", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                })}
              </span>
            </div>
          </div>

          <div className="my-3 flex items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block mb-1">
                Today's Goal
              </span>
              <p className="text-xs text-[#172B4D] font-semibold leading-relaxed">
                Keep building better learning experiences for students.
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center text-[#16A34A] shrink-0">
              <Target className="w-6 h-6" />
            </div>
          </div>

          <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] text-[#64748B]">
            <span>System Status</span>
            <span className="flex items-center gap-1 font-bold text-[#16A34A]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
              All Services Operational
            </span>
          </div>
        </div>
      </div>

      {/* 2. Twelve Database-Driven KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
        {/* Card 1: Total Subjects */}
        <div className="bg-white border border-[#E5EAF2] rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-[#0284C7] flex items-center justify-center text-white shadow-2xs">
              <BookOpen className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] font-bold text-[#0284C7] bg-[#F0F9FF] px-1.5 py-0.5 rounded-md">
              Catalog
            </span>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#64748B]">Total Subjects</p>
            <p className="text-xl font-black text-[#172B4D] mt-0.5">
              {(stats?.totalSubjects ?? 0).toLocaleString()}
            </p>
            <p className="text-[10px] text-[#94A3B8] font-medium mt-1 truncate">
              Academic subjects
            </p>
          </div>
        </div>

        {/* Card 2: Total Students */}
        <div className="bg-white border border-[#E5EAF2] rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-2xs">
              <Users className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] font-bold text-[#2563EB] bg-[#EFF6FF] px-1.5 py-0.5 rounded-md">
              Students
            </span>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#64748B]">Total Students</p>
            <p className="text-xl font-black text-[#172B4D] mt-0.5">
              {(stats?.totalStudents ?? 0).toLocaleString()}
            </p>
            <p className="text-[10px] text-[#94A3B8] font-medium mt-1 truncate">
              {stats?.activeStudents ?? 0} active examinees
            </p>
          </div>
        </div>

        {/* Card 2: Total Admins */}
        <div className="bg-white border border-[#E5EAF2] rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-[#4F46E5] flex items-center justify-center text-white shadow-2xs">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] font-bold text-[#4F46E5] bg-[#EEF2FF] px-1.5 py-0.5 rounded-md">
              Staff
            </span>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#64748B]">Total Admins</p>
            <p className="text-xl font-black text-[#172B4D] mt-0.5">
              {(stats?.totalAdmins ?? 0).toLocaleString()}
            </p>
            <p className="text-[10px] text-[#94A3B8] font-medium mt-1 truncate">
              Role-based team
            </p>
          </div>
        </div>

        {/* Card 3: Total Questions */}
        <div className="bg-white border border-[#E5EAF2] rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-[#9333EA] flex items-center justify-center text-white shadow-2xs">
              <HelpCircle className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] font-bold text-[#9333EA] bg-[#FAF5FF] px-1.5 py-0.5 rounded-md">
              Bank
            </span>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#64748B]">Total Questions</p>
            <p className="text-xl font-black text-[#172B4D] mt-0.5">
              {(stats?.totalQuestions ?? 0).toLocaleString()}
            </p>
            <p className="text-[10px] text-[#94A3B8] font-medium mt-1 truncate">
              In question bank
            </p>
          </div>
        </div>

        {/* Card 4: Question Sets */}
        <div className="bg-white border border-[#E5EAF2] rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-[#0284C7] flex items-center justify-center text-white shadow-2xs">
              <Layers className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] font-bold text-[#0284C7] bg-[#F0F9FF] px-1.5 py-0.5 rounded-md">
              Sets
            </span>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#64748B]">Question Sets</p>
            <p className="text-xl font-black text-[#172B4D] mt-0.5">
              {(stats?.totalQuestionSets ?? 0).toLocaleString()}
            </p>
            <p className="text-[10px] text-[#94A3B8] font-medium mt-1 truncate">
              Curated modules
            </p>
          </div>
        </div>

        {/* Card 5: Total Exams */}
        <div className="bg-white border border-[#E5EAF2] rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-[#475569] flex items-center justify-center text-white shadow-2xs">
              <FileSpreadsheet className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] font-bold text-[#475569] bg-[#F8FAFC] px-1.5 py-0.5 rounded-md">
              All
            </span>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#64748B]">Total Exams</p>
            <p className="text-xl font-black text-[#172B4D] mt-0.5">
              {(stats?.totalExams ?? 0).toLocaleString()}
            </p>
            <p className="text-[10px] text-[#94A3B8] font-medium mt-1 truncate">
              {stats?.draftTests ?? 0} in draft
            </p>
          </div>
        </div>

        {/* Card 6: Published Exams */}
        <div className="bg-white border border-[#E5EAF2] rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-[#16A34A] flex items-center justify-center text-white shadow-2xs">
              <FileText className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] font-bold text-[#16A34A] bg-[#F0FDF4] px-1.5 py-0.5 rounded-md">
              Live
            </span>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#64748B]">Published Exams</p>
            <p className="text-xl font-black text-[#172B4D] mt-0.5">
              {(stats?.publishedExams ?? 0).toLocaleString()}
            </p>
            <p className="text-[10px] text-[#94A3B8] font-medium mt-1 truncate">
              Ready for examinees
            </p>
          </div>
        </div>

        {/* Card 7: Scheduled Exams */}
        <div className="bg-white border border-[#E5EAF2] rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-[#D97706] flex items-center justify-center text-white shadow-2xs">
              <Calendar className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] font-bold text-[#D97706] bg-[#FFFBEB] px-1.5 py-0.5 rounded-md">
              Upcoming
            </span>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#64748B]">Scheduled Exams</p>
            <p className="text-xl font-black text-[#172B4D] mt-0.5">
              {(stats?.scheduledExams ?? 0).toLocaleString()}
            </p>
            <p className="text-[10px] text-[#94A3B8] font-medium mt-1 truncate">
              Time-gated tests
            </p>
          </div>
        </div>

        {/* Card 8: Active Attempts */}
        <div className="bg-white border border-[#E5EAF2] rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-[#EA580C] flex items-center justify-center text-white shadow-2xs">
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </div>
            <span className="text-[10px] font-bold text-[#EA580C] bg-[#FFF7ED] px-1.5 py-0.5 rounded-md">
              Live
            </span>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#64748B]">Active Attempts</p>
            <p className="text-xl font-black text-[#172B4D] mt-0.5">
              {(stats?.activeAttempts ?? 0).toLocaleString()}
            </p>
            <p className="text-[10px] text-[#94A3B8] font-medium mt-1 truncate">
              Live student sessions
            </p>
          </div>
        </div>

        {/* Card 9: Completed Attempts */}
        <div className="bg-white border border-[#E5EAF2] rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-[#059669] flex items-center justify-center text-white shadow-2xs">
              <CheckCircle2 className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] font-bold text-[#059669] bg-[#ECFDF5] px-1.5 py-0.5 rounded-md">
              Submitted
            </span>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#64748B]">Completed Attempts</p>
            <p className="text-xl font-black text-[#172B4D] mt-0.5">
              {(stats?.completedAttempts ?? 0).toLocaleString()}
            </p>
            <p className="text-[10px] text-[#94A3B8] font-medium mt-1 truncate">
              Authoritatively submitted
            </p>
          </div>
        </div>

        {/* Card 10: Pending Results */}
        <div className="bg-white border border-[#E5EAF2] rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-[#E11D48] flex items-center justify-center text-white shadow-2xs">
              <Clock className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] font-bold text-[#E11D48] bg-[#FFF1F2] px-1.5 py-0.5 rounded-md">
              Pending
            </span>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#64748B]">Pending Results</p>
            <p className="text-xl font-black text-[#172B4D] mt-0.5">
              {(stats?.pendingResults ?? 0).toLocaleString()}
            </p>
            <p className="text-[10px] text-[#94A3B8] font-medium mt-1 truncate">
              Awaiting publication
            </p>
          </div>
        </div>

        {/* Card 11: Published Results */}
        <div className="bg-white border border-[#E5EAF2] rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-[#0D9488] flex items-center justify-center text-white shadow-2xs">
              <Award className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] font-bold text-[#0D9488] bg-[#F0FDFA] px-1.5 py-0.5 rounded-md">
              Published
            </span>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#64748B]">Published Results</p>
            <p className="text-xl font-black text-[#172B4D] mt-0.5">
              {(stats?.publishedResults ?? 0).toLocaleString()}
            </p>
            <p className="text-[10px] text-[#94A3B8] font-medium mt-1 truncate">
              Released scorecards
            </p>
          </div>
        </div>
      </div>

      {/* 3. Second Row: Exam Activity Overview + Student Performance + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Column 1: Exam Activity Overview Line Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#172B4D]">
                Exam Activity Overview
              </h3>
              <div className="flex items-center gap-3 mt-1 text-[10px] text-[#64748B]">
                <span className="flex items-center gap-1 font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
                  Attempts Started
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                  Attempts Submitted
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#9333EA]" />
                  Results Published
                </span>
              </div>
            </div>

            <div className="relative">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="appearance-none bg-[#F6F8FC] border border-[#E5EAF2] text-[11px] font-bold text-[#172B4D] rounded-xl pl-3 pr-7 py-1.5 outline-none cursor-pointer hover:bg-[#EFF6FF]"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#64748B] absolute right-2 top-2.5 pointer-events-none" />
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={{ stroke: "#F1F5F9" }}
                  tick={{ fill: "#94A3B8", fontSize: 10 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={{ stroke: "#F1F5F9" }}
                  tick={{ fill: "#94A3B8", fontSize: 10 }}
                />
                <Tooltip content={<CustomActivityTooltip />} />
                <Line
                  type="monotone"
                  dataKey="started"
                  stroke="#2563EB"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#2563EB" }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="submitted"
                  stroke="#16A34A"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#16A34A" }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="published"
                  stroke="#9333EA"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#9333EA" }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Column 2: Student Performance Donut Chart (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-[#172B4D]">
              Student Performance
            </h3>
            <span className="text-[11px] font-bold text-[#64748B] bg-[#F6F8FC] border border-[#E5EAF2] px-2.5 py-1 rounded-xl">
              Percentage &nabla;
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            {/* Donut Chart with Center Text */}
            <div className="relative w-40 h-40 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={studentPerformance}
                    innerRadius={46}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {studentPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-sm font-black text-[#172B4D]">
                  {(stats?.totalStudents ?? 0).toLocaleString()}
                </span>
                <span className="text-[9px] text-[#64748B] font-semibold">
                  Students
                </span>
              </div>
            </div>

            {/* Legend Breakdown */}
            <div className="flex-1 space-y-2 text-xs">
              {studentPerformance.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-[11px] font-medium text-[#64748B] truncate max-w-[105px]">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#172B4D]">
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 3: Quick Actions (3 cols) */}
        <div className="lg:col-span-3 bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <h3 className="text-sm font-bold text-[#172B4D] mb-3">
            Quick Actions
          </h3>

          <div className="grid grid-cols-3 gap-2.5 flex-1">
            {/* Action 1 */}
            <Link
              to="/admin/tests/create"
              className="p-2.5 rounded-xl border border-[#E5EAF2] hover:border-[#2563EB] hover:bg-[#F6F8FC] transition-all flex flex-col items-center justify-center text-center group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                <Plus className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-[#172B4D] group-hover:text-[#2563EB]">
                Create Exam
              </span>
            </Link>

            {/* Action 2 */}
            <Link
              to="/admin/questions"
              className="p-2.5 rounded-xl border border-[#E5EAF2] hover:border-[#16A34A] hover:bg-[#F6F8FC] transition-all flex flex-col items-center justify-center text-center group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-[#172B4D] group-hover:text-[#16A34A]">
                Add Question
              </span>
            </Link>

            {/* Action 3 */}
            <Link
              to="/admin/questions"
              className="p-2.5 rounded-xl border border-[#E5EAF2] hover:border-[#9333EA] hover:bg-[#F6F8FC] transition-all flex flex-col items-center justify-center text-center group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#FAF5FF] text-[#9333EA] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                <Upload className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-[#172B4D] group-hover:text-[#9333EA]">
                Import Qs
              </span>
            </Link>

            {/* Action 4 */}
            <Link
              to="/admin/students"
              className="p-2.5 rounded-xl border border-[#E5EAF2] hover:border-[#F97316] hover:bg-[#F6F8FC] transition-all flex flex-col items-center justify-center text-center group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#FFF7ED] text-[#F97316] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                <UserCheck className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-[#172B4D] group-hover:text-[#F97316]">
                Manage Students
              </span>
            </Link>

            {/* Action 5 */}
            <Link
              to="/admin/results"
              className="p-2.5 rounded-xl border border-[#E5EAF2] hover:border-[#EF4444] hover:bg-[#F6F8FC] transition-all flex flex-col items-center justify-center text-center group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#FEF2F2] text-[#EF4444] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                <Award className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-[#172B4D] group-hover:text-[#EF4444]">
                Review Results
              </span>
            </Link>

            {/* Action 6 */}
            <Link
              to="/admin/reports"
              className="p-2.5 rounded-xl border border-[#E5EAF2] hover:border-[#F59E0B] hover:bg-[#F6F8FC] transition-all flex flex-col items-center justify-center text-center group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#FFFBEB] text-[#F59E0B] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                <BarChart2 className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-[#172B4D] group-hover:text-[#F59E0B]">
                Generate Reports
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Third Row: Recent Exams Table + Recent Student Registrations Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Column 1: Recent Exams Table (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
            <h3 className="text-sm font-bold text-[#172B4D]">Recent Exams</h3>
            <Link
              to="/admin/tests"
              className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#F1F5F9] text-[11px] font-semibold text-[#64748B]">
                  <th className="py-2.5 pr-2">Exam Title</th>
                  <th className="py-2.5 px-2">Questions</th>
                  <th className="py-2.5 px-2">Duration</th>
                  <th className="py-2.5 px-2">Status</th>
                  <th className="py-2.5 px-2">Start Date</th>
                  <th className="py-2.5 pl-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8FAFC] text-xs">
                {recentExams.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-[#94A3B8]">
                      No exams created yet. Click "Create New Exam" to begin.
                    </td>
                  </tr>
                ) : (
                  recentExams.map((exam) => (
                  <tr key={exam.id} className="hover:bg-[#F8FAFD] transition-colors">
                    <td className="py-2.5 pr-2 font-bold text-[#172B4D] max-w-[180px] truncate">
                      {exam.title}
                    </td>
                    <td className="py-2.5 px-2 text-[#64748B]">
                      {exam.questionsCount}
                    </td>
                    <td className="py-2.5 px-2 text-[#64748B]">
                      {exam.duration}
                    </td>
                    <td className="py-2.5 px-2">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          exam.status === "Published"
                            ? "bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]"
                            : exam.status === "Scheduled"
                            ? "bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]"
                            : exam.status === "In Progress"
                            ? "bg-[#FFFBEB] text-[#F59E0B] border border-[#FDE68A]"
                            : "bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]"
                        }`}
                      >
                        {exam.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-[#64748B]">
                      {exam.startDate}
                    </td>
                    <td className="py-2.5 pl-2 text-right relative">
                      <button
                        onClick={() =>
                          setActionMenuOpenId(
                            actionMenuOpenId === exam.id ? null : exam.id
                          )
                        }
                        className="p-1 rounded-lg text-[#94A3B8] hover:text-[#172B4D] hover:bg-[#F1F5F9]"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {actionMenuOpenId === exam.id && (
                        <div className="absolute right-0 mt-1 w-32 bg-white border border-[#E5EAF2] rounded-xl shadow-lg z-20 py-1 text-left text-xs">
                          <Link
                            to="/admin/tests"
                            className="block px-3 py-1.5 hover:bg-[#F6F8FC] font-medium text-[#172B4D]"
                            onClick={() => setActionMenuOpenId(null)}
                          >
                            View Details
                          </Link>
                          <Link
                            to="/admin/results"
                            className="block px-3 py-1.5 hover:bg-[#F6F8FC] font-medium text-[#172B4D]"
                            onClick={() => setActionMenuOpenId(null)}
                          >
                            View Results
                          </Link>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            </table>
          </div>
        </div>

        {/* Column 2: Recent Student Registrations Table (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
            <h3 className="text-sm font-bold text-[#172B4D]">
              Recent Student Registrations
            </h3>
            <Link
              to="/admin/students"
              className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#F1F5F9] text-[11px] font-semibold text-[#64748B]">
                  <th className="py-2.5 pr-2">Name</th>
                  <th className="py-2.5 px-2">Email</th>
                  <th className="py-2.5 px-2">Date</th>
                  <th className="py-2.5 pl-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8FAFC] text-xs">
                {recentStudents.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-xs text-[#94A3B8]">
                      No registered students yet.
                    </td>
                  </tr>
                ) : (
                  recentStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-[#F8FAFD] transition-colors">
                      <td className="py-2.5 pr-2 flex items-center gap-2">
                        {student.photoURL || student.avatar ? (
                          <img
                            src={student.photoURL || student.avatar}
                            alt={student.name}
                            className="w-6 h-6 rounded-full object-cover border border-[#E2E8F0] shrink-0"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center text-[10px] font-black shrink-0 border border-[#BFDBFE]">
                            {(student.name || "S").charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="font-bold text-[#172B4D] truncate max-w-[110px]">
                          {student.name}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-[#64748B] truncate max-w-[130px]">
                        {student.email}
                      </td>
                      <td className="py-2.5 px-2 text-[#64748B] whitespace-nowrap">
                        {student.date}
                      </td>
                      <td className="py-2.5 pl-2 text-right">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            student.status === "Active"
                              ? "bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]"
                              : "bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]"
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 5. Fourth Row: Live Attempts Table + Platform Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Column 1: Live Attempts Table (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-ping" />
              <h3 className="text-sm font-bold text-[#172B4D]">Live Attempts</h3>
            </div>
            <Link
              to="/admin/attempts"
              className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#F1F5F9] text-[11px] font-semibold text-[#64748B]">
                  <th className="py-2.5 pr-2">Student</th>
                  <th className="py-2.5 px-2">Exam</th>
                  <th className="py-2.5 px-2">Started At</th>
                  <th className="py-2.5 px-2">Time Left</th>
                  <th className="py-2.5 px-2">Progress</th>
                  <th className="py-2.5 px-2">Status</th>
                  <th className="py-2.5 pl-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8FAFC] text-xs">
                {liveAttempts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-xs text-[#94A3B8]">
                      No active attempts at this moment.
                    </td>
                  </tr>
                ) : (
                  liveAttempts.map((att) => (
                    <tr key={att.id} className="hover:bg-[#F8FAFD] transition-colors">
                      <td className="py-2.5 pr-2 font-bold text-[#172B4D]">
                        {att.studentName}
                      </td>
                      <td className="py-2.5 px-2 text-[#64748B] truncate max-w-[130px]">
                        {att.examTitle}
                      </td>
                      <td className="py-2.5 px-2 text-[#64748B] whitespace-nowrap">
                        {att.startedAt}
                      </td>
                      <td className="py-2.5 px-2 whitespace-nowrap">
                        <span
                          className={
                            att.timeLeft === "Expired"
                              ? "font-bold text-[#DC2626]"
                              : "font-semibold text-[#172B4D]"
                          }
                        >
                          {att.timeLeft}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 min-w-[90px]">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[#2563EB]"
                              style={{ width: `${att.progress}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-[#64748B]">
                            {att.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-2">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            att.status === "In Progress"
                              ? "bg-[#FFFBEB] text-[#F59E0B] border border-[#FDE68A]"
                              : "bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]"
                          }`}
                        >
                          {att.status}
                        </span>
                      </td>
                      <td className="py-2.5 pl-2 text-right">
                        <Link
                          to="/admin/attempts"
                          className="inline-block px-2.5 py-1 rounded-lg bg-[#EFF6FF] text-[#2563EB] hover:bg-[#2563EB] hover:text-white text-[11px] font-bold transition-colors"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Column 2: Platform Analytics (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
            <h3 className="text-sm font-bold text-[#172B4D]">
              Platform Analytics
            </h3>
            <div className="relative">
              <select
                value={analyticsDateRange}
                onChange={(e) => setAnalyticsDateRange(e.target.value)}
                className="appearance-none bg-[#F6F8FC] border border-[#E5EAF2] text-[11px] font-bold text-[#172B4D] rounded-xl pl-3 pr-7 py-1 outline-none cursor-pointer hover:bg-[#EFF6FF]"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#64748B] absolute right-2 top-2 pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 my-2">
            {/* Tile 1: Exam Attempts */}
            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E5EAF2] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shrink-0">
                  <BarChart2 className="w-4.5 h-4.5" />
                </div>
                <div>
                  <p className="text-base font-black text-[#172B4D]">
                    {currentPlatformAnalytics.examAttempts}
                  </p>
                  <p className="text-[11px] text-[#64748B] font-semibold">
                    Exam Attempts
                  </p>
                </div>
              </div>
              <span
                className={`text-[10px] font-bold flex items-center gap-0.5 ${
                  currentPlatformAnalytics.trends?.attempts?.isUp
                    ? "text-[#16A34A]"
                    : "text-[#DC2626]"
                }`}
              >
                {currentPlatformAnalytics.trends?.attempts?.isUp ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {currentPlatformAnalytics.trends?.attempts?.value || "0%"}
              </span>
            </div>

            {/* Tile 2: Submissions */}
            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E5EAF2] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#16A34A] text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4.5 h-4.5" />
                </div>
                <div>
                  <p className="text-base font-black text-[#172B4D]">
                    {currentPlatformAnalytics.submissions}
                  </p>
                  <p className="text-[11px] text-[#64748B] font-semibold">
                    Submissions
                  </p>
                </div>
              </div>
              <span
                className={`text-[10px] font-bold flex items-center gap-0.5 ${
                  currentPlatformAnalytics.trends?.submissions?.isUp
                    ? "text-[#16A34A]"
                    : "text-[#DC2626]"
                }`}
              >
                {currentPlatformAnalytics.trends?.submissions?.isUp ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {currentPlatformAnalytics.trends?.submissions?.value || "0%"}
              </span>
            </div>

            {/* Tile 3: Completion Rate */}
            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E5EAF2] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#9333EA] text-white flex items-center justify-center shrink-0">
                  <Users className="w-4.5 h-4.5" />
                </div>
                <div>
                  <p className="text-base font-black text-[#172B4D]">
                    {currentPlatformAnalytics.completionRate}
                  </p>
                  <p className="text-[11px] text-[#64748B] font-semibold">
                    Completion Rate
                  </p>
                </div>
              </div>
              <span
                className={`text-[10px] font-bold flex items-center gap-0.5 ${
                  currentPlatformAnalytics.trends?.completion?.isUp
                    ? "text-[#16A34A]"
                    : "text-[#DC2626]"
                }`}
              >
                {currentPlatformAnalytics.trends?.completion?.isUp ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {currentPlatformAnalytics.trends?.completion?.value || "0%"}
              </span>
            </div>

            {/* Tile 4: Average Score */}
            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E5EAF2] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F97316] text-white flex items-center justify-center shrink-0">
                  <Target className="w-4.5 h-4.5" />
                </div>
                <div>
                  <p className="text-base font-black text-[#172B4D]">
                    {currentPlatformAnalytics.averageScore}
                  </p>
                  <p className="text-[11px] text-[#64748B] font-semibold">
                    Average Score
                  </p>
                </div>
              </div>
              <span
                className={`text-[10px] font-bold flex items-center gap-0.5 ${
                  currentPlatformAnalytics.trends?.averageScore?.isUp
                    ? "text-[#16A34A]"
                    : "text-[#DC2626]"
                }`}
              >
                {currentPlatformAnalytics.trends?.averageScore?.isUp ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {currentPlatformAnalytics.trends?.averageScore?.value || "0%"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
