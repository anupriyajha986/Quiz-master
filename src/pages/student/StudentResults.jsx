import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getStudentResults } from "../../services/firebase/studentService";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import { TableSkeleton } from "../../components/common/LoadingSkeleton";
import { formatDate } from "../../utils/formatters";
import {
  Award,
  Eye,
  Search,
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Target,
  BarChart2,
  Clock,
  AlertCircle,
  RefreshCw
} from "lucide-react";

export default function StudentResults() {
  const { currentUser } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const fetchResults = useCallback(async () => {
    if (!currentUser?.uid) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getStudentResults(currentUser.uid);
      setResults(data || []);
    } catch (err) {
      console.error("Error loading examination results:", err);
      setError(err.message || "Failed to load examination results. Please check your connection and retry.");
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  // Overall Statistics computed from actual results
  const summaryStats = useMemo(() => {
    if (results.length === 0) {
      return { total: 0, avgPct: 0, maxScore: 0, accuracy: 0 };
    }
    const total = results.length;
    const totalPct = results.reduce((sum, r) => sum + (Number(r.percentage) || 0), 0);
    const avgPct = Math.round(totalPct / total);

    const scores = results.map((r) => Number(r.totalScore) || 0);
    const maxScore = Math.max(...scores);

    let totalCorrect = 0;
    let totalAttempted = 0;
    results.forEach((r) => {
      totalCorrect += Number(r.correctCount) || 0;
      totalAttempted += (Number(r.correctCount) || 0) + (Number(r.incorrectCount) || 0);
    });
    const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

    return { total, avgPct, maxScore, accuracy };
  }, [results]);

  // Unique Subjects
  const subjects = useMemo(() => {
    return Array.from(new Set(results.map((r) => r.subject).filter(Boolean)));
  }, [results]);

  // Filtered and Sorted Results
  const filteredResults = useMemo(() => {
    const list = results.filter((r) => {
      if (selectedSubject !== "all" && (r.subject || "").toLowerCase() !== selectedSubject.toLowerCase()) {
        return false;
      }
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const titleMatch = (r.testTitle || "").toLowerCase().includes(term);
        const subjMatch = (r.subject || "").toLowerCase().includes(term);
        if (!titleMatch && !subjMatch) return false;
      }
      return true;
    });

    list.sort((a, b) => {
      if (sortBy === "highest_score") {
        return (Number(b.totalScore) || 0) - (Number(a.totalScore) || 0);
      }
      if (sortBy === "highest_percentage") {
        return (Number(b.percentage) || 0) - (Number(a.percentage) || 0);
      }
      if (sortBy === "oldest") {
        const tA = new Date(a.evaluatedAt || a.submittedAt || 0).getTime();
        const tB = new Date(b.evaluatedAt || b.submittedAt || 0).getTime();
        return tA - tB;
      }
      // default: newest
      const tA = new Date(a.evaluatedAt || a.submittedAt || 0).getTime();
      const tB = new Date(b.evaluatedAt || b.submittedAt || 0).getTime();
      return tB - tA;
    });

    return list;
  }, [results, selectedSubject, searchTerm, sortBy]);

  // Paginated Slice
  const totalPages = Math.max(1, Math.ceil(filteredResults.length / pageSize));
  const paginatedResults = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredResults.slice(start, start + pageSize);
  }, [filteredResults, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs">
        <div>
          <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" /> Certified Assessment Transcripts
          </span>
          <h1 className="text-2xl font-black text-[#111827] tracking-tight mt-0.5">
            Results & Scorecards
          </h1>
          <p className="text-xs text-[#64748B] mt-1 max-w-2xl leading-relaxed">
            Access validated test evaluations, score breakdowns (+4 / -1 JEE marking), certified PDF scorecards, and question-by-question performance analysis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="primary" size="sm">
            {results.length} Published {results.length === 1 ? "Result" : "Results"}
          </Badge>
          <Button
            size="xs"
            variant="outline"
            icon={RefreshCw}
            onClick={fetchResults}
            disabled={loading}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      {results.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748B]">Total Tests Taken</span>
              <BookOpen className="w-4 h-4 text-[#2563EB]" />
            </div>
            <p className="text-2xl font-black text-[#111827] mt-2">{summaryStats.total}</p>
            <span className="text-[11px] text-[#64748B]">Completed examinations</span>
          </div>

          <div className="p-4 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748B]">Average Score</span>
              <TrendingUp className="w-4 h-4 text-[#16A34A]" />
            </div>
            <p className="text-2xl font-black text-[#111827] mt-2">{summaryStats.avgPct}%</p>
            <span className="text-[11px] text-[#64748B]">Mean percentage</span>
          </div>

          <div className="p-4 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748B]">Highest Score</span>
              <Award className="w-4 h-4 text-[#F59E0B]" />
            </div>
            <p className="text-2xl font-black text-[#111827] mt-2">{summaryStats.maxScore}</p>
            <span className="text-[11px] text-[#64748B]">Best raw marks</span>
          </div>

          <div className="p-4 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748B]">Overall Accuracy</span>
              <Target className="w-4 h-4 text-[#8B5CF6]" />
            </div>
            <p className="text-2xl font-black text-[#111827] mt-2">{summaryStats.accuracy}%</p>
            <span className="text-[11px] text-[#64748B]">Correct vs attempted</span>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      {results.length > 0 && (
        <Card className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6">
              <Input
                icon={Search}
                placeholder="Search result by exam title or subject..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div className="sm:col-span-3">
              <Select
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value);
                  setCurrentPage(1);
                }}
                options={[
                  { value: "all", label: "All Subjects" },
                  ...subjects.map((sub) => ({ value: sub, label: sub }))
                ]}
              />
            </div>

            <div className="sm:col-span-3">
              <Select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                options={[
                  { value: "newest", label: "Sort: Newest Evaluated" },
                  { value: "highest_score", label: "Sort: Highest Score" },
                  { value: "highest_percentage", label: "Sort: Highest Percentage" },
                  { value: "oldest", label: "Sort: Oldest First" }
                ]}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Main Results State Display */}
      {loading ? (
        <TableSkeleton rows={4} cols={7} />
      ) : error ? (
        <div className="bg-white border border-[#FCA5A5] rounded-2xl p-8 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#111827]">Could Not Load Examination Results</h3>
            <p className="text-xs text-[#64748B] mt-1 max-w-md mx-auto">{error}</p>
          </div>
          <Button variant="primary" size="sm" icon={RefreshCw} onClick={fetchResults}>
            Retry Loading Results
          </Button>
        </div>
      ) : results.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No Examination Results Yet"
          description="Complete and submit an active examination to generate certified scorecards, rank evaluation, and question transcripts."
          actionLabel="Explore Available Exams"
          actionHref="/student/exams"
        />
      ) : filteredResults.length === 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 text-center space-y-2">
          <HelpCircle className="w-8 h-8 text-[#94A3B8] mx-auto" />
          <p className="text-sm font-bold text-[#111827]">No results matching your filters</p>
          <p className="text-xs text-[#64748B]">Try clearing your search query or subject filter.</p>
        </div>
      ) : (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xs">
          {/* Desktop Table View (md and up) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Examination</th>
                  <th className="px-4 py-3.5">Score / Max</th>
                  <th className="px-4 py-3.5">Percentage</th>
                  <th className="px-4 py-3.5">Accuracy</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Questions & Time</th>
                  <th className="px-4 py-3.5">Evaluation Date</th>
                  <th className="px-5 py-3.5 text-right">Scorecard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {paginatedResults.map((r) => {
                  const correct = Number(r.correctCount) || 0;
                  const incorrect = Number(r.incorrectCount) || 0;
                  const unanswered = Number(r.unansweredCount) || 0;
                  const attempted = Number(r.attemptedCount) || (correct + incorrect);
                  const isPassed = r.resultStatus === "passed" || Number(r.percentage) >= 40;

                  return (
                    <tr key={r.id} className="hover:bg-[#F8FAFC]/70 transition-colors">
                      <td className="px-5 py-4 font-bold text-[#111827]">
                        <p className="line-clamp-1">{r.testTitle}</p>
                        <span className="text-[11px] text-[#64748B] font-normal">
                          Subject: {r.subject || "General"}
                        </span>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap font-bold text-[#111827]">
                        <span className="text-[#16A34A]">{r.totalScore}</span> / {r.maximumMarks}
                        {r.positiveMarks !== undefined && (
                          <div className="text-[10px] text-[#64748B] font-normal">
                            +{r.positiveMarks} / -{r.negativeMarks || 0}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <Badge variant={isPassed ? "primary" : "secondary"} size="xs">
                          {r.percentage}%
                        </Badge>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap font-medium text-[#64748B]">
                        {r.accuracy}%
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <Badge variant={isPassed ? "success" : "danger"} size="xs">
                          {isPassed ? "PASSED" : "FAILED"}
                        </Badge>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <span className="text-[#16A34A] font-bold" title="Correct">+{correct}</span>
                          <span className="text-[#EF4444] font-bold" title="Incorrect">-{incorrect}</span>
                          <span className="text-[#94A3B8]" title="Unanswered">{unanswered} unans</span>
                        </div>
                        <div className="text-[10px] text-[#64748B] flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>{r.timeTaken || `${attempted} attempted`}</span>
                        </div>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap text-[#64748B]">
                        {formatDate(r.evaluatedAt || r.submittedAt)}
                      </td>

                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <Link
                          to={`/student/results/${r.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-xs font-bold text-[#2563EB] hover:bg-[#DBEAFE] transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Scorecard
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View (under md) */}
          <div className="md:hidden divide-y divide-[#E2E8F0]">
            {paginatedResults.map((r) => {
              const correct = Number(r.correctCount) || 0;
              const incorrect = Number(r.incorrectCount) || 0;
              const unanswered = Number(r.unansweredCount) || 0;
              const attempted = Number(r.attemptedCount) || (correct + incorrect);
              const isPassed = r.resultStatus === "passed" || Number(r.percentage) >= 40;

              return (
                <div key={r.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-[#111827]">{r.testTitle}</h4>
                      <span className="text-[11px] text-[#64748B]">
                        {r.subject || "General"} &bull; {formatDate(r.evaluatedAt || r.submittedAt)}
                      </span>
                    </div>
                    <Badge variant={isPassed ? "success" : "danger"} size="xs">
                      {isPassed ? "PASSED" : "FAILED"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-[#F8FAFC] p-2.5 rounded-xl text-center text-xs">
                    <div>
                      <span className="text-[10px] text-[#64748B] block">Score</span>
                      <span className="font-black text-[#16A34A]">{r.totalScore}</span> / {r.maximumMarks}
                    </div>
                    <div>
                      <span className="text-[10px] text-[#64748B] block">Percentage</span>
                      <span className="font-bold text-[#111827]">{r.percentage}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#64748B] block">Accuracy</span>
                      <span className="font-bold text-[#2563EB]">{r.accuracy}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                    <div className="flex items-center gap-2">
                      <span className="text-[#16A34A] font-bold">+{correct} Correct</span>
                      <span className="text-[#EF4444] font-bold">-{incorrect} Wrong</span>
                      <span>{unanswered} Skip</span>
                    </div>
                    {r.timeTaken && (
                      <span className="flex items-center gap-1 text-[10px]">
                        <Clock className="w-3 h-3" /> {r.timeTaken}
                      </span>
                    )}
                  </div>

                  <Link
                    to={`/student/results/${r.id}`}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-xs font-bold text-[#2563EB] hover:bg-[#DBEAFE] transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Certified Scorecard
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC]">
              <span className="text-xs text-[#64748B]">
                Showing Page <strong className="text-[#111827]">{currentPage}</strong> of{" "}
                <strong className="text-[#111827]">{totalPages}</strong> ({filteredResults.length} total results)
              </span>

              <div className="flex items-center gap-2">
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  icon={ChevronLeft}
                >
                  Previous
                </Button>
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  icon={ChevronRight}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
