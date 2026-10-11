import React, { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      quote:
        "A clean and well-designed platform. The test interface feels just like the real exam! The timer and question palette helped me manage my pacing effortlessly.",
      name: "Rohan Sharma",
      role: "Engineering Aspirant",
      avatar: "/images/landing/avatar-rohan.jpg",
      rating: 5
    },
    {
      id: 2,
      quote:
        "The analytics and detailed solutions help me understand my mistakes easily. Being able to see negative marks clearly motivated me to stop wild guessing.",
      name: "Priya Patel",
      role: "Full Stack Developer Aspirant",
      avatar: "/images/landing/avatar-priya.jpg",
      rating: 5
    },
    {
      id: 3,
      quote:
        "Best platform for mock tests. The interface is simple and very easy to use. The downloadable scorecard looks so professional and authentic.",
      name: "Arjun Mehta",
      role: "Class 12 Student",
      avatar: "/images/landing/avatar-arjun.jpg",
      rating: 5
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Nav Arrows */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#14213D] tracking-tight">
              What Students <span className="text-[#2563EB]">Say</span>
            </h2>
            <p className="text-sm sm:text-base text-[#526079] mt-2">
              Real experiences from learners who are growing with QuizMaster.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="w-9 h-9 rounded-full border border-[#E2E8F0] hover:border-[#2563EB] hover:bg-[#EFF6FF] text-[#64748B] hover:text-[#2563EB] flex items-center justify-center transition-all cursor-pointer"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="w-9 h-9 rounded-full border border-[#E2E8F0] hover:border-[#2563EB] hover:bg-[#EFF6FF] text-[#64748B] hover:text-[#2563EB] flex items-center justify-center transition-all cursor-pointer"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3 Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-[#F8FAFC] rounded-2xl p-6 border border-[#E2E8F0] shadow-2xs hover:shadow-md hover:border-[#BFDBFE] transition-all flex flex-col justify-between"
            >
              <div>
                {/* 5 Gold Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]"
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-xs sm:text-sm text-[#334155] leading-relaxed mb-6 italic">
                  "{item.quote}"
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#E2E8F0]">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-2xs"
                  loading="lazy"
                />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#14213D] leading-none">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-[#64748B] mt-1">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
