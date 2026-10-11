import React from "react";
import { Atom, FlaskConical, Sigma, BookOpen } from "lucide-react";

export default function SubjectTabs({
  subjects = [],
  activeSubject,
  onSelectSubject,
  subjectQuestionCounts = {}
}) {
  const getSubjectMeta = (subjectName, index) => {
    const s = (subjectName || "").toLowerCase();
    const sectionLetter = String.fromCharCode(65 + index); // A, B, C, D...

    if (s.includes("physic")) {
      return {
        icon: Atom,
        iconBg: "bg-[#EFF6FF]",
        iconColor: "text-[#0B63F6]",
        section: `Section ${sectionLetter}`
      };
    }
    if (s.includes("chem")) {
      return {
        icon: FlaskConical,
        iconBg: "bg-[#F0FDF4]",
        iconColor: "text-[#16A34A]",
        section: `Section ${sectionLetter}`
      };
    }
    if (s.includes("math")) {
      return {
        icon: Sigma,
        iconBg: "bg-[#FAF5FF]",
        iconColor: "text-[#8B5CF6]",
        section: `Section ${sectionLetter}`
      };
    }
    return {
      icon: BookOpen,
      iconBg: "bg-[#F1F5F9]",
      iconColor: "text-[#0B63F6]",
      section: `Section ${sectionLetter}`
    };
  };

  if (!subjects || subjects.length === 0) return null;

  return (
    <div>
      {/* Desktop Subject Cards */}
      <div className="hidden sm:grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {subjects.map((subj, idx) => {
          const isActive = activeSubject === subj;
          const meta = getSubjectMeta(subj, idx);
          const Icon = meta.icon;
          const qCount = subjectQuestionCounts[subj] || 0;

          return (
            <div
              key={subj}
              onClick={() => onSelectSubject(subj)}
              className={`p-3.5 rounded-2xl transition-all duration-150 cursor-pointer select-none flex items-center gap-3.5 ${
                isActive
                  ? "bg-white border-2 border-[#0B63F6] shadow-xs"
                  : "bg-white border border-[#DCE5F0] hover:border-[#BFDBFE] hover:bg-[#F8FAFC]"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${meta.iconBg} ${meta.iconColor}`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div className="min-w-0">
                <h3
                  className={`text-sm font-bold truncate ${
                    isActive ? "text-[#0B63F6]" : "text-[#111C3A]"
                  }`}
                >
                  {subj}
                </h3>
                <p className="text-[11px] text-[#52627F] leading-tight">
                  {meta.section}
                </p>
                <p className="text-[11px] text-[#7B8AA5] leading-tight mt-0.5">
                  {qCount} Questions
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Horizontal Pill Tabs */}
      <div className="sm:hidden flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {subjects.map((subj) => {
          const isActive = activeSubject === subj;
          const qCount = subjectQuestionCounts[subj] || 0;

          return (
            <button
              key={subj}
              type="button"
              onClick={() => onSelectSubject(subj)}
              className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all select-none ${
                isActive
                  ? "bg-[#EFF6FF] border-2 border-[#0B63F6] text-[#0B63F6]"
                  : "bg-white border border-[#DCE5F0] text-[#52627F]"
              }`}
            >
              {subj} <span className="text-[11px] opacity-75">{qCount} Qs</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
