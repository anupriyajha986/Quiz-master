import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getStudentAttempts } from "../../services/firebase/studentService";
import { History, Eye, Play } from "lucide-react";

export default function StudentHistory() {
  const { currentUser } = useAuth();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!currentUser) return;
      try {
        const list = await getStudentAttempts(currentUser.uid);
        setAttempts(list || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [currentUser]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#111A36]">Practice History</h1>
        <p className="text-xs text-[#64748B] mt-1">
          Complete log of all past attempts, timestamps, and submission records.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-[#E5ECF5] shadow-xs">
        {loading ? (
          <div className="p-8 text-center text-xs text-[#64748B]">Loading history...</div>
        ) : attempts.length === 0 ? (
          <div className="text-center py-12">
            <History className="w-10 h-10 text-[#94A3B8] mx-auto mb-3" />
            <p className="text-sm font-bold text-[#111A36]">No attempt records found</p>
            <p className="text-xs text-[#64748B] mt-1">Start practicing to build your history log.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#F1F5F9] text-[#64748B] font-bold">
                <tr>
                  <th className="pb-3">Test Title</th>
                  <th className="pb-3">Started At</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8FAFD]">
                {attempts.map((att) => (
                  <tr key={att.id} className="hover:bg-[#F8FAFD]">
                    <td className="py-3 font-bold text-[#111A36]">{att.testTitle || "Mock Test"}</td>
                    <td className="py-3 text-[#64748B]">
                      {att.startedAt ? new Date(att.startedAt).toLocaleString("en-GB") : "N/A"}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          att.status === "submitted"
                            ? "bg-[#E9FAF0] text-[#16B866]"
                            : "bg-[#EAF2FF] text-[#0866F5]"
                        }`}
                      >
                        {att.status === "submitted" ? "Submitted" : "In Progress"}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      {att.status === "in_progress" ? (
                        <Link
                          to={`/student/attempts/${att.id}`}
                          className="px-3 py-1 rounded-lg bg-[#0866F5] text-white font-bold text-xs"
                        >
                          Resume
                        </Link>
                      ) : (
                        <Link
                          to={`/student/results/${att.resultId || att.id}`}
                          className="px-3 py-1 rounded-lg bg-[#F3F7FD] text-[#0866F5] font-bold text-xs"
                        >
                          View Results
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
