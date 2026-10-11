import React from "react";
import {
  CheckSquare,
  Calculator,
  Edit3,
  FileSpreadsheet,
  MoreHorizontal
} from "lucide-react";

export default function ExamMobileNavigation({
  activeTab = "questions",
  onSelectTab,
  onOpenCalculator,
  onOpenNotepad,
  onOpenQuestionPaper,
  onOpenMore
}) {
  const tabs = [
    { id: "questions", label: "Questions", icon: CheckSquare, onClick: () => onSelectTab("questions") },
    { id: "calculator", label: "Calculator", icon: Calculator, onClick: onOpenCalculator },
    { id: "notepad", label: "Notepad", icon: Edit3, onClick: onOpenNotepad },
    { id: "paper", label: "Paper", icon: FileSpreadsheet, onClick: onOpenQuestionPaper },
    { id: "more", label: "More", icon: MoreHorizontal, onClick: onOpenMore }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#DCE5F0] px-2 py-1.5 shadow-lg flex items-center justify-around select-none">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={tab.onClick}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[10px] font-semibold transition-colors cursor-pointer ${
              isActive
                ? "text-[#0B63F6]"
                : "text-[#64748B] hover:text-[#111C3A]"
            }`}
          >
            <Icon className={`w-4 h-4 mb-0.5 ${isActive ? "text-[#0B63F6]" : "text-[#7B8AA5]"}`} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
