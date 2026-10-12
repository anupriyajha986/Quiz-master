import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getStudentAvailableTests } from "../../services/firebase/testService";
import { getStudentAttempts, getStudentResults } from "../../services/firebase/studentService";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import EmptyState from "../../components/common/EmptyState";
import { CardSkeleton } from "../../components/common/LoadingSkeleton";
import { formatDuration, formatDate } from "../../utils/formatters";
import {
  BookOpen,
  Clock,
  CheckCircle2,
  Play,
  RotateCcw,
  Eye,
  FileCheck2,
  Calendar,
  Search,
  Award,
  Layers,
  ArrowRight,
  AlertCircle
} from "lucide-react";

export default function MyExams() {
  const { currentUser } = useAuth();
  const [tests, setTests] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tabs & Filters
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'in_progress' | 'completed' | 'available' | 'upcoming' | 'expired'
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");

  useEffect(() => {
    async function loadStudentExamLibrary() {
      if (!currentUser?.uid) return;
      setLoading(true);
      try {
        const [testsData, attemptsData, resultsData] = await Promise.all([
          getStudentAvailableTests(),
          getStudentAttempts(currentUser.uid),
          getStudentResults(currentUser.uid)
        ]);
        setTests(testsData || []);
        setAttempts(attemptsData || []);
        setResults(resultsData || []);
      } catch (err) {
        console.error("Failed to load personal exam library:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStudentExamLibrary();
  }, [currentUser]);

  // Map results by testId for instant scorecard lookup
  const resultsByTestId = useMemo(() => {
    const map = {};
    results.forEach((r) => {
      if (r.testId && (!map[r.testId] || (Number(r.percentage) || 0) > (Number(map[r.testId].percentage) || 0))) {
        map[r.testId] = r;
      }
    });
    return map;
  }, [results]);

  // Aggregate student exam list with reconciled lifecycle status
  const studentExams = useMemo(() => {
    const now = Date.now();

    return tests.map((test) => {
      const testAttempts = attempts.filter((a) => a.testId === test.id);
      const activeAttempt = testAttempts.find(
        (a) => a.status === "in_progress" && new Date(a.deadlineAt).getTime() > now
      );
      const submittedAttempts = testAttempts.filter((a) => a.status === "submitted");
      const submittedCount = submittedAttempts.length;
      const limit = Number(test.attemptLimit) || 2;
      const canAttempt = submittedCount < limit;

      const startAtMs = test.startAt ? new Date(test.startAt).getTime() : 0;
      const endAtMs = test.endAt ? new Date(test.endAt).getTime() : 0;
      const isUpcoming = startAtMs > 0 && startAtMs > now;
      const isExpired = endAtMs > 0 && endAtMs < now;

      const latestResult = resultsByTestId[test.id] || null;

      let status = "available";
      if (activeAttempt) {
        status = "in_progress";
      } else if (submittedCount > 0) {
        status = "completed";
      } else if (isUpcoming) {
        status = "upcoming";
      } else if (isExpired) {
        status = "expired";
      }

      return {
        ...test,
        activeAttempt,
        submittedCount,
        attemptLimit: limit,
        canAttempt,
        isUpcoming,
        isExpired,
        latestResult,
        status
      };
    });
  }, [tests, attempts, resultsByTestId]);

  // Extract unique subjects
  const subjects = useMemo(() => {
    return Array.from(new Set(studentExams.map((e) => e.subject).filter(Boolean)));
  }, [studentExams]);

  // Tab counts
  const counts = useMemo(() => {
    return {
      all: studentExams.length,
      in_progress: studentExams.filter((e) => e.status === "in_progress").length,
      completed: studentExams.filter((e) => e.status === "completed").length,
      available: studentExams.filter((e) => e.status === "available").length,
      upcoming: studentExams.filter((e) => e.status === "upcoming").length,
      expired: studentExams.filter((e) => e.status === "expired").length
    };
  }, [studentExams]);

  // Filtered exams according to tab, search, and subject
  const filteredExams = useMemo(() => {
    return studentExams.filter((exam) => {
      // Tab filter
      if (activeTab !== "all" && exam.status !== activeTab) {
        return false;
      }

      // Subject filter
      if (selectedSubject !== "all" && (exam.subject || "").toLowerCase() !== selectedSubject.toLowerCase()) {
        return false;
      }

      // Search filter
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchTitle = (exam.title || "").toLowerCase().includes(term);
        const matchSubject = (exam.subject || "").toLowerCase().includes(term);
        const matchDesc = (exam.description || "").toLowerCase().includes(term);
        if (!matchTitle && !matchSubject && !matchDesc) return false;
      }

      return true;
    });
  }, [studentExams, activeTab, selectedSubject, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs">
        <div>
          <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" /> Personal Examination Library
          </span>
          <h1 className="text-2xl font-black text-[#111827] tracking-tight mt-0.5">
            My Exams
          </h1>
          <p className="text-xs text-[#64748B] mt-1 max-w-2xl leading-relaxed">
            Manage your registered assessments, in-progress attempts, scorecards, and retake opportunities.
          </p>
        </div>

        {/* Quick Library Summary Stats */}
        <div className="flex items-center gap-4 bg-[#F8FAFC] border border-[#E2E8F0] px-4 py-2.5 rounded-xl">
          <div className="text-center">
            <span className="text-[10px] uppercase font-bold text-[#64748B] block">Enrolled</span>
            <span className="text-base font-black text-[#111827]">{counts.all}</span>
          </div>
          <div className="w-px h-7 bg-[#E2E8F0]" />
          <div className="text-center">
            <span className="text-[10px] uppercase font-bold text-[#0866F5] block">Active</span>
            <span className="text-base font-black text-[#0866F5]">{counts.in_progress}</span>
          </div>
          <div className="w-px h-7 bg-[#E2E8F0]" />
          <div className="text-center">
            <span className="text-[10px] uppercase font-bold text-[#16A34A] block">Completed</span>
            <span className="text-base font-black text-[#16A34A]">{counts.completed}</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {[
          { id: "all", label: "All My Exams", count: counts.all, icon: Layers },
          { id: "in_progress", label: "Active Attempts", count: counts.in_progress, icon: Clock },
          { id: "completed", label: "Completed", count: counts.completed, icon: CheckCircle2 },
          { id: "available", label: "Available to Attempt", count: counts.available, icon: Play },
          { id: "upcoming", label: "Upcoming", count: counts.upcoming, icon: Calendar },
          { id: "expired", label: "Closed / Expired", count: counts.expired, icon: AlertCircle }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? "bg-[#2563EB] text-white shadow-xs"
                  : "bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#111827] hover:border-[#CBD5E1]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  isActive ? "bg-white/20 text-white" : "bg-[#F1F5F9] text-[#475569]"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search and Subject Filter */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <Input
              icon={Search}
              placeholder="Search by exam title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            options={[
              { value: "all", label: "All Subjects" },
              ...subjects.map((sub) => ({ value: sub, label: sub }))
            ]}
          />
        </div>
      </Card>

      {/* Exam Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : filteredExams.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No Examinations in this Section"
          description={
            activeTab === "in_progress"
              ? "You do not have any ongoing exam attempts. Browse available sets to begin."
              : activeTab === "completed"
              ? "You haven't completed any exams yet. Submit an exam to view your scorecards."
              : "No exams matched your current tab or search filters."
          }
          actionLabel="Explore All Exams"
          actionHref="/student/exams"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam) => {
            const qCount = exam.questionCount || exam.questionIds?.length || 20;
            const marks = exam.maximumMarks || qCount * 4;
            const isCompleted = exam.status === "completed";
            const isInProgress = exam.status === "in_progress";

            return (
              <Card
                key={exam.id}
                className="p-6 flex flex-col justify-between hover:border-[#CBD5E1] transition-all hover:shadow-xs"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between mb-3 gap-2">
                    <Badge variant="primary">{exam.subject || "General"}</Badge>
                    <div className="flex items-center gap-1.5">
                      {isInProgress ? (
                        <span className="text-[10px] font-black text-[#0866F5] bg-[#EAF2FF] px-2 py-0.5 rounded-full border border-[#BFDBFE]">
                          In Progress
                        </span>
                      ) : isCompleted ? (
                        <span className="text-[10px] font-black text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded-full border border-[#BBF7D0]">
                          Completed {exam.latestResult ? `(${exam.latestResult.percentage}%)` : ""}
                        </span>
                      ) : exam.status === "upcoming" ? (
                        <span className="text-[10px] font-black text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded-full border border-[#FDE68A]">
                          Upcoming
                        </span>
                      ) : exam.status === "expired" ? (
                        <span className="text-[10px] font-black text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-full border border-[#E2E8F0]">
                          Closed
                        </span>
                      ) : (
                        <span className="text-[10px] font-black text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full border border-[#BBF7D0]">
                          Available
                        </span>
                      )}
                      <span className="text-xs font-black text-[#16A34A] bg-[#DCFCE7] px-2.5 py-0.5 rounded-full border border-[#BBF7D0]">
                        {marks} Marks
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-black text-[#111827] line-clamp-1 mb-1">
                    {exam.title}
                  </h3>
                  <p className="text-xs text-[#64748B] line-clamp-2 mb-4 leading-relaxed">
                    {exam.description || `Assessment paper covering ${exam.subject} fundamentals.`}
                  </p>

                  {/* Meta Specs Grid */}
                  <div className="grid grid-cols-3 gap-2 p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-center mb-4 text-xs">
                    <div>
                      <span className="text-[10px] text-[#64748B] block font-medium">Questions</span>
                      <span className="font-bold text-[#111827]">{qCount}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#64748B] block font-medium">Duration</span>
                      <span className="font-bold text-[#111827]">
                        {formatDuration(exam.durationMinutes || 40)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#64748B] block font-medium">Marking</span>
                      <span className="font-bold text-[#2563EB]">+4 / -1</span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-4 border-t border-[#E2E8F0] space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                    <span>
                      Attempts Taken: <strong className="text-[#111827]">{exam.submittedCount}</strong> / {exam.attemptLimit}
                    </span>
                    <Link
                      to={`/student/exams/${exam.id}/instructions`}
                      className="text-[#2563EB] hover:underline font-semibold"
                    >
                      Instructions
                    </Link>
                  </div>

                  <div className="flex items-center gap-2">
                    {isInProgress ? (
                      <Link to={`/student/attempts/${exam.activeAttempt.id}`} className="w-full">
                        <Button size="sm" variant="success" icon={Play} className="w-full justify-center">
                          Resume Active Attempt
                        </Button>
                      </Link>
                    ) : isCompleted ? (
                      <div className="flex items-center gap-2 w-full">
                        {exam.latestResult && (
                          <Link to={`/student/results/${exam.latestResult.id}`} className="flex-1">
                            <Button size="sm" variant="primary" icon={Eye} className="w-full justify-center">
                              Scorecard
                            </Button>
                          </Link>
                        )}
                        {exam.canAttempt && (
                          <Link to={`/student/exams/${exam.id}/instructions`} className="flex-1">
                            <Button size="sm" variant="outline" icon={RotateCcw} className="w-full justify-center">
                              Retake
                            </Button>
                          </Link>
                        )}
                      </div>
                    ) : exam.status === "upcoming" ? (
                      <Button size="sm" variant="outline" disabled className="w-full justify-center">
                        Scheduled for {exam.startAt ? new Date(exam.startAt).toLocaleDateString() : "Later"}
                      </Button>
                    ) : exam.status === "expired" ? (
                      <Button size="sm" variant="outline" disabled className="w-full justify-center">
                        Exam Window Closed
                      </Button>
                    ) : (
                      <Link to={`/student/exams/${exam.id}/instructions`} className="w-full">
                        <Button size="sm" icon={Play} className="w-full justify-center">
                          Start Examination
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
