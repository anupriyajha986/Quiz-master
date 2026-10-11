import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Play, Eye, Award } from "lucide-react";
import { formatDate } from "../../../utils/formatters";

export default function RecentTestsTable({ recentResults = [], activeAttempt }) {
  const rows = (recentResults || []).map((r, i) => ({
    id: r.id || `result-${i}`,
    testName: r.testTitle || `Examination`,
    subject: r.subject || "General",
    date: r.evaluatedAt ? formatDate(r.evaluatedAt) : "Recent",
    score: `${r.percentage}%`,
    status: "Completed",
    statusColor: "bg-[#E9FAF0] text-[#16B866]",
    actionText: "View Result",
    actionLink: `/student/results/${r.id}`,
    isResume: false
  }));

  if (activeAttempt) {
    rows.unshift({
      id: activeAttempt.id,
      testName: activeAttempt.testTitle || "In-Progress Test",
      subject: activeAttempt.subject || "General",
      date: "Active Now",
      score: "-",
      status: "In Progress",
      statusColor: "bg-[#EAF2FF] text-[#0866F5]",
      actionText: "Resume",
      actionLink: `/student/attempts/${activeAttempt.id}`,
      isResume: true
    });
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#E5ECF5] shadow-xs flex flex-col justify-between">
      {/* Table Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9] mb-4">
        <h3 className="text-base font-black text-[#111A36]">My Recent Tests</h3>
        <Link
          to="/student/results"
          className="text-xs font-bold text-[#0866F5] hover:text-[#0754D1] flex items-center gap-1 transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Table Body */}
      {/* Table Body or Empty State */}
      {rows.length === 0 ? (
        <div className="text-center py-8 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#F8FAFD] text-[#94A3B8] flex items-center justify-center mx-auto">
            <Award className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-[#111A36]">No test history recorded yet</p>
          <p className="text-[11px] text-[#64748B]">
            Once you submit and complete practice examinations, your score transcripts will be listed here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto scrollbar-none">
          <table className="w-full text-left text-xs min-w-[500px]">
            <thead>
              <tr className="border-b border-[#F1F5F9] text-[#64748B] text-[11px] font-bold">
                <th className="pb-3 font-semibold">Test Name</th>
                <th className="pb-3 font-semibold">Subject</th>
                <th className="pb-3 font-semibold">Attempt Date</th>
                <th className="pb-3 font-semibold">Score</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F8FAFD]">
              {rows.slice(0, 4).map((row) => (
                <tr key={row.id} className="hover:bg-[#F8FAFD] transition-colors">
                  <td className="py-3 font-bold text-[#111A36] truncate max-w-[160px]">
                    {row.testName}
                  </td>
                  <td className="py-3 text-[#64748B]">{row.subject}</td>
                  <td className="py-3 text-[#64748B]">{row.date}</td>
                  <td className="py-3 font-black text-[#111A36]">{row.score}</td>
                  <td className="py-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black ${row.statusColor}`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3 text-right pr-2">
                    <Link
                      to={row.actionLink}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        row.isResume
                          ? "bg-[#0866F5] text-white hover:bg-[#0754D1] shadow-2xs"
                          : "bg-[#F3F7FD] text-[#0866F5] hover:bg-[#EAF2FF]"
                      }`}
                    >
                      {row.isResume ? <Play className="w-3 h-3 fill-current" /> : <Eye className="w-3 h-3" />}
                      <span>{row.actionText}</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
