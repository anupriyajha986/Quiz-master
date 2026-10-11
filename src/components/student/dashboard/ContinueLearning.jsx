import React from "react";
import { Link } from "react-router-dom";
import { Clock, FileText, Award, ArrowRight, Play, BookOpen } from "lucide-react";

export default function ContinueLearning({ activeAttempt, defaultTest }) {
  // If no active attempt and no test available, render clean state
  if (!activeAttempt && !defaultTest) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-[#E5ECF5] shadow-xs flex flex-col justify-between h-full">
        <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9] mb-5">
          <h3 className="text-base font-black text-[#111A36]">Continue Learning</h3>
        </div>
        <div className="text-center py-6 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] text-[#0866F5] flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-[#111A36]">No Active Examinations</p>
          <p className="text-xs text-[#64748B] max-w-xs mx-auto">
            You do not have any ongoing tests. Explore published examinations to start practicing.
          </p>
          <div className="pt-2">
            <Link
              to="/student/exams"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0866F5] text-white text-xs font-bold"
            >
              <span>Explore Exams</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isResuming = !!activeAttempt;
  const targetTest = activeAttempt || defaultTest;
  const testTitle = targetTest?.title || targetTest?.testTitle || "Examination";
  const subjects = targetTest?.subject || "Web Development & Computer Science Core";
  const duration = targetTest?.durationMinutes
    ? targetTest.durationMinutes >= 60
      ? `${Math.floor(targetTest.durationMinutes / 60)} Hours`
      : `${targetTest.durationMinutes} Mins`
    : "3 Hours";
  const questionsCount = targetTest?.questionCount || targetTest?.questionIds?.length || targetTest?.publishedQuestionsSnapshot?.length || 0;
  const maxMarks = targetTest?.maximumMarks || 300;

  // Compute remaining time if active attempt exists
  let timeLeftDisplay = "Available";
  if (activeAttempt?.deadlineAt) {
    const diffMs = new Date(activeAttempt.deadlineAt).getTime() - Date.now();
    if (diffMs > 0) {
      const h = Math.floor(diffMs / (1000 * 60 * 60));
      const m = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      timeLeftDisplay = `${h}h ${m}m`;
    } else {
      timeLeftDisplay = "Expired";
    }
  }

  // Answer progress
  const answeredCount = activeAttempt?.responseSummary?.answered || (activeAttempt?.answers ? Object.keys(activeAttempt.answers).length : 0);
  const progressPercent = questionsCount > 0 && isResuming
    ? Math.min(100, Math.round((answeredCount / questionsCount) * 100))
    : 0;

  const actionLink = isResuming
    ? `/student/attempts/${activeAttempt.id}`
    : `/student/exams/${defaultTest?.id}/instructions`;

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#E5ECF5] shadow-xs flex flex-col justify-between h-full">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9] mb-5">
        <h3 className="text-base font-black text-[#111A36]">
          {isResuming ? "Active Session" : "Recommended Exam"}
        </h3>
        <Link
          to={isResuming ? "/student/active-attempts" : "/student/exams"}
          className="text-xs font-bold text-[#0866F5] hover:text-[#0754D1] flex items-center gap-1 transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Main Body */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-5">
        {/* Left Category Artwork (Graduation cap on books) */}
        <div className="w-full sm:w-28 md:w-28 h-32 md:h-36 rounded-2xl bg-gradient-to-b from-[#0866F5] via-[#2563EB] to-[#1D4ED8] p-3 flex flex-col items-center justify-center text-white shrink-0 relative overflow-hidden shadow-xs">
          <div className="absolute inset-0 bg-white/10 opacity-30"></div>
          {/* 3D Graduation Artwork representation */}
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center mb-2 border border-white/20">
            <Award className="w-8 h-8 md:w-9 md:h-9 text-white" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider text-blue-100">
            Coding CBT
          </span>
        </div>

        {/* Center Test Meta & Progress */}
        <div className="flex-1 min-w-0">
          <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#EAF2FF] text-[#0866F5] text-[11px] font-black mb-1.5">
            Full Stack
          </span>

          <h4 className="text-base font-black text-[#111A36] truncate leading-tight mb-1">
            {testTitle}
          </h4>

          <p className="text-xs text-[#64748B] mb-2.5 truncate">
            {subjects}
          </p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#64748B] mb-3.5">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#0866F5] shrink-0" />
              {duration}
            </span>
            <span className="text-[#CBD5E1]">&bull;</span>
            <span className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-[#16B866] shrink-0" />
              {questionsCount} Qs
            </span>
            <span className="text-[#CBD5E1]">&bull;</span>
            <span className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
              {maxMarks} Marks
            </span>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-[#64748B]">Progress</span>
              <span className="text-[#111A36]">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#E5ECF5] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#0866F5] transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Right Time Left & Action Buttons */}
        <div className="w-full sm:w-40 md:w-40 flex flex-col justify-between gap-2.5 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 md:border-l border-[#F1F5F9] md:pl-4">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-[#F8FAFD] border border-[#E5ECF5]">
            <Clock className="w-4 h-4 text-[#0866F5] shrink-0" />
            <div>
              <p className="text-[10px] text-[#64748B] font-semibold leading-none">Time Left</p>
              <p className="text-xs font-black text-[#111A36] mt-0.5">{timeLeftDisplay}</p>
            </div>
          </div>

          <Link
            to={actionLink}
            className="w-full py-2.5 px-4 rounded-xl bg-[#0866F5] hover:bg-[#0754D1] text-white font-bold text-xs text-center shadow-xs transition-all flex items-center justify-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isResuming ? "Resume Test" : "Start Test"}</span>
          </Link>

          <Link
            to={
              isResuming
                ? `/student/active-attempts`
                : `/student/exams/${defaultTest?.id}/instructions`
            }
            className="w-full py-2 px-4 rounded-xl bg-white hover:bg-[#F8FAFD] border border-[#CBD5E1] text-[#17233F] font-bold text-xs text-center transition-colors"
          >
            {isResuming ? "Session Details" : "View Details"}
          </Link>
        </div>
      </div>
    </div>
  );
}
