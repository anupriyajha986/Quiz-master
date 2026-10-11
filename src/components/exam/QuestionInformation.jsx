import React from "react";
import { FileText } from "lucide-react";

export default function QuestionInformation({ question }) {
  if (!question) return null;

  const pos = question.positiveMarks ?? 4;
  const neg = question.negativeMarks ?? 1;

  const difficultyVariant = {
    easy: "bg-[#DCFCE7] text-[#15803D]",
    medium: "bg-[#FEF3C7] text-[#D97706]",
    hard: "bg-[#FEE2E2] text-[#DC2626]"
  };

  const difficulty = (question.difficulty || "medium").toLowerCase();
  const diffBadgeClass = difficultyVariant[difficulty] || difficultyVariant.medium;

  const questionTypeLabel =
    question.questionType === "numerical"
      ? "Numerical"
      : question.questionType === "multiple_choice"
      ? "Multiple Correct"
      : "Single Correct";

  return (
    <div className="bg-white rounded-2xl border border-[#DCE5F0] p-4 shadow-2xs flex flex-col justify-between">
      {/* Card Header */}
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#E2E8F0]">
        <FileText className="w-4 h-4 text-[#0B63F6]" />
        <h4 className="text-xs font-bold text-[#111C3A]">
          Question Information
        </h4>
      </div>

      {/* Table Data */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-[#52627F]">Question Type</span>
          <span className="font-semibold text-[#111C3A]">{questionTypeLabel}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[#52627F]">Marks</span>
          <span className="font-semibold text-[#111C3A]">
            +{pos} for correct, -{neg} for incorrect
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[#52627F]">Subject</span>
          <span className="font-semibold text-[#111C3A]">
            {question.subject || "General"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[#52627F]">Topic</span>
          <span className="font-semibold text-[#111C3A]">
            {question.topic || "General Concepts"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[#52627F]">Difficulty</span>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${diffBadgeClass}`}
          >
            {difficulty}
          </span>
        </div>
      </div>
    </div>
  );
}
