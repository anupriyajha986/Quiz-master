import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

export default function FinalCTASection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#1D4ED8] via-[#1E40AF] to-[#0F172A] overflow-hidden p-8 sm:p-12 lg:p-16 shadow-2xl">
          {/* Subtle Background Glow Circles */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#2563EB]/40 rounded-full blur-3xl -z-0"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#16A34A]/20 rounded-full blur-3xl -z-0"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 text-left">
              {/* Eyebrow Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#86EFAC] text-xs font-bold mb-6 backdrop-blur-xs">
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping"></span>
                <span>The Quiz Engine You Need For Exam Prep</span>
              </div>

              {/* Headline */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                Start Your Learning <br className="hidden sm:inline" />
                Journey Today
              </h2>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-[#BFDBFE] leading-relaxed mb-8 max-w-lg">
                Join thousands of students who are practicing, improving, and achieving their goals with QuizMaster.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-sm sm:text-base shadow-lg transition-all hover:translate-y-[-1px]"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/student/exams"
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold text-sm sm:text-base backdrop-blur-xs transition-colors"
                >
                  Explore Exams
                </Link>
              </div>
            </div>

            {/* Right Visual Graphic (5 cols) */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                <img
                  src="/images/landing/cta-books.jpg"
                  alt="Graduation cap on books with green rising arrow"
                  className="w-full h-72 sm:h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
