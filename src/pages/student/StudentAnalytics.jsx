import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getStudentDashboardStats } from "../../services/firebase/analyticsService";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import EmptyState from "../../components/common/EmptyState";
import { CardSkeleton } from "../../components/common/LoadingSkeleton";
import { formatDate } from "../../utils/formatters";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from "recharts";
import {
  BarChart2,
  TrendingUp,
  Target,
  Award,
  BookOpen,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  Sparkles,
  Layers,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight
} from "lucide-react";

export default function StudentAnalytics() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      if (!currentUser?.uid) return;
      setLoading(true);
      try {
        const data = await getStudentDashboardStats(currentUser.uid);
        setStats(data);
      } catch (err) {
        console.error("Failed to load student analytics:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, [currentUser]);

  const allResults = stats?.allResults || [];
  const completedCount = stats?.completedTestsCount || 0;
  const avgPercentage = stats?.averagePercentage || 0;
  const highestPercentage = stats?.highestPercentage || 0;
  const lowestPercentage = stats?.lowestPercentage || 0;
  const overallAccuracy = stats?.overallAccuracy || 0;

  // Subject breakdown analysis
  const subjectAnalysis = useMemo(() => {
    const rawBreakdown = stats?.subjectBreakdown || {};
    const list = Object.entries(rawBreakdown)
      .filter(([name]) => name !== "Overall")
      .map(([name, data]) => ({
        subject: name,
        percentage: Number(data.percentage) || 0,
        score: Number(data.score) || 0
      }))
      .sort((a, b) => b.percentage - a.percentage);

    const strongest = list.length > 0 ? list[0] : null;
    const weakest = list.length > 1 ? list[list.length - 1] : null;

    return { list, strongest, weakest };
  }, [stats]);

  // Answer distribution data for Pie Chart
  const answerDistribution = useMemo(() => {
    const correct = stats?.totalCorrect || 0;
    const incorrect = stats?.totalIncorrect || 0;
    const unanswered = stats?.totalUnanswered || 0;
    const total = correct + incorrect + unanswered;

    if (total === 0) return [];

    return [
      { name: "Correct", value: correct, color: "#16A34A" },
      { name: "Incorrect", value: incorrect, color: "#EF4444" },
      { name: "Unanswered", value: unanswered, color: "#94A3B8" }
    ];
  }, [stats]);

  // Progression chart data (chronological)
  const progressionData = useMemo(() => {
    return allResults.map((r, i) => {
      const p = Math.round(Number(r.percentage) || 0);
      const acc = Math.round(Number(r.accuracy) || 0);
      return {
        index: i + 1,
        name: `T${i + 1}`,
        testTitle: r.testTitle || `Exam ${i + 1}`,
        percentage: p,
        accuracy: acc,
        score: r.totalScore || 0,
        maxScore: r.maximumMarks || 0,
        date: r.evaluatedAt ? formatDate(r.evaluatedAt) : ""
      };
    });
  }, [allResults]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-28 bg-white rounded-2xl border border-[#E5ECF5]" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="h-24 bg-white rounded-2xl border border-[#E5ECF5]" />
          <div className="h-24 bg-white rounded-2xl border border-[#E5ECF5]" />
          <div className="h-24 bg-white rounded-2xl border border-[#E5ECF5]" />
          <div className="h-24 bg-white rounded-2xl border border-[#E5ECF5]" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-white rounded-2xl border border-[#E5ECF5]" />
          <div className="h-80 bg-white rounded-2xl border border-[#E5ECF5]" />
        </div>
      </div>
    );
  }

  if (completedCount === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-[#111A36]">Performance Analytics</h1>
          <p className="text-xs text-[#64748B] mt-1">
            Comprehensive evaluation metrics, score trajectories, and subject mastery analysis.
          </p>
        </div>

        <EmptyState
          icon={BarChart2}
          title="Insufficient Data for Performance Analytics"
          description="You haven't completed any examinations yet. Complete mock tests to unlock your performance trajectory, accuracy trends, and subject mastery breakdown."
          actionLabel="Explore Available Exams"
          actionHref="/student/exams"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs">
        <div>
          <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Empirical Performance Metrics
          </span>
          <h1 className="text-2xl font-black text-[#111827] tracking-tight mt-0.5">
            Performance Analytics
          </h1>
          <p className="text-xs text-[#64748B] mt-1 max-w-2xl leading-relaxed">
            Real-time analytics computed strictly from validated test scorecards. Track score progression, accuracy, subject strengths, and areas requiring improvement.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="primary" size="sm">
            {completedCount} Evaluated {completedCount === 1 ? "Exam" : "Exams"}
          </Badge>
        </div>
      </div>

      {/* 5 KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Average Score */}
        <div className="p-4 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B]">Average Score</span>
            <BarChart2 className="w-4 h-4 text-[#2563EB]" />
          </div>
          <p className="text-2xl font-black text-[#111827] mt-2">{avgPercentage}%</p>
          <span className="text-[11px] text-[#64748B]">Across all completed sets</span>
        </div>

        {/* Highest Score */}
        <div className="p-4 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B]">Highest Score</span>
            <ArrowUpRight className="w-4 h-4 text-[#16A34A]" />
          </div>
          <p className="text-2xl font-black text-[#16A34A] mt-2">{highestPercentage}%</p>
          <span className="text-[11px] text-[#64748B]">Peak test percentage</span>
        </div>

        {/* Lowest Score */}
        <div className="p-4 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B]">Lowest Score</span>
            <ArrowDownRight className="w-4 h-4 text-[#EF4444]" />
          </div>
          <p className="text-2xl font-black text-[#64748B] mt-2">{lowestPercentage}%</p>
          <span className="text-[11px] text-[#64748B]">Lowest recorded set</span>
        </div>

        {/* Overall Accuracy */}
        <div className="p-4 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B]">Accuracy</span>
            <Target className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <p className="text-2xl font-black text-[#8B5CF6] mt-2">{overallAccuracy}%</p>
          <span className="text-[11px] text-[#64748B]">Correct / attempted</span>
        </div>

        {/* Total Completed */}
        <div className="p-4 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B]">Exams Completed</span>
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          </div>
          <p className="text-2xl font-black text-[#111827] mt-2">{completedCount}</p>
          <span className="text-[11px] text-[#64748B]">Verified submissions</span>
        </div>
      </div>

      {/* Row 2: Subject Strengths Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strongest Subject */}
        <div className="p-5 bg-gradient-to-r from-[#F0FDF4] to-[#DCFCE7] border border-[#BBF7D0] rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#15803D] tracking-wider block">
              Strongest Subject
            </span>
            <h4 className="text-lg font-black text-[#14532D]">
              {subjectAnalysis.strongest ? subjectAnalysis.strongest.subject : "All Subjects Equal"}
            </h4>
            <p className="text-xs text-[#166534]">
              {subjectAnalysis.strongest
                ? `Leading with ${subjectAnalysis.strongest.percentage}% average mastery.`
                : "Complete more sets to differentiate subject strengths."}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/80 border border-[#86EFAC] text-[#16A34A] flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Needs Improvement */}
        <div className="p-5 bg-gradient-to-r from-[#FEF2F2] to-[#FEE2E2] border border-[#FECACA] rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#B91C1C] tracking-wider block">
              Area for Improvement
            </span>
            <h4 className="text-lg font-black text-[#7F1D1D]">
              {subjectAnalysis.weakest ? subjectAnalysis.weakest.subject : "Maintain Consistency"}
            </h4>
            <p className="text-xs text-[#991B1B]">
              {subjectAnalysis.weakest
                ? `Currently averaging ${subjectAnalysis.weakest.percentage}%. Recommended for revision.`
                : "Maintain consistent practice across all examination papers."}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/80 border border-[#FCA5A5] text-[#DC2626] flex items-center justify-center shrink-0">
            <Target className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Row 3: Score Progression Trend Chart */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-[#F1F5F9] mb-4 gap-2">
          <div>
            <h3 className="text-base font-black text-[#111827]">Score Progression & Accuracy Over Time</h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Normalized score percentages and accuracy trajectories across chronologically completed exams.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#2563EB]" />
              <span className="text-[#64748B]">Score %</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#10B981]" />
              <span className="text-[#64748B]">Accuracy %</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={progressionData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="accuracyColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748B" }} />
              <YAxis domain={[-10, 100]} tick={{ fontSize: 11, fill: "#64748B" }} unit="%" />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-white border border-[#E2E8F0] rounded-xl p-3 shadow-md text-xs space-y-1">
                        <p className="font-bold text-[#111827]">{d.testTitle}</p>
                        <p className="text-[#64748B] text-[11px]">{d.date}</p>
                        <div className="pt-1 space-y-0.5 border-t border-[#F1F5F9]">
                          <p className="text-[#2563EB] font-bold">Score: {d.score} / {d.maxScore} ({d.percentage}%)</p>
                          <p className="text-[#10B981] font-bold">Accuracy: {d.accuracy}%</p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area type="monotone" dataKey="percentage" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#scoreColor)" />
              <Area type="monotone" dataKey="accuracy" stroke="#10B981" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#accuracyColor)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Row 4: Subject Performance Comparison & Question Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Subject-Wise Performance Bars (7 cols) */}
        <div className="lg:col-span-7">
          <Card className="p-6 h-full flex flex-col justify-between">
            <div>
              <div className="pb-4 border-b border-[#F1F5F9] mb-4">
                <h3 className="text-base font-black text-[#111827]">Subject-Wise Performance</h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Comparative mastery percentages across academic and technical disciplines.
                </p>
              </div>

              <div className="space-y-4">
                {subjectAnalysis.list.map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#111827]">{item.subject}</span>
                      <span className="font-black text-[#2563EB]">{item.percentage}%</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-[#F1F5F9] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6] transition-all duration-500"
                        style={{ width: `${Math.max(0, Math.min(100, item.percentage))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#F1F5F9] mt-6 flex items-center justify-between text-xs text-[#64748B]">
              <span>Evaluated against official marking schemes</span>
              <Link to="/student/results" className="text-[#2563EB] font-bold hover:underline flex items-center gap-1">
                <span>View Full Results</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card>
        </div>

        {/* Overall Answer Distribution (5 cols) */}
        <div className="lg:col-span-5">
          <Card className="p-6 h-full flex flex-col justify-between">
            <div>
              <div className="pb-4 border-b border-[#F1F5F9] mb-4">
                <h3 className="text-base font-black text-[#111827]">Question Response Distribution</h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Aggregate outcome of all questions attempted in completed examinations.
                </p>
              </div>

              <div className="h-52 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={answerDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                    >
                      {answerDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#F1F5F9] text-center text-xs">
              <div className="p-2 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0]">
                <span className="text-sm font-black text-[#16A34A] block">
                  {stats?.totalCorrect || 0}
                </span>
                <span className="text-[10px] font-semibold text-[#15803D]">Correct</span>
              </div>
              <div className="p-2 rounded-xl bg-[#FEF2F2] border border-[#FECACA]">
                <span className="text-sm font-black text-[#DC2626] block">
                  {stats?.totalIncorrect || 0}
                </span>
                <span className="text-[10px] font-semibold text-[#B91C1C]">Incorrect</span>
              </div>
              <div className="p-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-sm font-black text-[#64748B] block">
                  {stats?.totalUnanswered || 0}
                </span>
                <span className="text-[10px] font-semibold text-[#64748B]">Unanswered</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
