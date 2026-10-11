import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";
import { ChevronDown } from "lucide-react";

export default function PerformanceOverviewCard({ scoreTrends = [], stats }) {
  const [filterRange, setFilterRange] = useState("Recent Tests");

  const data = scoreTrends || [];
  const hasData = data.length > 0;
  const latestScore = hasData ? data[data.length - 1].percentage : 0;
  const completedCount = stats?.completedTestsCount ?? 0;
  const avgScore = stats?.averagePercentage ?? 0;
  const accuracy = stats?.overallAccuracy ?? 0;

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#E5ECF5] shadow-xs flex flex-col justify-between h-full">
      {/* Header with Filter Dropdown */}
      <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9] mb-4">
        <h3 className="text-base font-black text-[#111A36]">Performance Overview</h3>

        <div className="relative">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#F8FAFD] border border-[#E5ECF5] text-xs font-bold text-[#17233F]">
            <span>{filterRange}</span>
          </span>
        </div>
      </div>

      {/* Recharts Area Chart or Empty State */}
      <div className="h-52 w-full relative mb-4 flex items-center justify-center">
        {!hasData ? (
          <div className="text-center py-6 px-4 space-y-2">
            <p className="text-xs font-bold text-[#111A36]">No test scores recorded yet</p>
            <p className="text-[11px] text-[#64748B] max-w-xs mx-auto">
              Your performance trajectory will automatically be charted as you complete mock examinations.
            </p>
          </div>
        ) : (
          <>
            {/* Floating marker badge at end point */}
            <div className="absolute top-2 right-4 bg-[#0866F5] text-white text-[11px] font-black px-2 py-0.5 rounded-full shadow-md z-10">
              {latestScore}%
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 25, right: 15, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="studentScoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0866F5" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0866F5" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="test"
                  stroke="#94A3B8"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94A3B8"
                  fontSize={10}
                  domain={[0, 100]}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${val}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111A36",
                    border: "none",
                    borderRadius: "12px",
                    color: "#ffffff",
                    fontSize: "12px",
                    fontWeight: "bold"
                  }}
                  formatter={(val) => [`${val}%`, "Score"]}
                />
                <Area
                  type="monotone"
                  dataKey="percentage"
                  stroke="#0866F5"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#studentScoreGrad)"
                  dot={{ r: 4, fill: "#0866F5", strokeWidth: 2, stroke: "#FFFFFF" }}
                  activeDot={{ r: 6, fill: "#0866F5" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </>
        )}
      </div>

      {/* Bottom 4 Summary Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-[#F1F5F9]">
        <div className="p-2.5 rounded-xl bg-[#E9FAF0] border border-[#BBF7D0] text-center">
          <span className="block text-base font-black text-[#16B866]">
            {accuracy}%
          </span>
          <span className="text-[10px] font-bold text-[#15803D]">Accuracy</span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#EAF2FF] border border-[#BFDBFE] text-center">
          <span className="block text-base font-black text-[#0866F5]">
            {avgScore}%
          </span>
          <span className="text-[10px] font-bold text-[#0754D1]">Average Score</span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#F3E8FF] border border-[#DDD6FE] text-center">
          <span className="block text-base font-black text-[#7547F8]">
            {completedCount}
          </span>
          <span className="text-[10px] font-bold text-[#6D28D9]">Tests Done</span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#FFF7ED] border border-[#FED7AA] text-center">
          <span className="block text-base font-black text-[#FF9F0A]">
            3
          </span>
          <span className="text-[10px] font-bold text-[#C2410C]">Core Subjects</span>
        </div>
      </div>
    </div>
  );
}
