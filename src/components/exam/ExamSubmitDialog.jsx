import React from "react";
import {
  Send,
  AlertTriangle,
  Clock,
  CheckCircle2,
  HelpCircle,
  Bookmark,
  Loader2
} from "lucide-react";
import { formatTimeRemaining } from "../../utils/formatters";

export default function ExamSubmitDialog({
  isOpen,
  onClose,
  onConfirmSubmit,
  isSubmitting,
  totalQuestions = 0,
  answeredCount = 0,
  unansweredCount = 0,
  markedCount = 0,
  secondsRemaining = 0
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs">
      <div
        className="w-full max-w-md bg-white rounded-2xl border border-[#DCE5F0] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-label="Confirm Final Examination Submission"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#DCE5F0] bg-[#FFF1F2] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FEE2E2] text-[#E11D48] flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#111C3A]">
              Final Examination Submission
            </h3>
            <p className="text-xs text-[#E11D48]">
              Are you sure you want to finish your test?
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-[#52627F] leading-relaxed">
            Please review your attempt summary below. Once submitted, answers cannot be edited and your responses will be sent for authoritative evaluation.
          </p>

          {/* Time Remaining Callout */}
          <div className="p-3 bg-[#F0F6FF] border border-[#BFDBFE] rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#0B63F6] font-semibold">
              <Clock className="w-4 h-4" />
              <span>Time Left:</span>
            </div>
            <span className="font-mono font-black text-sm text-[#0B63F6]">
              {secondsRemaining !== null ? formatTimeRemaining(secondsRemaining) : "--:--:--"}
            </span>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 text-center p-3.5 bg-[#F8FAFC] border border-[#DCE5F0] rounded-xl text-xs">
            <div>
              <span className="text-[10px] text-[#52627F] block">Answered</span>
              <span className="text-lg font-black text-[#16A34A]">
                {answeredCount}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-[#52627F] block">Unanswered</span>
              <span className="text-lg font-black text-[#DC2626]">
                {unansweredCount}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-[#52627F] block">Marked Review</span>
              <span className="text-lg font-black text-[#8B5CF6]">
                {markedCount}
              </span>
            </div>
          </div>

          {unansweredCount > 0 && (
            <div className="p-3 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl text-[11px] text-[#B45309] flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                You still have <strong>{unansweredCount}</strong> unanswered questions. Unattempted questions will receive 0 marks.
              </span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#DCE5F0] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="border border-[#DCE5F0] hover:bg-white text-[#111C3A] font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer select-none"
          >
            Continue Exam
          </button>

          <button
            type="button"
            onClick={onConfirmSubmit}
            disabled={isSubmitting}
            className="bg-[#F43F5E] hover:bg-[#E11D48] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all duration-150 flex items-center gap-2 cursor-pointer select-none active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Evaluating...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Confirm Final Submission</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
