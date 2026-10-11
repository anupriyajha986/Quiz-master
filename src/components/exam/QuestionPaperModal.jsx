import React, { useState } from "react";
import { X, FileSpreadsheet, ArrowRight } from "lucide-react";
import MathRenderer from "./MathRenderer";

export default function QuestionPaperModal({
  isOpen,
  onClose,
  questions = [],
  subjects = [],
  responses = {},
  onJumpToQuestion
}) {
  const [selectedSubject, setSelectedSubject] = useState(subjects[0] || "All");

  if (!isOpen) return null;

  const filteredQuestions = questions.map((q, idx) => ({ ...q, globalIndex: idx }))
    .filter((q) => selectedSubject === "All" || q.subject === selectedSubject);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs">
      <div
        className="w-full max-w-4xl bg-white rounded-2xl border border-[#DCE5F0] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-label="Full Examination Question Paper"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DCE5F0] bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-[#0B63F6]" />
            <h3 className="text-base font-bold text-[#111C3A]">
              Examination Question Paper Overview
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

        {/* Subject Filter Pills */}
        <div className="px-6 py-3 border-b border-[#E2E8F0] bg-white flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setSelectedSubject("All")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              selectedSubject === "All"
                ? "bg-[#0B63F6] text-white"
                : "bg-[#F1F5F9] text-[#52627F] hover:bg-[#E2E8F0]"
            }`}
          >
            All Subjects ({questions.length})
          </button>
          {subjects.map((s) => {
            const count = questions.filter((q) => q.subject === s).length;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedSubject(s)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedSubject === s
                    ? "bg-[#0B63F6] text-white"
                    : "bg-[#F1F5F9] text-[#52627F] hover:bg-[#E2E8F0]"
                }`}
              >
                {s} ({count})
              </button>
            );
          })}
        </div>

        {/* Questions List */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {filteredQuestions.map((q) => {
            const resp = responses[q.id];
            const hasAnswer =
              resp?.selectedAnswer !== undefined &&
              resp?.selectedAnswer !== null &&
              resp?.selectedAnswer !== "";
            const isMarked = !!resp?.markedForReview;

            return (
              <div
                key={q.id}
                className="p-5 rounded-xl border border-[#DCE5F0] bg-[#F8FAFC] space-y-3"
              >
                {/* Question Top Row */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#0B63F6]">
                      Question {q.globalIndex + 1}
                    </span>
                    <span className="text-[10px] bg-white border border-[#CBD5E1] text-[#52627F] px-2 py-0.5 rounded-full">
                      {q.subject || "General"}
                    </span>
                    <span className="text-[10px] text-[#16A34A] font-semibold">
                      +{q.positiveMarks ?? 4} / -{q.negativeMarks ?? 1}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {hasAnswer && (
                      <span className="bg-[#DCFCE7] text-[#15803D] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#86EFAC]">
                        Answered ({resp.selectedAnswer})
                      </span>
                    )}
                    {isMarked && (
                      <span className="bg-[#FAF5FF] text-[#8B5CF6] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#DDD6FE]">
                        Marked for Review
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        onJumpToQuestion(q.globalIndex);
                        onClose();
                      }}
                      className="text-xs font-bold text-[#0B63F6] hover:text-[#084FC7] flex items-center gap-1 cursor-pointer"
                    >
                      <span>Jump</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Question Statement */}
                <div className="text-sm font-medium text-[#111C3A] leading-relaxed">
                  <MathRenderer text={q.questionText} />
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {q.options?.map((opt) => (
                    <div
                      key={opt.id}
                      className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 ${
                        resp?.selectedAnswer === opt.id
                          ? "bg-[#EFF6FF] border-[#0B63F6] font-semibold text-[#0B63F6]"
                          : "bg-white border-[#E2E8F0] text-[#52627F]"
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full border flex items-center justify-center font-bold text-[10px] shrink-0">
                        {opt.id}
                      </span>
                      <span className="truncate">
                        <MathRenderer text={opt.text} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F8FAFC] border-t border-[#DCE5F0] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-[#0B63F6] hover:bg-[#084FC7] text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
          >
            Close Question Paper
          </button>
        </div>
      </div>
    </div>
  );
}
