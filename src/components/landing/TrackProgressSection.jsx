import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";
import {
  BarChart2,
  PieChart,
  History,
  AlertTriangle,
  ChevronDown
} from "lucide-react";

export default function TrackProgressSection() {
  const [selectedRange, setSelectedRange] = useState("Last 5 Tests");

  const chartData = [
    { test: "Test 1", score: 62 },
    { test: "Test 2", score: 68 },
    { test: "Test 3", score: 65 },
    { test: "Test 4", score: 78 },
    { test: "Test 5", score: 84 }
  ];

  const features = [
    {
      icon: BarChart2,
      title: "Score Analysis",
      description: "See your marks and percentage.",
      color: "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]"
    },
    {
      icon: PieChart,
      title: "Subject-Wise Breakdown",
      description: "Compare performance across subjects.",
      color: "bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]"
    },
    {
      icon: History,
      title: "Attempt History",
      description: "Track your improvement over time.",
      color: "bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]"
    },
    {
      icon: AlertTriangle,
      title: "Areas to Improve",
      description: "Identify topics that need more practice.",
      color: "bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-left mb-14">
          <h2 className="text-3xl sm:text-4xl font-black text-[#14213D] tracking-tight">
            Track Your <span className="text-[#2563EB]">Progress</span>
          </h2>
          <p className="text-sm sm:text-base text-[#526079] mt-2">
            Turn every attempt into an opportunity to improve.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Performance Overview Chart Card (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-md">
            {/* Card Header with Dropdown */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-[#14213D]">Performance Overview</h3>
                <p className="text-xs text-[#64748B]">Score progression trajectory</p>
              </div>

              <div className="relative">
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-xs font-semibold text-[#334155] hover:bg-white transition-colors">
                  <span>{selectedRange}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
                </button>
              </div>
            </div>

            {/* Recharts Area Curve */}
            <div className="h-64 w-full relative mb-6">
              {/* Highlight Badge on Top of Point */}
              <div className="absolute top-10 left-[62%] -translate-x-1/2 bg-[#2563EB] text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-md z-10 flex items-center gap-1">
                <span>78%</span>
              </div>

              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="test"
                    stroke="#94A3B8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#94A3B8"
                    fontSize={11}
                    domain={[40, 100]}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `${val}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1E293B",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "12px"
                    }}
                    formatter={(val) => [`${val}%`, "Score"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#10B981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#scoreGradient)"
                    dot={{ r: 4, fill: "#10B981", strokeWidth: 2, stroke: "#FFFFFF" }}
                    activeDot={{ r: 6, fill: "#2563EB" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* 4 Stat Tiles at Bottom of Chart Card */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#F1F5F9]">
              <div className="p-3 rounded-xl bg-[#DCFCE7] border border-[#BBF7D0] text-center">
                <span className="block text-xl font-black text-[#16A34A]">85%</span>
                <span className="text-[11px] font-semibold text-[#15803D]">Accuracy</span>
              </div>

              <div className="p-3 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-center">
                <span className="block text-xl font-black text-[#2563EB]">72%</span>
                <span className="text-[11px] font-semibold text-[#1D4ED8]">Average Score</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F5F3FF] border border-[#DDD6FE] text-center">
                <span className="block text-xl font-black text-[#7C3AED]">12</span>
                <span className="text-[11px] font-semibold text-[#6D28D9]">Tests Attempted</span>
              </div>

              <div className="p-3 rounded-xl bg-[#E0F2FE] border border-[#BAE6FD] text-center">
                <span className="block text-xl font-black text-[#0284C7]">5</span>
                <span className="text-[11px] font-semibold text-[#0369A1]">Subjects</span>
              </div>
            </div>
          </div>

          {/* Right: 4 Detailed Feature Rows (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-[#E2E8F0] hover:border-[#BFDBFE] hover:shadow-xs transition-all bg-white"
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 ${feat.color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#14213D] leading-tight">
                      {feat.title}
                    </h4>
                    <p className="text-xs text-[#526079] mt-1 leading-snug">
                      {feat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
