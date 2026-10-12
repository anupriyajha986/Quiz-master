import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getStudentAttempts, getStudentResults } from "../../services/firebase/studentService";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import { TableSkeleton } from "../../components/common/LoadingSkeleton";
import { formatDate, formatDuration } from "../../utils/formatters";
import {
  History,
  Eye,
  Play,
  RotateCcw,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ChevronLeft,
  ChevronRight,
  Award
} from "lucide-react";

export default function StudentHistory() {
  const { currentUser } = useAuth();
  const [attempts, setAttempts] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    async function loadHistory() {
      if (!currentUser?.uid) return;
      setLoading(true);
      try {
        const [attemptsData, resultsData] = await Promise.all([
          getStudentAttempts(currentUser.uid),
          getStudentResults(currentUser.uid)
        ]);
        setAttempts(attemptsData || []);
        setResults(resultsData || []);
      } catch (err) {
        console.error("Failed to load student history:", err);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, [currentUser]);

  // Results lookup by attemptId or testId
  const resultsByAttemptId = useMemo(() => {
    const map = {};
    results.forEach((r) => {
      if (r.attemptId) map[r.attemptId] = r;
      if (r.id) map[r.id] = r;
    });
    return map;
  }, [results]);

  // Enriched history records
  const historyRecords = useMemo(() => {
    const now = Date.now();

    return attempts.map((att) => {
      const associatedResult =
        (att.resultId && resultsByAttemptId[att.resultId]) ||
        resultsByAttemptId[att.id] ||
        null;

      const deadlineMs = att.deadlineAt?.toMillis
        ? att.deadlineAt.toMillis()
        : new Date(att.deadlineAt || 0).getTime();
      const isExpired = att.status === "in_progress" && deadlineMs > 0 && deadlineMs < now;

      const answered = att.responseSummary?.answered ?? 0;
      const unanswered = att.responseSummary?.unanswered ?? 0;
      const totalQ = answered + unanswered;

      return {
        ...att,
        associatedResult,
        isExpired,
        answered,
        totalQ
      };
    });
  }, [attempts, resultsByAttemptId]);

  // Extract unique subjects
  const subjects = useMemo(() => {
    return Array.from(new Set(historyRecords.map((h) => h.subject || h.testTitle?.split("—")[0]?.trim()).filter(Boolean)));
  }, [historyRecords]);

  // Filtered and sorted
  const filteredRecords = useMemo(() => {
    const list = historyRecords.filter((rec) => {
      // Subject filter
      if (filterSubject !== "all") {
        const subj = (rec.subject || rec.testTitle || "").toLowerCase();
        if (!subj.includes(filterSubject.toLowerCase())) return false;
      }

      // Status filter
      if (filterStatus !== "all") {
        if (filterStatus === "submitted" && rec.status !== "submitted") return false;
        if (filterStatus === "in_progress" && (rec.status !== "in_progress" || rec.isExpired)) return false;
        if (filterStatus === "expired" && !rec.isExpired) return false;
      }

      // Search
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const titleMatch = (rec.testTitle || "").toLowerCase().includes(term);
        const subjMatch = (rec.subject || "").toLowerCase().includes(term);
        if (!titleMatch && !subjMatch) return false;
      }

      return true;
    });

    list.sort((a, b) => {
      if (sortBy === "highest_score") {
        const scoreA = a.associatedResult?.totalScore ?? -999;
        const scoreB = b.associatedResult?.totalScore ?? -999;
        return scoreB - scoreA;
      }
      if (sortBy === "oldest") {
        const tA = new Date(a.startedAt || 0).getTime();
        const tB = new Date(b.startedAt || 0).getTime();
        return tA - tB;
      }
      // default: newest
      const tA = new Date(a.startedAt || 0).getTime();
      const tB = new Date(b.startedAt || 0).getTime();
      return tB - tA;
    });

    return list;
  }, [historyRecords, filterSubject, filterStatus, searchTerm, sortBy]);

  // Paginated Slice
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs">
        <div>
          <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider flex items-center gap-1.5">
            <History className="w-3.5 h-3.5" /> Comprehensive Session Audit Trail
          </span>
          <h1 className="text-2xl font-black text-[#111827] tracking-tight mt-0.5">
            Practice & Attempt History
          </h1>
          <p className="text-xs text-[#64748B] mt-1 max-w-2xl leading-relaxed">
            Immutable log of all examination attempts, start timestamps, answers recorded, and submission outcomes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="primary" size="sm">
            {attempts.length} Total {attempts.length === 1 ? "Session" : "Sessions"}
          </Badge>
        </div>
      </div>

      {/* Filter and Search Bar */}
      {attempts.length > 0 && (
        <Card className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6">
              <Input
                icon={Search}
                placeholder="Search history by test title..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div className="sm:col-span-3">
              <Select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
                options={[
                  { value: "all", label: "All Statuses" },
                  { value: "submitted", label: "Submitted" },
                  { value: "in_progress", label: "In Progress" },
                  { value: "expired", label: "Expired Sessions" }
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
                  { value: "newest", label: "Sort: Newest First" },
                  { value: "highest_score", label: "Sort: Highest Score" },
                  { value: "oldest", label: "Sort: Oldest First" }
                ]}
              />
            </div>
          </div>
        </Card>
      )}

      {/* History Table */}
      {loading ? (
        <TableSkeleton rows={4} cols={5} />
      ) : attempts.length === 0 ? (
        <EmptyState
          icon={History}
          title="No Practice or Attempt Records Yet"
          description="Your examination sessions, answer saves, and submission histories will appear here once you begin practicing."
          actionLabel="Explore Available Exams"
          actionHref="/student/exams"
        />
      ) : filteredRecords.length === 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-[#94A3B8] mx-auto" />
          <p className="text-sm font-bold text-[#111827]">No records matching filters</p>
          <p className="text-xs text-[#64748B]">Try resetting your search query or status filter.</p>
        </div>
      ) : (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Examination</th>
                  <th className="px-4 py-3.5">Started At</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Questions Attempted</th>
                  <th className="px-4 py-3.5">Score / Max</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {paginatedRecords.map((att) => {
                  const res = att.associatedResult;
                  const isSubmitted = att.status === "submitted";
                  const isInProgress = att.status === "in_progress" && !att.isExpired;

                  return (
                    <tr key={att.id} className="hover:bg-[#F8FAFC]/70 transition-colors">
                      <td className="px-5 py-4 font-bold text-[#111827]">
                        <p className="line-clamp-1">{att.testTitle || "Mock Test"}</p>
                        <span className="text-[11px] text-[#64748B] font-mono">
                          ID: {att.id.slice(0, 10)}...
                        </span>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap text-[#64748B]">
                        {formatDate(att.startedAt)}
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        {isSubmitted ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E9FAF0] text-[#16B866]">
                            <CheckCircle2 className="w-3 h-3" /> Submitted
                          </span>
                        ) : isInProgress ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF2FF] text-[#0866F5]">
                            <Clock className="w-3 h-3" /> In Progress
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F1F5F9] text-[#64748B]">
                            <AlertCircle className="w-3 h-3" /> Expired
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap font-medium text-[#111827]">
                        {att.answered} {att.totalQ > 0 ? `/ ${att.totalQ} Qs` : "answered"}
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap font-bold text-[#111827]">
                        {res ? (
                          <span>
                            <strong className="text-[#16A34A]">{res.totalScore}</strong> / {res.maximumMarks}{" "}
                            <span className="text-[#64748B] font-normal text-[11px]">({res.percentage}%)</span>
                          </span>
                        ) : (
                          <span className="text-[#94A3B8] font-normal">-</span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {isInProgress ? (
                            <Link
                              to={`/student/attempts/${att.id}`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0866F5] text-white text-xs font-bold hover:bg-[#0754D1] transition-colors"
                            >
                              <Play className="w-3 h-3 fill-current" /> Resume
                            </Link>
                          ) : res ? (
                            <Link
                              to={`/student/results/${res.id}`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-xs font-bold text-[#2563EB] hover:bg-[#DBEAFE] transition-colors"
                            >
                              <Eye className="w-3 h-3" /> Scorecard
                            </Link>
                          ) : (
                            <Link
                              to={`/student/results/${att.id}`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#F8FAFD] border border-[#E2E8F0] text-xs font-semibold text-[#64748B] hover:text-[#111827]"
                            >
                              Details
                            </Link>
                          )}

                          {att.testId && (
                            <Link
                              to={`/student/exams/${att.testId}/instructions`}
                              className="p-1.5 rounded-lg text-[#64748B] hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-colors"
                              title="Retake or review test"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC]">
              <span className="text-xs text-[#64748B]">
                Showing Page <strong className="text-[#111827]">{currentPage}</strong> of{" "}
                <strong className="text-[#111827]">{totalPages}</strong> ({filteredRecords.length} total attempts)
              </span>

              <div className="flex items-center gap-2">
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  icon={ChevronLeft}
                >
                  Previous
                </Button>
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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
