import React from "react";
import { Link } from "react-router-dom";
import {
  Atom,
  Stethoscope,
  Cpu,
  Brain,
  BookOpen,
  ClipboardCheck
} from "lucide-react";

export default function PopularExamsStrip({ activeCategory, onSelectCategory }) {
  const categories = [
    { id: "coding", name: "Full Stack & Web", icon: BookOpen, tag: null },
    { id: "core-cs", name: "Core CS (OS/DBMS/COA)", icon: Cpu, tag: null },
    { id: "dsa", name: "DSA & Algorithms", icon: Brain, tag: null },
    { id: "subject", name: "Subject-Wise", icon: Atom, tag: null },
    { id: "mock", name: "Mock Tests", icon: ClipboardCheck, tag: null }
  ];

  return (
    <section className="py-6 border-y border-[#E2E8F0] bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
          {/* Label */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
            <span className="text-xs font-black tracking-wider uppercase text-[#64748B]">
              Popular Exams
            </span>
          </div>

          {/* Badge List */}
          <div className="flex items-center gap-3 overflow-x-auto w-full pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory && onSelectCategory(cat.id)}
                  className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full border text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-[#EFF6FF] border-[#2563EB] text-[#2563EB] shadow-2xs"
                      : "bg-white border-[#E2E8F0] text-[#1E293B] hover:border-[#2563EB] hover:text-[#2563EB] hover:bg-[#F8FAFC]"
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#2563EB]" />
                  <span>{cat.name}</span>
                  {cat.tag && (
                    <span className="text-[10px] font-semibold bg-[#F1F5F9] text-[#64748B] px-1.5 py-0.5 rounded-full">
                      {cat.tag}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
