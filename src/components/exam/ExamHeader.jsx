import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Clock,
  Send,
  Maximize2,
  Minimize2,
  Wifi,
  WifiOff,
  Loader2
} from "lucide-react";
import { formatTimeRemaining, formatDuration } from "../../utils/formatters";

export default function ExamHeader({
  test,
  secondsRemaining,
  saveStatus,
  onSubmitClick,
  subjectsList = [],
  totalQuestions = 0
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const isLowTime = secondsRemaining !== null && secondsRemaining < 300; // less than 5 min

  const subjectNames = subjectsList.length > 0
    ? subjectsList.join(" • ")
    : test?.subject || "Computer Science & Software Engineering Core";

  const durationText = test?.durationMinutes
    ? test.durationMinutes >= 60
      ? `${Math.floor(test.durationMinutes / 60)} Hour${Math.floor(test.durationMinutes / 60) > 1 ? "s" : ""}`
      : `${test.durationMinutes} Mins`
    : "3 Hours";

  const posMarks = test?.markingScheme?.positiveMarks ?? 4;
  const negMarks = test?.markingScheme?.negativeMarks ?? 1;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#DCE5F0] shadow-2xs px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
      {/* Left: Brand + Test Title + Metadata */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-[#0B63F6] text-white flex items-center justify-center shadow-xs">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="font-black text-lg text-[#111C3A] tracking-tight hidden sm:inline">
            QuizMaster
          </span>
        </div>

        {/* Fullscreen Toggle Icon */}
        <button
          onClick={toggleFullscreen}
          className="p-1.5 rounded-lg border border-[#DCE5F0] text-[#7B8AA5] hover:text-[#111C3A] hover:bg-[#F5F8FC] transition-colors shrink-0"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          aria-label="Toggle Fullscreen"
        >
          {isFullscreen ? (
            <Minimize2 className="w-3.5 h-3.5" />
          ) : (
            <Maximize2 className="w-3.5 h-3.5" />
          )}
        </button>

        <div className="h-6 w-px bg-[#DCE5F0] hidden sm:block shrink-0" />

        {/* Title and Metadata */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-bold text-[#111C3A] truncate">
              {test?.title || "Full Stack & CS Examination"}
            </h1>
            <span className="inline-flex items-center gap-1 bg-[#DCFCE7] text-[#15803D] text-[11px] font-semibold px-2 py-0.5 rounded-full border border-[#86EFAC] shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#15803D] animate-pulse" />
              Live
            </span>
          </div>

          <p className="text-[11px] sm:text-xs text-[#52627F] truncate hidden sm:block">
            <span>{subjectNames}</span>
            <span className="mx-1 text-[#DCE5F0]">|</span>
            <span>{totalQuestions || 90} Questions</span>
            <span className="mx-1 text-[#DCE5F0]">|</span>
            <span>{durationText}</span>
            <span className="mx-1 text-[#DCE5F0]">|</span>
            <span>+{posMarks} / -{negMarks}</span>
          </p>
        </div>
      </div>

      {/* Right: Clock & Countdown + Submit Test */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Time Left Card */}
        <div
          className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border transition-all ${
            isLowTime
              ? "bg-[#FEF2F2] border-[#FECACA] text-[#DC2626] animate-pulse"
              : "bg-[#F0F6FF] border-[#BFDBFE] text-[#0B63F6]"
          }`}
        >
          <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-2xs shrink-0">
            <Clock
              className={`w-4 h-4 ${
                isLowTime ? "text-[#DC2626]" : "text-[#0B63F6]"
              }`}
            />
          </div>
          <div>
            <span className="text-[9px] font-semibold uppercase tracking-wider block text-[#52627F] leading-none mb-0.5">
              Time Left
            </span>
            <span className="text-sm sm:text-base font-black font-mono tracking-wider leading-none">
              {secondsRemaining !== null
                ? formatTimeRemaining(secondsRemaining)
                : "--:--:--"}
            </span>
          </div>
        </div>

        {/* Sync Status Icon (Desktop) */}
        <div className="hidden xl:flex items-center text-xs">
          {saveStatus === "saving" && (
            <span className="text-[#0B63F6] flex items-center gap-1 font-medium text-[11px]">
              <Loader2 className="w-3 h-3 animate-spin" /> Syncing
            </span>
          )}
          {saveStatus === "saved" && (
            <span className="text-[#25A56A] flex items-center gap-1 font-medium text-[11px]" title="Responses saved to cloud">
              <span className="w-1.5 h-1.5 rounded-full bg-[#25A56A]" /> Saved
            </span>
          )}
          {saveStatus === "error" && (
            <span className="text-[#DC2626] flex items-center gap-1 font-medium text-[11px]" title="Connectivity interrupted">
              <WifiOff className="w-3 h-3" /> Reconnecting
            </span>
          )}
        </div>

        {/* Submit Test Button (matches reference image coral-red button) */}
        <button
          type="button"
          onClick={onSubmitClick}
          className="bg-[#F43F5E] hover:bg-[#E11D48] text-white font-bold text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-xs transition-all duration-150 flex items-center gap-2 select-none active:scale-95 cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Submit Test</span>
        </button>
      </div>
    </header>
  );
}
