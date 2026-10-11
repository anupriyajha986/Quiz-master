import React from "react";
import {
  ChevronLeft,
  Bookmark,
  ArrowRight,
  HelpCircle
} from "lucide-react";
import MathRenderer from "./MathRenderer";

export default function QuestionPanel({
  question,
  currentIndex,
  totalQuestions,
  currentSubjectQuestionIndex,
  currentSubjectTotalQuestions,
  currentResponse = {},
  onSelectOption,
  onClearResponse,
  onToggleReview,
  onPrevious,
  onSaveAndNext,
  onNext,
  canGoPrevious,
  canGoNext,
  saveStatus
}) {
  if (!question) {
    return (
      <div className="bg-white rounded-2xl border border-[#DCE5F0] p-12 text-center text-[#64748B] flex flex-col items-center justify-center min-h-[460px]">
        <HelpCircle className="w-10 h-10 text-[#CBD5E1] mb-2" />
        <p className="text-sm font-semibold">No question available.</p>
      </div>
    );
  }

  const selectedAnswer = currentResponse.selectedAnswer;
  const isMarked = !!currentResponse.markedForReview;

  const posMarks = question.positiveMarks ?? 4;
  const negMarks = question.negativeMarks ?? 1;

  const questionTypeLabel =
    question.questionType === "numerical"
      ? `Numerical (+${posMarks}, -${negMarks})`
      : question.questionType === "multiple_choice"
      ? `Multiple Correct (+${posMarks}, -${negMarks})`
      : `Single Correct (+${posMarks}, -${negMarks})`;

  return (
    <div className="bg-white rounded-2xl border border-[#DCE5F0] p-5 sm:p-7 shadow-xs flex flex-col justify-between min-h-[480px]">
      {/* Top Question Header */}
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-[#DCE5F0] gap-2 flex-wrap">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onPrevious}
              disabled={!canGoPrevious}
              className="w-8 h-8 rounded-lg border border-[#DCE5F0] bg-white hover:bg-[#F5F8FC] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-[#52627F] transition-colors cursor-pointer"
              title="Previous Question"
              aria-label="Previous Question"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-sm sm:text-base font-bold text-[#111C3A]">
              Question {currentSubjectQuestionIndex + 1} of {currentSubjectTotalQuestions || totalQuestions}
            </span>

            <span className="bg-[#EFF6FF] text-[#0B63F6] border border-[#BFDBFE] text-xs font-semibold px-3 py-1 rounded-full">
              {questionTypeLabel}
            </span>
          </div>

          {/* Mark for Review Toggle */}
          <button
            type="button"
            onClick={onToggleReview}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer select-none ${
              isMarked
                ? "bg-[#FAF5FF] border border-[#DDD6FE] text-[#8B5CF6]"
                : "text-[#0B63F6] hover:bg-[#EFF6FF]"
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isMarked ? "fill-[#8B5CF6] text-[#8B5CF6]" : "text-[#0B63F6]"}`} />
            <span>{isMarked ? "Marked for Review" : "Mark for Review"}</span>
          </button>
        </div>

        {/* Question Statement */}
        <div className="py-5">
          <div className="text-[17px] font-medium text-[#111C3A] leading-relaxed">
            <MathRenderer text={question.questionText} />
          </div>

          {/* Attached Diagram / Image if present */}
          {question.imageUrl && (
            <div className="mt-4 max-w-md rounded-xl overflow-hidden border border-[#DCE5F0]">
              <img
                src={question.imageUrl}
                alt="Question diagram"
                className="w-full h-auto object-contain max-h-64"
                loading="lazy"
              />
            </div>
          )}
        </div>

        {/* Options Selection Area */}
        <div className="space-y-3 pb-6">
          {question.questionType === "numerical" ? (
            <div className="p-4 bg-[#F8FAFC] border border-[#DCE5F0] rounded-xl space-y-2">
              <label className="block text-xs font-bold text-[#111C3A]">
                Enter Numerical Answer:
              </label>
              <input
                type="number"
                step="any"
                value={selectedAnswer ?? ""}
                onChange={(e) => onSelectOption(e.target.value)}
                placeholder="Type your numeric value here"
                className="w-full sm:w-64 px-4 py-2.5 rounded-xl border border-[#DCE5F0] bg-white text-sm font-mono font-bold text-[#111C3A] focus:outline-none focus:ring-2 focus:ring-[#0B63F6]"
              />
            </div>
          ) : (
            question.options?.map((opt) => {
              const isSelected = selectedAnswer === opt.id;

              return (
                <div
                  key={opt.id}
                  onClick={() => onSelectOption(opt.id)}
                  className={`p-3.5 sm:p-4 rounded-xl border flex items-center gap-3.5 cursor-pointer transition-all duration-150 select-none ${
                    isSelected
                      ? "bg-[#EFF6FF] border-2 border-[#0B63F6] text-[#111C3A] shadow-xs"
                      : "bg-white border-[#DCE5F0] hover:border-[#BFDBFE] hover:bg-[#FBFDFF] text-[#111C3A]"
                  }`}
                >
                  {/* Radio Indicator */}
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? "border-[#0B63F6] bg-white"
                        : "border-[#DCE5F0] bg-white"
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#0B63F6]" />
                    )}
                  </div>

                  {/* Letter badge: A, B, C, D */}
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 ${
                      isSelected
                        ? "bg-[#0B63F6] border-[#0B63F6] text-white"
                        : "bg-[#F8FAFC] border-[#DCE5F0] text-[#52627F]"
                    }`}
                  >
                    {opt.id}
                  </div>

                  {/* Option Text */}
                  <div className="text-sm sm:text-[15px] font-medium leading-relaxed min-w-0">
                    <MathRenderer text={opt.text} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Bottom Action Controls Bar (Exact Match with Reference Image) */}
      <div className="pt-4 border-t border-[#DCE5F0] flex flex-wrap items-center justify-between gap-3">
        {/* Left: Clear button */}
        <button
          type="button"
          onClick={onClearResponse}
          disabled={selectedAnswer === undefined || selectedAnswer === null || selectedAnswer === ""}
          className="border border-[#DCE5F0] hover:bg-[#F5F8FC] disabled:opacity-40 disabled:cursor-not-allowed text-[#52627F] font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-xl transition-colors cursor-pointer select-none"
        >
          Clear
        </button>

        {/* Center/Right: Save & Next + Next Question -> */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSaveAndNext}
            className="bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#0B63F6] border border-[#BFDBFE] font-bold text-xs sm:text-sm px-6 sm:px-8 py-2.5 rounded-xl transition-all duration-150 cursor-pointer select-none active:scale-95 shadow-2xs"
          >
            Save & Next
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={!canGoNext}
            className="bg-[#0B63F6] hover:bg-[#084FC7] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm px-6 sm:px-8 py-2.5 rounded-xl shadow-xs transition-all duration-150 flex items-center gap-2 cursor-pointer select-none active:scale-95"
          >
            <span>Next Question</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
