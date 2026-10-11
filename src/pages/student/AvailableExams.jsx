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
  Sparkles
} from "lucide-react";

export default function AvailableExams() {
  const { currentUser } = useAuth();
  const [tests, setTests] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [myAttempts, setMyAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("all");

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
        setTests(testsData);
        setMyAttempts(attemptsData);
        setSubjects(subjectsData);
      } catch (err) {
        console.error(err);
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

  // Filtered tests
  const filteredTests = useMemo(() => {
    return tests.filter((test) => {
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
        if ((test.difficulty || "easy").toLowerCase() !== filterDifficulty.toLowerCase()) {
          return false;
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
  }, [tests, selectedSubject, filterDifficulty, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs">
        <div>
          <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Examination Hall &bull; Subject-Wise Question Sets
          </span>
          <h1 className="text-2xl font-black text-[#111827] tracking-tight mt-0.5">
            Available Examination Sets
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Browse published examination papers organized by subject and set number. Attempt questions with official marking scheme (+4 / -1).
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

      {/* Search and Secondary Filter */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <Input
              icon={Search}
              placeholder="Search set title, topics, or instructions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

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
          title="No Matching Examination Sets Found"
          description={
            searchTerm || selectedSubject !== "all"
              ? "Try resetting your search query or subject filter."
              : "There are currently no examination sets scheduled or published. Please check back later."
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

            const qCount = test.questionCount || test.questionIds?.length || 20;
            const marks = test.maximumMarks || qCount * 4;

            return (
              <Card key={test.id} className="p-6 flex flex-col justify-between hover:border-[#CBD5E1] transition-all hover:shadow-xs">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="primary">{test.subject || "General"}</Badge>
                    <span className="text-xs font-black text-[#16A34A] bg-[#DCFCE7] px-2.5 py-0.5 rounded-full border border-[#BBF7D0]">
                      {marks} Marks
                    </span>
                  </div>

                  <h3 className="text-base font-black text-[#111827] line-clamp-1 mb-1">
                    {test.title}
                  </h3>
                  <p className="text-xs text-[#64748B] line-clamp-2 mb-4 leading-relaxed">
                    {test.description || `Evaluation exam for ${test.subject} core competencies.`}
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

                <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-[#64748B]">
                      Attempts: <strong className="text-[#111827]">{submittedCount}</strong>/{limit}
                    </span>
                  </div>

                  {inProgress ? (
                    <Link to={`/student/attempts/${inProgress.id}`}>
                      <Button size="sm" variant="success" icon={Play}>
                        Resume Test
                      </Button>
                    </Link>
                  ) : canAttempt ? (
                    <Link to={`/student/exams/${test.id}/instructions`}>
                      <Button size="sm" icon={submittedCount > 0 ? RotateCcw : Play}>
                        {submittedCount > 0 ? "Retake Set" : "Start Set"}
                      </Button>
                    </Link>
                  ) : (
                    <Badge variant="default" size="xs">
                      Attempts Exhausted
                    </Badge>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
