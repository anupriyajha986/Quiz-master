import React from "react";
import { Link } from "react-router-dom";
import { Sun, ArrowRight, BarChart2, Calendar } from "lucide-react";

export default function WelcomeBanner({ studentName = "Student" }) {
  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning,";
    if (hour < 17) return "Good Afternoon,";
    return "Good Evening,";
  };

  // Formatted current date
  const todayFormatted = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date());

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
      {/* Main Welcome Hero Banner (9 cols on desktop) */}
      <div className="lg:col-span-9 bg-gradient-to-r from-white via-[#F8FAFD] to-[#EBF3FE] rounded-3xl p-6 sm:p-8 border border-[#E5ECF5] shadow-xs relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Soft Decorative Ambient Halos */}
        <div className="absolute top-0 right-1/4 w-72 h-72 rounded-full bg-[#38BDF8]/15 blur-3xl -z-0 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-60 h-60 rounded-full bg-[#34D399]/15 blur-2xl -z-0 pointer-events-none"></div>

        {/* Left Text Content */}
        <div className="relative z-10 max-w-md text-left">
          <div className="flex items-center gap-2 text-xs font-bold text-[#F59E0B] mb-2">
            <Sun className="w-4 h-4 fill-[#F59E0B]" />
            <span>{getGreeting()}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-[#111A36] tracking-tight leading-tight mb-2">
            {studentName}!
          </h1>

          <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed mb-6">
            Keep practicing, track your progress, and work toward your goals.
          </p>

          <Link
            to="/student/exams"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0866F5] hover:bg-[#0754D1] text-white font-bold text-xs sm:text-sm shadow-xs hover:shadow transition-all hover:translate-y-[-1px]"
          >
            <span>Explore Exams</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Center/Right Student Photo Visual with Floating Quote */}
        <div className="relative z-10 shrink-0 flex items-center justify-center">
          {/* Floating Quote Badge */}
          <div className="hidden sm:flex absolute -top-4 -right-2 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-md border border-[#E5ECF5] items-center gap-2.5 z-20">
            <div className="w-8 h-8 rounded-lg bg-[#EAF2FF] text-[#0866F5] flex items-center justify-center">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-[11px] font-bold text-[#111A36] leading-tight">
                "Small Steps
              </p>
              <p className="text-[11px] font-black text-[#0866F5]">
                Make Big Results"
              </p>
            </div>
          </div>

          {/* Student Cutout / Photo */}
          <div className="relative w-44 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden bg-gradient-to-t from-[#0866F5]/20 to-transparent">
            <img
              src="/images/student/student-banner.jpg"
              alt="Student smiling"
              className="w-full h-full object-cover object-top"
              loading="eager"
            />
          </div>
        </div>
      </div>

      {/* Right Desktop Date & Motivation Card (3 cols on desktop) */}
      <div className="lg:col-span-3 bg-white rounded-3xl p-6 border border-[#E5ECF5] shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#0866F5] bg-[#EAF2FF] px-3 py-1.5 rounded-xl w-fit mb-4">
            <Calendar className="w-4 h-4" />
            <span>{todayFormatted}</span>
          </div>

          <p className="text-sm text-[#111A36] font-medium leading-relaxed italic">
            "Stay consistent today for a <span className="font-bold text-[#0866F5]">brighter tomorrow</span>."
          </p>
        </div>

        <div className="pt-4 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] text-[#64748B]">
          <span>Exam Season 2026</span>
          <span className="font-bold text-[#16B866]">● Active</span>
        </div>
      </div>
    </div>
  );
}
