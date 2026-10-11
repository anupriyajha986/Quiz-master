import React, { useState } from "react";
import LandingNavbar from "../../components/landing/LandingNavbar";
import HeroSection from "../../components/landing/HeroSection";
import PopularExamsStrip from "../../components/landing/PopularExamsStrip";
import ExploreExamsSection from "../../components/landing/ExploreExamsSection";
import WhyQuizMasterSection from "../../components/landing/WhyQuizMasterSection";
import FamiliarExamSection from "../../components/landing/FamiliarExamSection";
import HowItWorksSection from "../../components/landing/HowItWorksSection";
import TrackProgressSection from "../../components/landing/TrackProgressSection";
import AdminFeatureSection from "../../components/landing/AdminFeatureSection";
import TestimonialsSection from "../../components/landing/TestimonialsSection";
import FAQSection from "../../components/landing/FAQSection";
import FinalCTASection from "../../components/landing/FinalCTASection";
import LandingFooter from "../../components/landing/LandingFooter";

export default function LandingPage() {
  const [activeCategory, setActiveCategory] = useState("coding");

  const handleSelectCategory = (catId) => {
    setActiveCategory(catId);
    const exploreSection = document.getElementById("explore-exams");
    if (exploreSection) {
      exploreSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#14213D] selection:bg-[#2563EB] selection:text-white">
      {/* 1. Sticky Navigation Bar */}
      <LandingNavbar />

      <main>
        {/* 2. Premium Hero Section with Live Exam Mockup */}
        <HeroSection />

        {/* 3. Popular Exams Strip */}
        <PopularExamsStrip
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
        />

        {/* 4. Find Your Next Challenge / Explore Exams */}
        <ExploreExamsSection />

        {/* 5. Why Choose QuizMaster */}
        <WhyQuizMasterSection />

        {/* 6. A Familiar Exam Experience */}
        <FamiliarExamSection />

        {/* 7. How It Works (4-Step Process) */}
        <HowItWorksSection />

        {/* 8. Track Your Progress with Analytics Chart */}
        <TrackProgressSection />

        {/* 9. For Teachers, Institutes & Administrators */}
        <AdminFeatureSection />

        {/* 10. What Students Say (Testimonials) */}
        <TestimonialsSection />

        {/* 11. Frequently Asked Questions & Contact Card */}
        <FAQSection />

        {/* 12. Final CTA Banner */}
        <FinalCTASection />
      </main>

      {/* 13. Comprehensive EdTech SaaS Footer */}
      <LandingFooter />
    </div>
  );
}
