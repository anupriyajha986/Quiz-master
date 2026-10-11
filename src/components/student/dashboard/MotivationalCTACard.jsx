import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function MotivationalCTACard() {
  return (
    <div className="bg-white rounded-3xl p-6 border border-[#E5ECF5] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden relative">
      {/* Background Subtle Gradient */}
      <div className="absolute right-0 bottom-0 w-64 h-64 bg-[#EAF2FF] rounded-full blur-3xl -z-0 pointer-events-none"></div>

      {/* Left Content */}
      <div className="relative z-10 max-w-sm text-left">
        <h3 className="text-lg sm:text-xl font-black text-[#111A36] leading-tight mb-2">
          Your Next Attempt <br />
          Could Be <span className="text-[#0866F5]">Your Best One!</span>
        </h3>

        <p className="text-xs text-[#64748B] leading-relaxed mb-6">
          Practice consistently, analyze your mistakes, and keep improving.
        </p>

        <Link
          to="/student/exams"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0866F5] hover:bg-[#0754D1] text-white font-bold text-xs shadow-xs hover:shadow transition-all hover:translate-y-[-1px]"
        >
          <span>Explore More Exams</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Right Visual: 3D Blue Target Dartboard SVG */}
      <div className="relative z-10 shrink-0 w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center">
        <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-md">
          {/* Outer circle */}
          <ellipse cx="80" cy="85" rx="65" ry="60" fill="#EAF2FF" />
          <ellipse cx="80" cy="82" rx="60" ry="55" fill="#0866F5" />
          <ellipse cx="80" cy="80" rx="48" ry="44" fill="#FFFFFF" />
          <ellipse cx="80" cy="78" rx="36" ry="33" fill="#0866F5" />
          <ellipse cx="80" cy="76" rx="24" ry="22" fill="#FFFFFF" />
          <ellipse cx="80" cy="74" rx="12" ry="11" fill="#0866F5" />
          {/* Arrow */}
          <g transform="rotate(-35 80 74)">
            <line x1="80" y1="20" x2="80" y2="74" stroke="#111A36" strokeWidth="4" strokeLinecap="round" />
            <polygon points="76,20 84,20 80,8" fill="#16B866" />
            <polygon points="73,32 87,32 80,24" fill="#0866F5" />
          </g>
          {/* Small green plant / success accent at base */}
          <path d="M40 135 C50 120 70 125 75 140 Z" fill="#34D399" opacity="0.8" />
          <path d="M120 135 C110 120 90 125 85 140 Z" fill="#34D399" opacity="0.8" />
        </svg>
      </div>
    </div>
  );
}
