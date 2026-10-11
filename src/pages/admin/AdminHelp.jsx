import React from "react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import {
  LifeBuoy,
  BookOpen,
  FileText,
  ShieldAlert,
  HelpCircle,
  Mail,
  Phone,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Server
} from "lucide-react";

export default function AdminHelp() {
  const guideSections = [
    {
      title: "Authoring Question Banks & Question Sets",
      desc: "Questions can be authored one-by-one or uploaded via standard CSV templates. Answer keys are stored in a private Firestore vault and stripped before student distribution.",
      icon: BookOpen
    },
    {
      title: "Immutable Examination Snapshots",
      desc: "When an examination is published, an immutable snapshot of questions and marking scheme is locked. Changing drafts does not alter ongoing or historical attempts.",
      icon: FileText
    },
    {
      title: "Authoritative Scoring & Evaluation Engine",
      desc: "Student scores are evaluated using backend logic against verified answer keys. Standard scheme awards +4 for correct, -1 for incorrect, and 0 for unattempted.",
      icon: CheckCircle2
    },
    {
      title: "Force-Submit & Session Expiry Policy",
      desc: "Attempts with elapsed deadlines are closed by the server. Administrators can force-submit stuck attempts directly from the Live Attempts console.",
      icon: AlertTriangle
    }
  ];

  const faqs = [
    {
      q: "How do I import questions in bulk from Excel or CSV?",
      a: "Navigate to Question Bank and click 'Import Questions'. Download the sample template, fill out columns (Question Statement, Options A-D, Correct Answer, Subject, Topic, Marks), and upload."
    },
    {
      q: "What happens if a student's internet disconnects during an examination?",
      a: "QuizMaster saves all responses locally and synchronizes every response to Firestore in real time. Students can refresh or reopen the session and resume with time intact."
    },
    {
      q: "Can students view the correct answers while an exam is active?",
      a: "No. Firestore Security Rules explicitly restrict access to the answerKeys collection. Only backend evaluators have read access to answer keys."
    },
    {
      q: "How do I assign permissions to an evaluator or question author?",
      a: "Navigate to Admin Users & Roles, find or invite the staff member, and assign the appropriate role tier (e.g. Evaluator, Question Manager, Exam Manager)."
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E5EAF2] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#EFF6FF] text-[#2563EB]">
              <LifeBuoy className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider">
              System Documentation
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#172B4D] tracking-tight">
            Help & Administrative Support
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Operational guides, security protocol references, and support resources for QuizMaster administrators.
          </p>
        </div>

        <a
          href="mailto:support@quizmaster.com"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs transition-all"
        >
          <Mail className="w-4 h-4" />
          <span>Contact Technical Operations</span>
        </a>
      </div>

      {/* 4 Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {guideSections.map((guide, idx) => {
          const Icon = guide.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-2xs flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#172B4D] mb-1">
                  {guide.title}
                </h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  {guide.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQs Section */}
      <div className="bg-white border border-[#E5EAF2] rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="pb-3 border-b border-[#F1F5F9]">
          <h3 className="font-bold text-sm text-[#172B4D]">
            Frequently Asked Administrative Questions
          </h3>
          <p className="text-xs text-[#64748B] mt-0.5">
            Quick solutions to everyday platform scenarios and operational tasks.
          </p>
        </div>

        <div className="divide-y divide-[#F8FAFC]">
          {faqs.map((faq, idx) => (
            <div key={idx} className="py-3.5 space-y-1">
              <h4 className="text-xs font-bold text-[#172B4D] flex items-center gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-[#64748B] pl-5 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Infrastructure Status */}
      <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center shrink-0">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#172B4D]">
              Cloud Infrastructure Status
            </h4>
            <p className="text-[11px] text-[#64748B]">
              Firebase Authentication, Cloud Firestore, Cloud Functions, and App Check running normally.
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
          Production Grade Healthy
        </span>
      </div>
    </div>
  );
}
