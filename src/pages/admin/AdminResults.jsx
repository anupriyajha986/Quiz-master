import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllResults } from "../../services/firebase/analyticsService";
import { getTests } from "../../services/firebase/testService";
import { exportToCsv } from "../../utils/csvExport";
import { useToast } from "../../context/ToastContext";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Badge from "../../components/common/Badge";
import EmptyState from "../../components/common/EmptyState";
import { TableSkeleton } from "../../components/common/LoadingSkeleton";
import { formatDate } from "../../utils/formatters";
import {
  Award,
  Search,
  Download,
  Eye,
  FileCheck2,
  TrendingUp,
  Percent
} from "lucide-react";

export default function AdminResults() {
  const [results, setResults] = useState([]);
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const toast = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const [resData, testData] = await Promise.all([
        getAllResults(selectedTest),
        getTests()
      ]);
      setResults(resData);
      setTests(testData);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load result archives.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedTest]);

  const filteredResults = results.filter((r) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      r.studentName?.toLowerCase().includes(term) ||
      r.rollNumber?.toLowerCase().includes(term) ||
      r.testTitle?.toLowerCase().includes(term)
    );
  });

  const handleExportCsv = () => {
    const headers = [
      { key: "studentName", label: "CandidateName" },
      { key: "rollNumber", label: "RollNumber" },
      { key: "testTitle", label: "TestTitle" },
      { key: "totalScore", label: "Score" },
      { key: "maximumMarks", label: "MaxMarks" },
      { key: "percentage", label: "Percentage" },
      { key: "accuracy", label: "Accuracy" },
      { key: "correctCount", label: "Correct" },
      { key: "incorrectCount", label: "Incorrect" },
      { key: "unansweredCount", label: "Unanswered" }
    ];
    exportToCsv("QuizMaster_Results_Archive.csv", filteredResults, headers);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-[#E2E8F0] rounded-2xl p-6">
        <div>
          <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider">
            Evaluation Ledger
          </span>
          <h1 className="text-2xl font-black text-[#111827] tracking-tight mt-0.5">
            Examination Results Archive
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Access official candidate scorecards, performance metrics, and batch result exports.
          </p>
        </div>

        <Button
          variant="secondary"
          icon={Download}
          size="sm"
          onClick={handleExportCsv}
        >
          Export Results (CSV)
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <Input
              icon={Search}
              placeholder="Search candidate name, roll number, or test title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select
            value={selectedTest}
            onChange={(e) => setSelectedTest(e.target.value)}
          >
            <option value="all">All Examinations</option>
            {tests.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      {/* Results Table */}
      {loading ? (
        <TableSkeleton rows={6} cols={6} />
      ) : filteredResults.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No Results Recorded"
          description="Submitted candidate assessments will appear in this ledger once evaluated."
        />
      ) : (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Candidate Details</th>
                  <th className="px-4 py-3.5">Examination</th>
                  <th className="px-4 py-3.5">Score / Max</th>
                  <th className="px-4 py-3.5">Percentage</th>
                  <th className="px-4 py-3.5">Accuracy</th>
                  <th className="px-4 py-3.5">Evaluation Date</th>
                  <th className="px-5 py-3.5 text-right">Scorecard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredResults.map((r) => (
                  <tr key={r.id} className="hover:bg-[#F8FAFC]/60 transition-colors">
                    <td className="px-5 py-4 font-bold text-[#111827]">
                      <p>{r.studentName}</p>
                      <span className="text-[10px] text-[#64748B] font-mono block">
                        Roll: {r.rollNumber || "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-medium text-[#111827] max-w-xs truncate">
                      {r.testTitle}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap font-bold text-[#111827]">
                      <span className="text-[#16A34A]">{r.totalScore}</span> / {r.maximumMarks}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Badge variant="primary" size="xs">
                        {r.percentage}%
                      </Badge>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap font-medium text-[#64748B]">
                      {r.accuracy}%
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-[#64748B]">
                      {formatDate(r.evaluatedAt)}
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <Link
                        to={`/admin/results/${r.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-xs font-bold text-[#2563EB] hover:bg-[#DBEAFE] transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Report
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
