import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Brain, Atom, Award } from "lucide-react";

export default function ExploreExamsSection() {
  const examCards = [
    {
      id: "fullstack-cs",
      title: "Full Stack & CS Practice",
      description: "Timed MCQs across DSA, Web Dev, OS, DBMS, and COA.",
      image: "/images/landing/jee-practice.jpg",
      badgeColor: "bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]",
      icon: Atom,
      target: "/student/exams"
    },
    {
      id: "aptitude",
      title: "General Aptitude",
      description: "Practice logic and quantitative ability problems.",
      image: "/images/landing/aptitude-desk.jpg",
      badgeColor: "bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]",
      icon: Brain,
      target: "/student/exams"
    },
    {
      id: "subject-wise",
      title: "Subject-Wise Tests",
      description: "Focus on topics that need improvement.",
      image: "/images/landing/subject-books.jpg",
      badgeColor: "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]",
      icon: BookOpen,
      target: "/student/exams"
    },
    {
      id: "mock-exams",
      title: "Mock Exams",
      description: "Experience a full exam environment.",
      image: "/images/landing/mock-exam.jpg",
      badgeColor: "bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]",
      icon: Award,
      target: "/student/exams"
    }
  ];

  return (
    <section id="explore-exams" className="py-16 md:py-24 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#14213D] tracking-tight">
              Find Your <span className="text-[#2563EB]">Next Challenge</span>
            </h2>
            <p className="text-sm sm:text-base text-[#526079] mt-2">
              Choose an exam, test your knowledge, and take one step closer to your goals.
            </p>
          </div>

          <Link
            to="/student/exams"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#2563EB] hover:text-[#1D4ED8] hover:gap-2.5 transition-all self-start md:self-auto"
          >
            <span>View All Exams</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {examCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="group bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-2xs hover:shadow-md hover:border-[#BFDBFE] transition-all flex flex-col justify-between"
              >
                {/* Photo Top */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                </div>

                {/* Card Content Bottom */}
                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    {/* Badge */}
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border mb-3 ${card.badgeColor}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{card.title}</span>
                    </div>

                    <p className="text-xs text-[#526079] leading-relaxed line-clamp-2">
                      {card.description}
                    </p>
                  </div>

                  {/* Circular Blue Action Button */}
                  <div className="pt-4 mt-2 flex items-center justify-end">
                    <Link
                      to={card.target}
                      className="w-9 h-9 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white flex items-center justify-center transition-all group-hover:scale-110 shadow-xs"
                      aria-label={`Start ${card.title}`}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
