import React, { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

export default function QuestionPalette({
  questions = [],
  currentIndex,
  responses = {},
  visitedSet = new Set(),
  subjects = [],
  activeSubject,
  onSelectSubject,
  onNavigateToQuestion,
  onTabChange,
  activeTab = "palette"
}) {
  // Accordion open state for each subject
  const [expandedSubjects, setExpandedSubjects] = useState(() => {
    // Expand current subject by default
    const initial = {};
    subjects.forEach((s, idx) => {
      initial[s] = idx === 0 || s === activeSubject;
    });
    return initial;
  });

  const toggleSubject = (s) => {
    setExpandedSubjects((prev) => ({
      ...prev,
      [s]: !prev[s]
    }));
  };

  // Determine Question Status
  const getQuestionState = (q) => {
    const qid = q.id;
    const resp = responses[qid];
    const isVisited = visitedSet.has(qid) || !!resp;
    const hasAnswer =
      resp?.selectedAnswer !== undefined &&
      resp?.selectedAnswer !== null &&
      resp?.selectedAnswer !== "";
    const isMarked = !!resp?.markedForReview;

    if (hasAnswer && isMarked) return "answered_marked";
    if (isMarked) return "marked";
    if (hasAnswer) return "answered";
    if (isVisited) return "not_answered";
    return "not_visited";
  };

  // Group questions by subject
  const groupedQuestions = {};
  subjects.forEach((s) => {
    groupedQuestions[s] = [];
  });
  questions.forEach((q, globalIdx) => {
    const s = q.subject || subjects[0] || "General";
    if (!groupedQuestions[s]) groupedQuestions[s] = [];
    groupedQuestions[s].push({ question: q, globalIdx });
  });

  return (
    <div className="bg-white rounded-2xl border border-[#DCE5F0] p-4 sm:p-5 shadow-xs flex flex-col h-full select-none">
      {/* Top Palette / Instructions Tabs */}
      <div className="flex items-center border-b border-[#DCE5F0] mb-4">
        <button
          type="button"
          onClick={() => onTabChange?.("palette")}
          className={`flex-1 pb-2.5 text-xs font-bold transition-colors text-center cursor-pointer ${
            activeTab === "palette"
              ? "text-[#0B63F6] border-b-2 border-[#0B63F6]"
              : "text-[#7B8AA5] hover:text-[#111C3A]"
          }`}
        >
          Question Palette
        </button>

        <button
          type="button"
          onClick={() => onTabChange?.("instructions")}
          className={`flex-1 pb-2.5 text-xs font-bold transition-colors text-center cursor-pointer ${
            activeTab === "instructions"
              ? "text-[#0B63F6] border-b-2 border-[#0B63F6]"
              : "text-[#7B8AA5] hover:text-[#111C3A]"
          }`}
        >
          Instructions
        </button>
      </div>

      {/* Status Legend (Exact 2 columns x 3 rows grid from reference image) */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-[11px] text-[#52627F] pb-4 mb-4 border-b border-[#DCE5F0]">
        {/* Row 1 */}
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-md bg-[#25A56A] shrink-0" />
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-md bg-white border border-[#CBD5E1] shrink-0" />
          <span>Not Answered</span>
        </div>

        {/* Row 2 */}
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-md bg-[#8B5CF6] shrink-0" />
          <span>Marked for Review</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-md bg-[#A78BFA] border border-[#8B5CF6] shrink-0" />
          <span>Answered & Marked</span>
        </div>

        {/* Row 3 */}
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-md bg-[#F1F5F9] border border-[#E2E8F0] shrink-0" />
          <span>Not Visited</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-md bg-white border-2 border-[#0B63F6] shrink-0" />
          <span>Current Question</span>
        </div>
      </div>

      {/* Subject Sections Accordion */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-0.5">
        {subjects.map((subj) => {
          const isExpanded = !!expandedSubjects[subj];
          const subjectItems = groupedQuestions[subj] || [];
          const count = subjectItems.length;

          return (
            <div key={subj} className="border border-[#DCE5F0] rounded-xl overflow-hidden">
              {/* Accordion Header */}
              <button
                type="button"
                onClick={() => {
                  toggleSubject(subj);
                  onSelectSubject?.(subj);
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] text-left transition-colors cursor-pointer"
              >
                <span className="text-xs font-bold text-[#111C3A]">
                  {subj} ({count})
                </span>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-[#52627F]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#52627F]" />
                )}
              </button>

              {/* Accordion Content: 5-column button grid */}
              {isExpanded && (
                <div className="p-3 bg-white">
                  <div className="grid grid-cols-5 gap-2">
                    {subjectItems.map(({ question: q, globalIdx }, localIdx) => {
                      const state = getQuestionState(q, globalIdx);
                      const isCurrent = globalIdx === currentIndex;

                      let btnStyle = "bg-[#F1F5F9] text-[#52627F] border border-[#E2E8F0]";

                      if (state === "answered") {
                        btnStyle = "bg-[#25A56A] text-white font-bold border-none";
                      } else if (state === "not_answered") {
                        btnStyle = "bg-white text-[#111C3A] font-bold border border-[#CBD5E1]";
                      } else if (state === "marked") {
                        btnStyle = "bg-[#8B5CF6] text-white font-bold border-none";
                      } else if (state === "answered_marked") {
                        btnStyle = "bg-[#A78BFA] text-white font-bold border-2 border-[#8B5CF6]";
                      }

                      // If current question, highlight with blue outline
                      if (isCurrent) {
                        btnStyle += " ring-2 ring-offset-1 ring-[#0B63F6] scale-105";
                      }

                      return (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => onNavigateToQuestion(globalIdx)}
                          className={`h-8 sm:h-9 rounded-lg text-xs font-bold transition-all flex items-center justify-center cursor-pointer select-none ${btnStyle}`}
                          title={`Question ${localIdx + 1} (${state.replace("_", " ")})`}
                        >
                          {localIdx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
