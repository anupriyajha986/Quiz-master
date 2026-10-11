import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Layers, Calendar, BookOpen } from "lucide-react";
import { formatDate } from "../../../utils/formatters";

export default function UpcomingExams({ exams = [] }) {
  const publishedExams = (exams || []).slice(0, 3);

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#E5ECF5] shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9] mb-5">
        <h3 className="text-base font-black text-[#111A36]">Available Examinations</h3>
        <Link
          to="/student/exams"
          className="text-xs font-bold text-[#0866F5] hover:text-[#0754D1] flex items-center gap-1 transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Exam List */}
      {publishedExams.length === 0 ? (
        <div className="text-center py-8 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#F8FAFD] text-[#94A3B8] flex items-center justify-center mx-auto">
            <BookOpen className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-[#111A36]">No examinations scheduled</p>
          <p className="text-[11px] text-[#64748B]">
            Newly published examinations will appear here as soon as they are scheduled.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {publishedExams.map((item) => {
            const duration = item.durationMinutes
              ? item.durationMinutes >= 60
                ? `${Math.floor(item.durationMinutes / 60)}h ${item.durationMinutes % 60 ? `${item.durationMinutes % 60}m` : ""}`.trim()
                : `${item.durationMinutes} Mins`
              : "60 Mins";
            const qCount = item.questionCount || item.questionIds?.length || item.publishedQuestionsSnapshot?.length || 0;
            const marks = item.maximumMarks || 300;

            return (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl hover:bg-[#F8FAFD] border border-[#F1F5F9] hover:border-[#E5ECF5] transition-all"
              >
                {/* Left Box Icon + Title */}
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0866F5] to-[#3B82F6] flex items-center justify-center text-white shrink-0 shadow-2xs">
                    <Layers className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#EAF2FF] text-[#0866F5]">
                        {item.subject || "Coding Test"}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-black text-[#111A36] truncate leading-tight">
                      {item.title}
                    </h4>

                    <div className="flex items-center gap-2 text-[11px] text-[#64748B] mt-1 flex-wrap">
                      <span>{duration}</span>
                      <span>&bull;</span>
                      <span>{qCount} Questions</span>
                      <span>&bull;</span>
                      <span>{marks} Marks</span>
                    </div>
                  </div>
                </div>

                {/* Right Action */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0 pt-2 sm:pt-0">
                  <span className="text-[11px] font-bold text-[#16B866] flex items-center gap-1">
                    <span>&bull;</span> Available
                  </span>
                  <Link
                    to={`/student/exams/${item.id}/instructions`}
                    className="px-3.5 py-1.5 rounded-xl bg-[#0866F5] hover:bg-[#0754D1] text-white font-bold text-xs shadow-2xs transition-all"
                  >
                    Start Test
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
