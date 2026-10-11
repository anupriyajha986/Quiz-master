import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getStudentResults } from "../../services/firebase/studentService";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import EmptyState from "../../components/common/EmptyState";
import { TableSkeleton } from "../../components/common/LoadingSkeleton";
import { formatDate } from "../../utils/formatters";
import { Award, Eye, FileText, ArrowRight, CheckCircle2 } from "lucide-react";

export default function StudentResults() {
  const { currentUser } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResults() {
      if (!currentUser) return;
      setLoading(true);
      try {
        const data = await getStudentResults(currentUser.uid);
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadResults();
  }, [currentUser]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-[#E2E8F0] rounded-2xl p-6">
        <div>
          <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider">
            Academic Performance
          </span>
          <h1 className="text-2xl font-black text-[#111827] tracking-tight mt-0.5">
            My Examination Results
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Access validated assessment scorecards, subject breakdowns, and certified PDF downloads.
          </p>
        </div>
      </div>

      {loading ? (
        <TableSkeleton rows={4} cols={5} />
      ) : results.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No Examination Results Yet"
          description="Complete an active examination to view your performance analytics and scorecard."
        />
      ) : (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Examination</th>
                  <th className="px-4 py-3.5">Score / Max</th>
                  <th className="px-4 py-3.5">Percentage</th>
                  <th className="px-4 py-3.5">Accuracy</th>
                  <th className="px-4 py-3.5">Date Attempted</th>
                  <th className="px-5 py-3.5 text-right">Scorecard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {results.map((r) => (
                  <tr key={r.id} className="hover:bg-[#F8FAFC]/60 transition-colors">
                    <td className="px-5 py-4 font-bold text-[#111827]">
                      <p>{r.testTitle}</p>
                      <span className="text-[11px] text-[#64748B] font-normal">
                        Subject: {r.subject || "General"}
                      </span>
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
                        to={`/student/results/${r.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-xs font-bold text-[#2563EB] hover:bg-[#DBEAFE] transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Scorecard
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
