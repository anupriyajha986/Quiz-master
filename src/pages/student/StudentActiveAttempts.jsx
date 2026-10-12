import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getStudentAttempts } from "../../services/firebase/studentService";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import EmptyState from "../../components/common/EmptyState";
import { CardSkeleton } from "../../components/common/LoadingSkeleton";
import { formatDuration } from "../../utils/formatters";
import {
  Clock,
  Play,
  BookOpen,
  AlertCircle,
  FileCheck2,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function StudentActiveAttempts() {
  const { currentUser } = useAuth();
  const [activeAttempts, setActiveAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(Date.now());

  // Clock tick to keep remaining time live
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadAttempts = async () => {
    if (!currentUser?.uid) return;
    setLoading(true);
    try {
      const attempts = await getStudentAttempts(currentUser.uid);
      const currentTime = Date.now();
      const active = (attempts || []).filter((a) => {
        if (a.status !== "in_progress") return false;
        const deadline = a.deadlineAt?.toMillis
          ? a.deadlineAt.toMillis()
          : new Date(a.deadlineAt).getTime();
        return deadline > currentTime;
      });
      setActiveAttempts(active);
    } catch (err) {
      console.error("Error loading active attempts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttempts();
  }, [currentUser]);

  // Format countdown string
  const formatTimeRemaining = (deadlineAt) => {
    if (!deadlineAt) return "N/A";
    const deadlineMs = deadlineAt?.toMillis
      ? deadlineAt.toMillis()
      : new Date(deadlineAt).getTime();
    const diffSeconds = Math.max(0, Math.floor((deadlineMs - now) / 1000));

    if (diffSeconds <= 0) return "Expired";

    const hours = Math.floor(diffSeconds / 3600);
    const minutes = Math.floor((diffSeconds % 3600) / 60);
    const seconds = diffSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs">
        <div>
          <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Real-Time Session Tracker
          </span>
          <h1 className="text-2xl font-black text-[#111827] tracking-tight mt-0.5">
            Active Examinations
          </h1>
          <p className="text-xs text-[#64748B] mt-1 max-w-2xl leading-relaxed">
            Ongoing test sessions that are currently in progress. Resuming restores your saved answers and authoritative server countdown timer.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="primary" size="sm">
            {activeAttempts.length} Active {activeAttempts.length === 1 ? "Session" : "Sessions"}
          </Badge>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : activeAttempts.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No Active Examination Sessions"
          description="You currently have no tests in progress. You can explore available examinations and start when you are ready."
          actionLabel="Explore Available Exams"
          actionHref="/student/exams"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeAttempts.map((att) => {
            const timeRemaining = formatTimeRemaining(att.deadlineAt);
            const isExpired = timeRemaining === "Expired";

            const answered = att.responseSummary?.answered ?? 0;
            const unanswered = att.responseSummary?.unanswered ?? 0;
            const totalQ = answered + unanswered;
            const progress = totalQ > 0 ? Math.round((answered / totalQ) * 100) : 0;

            const startedFormatted = att.startedAt?.toMillis
              ? new Date(att.startedAt.toMillis()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : att.startedAt
              ? new Date(att.startedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : "Recently";

            const deadlineFormatted = att.deadlineAt?.toMillis
              ? new Date(att.deadlineAt.toMillis()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : att.deadlineAt
              ? new Date(att.deadlineAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : "Soon";

            return (
              <Card
                key={att.id}
                className="p-6 flex flex-col justify-between hover:border-[#CBD5E1] transition-all hover:shadow-xs border-l-4 border-l-[#0866F5]"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#EAF2FF] text-[#0866F5] border border-[#BFDBFE]">
                      In Progress
                    </span>
                    <span className="text-xs font-mono font-bold text-[#64748B]">
                      ID: {att.id.slice(0, 8)}...
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-[#111827] line-clamp-1 mb-1">
                    {att.testTitle || "Mock Test"}
                  </h3>
                  <p className="text-xs text-[#64748B] mb-4">
                    Started at {startedFormatted} &bull; Deadline: {deadlineFormatted}
                  </p>

                  {/* Live Timer & Progress Row */}
                  <div className="grid grid-cols-2 gap-3 p-4 bg-[#F8FAFD] border border-[#E5ECF5] rounded-xl mb-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#64748B] block">
                        Time Remaining
                      </span>
                      <span className={`text-base font-black ${isExpired ? "text-[#EF4444]" : "text-[#0866F5]"}`}>
                        {timeRemaining}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#64748B] block">
                        Answer Progress
                      </span>
                      <span className="text-base font-black text-[#111827]">
                        {answered} {totalQ > 0 ? `/ ${totalQ} Qs` : "Answered"}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {totalQ > 0 && (
                    <div className="space-y-1.5 mb-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-[#64748B]">
                        <span>Completion Rate</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#E5ECF5] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#0866F5] transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between gap-3">
                  <span className="text-[11px] text-[#64748B]">
                    Answers auto-saved to cloud
                  </span>

                  {isExpired ? (
                    <Button size="sm" variant="outline" disabled>
                      Attempt Expired
                    </Button>
                  ) : (
                    <Link to={`/student/attempts/${att.id}`}>
                      <Button size="sm" variant="success" icon={Play}>
                        Resume Test
                      </Button>
                    </Link>
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
