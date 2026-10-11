import React from "react";
import {
  FileText,
  CheckSquare,
  Calculator,
  Edit3,
  FileSpreadsheet,
  BarChart2,
  Target
} from "lucide-react";

export default function ExamSidebar({
  activeView = "questions",
  onSelectView,
  onOpenCalculator,
  onOpenNotepad,
  onOpenQuestionPaper,
  onOpenInstructions,
  onOpenAnalysis
}) {
  const navItems = [
    {
      id: "instructions",
      label: "Instructions",
      icon: FileText,
      onClick: onOpenInstructions
    },
    {
      id: "questions",
      label: "Questions",
      icon: CheckSquare,
      onClick: () => onSelectView("questions")
    },
    {
      id: "calculator",
      label: "Calculator",
      icon: Calculator,
      onClick: onOpenCalculator
    },
    {
      id: "notepad",
      label: "Notepad",
      icon: Edit3,
      onClick: onOpenNotepad
    },
    {
      id: "question_paper",
      label: "Question Paper",
      icon: FileSpreadsheet,
      onClick: onOpenQuestionPaper
    },
    {
      id: "analysis",
      label: "Exam Analysis",
      icon: BarChart2,
      onClick: onOpenAnalysis
    }
  ];

  return (
    <aside className="w-[180px] shrink-0 flex flex-col justify-between self-stretch bg-white rounded-2xl border border-[#DCE5F0] p-3 shadow-2xs">
      {/* Top Utility Items */}
      <nav className="space-y-1.5" aria-label="Exam Utilities">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={item.onClick}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 text-left select-none cursor-pointer ${
                isActive
                  ? "bg-[#0B63F6] text-white shadow-xs"
                  : "text-[#52627F] hover:text-[#111C3A] hover:bg-[#F5F8FC]"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-[#7B8AA5]"}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Motivational Banner Card */}
      <div className="mt-4 p-3 bg-[#F0FDF4] border border-[#DCFCE7] rounded-xl text-left select-none">
        <div className="w-7 h-7 rounded-full bg-[#DCFCE7] flex items-center justify-center text-[#16A34A] mb-1.5">
          <Target className="w-4 h-4" />
        </div>
        <h4 className="text-xs font-bold text-[#111827]">
          Stay Focused
        </h4>
        <p className="text-[10px] text-[#52627F] mt-0.5 leading-snug">
          Give your best. Analyze your performance and achieve your goal.
        </p>
      </div>
    </aside>
  );
}
