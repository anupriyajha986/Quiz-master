import React from "react";
import {
  X,
  FileText,
  Clock,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
  ArrowRight
} from "lucide-react";

export default function ExamInstructionsModal({ isOpen, onClose, test }) {
  if (!isOpen) return null;

  const pos = test?.markingScheme?.positiveMarks ?? 4;
  const neg = test?.markingScheme?.negativeMarks ?? 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl border border-[#DCE5F0] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-label="Examination Guidelines & Instructions"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DCE5F0] bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#0B63F6]" />
            <h3 className="text-base font-bold text-[#111C3A]">
              Official Examination Instructions
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-[#52627F] leading-relaxed">
          {/* Summary Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#F0F6FF] border border-[#BFDBFE] rounded-xl text-center">
            <div>
              <span className="text-[10px] text-[#52627F] uppercase tracking-wider block">Duration</span>
              <span className="text-sm font-bold text-[#0B63F6]">
                {test?.durationMinutes || 180} Minutes
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#52627F] uppercase tracking-wider block">Total Questions</span>
              <span className="text-sm font-bold text-[#0B63F6]">
                {test?.publishedQuestionsSnapshot?.length || test?.questionCount || 90}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#52627F] uppercase tracking-wider block">Correct Score</span>
              <span className="text-sm font-bold text-[#16A34A]">+{pos} Marks</span>
            </div>
            <div>
              <span className="text-[10px] text-[#52627F] uppercase tracking-wider block">Incorrect Penalty</span>
              <span className="text-sm font-bold text-[#DC2626]">-{neg} Mark</span>
            </div>
          </div>

          {/* Section 1: Palette Symbols */}
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-[#111C3A] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#25A56A]" /> 1. Question Palette State Legend
            </h4>
            <p>The right sidebar question palette visually indicates question statuses in real-time:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-[11px]">
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="w-5 h-5 rounded bg-[#F1F5F9] border border-[#E2E8F0] shrink-0" />
                <span><strong>Not Visited:</strong> Question has not been opened yet.</span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="w-5 h-5 rounded bg-white border border-[#CBD5E1] shrink-0" />
                <span><strong>Not Answered:</strong> Question viewed without selecting an answer.</span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="w-5 h-5 rounded bg-[#25A56A] text-white flex items-center justify-center font-bold text-[10px] shrink-0">✓</span>
                <span><strong>Answered:</strong> Answer saved to server.</span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="w-5 h-5 rounded bg-[#8B5CF6] text-white flex items-center justify-center font-bold text-[10px] shrink-0">★</span>
                <span><strong>Marked for Review:</strong> Question flagged for subsequent check.</span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="w-5 h-5 rounded bg-[#A78BFA] border border-[#8B5CF6] shrink-0" />
                <span><strong>Answered & Marked:</strong> Answered and flagged for review.</span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="w-5 h-5 rounded bg-white border-2 border-[#0B63F6] shrink-0" />
                <span><strong>Current Question:</strong> Active question in view.</span>
              </div>
            </div>
          </div>

          {/* Section 2: Navigation Guidelines */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-sm text-[#111C3A] flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-[#0B63F6]" /> 2. Navigation & Answering Procedure
            </h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Click anywhere on an option card to select it.</li>
              <li>Click <strong>Save & Next</strong> to persist your response and advance to the next question.</li>
              <li>Click <strong>Clear</strong> to cancel your current selection.</li>
              <li>Click <strong>Mark for Review</strong> to flag the question without losing answers.</li>
              <li>You may jump directly to any question by clicking its number in the question palette.</li>
            </ul>
          </div>

          {/* Section 3: Timer & Resilience */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-sm text-[#111C3A] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#16A34A]" /> 3. Countdown & Submission Security
            </h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>The timer countdown is synchronized with the authoritative server deadline.</li>
              <li>Refreshing the browser will <strong>not</strong> reset your time or discard saved responses.</li>
              <li>When the timer reaches 00:00:00, the examination will automatically submit and finalize.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F8FAFC] border-t border-[#DCE5F0] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-[#0B63F6] hover:bg-[#084FC7] text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
          >
            Return to Examination
          </button>
        </div>
      </div>
    </div>
  );
}
