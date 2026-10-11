import React from "react";
import {
  Compass,
  ArrowLeft,
  ArrowRight,
  Atom,
  FlaskConical,
  Sigma,
  BookOpen
} from "lucide-react";

export default function QuickNavigation({
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
  subjects = [],
  activeSubject,
  onSelectSubject,
  subjectStats = {} // { [subject]: { total, attempted } }
}) {
  const getSubjectIcon = (subj) => {
    const s = (subj || "").toLowerCase();
    if (s.includes("physic")) return Atom;
    if (s.includes("chem")) return FlaskConical;
    if (s.includes("math")) return Sigma;
    return BookOpen;
  };

  return (
    <div className="bg-white rounded-2xl border border-[#DCE5F0] p-4 shadow-2xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#E2E8F0]">
        <Compass className="w-4 h-4 text-[#0B63F6]" />
        <h4 className="text-xs font-bold text-[#111C3A]">
          Quick Navigation
        </h4>
      </div>

      {/* Prev / Next Buttons */}
      <div className="grid grid-cols-2 gap-2 my-1">
        <button
          type="button"
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className="border border-[#DCE5F0] hover:bg-[#F5F8FC] disabled:opacity-40 disabled:cursor-not-allowed text-[#111C3A] font-semibold text-xs py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!canGoNext}
          className="bg-[#0B63F6] hover:bg-[#084FC7] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-xs py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <span>Next</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Mini Subject Status Cards */}
      <div className="grid grid-cols-3 gap-1.5 mt-2">
        {subjects.slice(0, 3).map((subj) => {
          const isActive = activeSubject === subj;
          const Icon = getSubjectIcon(subj);
          const stats = subjectStats[subj] || { total: 0, attempted: 0 };

          return (
            <div
              key={subj}
              onClick={() => onSelectSubject(subj)}
              className={`p-2 rounded-xl text-center cursor-pointer transition-all ${
                isActive
                  ? "bg-[#EFF6FF] border border-[#0B63F6] shadow-2xs"
                  : "bg-[#F8FAFC] border border-[#DCE5F0] hover:border-[#CBD5E1]"
              }`}
            >
              <div className="flex justify-center mb-1">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-[#0B63F6]" : "text-[#52627F]"
                  }`}
                />
              </div>
              <h5 className="text-[11px] font-bold text-[#111C3A] truncate leading-tight">
                {subj}
              </h5>
              <p className="text-[9px] text-[#52627F] mt-0.5 leading-tight">
                {stats.attempted}/{stats.total} attempted
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
