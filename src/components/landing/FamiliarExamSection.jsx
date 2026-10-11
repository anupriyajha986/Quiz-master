import React from "react";
import { Clock, LayoutGrid, Bookmark, Cloud, Check, X, Minus } from "lucide-react";

export default function FamiliarExamSection() {
  const features = [
    {
      icon: Clock,
      title: "Live Timer",
      description: "Manage your time effectively.",
      iconColor: "text-[#2563EB] bg-[#EFF6FF] border-[#BFDBFE]"
    },
    {
      icon: LayoutGrid,
      title: "Question Palette",
      description: "See answered and pending questions.",
      iconColor: "text-[#16A34A] bg-[#DCFCE7] border-[#BBF7D0]"
    },
    {
      icon: Bookmark,
      title: "Mark for Review",
      description: "Flag questions to revisit later.",
      iconColor: "text-[#DC2626] bg-[#FEE2E2] border-[#FECACA]"
    },
    {
      icon: Cloud,
      title: "Auto Save",
      description: "Your responses are saved automatically.",
      iconColor: "text-[#2563EB] bg-[#EFF6FF] border-[#BFDBFE]"
    }
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-black text-[#14213D] tracking-tight">
            A Familiar <span className="text-[#2563EB]">Exam Experience</span>
          </h2>
          <p className="text-sm sm:text-base text-[#526079] mt-2">
            Practice with a structured interface inspired by real computer-based examinations.
          </p>
        </div>

        {/* 4 Feature Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs hover:shadow-sm hover:border-[#BFDBFE] transition-all"
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center border mb-3.5 ${feat.iconColor}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#14213D] mb-1">{feat.title}</h3>
                <p className="text-xs text-[#526079] leading-relaxed">{feat.description}</p>
              </div>
            );
          })}
        </div>

        {/* Large Mockup with Floating Sample Marking Scheme */}
        <div className="relative max-w-4xl mx-auto bg-white rounded-2xl border border-[#CBD5E1] shadow-xl overflow-hidden p-4 sm:p-6">
          {/* Top Window Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-[#14213D]">Coding Assessment - Mock Test</span>
              <span className="text-[10px] font-semibold bg-[#EFF6FF] text-[#2563EB] px-2 py-0.5 rounded-md border border-[#BFDBFE]">
                Section 1 of 3
              </span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] text-xs font-mono font-bold">
              <Clock className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>01:27:36</span>
            </div>
          </div>

          {/* Interior Mockup Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Question Screen (8 cols) */}
            <div className="lg:col-span-8 bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0]">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-bold text-[#2563EB]">DSA • Question 08</span>
                <span className="text-[#64748B]">Single Choice (Radio)</span>
              </div>

              <p className="text-xs text-[#1E293B] font-medium leading-relaxed mb-4">
                What is the worst-case time complexity of searching an element in a balanced Binary Search Tree (AVL or Red-Black Tree)?
              </p>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0] text-[#334155] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full border border-[#CBD5E1] flex items-center justify-center text-[10px] font-bold">A</span>
                  <span>O(1)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#EFF6FF] border border-[#2563EB] text-[#1D4ED8] font-bold flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-[10px] font-bold">B</span>
                  <span>O(log n) (Maintains strictly bounded height)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0] text-[#334155] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full border border-[#CBD5E1] flex items-center justify-center text-[10px] font-bold">C</span>
                  <span>O(n)</span>
                </div>
              </div>
            </div>

            {/* Right Mini Palette & Floating Marking Scheme (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              {/* Question Palette Preview */}
              <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
                <div className="text-xs font-bold text-[#14213D] mb-2">Palette Status</div>
                <div className="grid grid-cols-5 gap-1.5 text-center">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <div
                      key={num}
                      className={`h-6 rounded text-[10px] font-bold flex items-center justify-center ${
                        num === 8
                          ? "bg-[#2563EB] text-white ring-2 ring-[#2563EB]"
                          : num < 6
                          ? "bg-[#16A34A] text-white"
                          : num === 6
                          ? "bg-[#7C3AED] text-white"
                          : "bg-[#E2E8F0] text-[#475569]"
                      }`}
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Marking Scheme Card */}
              <div className="bg-white p-4 rounded-xl border border-[#CBD5E1] shadow-md">
                <div className="text-xs font-black text-[#14213D] mb-2.5 flex items-center justify-between">
                  <span>Sample Marking Scheme</span>
                  <span className="text-[10px] text-[#64748B]">Official NTA</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-[#F1F5F9]">
                    <span className="flex items-center gap-1.5 text-[#334155] font-medium">
                      <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                      Correct Answer
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#16A34A] font-bold text-[11px]">
                      +4 marks
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-[#F1F5F9]">
                    <span className="flex items-center gap-1.5 text-[#334155] font-medium">
                      <X className="w-3.5 h-3.5 text-[#DC2626]" />
                      Incorrect Answer
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#FEE2E2] text-[#DC2626] font-bold text-[11px]">
                      -1 mark
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="flex items-center gap-1.5 text-[#64748B] font-medium">
                      <Minus className="w-3.5 h-3.5 text-[#94A3B8]" />
                      Unattempted
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#64748B] font-bold text-[11px]">
                      0 marks
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
