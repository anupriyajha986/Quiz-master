import React, { useState } from "react";
import {
  Code,
  Palette,
  FileCode2,
  Cpu,
  Database,
  Binary,
  GitBranch,
  BarChart2,
  BookOpen,
  ChevronDown
} from "lucide-react";

export default function SubjectPerformanceCard({ subjectBreakdown }) {
  const [metric, setMetric] = useState("Percentage");

  const knownMeta = {
    HTML: { icon: Code, color: "bg-[#F97316]", iconBg: "bg-[#FFF7ED] text-[#F97316] border-[#FFEDD5]" },
    CSS: { icon: Palette, color: "bg-[#0866F5]", iconBg: "bg-[#EAF2FF] text-[#0866F5] border-[#BFDBFE]" },
    JavaScript: { icon: FileCode2, color: "bg-[#EAB308]", iconBg: "bg-[#FEFCE8] text-[#CA8A04] border-[#FEF08A]" },
    "Operating Systems": { icon: Cpu, color: "bg-[#9333EA]", iconBg: "bg-[#FAF5FF] text-[#9333EA] border-[#E9D5FF]" },
    DBMS: { icon: Database, color: "bg-[#4F46E5]", iconBg: "bg-[#EEF2FF] text-[#4F46E5] border-[#C7D2FE]" },
    COA: { icon: Binary, color: "bg-[#059669]", iconBg: "bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]" },
    DSA: { icon: GitBranch, color: "bg-[#E11D48]", iconBg: "bg-[#FFF1F2] text-[#E11D48] border-[#FECDD3]" },
    Overall: { icon: BarChart2, color: "bg-[#2563EB]", iconBg: "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]" }
  };

  const colorPalettes = [
    { color: "bg-[#0866F5]", iconBg: "bg-[#EAF2FF] text-[#0866F5] border-[#BFDBFE]" },
    { color: "bg-[#16A34A]", iconBg: "bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]" },
    { color: "bg-[#9333EA]", iconBg: "bg-[#FAF5FF] text-[#9333EA] border-[#E9D5FF]" },
    { color: "bg-[#EA580C]", iconBg: "bg-[#FFF7ED] text-[#EA580C] border-[#FFEDD5]" },
    { color: "bg-[#0D9488]", iconBg: "bg-[#F0FDFA] text-[#0D9488] border-[#99F6E4]" }
  ];

  const breakdownEntries = Object.entries(subjectBreakdown || {});
  const subjects = breakdownEntries
    .filter(([name]) => name !== "Overall")
    .map(([name, data], idx) => {
      const meta = knownMeta[name] || {
        icon: BookOpen,
        ...colorPalettes[idx % colorPalettes.length]
      };
      return {
        name,
        icon: meta.icon,
        color: meta.color,
        iconBg: meta.iconBg,
        percent: Math.round(Number(data?.percentage ?? data?.score ?? 0))
      };
    });

  if (subjectBreakdown?.Overall && (subjects.length > 0 || Number(subjectBreakdown.Overall.percentage) > 0)) {
    subjects.unshift({
      name: "Overall",
      icon: knownMeta.Overall.icon,
      color: knownMeta.Overall.color,
      iconBg: knownMeta.Overall.iconBg,
      percent: Math.round(Number(subjectBreakdown.Overall.percentage) || 0)
    });
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#E5ECF5] shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9] mb-4">
        <h3 className="text-base font-black text-[#111A36]">Subject-wise Performance</h3>

        <div className="relative">
          <button className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#F8FAFD] border border-[#E5ECF5] text-xs font-bold text-[#17233F] hover:bg-white transition-colors">
            <span>{metric}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
          </button>
        </div>
      </div>

      {/* Subject Bars or Empty State */}
      {subjects.length === 0 ? (
        <div className="py-10 text-center my-auto">
          <BookOpen className="w-8 h-8 text-[#94A3B8] mx-auto mb-2 opacity-50" />
          <p className="text-xs font-semibold text-[#64748B]">No exam results recorded yet</p>
          <p className="text-[11px] text-[#94A3B8] mt-0.5">Complete an exam to see your subject performance</p>
        </div>
      ) : (
        <div className="space-y-4 my-auto">
          {subjects.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center border shrink-0 ${s.iconBg}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-[#111A36]">{s.name}</span>
                  </div>
                  <span className="font-black text-[#111A36]">{s.percent}%</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 rounded-full bg-[#E5ECF5] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${s.color}`}
                    style={{ width: `${s.percent}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
