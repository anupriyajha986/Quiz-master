import React from "react";
import { GraduationCap, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#E2E8F0] py-6 text-xs text-[#64748B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-[#2563EB]" />
          <span className="font-semibold text-[#111827]">QuizMaster</span>
          <span>&copy; {new Date().getFullYear()} Examination & Assessment Platform.</span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-[#16A34A] font-medium">
            <ShieldCheck className="w-4 h-4" /> Secure Firebase Cloud Backend
          </span>
          <span className="text-[#CBD5E1]">|</span>
          <span>Role-Based Examination Portal</span>
        </div>
      </div>
    </footer>
  );
}
