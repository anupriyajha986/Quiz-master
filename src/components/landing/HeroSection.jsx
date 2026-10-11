import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Clock,
  BarChart2,
  FileText,
  ArrowRight,
  TrendingUp,
  CheckCircle,
  HelpCircle,
  Bookmark
} from "lucide-react";

export default function HeroSection() {
  const { currentUser, isAdmin } = useAuth();
  const [selectedOption, setSelectedOption] = useState("A");

  // Simulated countdown timer for the mockup
  const [secondsLeft, setSecondsLeft] = useState(5256); // 01:27:36

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 5256));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSec) => {
    const h = String(Math.floor(totalSec / 3600)).padStart(2, "0");
    const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
    const s = String(totalSec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const paletteQuestions = [
    { num: 1, status: "answered" },
    { num: 2, status: "answered" },
    { num: 3, status: "unanswered" },
    { num: 4, status: "answered" },
    { num: 5, status: "unanswered" },
    { num: 6, status: "review" },
    { num: 7, status: "answered" },
    { num: 8, status: "answered" },
    { num: 9, status: "unanswered" },
    { num: 10, status: "ans-review" },
    { num: 11, status: "review" },
    { num: 12, status: "current" },
    { num: 13, status: "unanswered" },
    { num: 14, status: "answered" },
    { num: 15, status: "ans-review" },
    { num: 16, status: "review" },
    { num: 17, status: "unanswered" },
    { num: 18, status: "answered" },
    { num: 19, status: "unanswered" },
    { num: 20, status: "ans-review" },
    { num: 21, status: "answered" },
    { num: 22, status: "unanswered" },
    { num: 23, status: "review" },
    { num: 24, status: "unanswered" },
    { num: 25, status: "unanswered" }
  ];

  const getPaletteColor = (status) => {
    switch (status) {
      case "answered":
        return "bg-[#16A34A] text-white"; // Green
      case "review":
        return "bg-[#7C3AED] text-white"; // Purple
      case "ans-review":
        return "bg-[#2563EB] text-white ring-2 ring-[#16A34A]"; // Blue + green ring
      case "current":
        return "bg-[#2563EB] text-white ring-2 ring-offset-1 ring-[#2563EB]"; // Active Question 12
      case "unanswered":
      default:
        return "bg-[#E2E8F0] text-[#475569]"; // Gray
    }
  };

  return (
    <section id="home" className="relative pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden bg-gradient-to-b from-[#F8FAFC] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Copy & CTAs */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAFBF0] border border-[#BBF7D0] text-[#16A34A] text-xs font-bold mb-6 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
              <span>Your Journey to Better Scores Starts Here</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black text-[#14213D] tracking-tight leading-[1.12] mb-6">
              Prepare Smarter. <br />
              Practice <span className="text-[#2563EB]">Better</span>. <br />
              <span className="text-[#16A34A]">Achieve More.</span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-[#526079] leading-relaxed mb-8 max-w-xl">
              An all-in-one online examination platform to practice, evaluate your performance, and prepare with confidence.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto mb-10">
              {currentUser ? (
                <Link
                  to={isAdmin ? "/admin/dashboard" : "/student/dashboard"}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-base shadow-sm hover:shadow transition-all hover:translate-y-[-1px]"
                >
                  <span>Go to {isAdmin ? "Admin Console" : "Dashboard"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-base shadow-sm hover:shadow transition-all hover:translate-y-[-1px]"
                  >
                    <span>Start Practicing Free</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a
                    href="#explore-exams"
                    className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#14213D] border border-[#CBD5E1] font-bold text-base transition-colors"
                  >
                    Explore Exams
                  </a>
                </>
              )}
            </div>

            {/* Three Feature Highlights Under Buttons */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-6 border-t border-[#E2E8F0] w-full max-w-lg">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#14213D] leading-tight">Timed Tests</h4>
                  <p className="text-[10px] sm:text-xs text-[#64748B] mt-0.5">Exam-style experience</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] flex items-center justify-center shrink-0">
                  <BarChart2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#14213D] leading-tight">Detailed Analytics</h4>
                  <p className="text-[10px] sm:text-xs text-[#64748B] mt-0.5">Track your progress</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#14213D] leading-tight">PDF Scorecards</h4>
                  <p className="text-[10px] sm:text-xs text-[#64748B] mt-0.5">Download & share</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Realistic Exam Mockup */}
          <div className="lg:col-span-6 relative">
            {/* Background Radial Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-[#DBEAFE] to-[#DCFCE7] rounded-3xl blur-2xl opacity-50 -z-10"></div>

            {/* Laptop / Browser Container */}
            <div className="bg-white rounded-2xl shadow-xl border border-[#CBD5E1] overflow-hidden">
              {/* Window Controls Topbar */}
              <div className="bg-[#F1F5F9] px-4 py-2.5 border-b border-[#E2E8F0] flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#EF4444]"></span>
                  <span className="w-3 h-3 rounded-full bg-[#F59E0B]"></span>
                  <span className="w-3 h-3 rounded-full bg-[#10B981]"></span>
                </div>
                <div className="text-[11px] font-semibold text-[#64748B] truncate max-w-[200px]">
                  quizmaster.app/exam/fullstack-cs-2026
                </div>
                <div className="w-10"></div>
              </div>

              {/* Exam Header */}
              <div className="bg-white px-4 py-2.5 border-b border-[#E2E8F0] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#14213D]">Full Stack & CS - Mock Test 01</span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Live Timer */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] text-xs font-mono font-bold">
                    <Clock className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>{formatTimer(secondsLeft)}</span>
                  </div>

                  <button className="px-3 py-1 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-colors">
                    Submit Test
                  </button>
                </div>
              </div>

              {/* Subject Tabs */}
              <div className="bg-[#F8FAFC] px-4 py-2 border-b border-[#E2E8F0] flex items-center gap-2 text-xs">
                <button className="px-3 py-1 rounded-md bg-[#2563EB] text-white font-bold shadow-2xs">
                  JavaScript (12/25)
                </button>
                <button className="px-3 py-1 rounded-md bg-white border border-[#E2E8F0] text-[#64748B] font-semibold hover:text-[#111827]">
                  DSA (8/25)
                </button>
                <button className="px-3 py-1 rounded-md bg-white border border-[#E2E8F0] text-[#64748B] font-semibold hover:text-[#111827]">
                  OS & DBMS (14/25)
                </button>
              </div>

              {/* Exam Content Grid */}
              <div className="grid grid-cols-12 p-4 gap-4">
                {/* Question Area (8 cols) */}
                <div className="col-span-8 flex flex-col justify-between border-r border-[#E2E8F0] pr-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#2563EB]">Question 12</span>
                      <span className="text-[10px] font-semibold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded">
                        +4 / -1
                      </span>
                    </div>

                    <p className="text-xs font-medium text-[#1E293B] leading-relaxed mb-3">
                      What is the evaluated output of typeof NaN in modern JavaScript, and why?
                    </p>

                    {/* Radio Options */}
                    <div className="space-y-1.5">
                      {[
                        { key: "A", text: '"number" (Special numeric value in IEEE 754)' },
                        { key: "B", text: '"NaN"' },
                        { key: "C", text: '"undefined"' },
                        { key: "D", text: '"object"' }
                      ].map((opt) => (
                        <label
                          key={opt.key}
                          onClick={() => setSelectedOption(opt.key)}
                          className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                            selectedOption === opt.key
                              ? "bg-[#EFF6FF] border-[#2563EB] text-[#1D4ED8] font-bold"
                              : "bg-white border-[#E2E8F0] text-[#334155] hover:bg-[#F8FAFC]"
                          }`}
                        >
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center text-[9px] font-bold ${
                              selectedOption === opt.key
                                ? "border-[#2563EB] bg-[#2563EB] text-white"
                                : "border-[#94A3B8] text-[#64748B]"
                            }`}
                          >
                            {opt.key}
                          </span>
                          <span>{opt.text}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Question Bottom Action Bar */}
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#E2E8F0]">
                    <button className="px-2.5 py-1 text-[11px] rounded border border-[#CBD5E1] text-[#64748B] hover:bg-[#F1F5F9]">
                      Clear
                    </button>
                    <div className="flex items-center gap-2">
                      <button className="px-2.5 py-1 text-[11px] rounded border border-[#7C3AED] text-[#7C3AED] hover:bg-[#F5F3FF] font-semibold">
                        Mark Review
                      </button>
                      <button className="px-3 py-1 text-[11px] rounded bg-[#2563EB] text-white font-bold hover:bg-[#1D4ED8]">
                        Save & Next
                      </button>
                    </div>
                  </div>
                </div>

                {/* Question Palette (4 cols) */}
                <div className="col-span-4 pl-1">
                  <div className="text-[11px] font-bold text-[#14213D] mb-2">Question Palette</div>
                  <div className="grid grid-cols-5 gap-1 mb-3">
                    {paletteQuestions.map((q) => (
                      <div
                        key={q.num}
                        className={`w-5 h-5 rounded-md text-[10px] font-bold flex items-center justify-center ${getPaletteColor(
                          q.status
                        )}`}
                      >
                        {q.num}
                      </div>
                    ))}
                  </div>

                  {/* Legend */}
                  <div className="space-y-1 text-[9px] text-[#64748B] border-t border-[#E2E8F0] pt-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#16A34A]"></span>
                      <span>Answered (9)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#E2E8F0]"></span>
                      <span>Not Answered (9)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#7C3AED]"></span>
                      <span>Marked Review (4)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#2563EB] ring-1 ring-[#16A34A]"></span>
                      <span>Ans & Review (3)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Progress Badge at Bottom-Right */}
            <div className="absolute -bottom-6 -right-4 sm:-bottom-5 sm:-right-5 bg-white rounded-2xl p-3.5 shadow-xl border border-[#E2E8F0] flex items-center gap-3 animate-bounce [animation-duration:4s]">
              <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black text-[#14213D] leading-none">Great Progress!</p>
                <p className="text-[11px] font-semibold text-[#16A34A] mt-1">Keep Going ✨</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
