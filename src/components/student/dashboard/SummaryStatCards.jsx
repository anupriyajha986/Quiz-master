import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, CheckCircle2, BarChart2, Target, ChevronRight } from "lucide-react";

export default function SummaryStatCards({ stats }) {
  const completedCount = stats?.completedTestsCount ?? 0;
  const availableCount = stats?.availableTestsCount ?? 0;
  const avgScore = stats?.averagePercentage ?? 0;
  const accuracy = stats?.overallAccuracy ?? 0;

  const cards = [
    {
      icon: BookOpen,
      iconBg: "bg-[#0866F5] text-white",
      value: availableCount,
      label: "Available Exams",
      subtext: availableCount > 0 ? `${availableCount} tests ready to take` : "No active tests published",
      link: "/student/exams"
    },
    {
      icon: CheckCircle2,
      iconBg: "bg-[#16B866] text-white",
      value: completedCount,
      label: "Tests Completed",
      subtext: completedCount > 0 ? "Completed sessions" : "Begin your first practice exam",
      link: "/student/results"
    },
    {
      icon: BarChart2,
      iconBg: "bg-[#7547F8] text-white",
      value: `${avgScore}%`,
      label: "Average Score",
      subtext: completedCount > 0 ? "Average across all attempts" : "Calculated after first evaluation",
      link: "/student/analytics"
    },
    {
      icon: Target,
      iconBg: "bg-[#FF9F0A] text-white",
      value: `${accuracy}%`,
      label: "Overall Accuracy",
      subtext: completedCount > 0 ? "Correct vs attempted questions" : "Awaiting test responses",
      link: "/student/analytics"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {cards.map((c, idx) => {
        const Icon = c.icon;
        return (
          <Link
            key={idx}
            to={c.link}
            className="bg-white rounded-2xl p-5 border border-[#E5ECF5] shadow-2xs hover:shadow-sm hover:border-[#BFDBFE] transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              {/* Circular Icon Container */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-xs shrink-0 ${c.iconBg}`}
              >
                <Icon className="w-5 h-5" />
              </div>

              {/* Metric and Labels */}
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-[#111A36] leading-none">
                    {c.value}
                  </span>
                  {c.trend && (
                    <span className="text-[11px] font-bold text-[#16B866] flex items-center">
                      &uarr; {c.trend}
                    </span>
                  )}
                </div>

                <p className="text-xs font-bold text-[#17233F] mt-1.5 leading-none">
                  {c.label}
                </p>
                <p className="text-[11px] text-[#64748B] mt-1 leading-tight">
                  {c.subtext}
                </p>
              </div>
            </div>

            {/* Navigation Arrow */}
            <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#0866F5] group-hover:translate-x-0.5 transition-all shrink-0" />
          </Link>
        );
      })}
    </div>
  );
}
