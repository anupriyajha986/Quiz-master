import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getStudentAvailableTests } from "../../services/firebase/testService";
import { getStudentAttempts } from "../../services/firebase/studentService";
import { getSubjects } from "../../services/firebase/subjectService";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import EmptyState from "../../components/common/EmptyState";
import { CardSkeleton } from "../../components/common/LoadingSkeleton";
import { formatDuration } from "../../utils/formatters";
import {
  FileCheck2,
  Clock,
  Award,
  ArrowRight,
  Play,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Search,
  BookOpen,
  Filter,
  CheckCircle,
  Layers,
  Sparkles,
  Calendar,
  AlertCircle
} from "lucide-react";

export default function AvailableExams() {
  const { currentUser } = useAuth();
  const [tests, setTests] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [myAttempts, setMyAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Sorting
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    async function loadData() {
      if (!currentUser) return;
      setLoading(true);
      try {
        const [testsData, attemptsData, subjectsData] = await Promise.all([
          getStudentAvailableTests(),
          getStudentAttempts(currentUser.uid),
          getSubjects("active")
        ]);
        setTests(testsData || []);
        setMyAttempts(attemptsData || []);
        setSubjects(subjectsData || []);
      } catch (err) {
        console.error("Failed to load available exams:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [currentUser]);

  // Computed counts per subject
  const subjectCounts = useMemo(() => {
    const counts = { all: tests.length };
    tests.forEach((t) => {
      const s = t.subject || "General";
      counts[s] = (counts[s] || 0) + 1;
    });
    return counts;
  }, [tests]);

  // Filtered and Sorted tests
  const filteredTests = useMemo(() => {
    const now = Date.now();

    const filtered = tests.filter((test) => {
      // Subject filter
      if (selectedSubject !== "all") {
        const testSubj = (test.subject || "").toLowerCase();
        const selSubj = selectedSubject.toLowerCase();
        if (testSubj !== selSubj && test.subjectId !== selectedSubject) {
          return false;
        }
      }

      // Difficulty filter
      if (filterDifficulty !== "all") {
        if ((test.difficulty || "medium").toLowerCase() !== filterDifficulty.toLowerCase()) {
          return false;
        }
      }

      // Status filter
      if (filterStatus !== "all") {
        const attemptsForTest = myAttempts.filter((a) => a.testId === test.id);
        const inProgress = attemptsForTest.some(
          (a) => a.status === "in_progress" && new Date(a.deadlineAt).getTime() > now
        );
        const submittedCount = attemptsForTest.filter((a) => a.status === "submitted").length;
        const limit = Number(test.attemptLimit) || 2;

        const startAtMs = test.startAt ? new Date(test.startAt).getTime() : 0;
        const endAtMs = test.endAt ? new Date(test.endAt).getTime() : 0;
        const isUpcoming = startAtMs > 0 && startAtMs > now;
        const isExpired = endAtMs > 0 && endAtMs < now;

        if (filterStatus === "in_progress" && !inProgress) return false;
        if (filterStatus === "completed" && submittedCount === 0) return false;
        if (filterStatus === "upcoming" && !isUpcoming) return false;
        if (filterStatus === "expired" && !isExpired) return false;
        if (filterStatus === "available") {
          if (inProgress || isUpcoming || isExpired || submittedCount >= limit) return false;
        }
      }

      // Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const titleMatch = (test.title || "").toLowerCase().includes(term);
        const descMatch = (test.description || "").toLowerCase().includes(term);
        const subjMatch = (test.subject || "").toLowerCase().includes(term);
        if (!titleMatch && !descMatch && !subjMatch) return false;
      }

      return true;
    });

    // Sorting
    filtered.sort((a, b) => {
      if (sortBy === "title_asc") {
        return (a.title || "").localeCompare(b.title || "");
      }
      if (sortBy === "duration_asc") {
        return (a.durationMinutes || 0) - (b.durationMinutes || 0);
      }
      if (sortBy === "duration_desc") {
        return (b.durationMinutes || 0) - (a.durationMinutes || 0);
      }
      if (sortBy === "questions_desc") {
        const qA = a.questionCount || a.questionIds?.length || 0;
        const qB = b.questionCount || b.questionIds?.length || 0;
        return qB - qA;
      }
      // default: newest
      const tA = a.createdAt?.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt || 0).getTime();
      const tB = b.createdAt?.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt || 0).getTime();
      return tB - tA;
    });

    return filtered;
  }, [tests, selectedSubject, filterDifficulty, filterStatus, searchTerm, sortBy, myAttempts]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs">
        <div>
          <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Examination Discovery &bull; Official Test Papers
          </span>
          <h1 className="text-2xl font-black text-[#111827] tracking-tight mt-0.5">
            Explore Examinations
          </h1>
          <p className="text-xs text-[#64748B] mt-1 max-w-2xl leading-relaxed">
            Browse published examination papers across core subjects. Start an active assessment, resume a session, or review past completions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] font-semibold text-[#64748B] block">Published Sets</span>
            <span className="text-xl font-black text-[#111827]">{tests.length} Available</span>
          </div>
        </div>
      </div>

      {/* Subject Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <button
          onClick={() => setSelectedSubject("all")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            selectedSubject === "all"
              ? "bg-[#2563EB] text-white shadow-xs shadow-blue-500/20"
              : "bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#111827] hover:border-[#CBD5E1]"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>All Subjects</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
              selectedSubject === "all" ? "bg-white/20 text-white" : "bg-[#F1F5F9] text-[#475569]"
            }`}
          >
            {subjectCounts.all || 0}
          </span>
        </button>

        {subjects.map((subj) => {
          const count = subjectCounts[subj.name] || subjectCounts[subj.code] || 0;
          const isSelected =
            selectedSubject.toLowerCase() === subj.name.toLowerCase() ||
            selectedSubject === subj.id;

          return (
            <button
              key={subj.id}
              onClick={() => setSelectedSubject(subj.name)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isSelected
                  ? "bg-[#2563EB] text-white shadow-xs shadow-blue-500/20"
                  : "bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#111827] hover:border-[#CBD5E1]"
              }`}
            >
              <span>{subj.name}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  isSelected ? "bg-white/20 text-white" : "bg-[#F1F5F9] text-[#475569]"
                }`}
              >
                {count} Sets
              </span>
            </button>
          );
        })}
      </div>

      {/* Search and Advanced Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          <div className="lg:col-span-5">
            <Input
              icon={Search}
              placeholder="Search by title, subject, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="lg:col-span-2">
            <Select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              options={[
                { value: "all", label: "All Difficulties" },
                { value: "easy", label: "Easy" },
                { value: "medium", label: "Medium" },
                { value: "hard", label: "Hard" }
              ]}
            />
          </div>

          <div className="lg:col-span-2">
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              options={[
                { value: "all", label: "All Statuses" },
                { value: "available", label: "Available to Start" },
                { value: "in_progress", label: "In Progress" },
                { value: "completed", label: "Completed" },
                { value: "upcoming", label: "Upcoming" },
                { value: "expired", label: "Window Closed" }
              ]}
            />
          </div>

          <div className="lg:col-span-3">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={[
                { value: "newest", label: "Sort: Newest First" },
                { value: "title_asc", label: "Sort: Title (A-Z)" },
                { value: "duration_asc", label: "Sort: Shortest Duration" },
                { value: "duration_desc", label: "Sort: Longest Duration" },
                { value: "questions_desc", label: "Sort: Most Questions" }
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Examination Sets Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : filteredTests.length === 0 ? (
        <EmptyState
          icon={FileCheck2}
          title="No Matching Examinations Found"
          description={
            searchTerm || selectedSubject !== "all" || filterDifficulty !== "all" || filterStatus !== "all"
              ? "Try resetting your search query or adjusting your filters."
              : "There are currently no examination sets published. Please check back later."
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => {
            const now = Date.now();
            const attemptsForThisTest = myAttempts.filter((a) => a.testId === test.id);
            const inProgress = attemptsForThisTest.find(
              (a) => a.status === "in_progress" && new Date(a.deadlineAt).getTime() > now
            );
            const submittedCount = attemptsForThisTest.filter(
              (a) => a.status === "submitted"
            ).length;
            const limit = Number(test.attemptLimit) || 2;
            const canAttempt = submittedCount < limit;

            const startAtMs = test.startAt ? new Date(test.startAt).getTime() : 0;
            const endAtMs = test.endAt ? new Date(test.endAt).getTime() : 0;
            const isUpcoming = startAtMs > 0 && startAtMs > now;
            const isExpired = endAtMs > 0 && endAtMs < now;

            const qCount = test.questionCount || test.questionIds?.length || 20;
            const marks = test.maximumMarks || qCount * 4;

            return (
              <Card key={test.id} className="p-6 flex flex-col justify-between hover:border-[#CBD5E1] transition-all hover:shadow-xs">
                <div>
                  <div className="flex items-center justify-between mb-3 gap-2">
                    <Badge variant="primary">{test.subject || "General"}</Badge>
                    <div className="flex items-center gap-1.5">
                      {inProgress ? (
                        <span className="text-[10px] font-black text-[#0866F5] bg-[#EAF2FF] px-2 py-0.5 rounded-full border border-[#BFDBFE]">
                          In Progress
                        </span>
                      ) : isUpcoming ? (
                        <span className="text-[10px] font-black text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded-full border border-[#FDE68A]">
                          Scheduled
                        </span>
                      ) : isExpired ? (
                        <span className="text-[10px] font-black text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-full border border-[#E2E8F0]">
                          Closed
                        </span>
                      ) : submittedCount >= limit ? (
                        <span className="text-[10px] font-black text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded-full border border-[#BBF7D0]">
                          Completed
                        </span>
                      ) : (
                        <span className="text-[10px] font-black text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full border border-[#BBF7D0]">
                          Available
                        </span>
                      )}
                      <span className="text-xs font-black text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full border border-[#BBF7D0]">
                        {marks} Marks
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-black text-[#111827] line-clamp-1 mb-1">
                    {test.title}
                  </h3>
                  <p className="text-xs text-[#64748B] line-clamp-2 mb-4 leading-relaxed">
                    {test.description || `Official evaluation examination covering ${test.subject || "computer science"} concepts.`}
                  </p>

                  <div className="grid grid-cols-3 gap-2 p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-center mb-4 text-xs">
                    <div>
                      <span className="text-[10px] text-[#64748B] block font-medium">Questions</span>
                      <span className="font-bold text-[#111827]">{qCount}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#64748B] block font-medium">Duration</span>
                      <span className="font-bold text-[#111827]">
                        {formatDuration(test.durationMinutes || 40)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#64748B] block font-medium">Marking</span>
                      <span className="font-bold text-[#2563EB]">+4 / -1</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E2E8F0] space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                    <span>
                      Attempts Taken: <strong className="text-[#111827]">{submittedCount}</strong> / {limit}
                    </span>
                    <Link
                      to={`/student/exams/${test.id}/instructions`}
                      className="text-[#2563EB] hover:underline font-semibold"
                    >
                      Instructions
                    </Link>
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    {inProgress ? (
                      <Link to={`/student/attempts/${inProgress.id}`} className="w-full">
                        <Button size="sm" variant="success" icon={Play} className="w-full justify-center">
                          Resume Test Session
                        </Button>
                      </Link>
                    ) : isUpcoming ? (
                      <Button size="sm" variant="outline" disabled className="w-full justify-center">
                        Scheduled for {test.startAt ? new Date(test.startAt).toLocaleDateString() : "Later"}
                      </Button>
                    ) : isExpired ? (
                      <Button size="sm" variant="outline" disabled className="w-full justify-center">
                        Exam Window Closed
                      </Button>
                    ) : canAttempt ? (
                      <Link to={`/student/exams/${test.id}/instructions`} className="w-full">
                        <Button size="sm" icon={submittedCount > 0 ? RotateCcw : Play} className="w-full justify-center">
                          {submittedCount > 0 ? "Retake Exam" : "Start Exam"}
                        </Button>
                      </Link>
                    ) : (
                      <Link to="/student/results" className="w-full">
                        <Button size="sm" variant="secondary" icon={Award} className="w-full justify-center">
                          View Results
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
