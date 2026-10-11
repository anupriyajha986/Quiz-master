import React from "react";
import { HelpCircle, Mail, MessageCircle, FileText } from "lucide-react";

export default function StudentHelp() {
  const faqs = [
    {
      q: "How does the authoritative countdown timer work?",
      a: "The countdown timer is anchored to an official server deadline. Refreshing your web browser or updating your local clock will never alter the official test deadline."
    },
    {
      q: "What happens if I lose my internet connection during an exam?",
      a: "Your answers are automatically saved locally and synchronized to the server whenever a response is selected. Once your connection recovers, your current state is instantly reconciled."
    },
    {
      q: "How do negative markings work in the exams?",
      a: "Standard marking schemes award +4 marks for every correct answer, deduct -1 mark for every incorrect answer, and allocate 0 marks for unattempted questions."
    },
    {
      q: "When can I download my verified PDF scorecard?",
      a: "Once you submit the examination, our trusted evaluation engine generates and publishes your verified performance report. You can view and download it anytime under Results & Scorecards."
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-[#111A36]">Help & Support</h1>
        <p className="text-xs text-[#64748B] mt-1">
          Frequently asked questions, examination instructions, and support contacts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Support Cards */}
        <div className="bg-white rounded-3xl p-6 border border-[#E5ECF5] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#EAF2FF] text-[#0866F5] flex items-center justify-center shrink-0">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#111A36]">Email Support</h4>
            <a href="mailto:support@quizmaster.com" className="text-xs text-[#2563EB] hover:underline mt-0.5 block">
              support@quizmaster.com
            </a>
            <span className="text-[10px] text-[#16B866] font-semibold mt-1 block">Response within 2 hours</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#E5ECF5] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#E9FAF0] text-[#16B866] flex items-center justify-center shrink-0">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#111A36]">Candidate Helpline</h4>
            <a href="tel:+918001234567" className="text-xs text-[#2563EB] hover:underline mt-0.5 block">
              +91 (800) 123-4567
            </a>
            <span className="text-[10px] text-[#64748B] font-semibold mt-1 block">Mon - Sat, 9 AM - 6 PM IST</span>
          </div>
        </div>
      </div>

      {/* FAQ List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5ECF5] shadow-xs">
        <h3 className="text-base font-black text-[#111A36] mb-6">Frequently Asked Questions</h3>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="p-4 rounded-2xl bg-[#F8FAFD] border border-[#E5ECF5]">
              <h4 className="text-xs sm:text-sm font-bold text-[#111A36] mb-1.5">{faq.q}</h4>
              <p className="text-xs text-[#526079] leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
