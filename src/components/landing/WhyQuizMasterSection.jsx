import React from "react";
import {
  Monitor,
  BarChart3,
  Lightbulb,
  Target,
  FileCheck2,
  Smartphone,
  TrendingUp,
  Sparkles
} from "lucide-react";

export default function WhyQuizMasterSection() {
  const features = [
    {
      icon: Monitor,
      title: "Realistic Exam Experience",
      description: "Practice with a timed interface, question navigation and exam-style features.",
      iconBg: "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]"
    },
    {
      icon: BarChart3,
      title: "Instant Performance Insights",
      description: "Get detailed analysis of your score and accuracy.",
      iconBg: "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]"
    },
    {
      icon: Lightbulb,
      title: "Learn from Your Mistakes",
      description: "Review explanations and understand concepts.",
      iconBg: "bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]"
    },
    {
      icon: Target,
      title: "Track Your Improvement",
      description: "Compare performance and identify weak areas.",
      iconBg: "bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]"
    },
    {
      icon: FileCheck2,
      title: "Your Results, Organized",
      description: "Access your test history and download scorecards.",
      iconBg: "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]"
    },
    {
      icon: Smartphone,
      title: "Simple and Accessible",
      description: "Use on any device — desktop, tablet or mobile.",
      iconBg: "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]"
    }
  ];

  return (
    <section id="why-quizmaster" className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-left mb-14">
          <h2 className="text-3xl sm:text-4xl font-black text-[#14213D] tracking-tight">
            Why Choose <span className="text-[#2563EB]">QuizMaster?</span>
          </h2>
          <p className="text-sm sm:text-base text-[#526079] mt-2">
            More than just a quiz platform — built for your success.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: 6 Feature Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#BFDBFE] hover:bg-white hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center border mb-3.5 shrink-0 ${item.iconBg}">
                    <div className={`w-full h-full rounded-xl flex items-center justify-center border ${item.iconBg}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#14213D] mb-1.5 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#526079] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Female Student Photo with Floating Badges */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Soft Circular Mint Halo */}
            <div className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-[#DCFCE7]/70 blur-3xl -z-10"></div>

            {/* Photo Card Container */}
            <div className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-xl border border-[#CBD5E1] bg-white">
              <img
                src="/images/landing/student-female.jpg"
                alt="Student smiling with books"
                className="w-full h-[430px] object-cover object-top"
              />

              {/* Top Floating Badge */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-[#E2E8F0] max-w-[210px] animate-pulse [animation-duration:3s]">
                <p className="text-xs font-bold text-[#2563EB] leading-tight flex items-center gap-1">
                  <span>Practice Today For a Brighter Tomorrow</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#EAB308] shrink-0" />
                </p>
              </div>

              {/* Bottom Floating Stat Badge */}
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-[#E2E8F0] flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-black text-[#14213D] leading-none">98.4% Confidence</p>
                  <p className="text-[10px] font-semibold text-[#16A34A] mt-0.5">Exam Day Ready</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
