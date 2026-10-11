import React, { useState } from "react";
import { ChevronDown, HelpCircle, Mail, MessageSquare } from "lucide-react";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "What is QuizMaster?",
      a: "QuizMaster is an online examination and practice platform where students can take timed exams, review detailed result reports, access trended score analytics, and track performance across subjects."
    },
    {
      q: "What coding and computer science subjects are supported?",
      a: "QuizMaster features comprehensive question banks and set-wise practice across core coding domains: HTML, CSS, JavaScript, Operating Systems, DBMS, Computer Organization & Architecture (COA), and Data Structures & Algorithms (DSA), with live timers, marking schemes, and instant performance feedback."
    },
    {
      q: "How is my score calculated?",
      a: "Our automated server evaluation applies standard official marking schemes: +4 marks for correct MCQ choices, -1 mark for incorrect answers, and 0 marks for unattempted questions."
    },
    {
      q: "Can I review my answers after submitting?",
      a: "Yes. After submitting or when the test time expires, you receive an instant scorecard with question-by-question breakdown, correct answers, your chosen answers, and explanations."
    },
    {
      q: "Can I use QuizMaster on my phone?",
      a: "Absolutely! QuizMaster is fully responsive and optimized for smartphones, tablets, laptops, and desktop computers with adaptive layouts."
    }
  ];

  const toggleAccordion = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <section id="faq" className="py-16 md:py-24 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-left mb-14">
          <h2 className="text-3xl sm:text-4xl font-black text-[#14213D] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-[#526079] mt-2">
            Everything you need to know about QuizMaster.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Accordion (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden transition-all shadow-2xs"
                >
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-[#14213D] hover:text-[#2563EB] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#64748B] shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-[#2563EB]" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-[#526079] leading-relaxed border-t border-[#F1F5F9] pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Contact Card with 3D Illustration (5 cols) */}
          <div id="contact" className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#CBD5E1] shadow-lg flex flex-col items-center text-center">
            {/* 3D Student with Laptop Illustration */}
            <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden mb-6 bg-slate-50 border border-[#E2E8F0]">
              <img
                src="/images/landing/faq-student.jpg"
                alt="Support character with laptop"
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="text-lg font-black text-[#14213D] mb-2 leading-snug">
              Still have questions? We're here to help.
            </h3>
            <p className="text-xs text-[#526079] mb-6 max-w-xs leading-relaxed">
              Contact our support team for quick assistance with exams, scorecards, or account setup.
            </p>

            <a
              href="mailto:support@quizmaster.com"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs sm:text-sm shadow-xs transition-all w-full max-w-xs"
            >
              <Mail className="w-4 h-4" />
              <span>Contact Us</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
