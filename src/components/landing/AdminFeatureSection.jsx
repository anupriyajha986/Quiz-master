import React from "react";
import { Link } from "react-router-dom";
import {
  Database,
  Sliders,
  Users,
  CheckCircle2,
  FileSpreadsheet,
  Plus,
  LayoutDashboard,
  HelpCircle,
  FileQuestion,
  GraduationCap,
  Settings,
  BarChart2
} from "lucide-react";

export default function AdminFeatureSection() {
  const adminFeatures = [
    {
      icon: Database,
      title: "Question Bank",
      description: "Create and manage comprehensive question sets."
    },
    {
      icon: Sliders,
      title: "Flexible Test Creation",
      description: "Configure custom exam rules and negative marking schemes."
    },
    {
      icon: Users,
      title: "Student Management",
      description: "Track students by batches and monitor candidate status."
    },
    {
      icon: CheckCircle2,
      title: "Automated Evaluation",
      description: "Instantly calculate ranks, percentiles and section analytics."
    },
    {
      icon: FileSpreadsheet,
      title: "Reports & Exports",
      description: "Export candidate performance data to CSV and formatted PDFs."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-[#EAFBF0] border-y border-[#DCFCE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-left mb-14">
          <h2 className="text-3xl sm:text-4xl font-black text-[#14213D] tracking-tight">
            For Teachers, <span className="text-[#2563EB]">Institutes & Administrators</span>
          </h2>
          <p className="text-sm sm:text-base text-[#526079] mt-2">
            Manage exams. Organize questions. Simplify evaluation.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: 5 Feature Items (5 cols) */}
          <div className="lg:col-span-5 space-y-3.5">
            {adminFeatures.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-[#DCFCE7] shadow-2xs hover:shadow-xs transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#14213D] leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#526079] mt-0.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Realistic Admin Dashboard Mockup (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#CBD5E1] shadow-xl overflow-hidden flex flex-col sm:flex-row">
            {/* Dark Sidebar */}
            <div className="w-full sm:w-48 bg-[#0F172A] text-[#94A3B8] p-4 flex flex-col justify-between shrink-0">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-white pb-3 border-b border-[#1E293B]">
                  <GraduationCap className="w-5 h-5 text-[#2563EB]" />
                  <span className="text-xs font-bold tracking-tight">QuizMaster Admin</span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-slate-300 hover:bg-[#1E293B]">
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Dashboard</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-slate-300 hover:bg-[#1E293B]">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Questions</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-slate-300 hover:bg-[#1E293B]">
                    <FileQuestion className="w-3.5 h-3.5" />
                    <span>Question Sets</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg bg-[#2563EB] text-white font-bold shadow-xs">
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Test Management</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-slate-300 hover:bg-[#1E293B]">
                    <Users className="w-3.5 h-3.5" />
                    <span>Students</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-slate-300 hover:bg-[#1E293B]">
                    <BarChart2 className="w-3.5 h-3.5" />
                    <span>Analytics</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-slate-300 hover:bg-[#1E293B]">
                    <Settings className="w-3.5 h-3.5" />
                    <span>Settings</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#1E293B] text-[10px] text-slate-400">
                Logged in as Admin
              </div>
            </div>

            {/* Admin Table Body */}
            <div className="flex-1 p-5 overflow-x-auto bg-white">
              {/* Table Top Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-[#14213D]">Test Management</h4>
                  <p className="text-[11px] text-[#64748B]">Active examination schedules</p>
                </div>

                <Link
                  to="/admin/tests"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Test</span>
                </Link>
              </div>

              {/* Data Table */}
              <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B]">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">Title</th>
                      <th className="py-2.5 px-2 font-semibold">Questions</th>
                      <th className="py-2.5 px-2 font-semibold">Duration</th>
                      <th className="py-2.5 px-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9] text-[#1E293B]">
                    <tr>
                      <td className="py-2.5 px-3 font-bold truncate max-w-[140px]">
                        Full-Stack JavaScript Core Exam
                      </td>
                      <td className="py-2.5 px-2 text-[#64748B]">50</td>
                      <td className="py-2.5 px-2 text-[#64748B]">60 min</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#16A34A] font-bold text-[10px]">
                          Published
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold truncate max-w-[140px]">
                        Operating Systems - Concurrency Drill
                      </td>
                      <td className="py-2.5 px-2 text-[#64748B]">30</td>
                      <td className="py-2.5 px-2 text-[#64748B]">45 min</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#64748B] font-bold text-[10px]">
                          Draft
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold truncate max-w-[140px]">
                        DBMS - Normalization & SQL Unit
                      </td>
                      <td className="py-2.5 px-2 text-[#64748B]">25</td>
                      <td className="py-2.5 px-2 text-[#64748B]">40 min</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#16A34A] font-bold text-[10px]">
                          Published
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold truncate max-w-[140px]">
                        DSA - Trees & Dynamic Programming
                      </td>
                      <td className="py-2.5 px-2 text-[#64748B]">20</td>
                      <td className="py-2.5 px-2 text-[#64748B]">40 min</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] font-bold text-[10px]">
                          Completed
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
