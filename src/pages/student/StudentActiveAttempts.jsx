import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getStudentAttempts } from "../../services/firebase/studentService";
import { Clock, Play, BookOpen } from "lucide-react";

export default function StudentActiveAttempts() {
  const { currentUser } = useAuth();
  const [activeAttempts, setActiveAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!currentUser) return;
      try {
        const attempts = await getStudentAttempts(currentUser.uid);
        const now = Date.now();
        const active = (attempts || []).filter((a) => {
          if (a.status !== "in_progress") return false;
          const deadline = new Date(a.deadlineAt).getTime();
          return deadline > now;
        });
        setActiveAttempts(active);
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
        <h1 className="text-2xl font-black text-[#111A36]">Active Attempts</h1>
        <p className="text-xs text-[#64748B] mt-1">
          Examinations currently in progress that have not reached their authoritative deadline.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-[#E5ECF5] shadow-xs">
        {loading ? (
          <div className="p-8 text-center text-xs text-[#64748B]">Checking active attempts...</div>
        ) : activeAttempts.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-10 h-10 text-[#94A3B8] mx-auto mb-3" />
            <p className="text-sm font-bold text-[#111A36]">No Active Exams Right Now</p>
            <p className="text-xs text-[#64748B] mt-1 mb-5">
              You do not have any pending tests in progress. Choose an exam from Explore Exams to start.
            </p>
            <Link
              to="/student/exams"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0866F5] text-white font-bold text-xs shadow-xs hover:bg-[#0754D1]"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore Exams</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {activeAttempts.map((att) => (
              <div
                key={att.id}
                className="p-5 rounded-2xl bg-[#F8FAFD] border border-[#E5ECF5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-[#EAF2FF] text-[#0866F5] text-[10px] font-bold">
                      In Progress
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#111A36]">{att.testTitle}</h3>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Deadline: {new Date(att.deadlineAt).toLocaleTimeString()}
                  </p>
                </div>

                <Link
                  to={`/student/attempts/${att.id}`}
                  className="px-5 py-2.5 rounded-xl bg-[#0866F5] hover:bg-[#0754D1] text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Resume Examination</span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
