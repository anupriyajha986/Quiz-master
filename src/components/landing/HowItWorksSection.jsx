import React from "react";
import { UserPlus, Search, Play, BarChart3, ArrowRight } from "lucide-react";

export default function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      icon: UserPlus,
      title: "Create Your Account",
      description: "Register and set up your profile in under a minute."
    },
    {
      num: "02",
      icon: Search,
      title: "Choose an Exam",
      description: "Explore curated mock tests and subject quizzes."
    },
    {
      num: "03",
      icon: Play,
      title: "Take the Test",
      description: "Answer questions in a real exam simulated environment."
    },
    {
      num: "04",
      icon: BarChart3,
      title: "Review Your Results",
      description: "Analyze performance insights and pinpoint improvements."
    }
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-[#14213D] tracking-tight">
            How It <span className="text-[#2563EB]">Works</span>
          </h2>
          <p className="text-sm sm:text-base text-[#526079] mt-2">
            Your preparation, in four simple steps.
          </p>
        </div>

        {/* 4 Steps Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="relative flex flex-col items-center text-center group">
                {/* Connecting arrow line on desktop */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-7 left-[65%] w-[70%] h-0.5 border-t-2 border-dashed border-[#CBD5E1] z-0"></div>
                )}

                {/* Step Circle with Number Badge */}
                <div className="relative mb-6 z-10">
                  <div className="w-14 h-14 rounded-2xl bg-[#2563EB] text-white flex items-center justify-center shadow-md group-hover:scale-105 group-hover:bg-[#1D4ED8] transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#16A34A] text-white text-[10px] font-black flex items-center justify-center border-2 border-white shadow-2xs">
                    {step.num}
                  </span>
                </div>

                {/* Text Content */}
                <h3 className="text-base font-bold text-[#14213D] mb-2 leading-snug">
                  {step.title}
                </h3>
                <p className="text-xs text-[#526079] leading-relaxed max-w-[220px]">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
