import React from "react";
import { X, BarChart2, CheckCircle2, Clock, HelpCircle, Bookmark } from "lucide-react";

export default function ExamAnalysisModal({
  isOpen,
  onClose,
  totalQuestions = 0,
  answeredCount = 0,
  unansweredCount = 0,
  markedCount = 0,
  secondsRemaining,
  durationMinutes = 180,
  subjectStats = {}
}) {
  if (!isOpen) return null;

  const totalSeconds = durationMinutes * 60;
  const elapsedSeconds = secondsRemaining !== null ? Math.max(0, totalSeconds - secondsRemaining) : 0;
  const progressPct = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs">
      <div
        className="w-full max-w-lg bg-white rounded-2xl border border-[#DCE5F0] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-label="Live Examination Progress Analysis"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DCE5F0] bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-[#0B63F6]" />
            <h3 className="text-base font-bold text-[#111C3A]">
              Live Examination Progress Analysis
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#111827] hover:bg-[#E2E8F0] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs text-[#52627F]">
          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between mb-1.5 font-bold text-[#111C3A]">
              <span>Overall Completion</span>
              <span className="text-[#0B63F6]">{progressPct}%</span>
            </div>
            <div className="w-full h-3 bg-[#F1F5F9] rounded-full overflow-hidden border border-[#E2E8F0]">
              <div
                className="h-full bg-[#0B63F6] rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7]">
              <span className="text-[10px] text-[#16A34A] uppercase font-bold block">
                Answered
              </span>
              <span className="text-xl font-black text-[#15803D]">
                {answeredCount}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#FEF2F2] border border-[#FEE2E2]">
              <span className="text-[10px] text-[#DC2626] uppercase font-bold block">
                Unanswered
              </span>
              <span className="text-xl font-black text-[#B91C1C]">
                {unansweredCount}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF5FF] border border-[#F3E8FF]">
              <span className="text-[10px] text-[#8B5CF6] uppercase font-bold block">
                Marked
              </span>
              <span className="text-xl font-black text-[#6D28D9]">
                {markedCount}
              </span>
            </div>
          </div>

          {/* Subject Breakdown */}
          <div className="border border-[#DCE5F0] rounded-xl p-4 bg-[#F8FAFC]">
            <h4 className="font-bold text-[#111C3A] mb-3 text-xs">
              Subject-Wise Attempt Metrics
            </h4>
            <div className="space-y-2.5">
              {Object.entries(subjectStats).map(([subj, stats]) => {
                const subjPct = stats.total > 0 ? Math.round((stats.attempted / stats.total) * 100) : 0;
                return (
                  <div key={subj}>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-bold text-[#111C3A]">{subj}</span>
                      <span>
                        {stats.attempted} / {stats.total} attempted ({subjPct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0B63F6] rounded-full"
                        style={{ width: `${subjPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F8FAFC] border-t border-[#DCE5F0] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-[#0B63F6] hover:bg-[#084FC7] text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
          >
            Resume Examination
          </button>
        </div>
      </div>
    </div>
  );
}
