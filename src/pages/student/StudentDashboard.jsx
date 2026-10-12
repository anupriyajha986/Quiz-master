import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getStudentDashboardStats } from "../../services/firebase/analyticsService";
import { getStudentAvailableTests } from "../../services/firebase/testService";
import { getStudentAttempts } from "../../services/firebase/studentService";

// Modular Dashboard Components matching exact reference image
import WelcomeBanner from "../../components/student/dashboard/WelcomeBanner";
import SummaryStatCards from "../../components/student/dashboard/SummaryStatCards";
import ContinueLearning from "../../components/student/dashboard/ContinueLearning";
import UpcomingExams from "../../components/student/dashboard/UpcomingExams";
import PerformanceOverviewCard from "../../components/student/dashboard/PerformanceOverviewCard";
import SubjectPerformanceCard from "../../components/student/dashboard/SubjectPerformanceCard";
import RecentActivityCard from "../../components/student/dashboard/RecentActivityCard";
import RecentTestsTable from "../../components/student/dashboard/RecentTestsTable";
import MotivationalCTACard from "../../components/student/dashboard/MotivationalCTACard";

export default function StudentDashboard() {
  const { currentUser, userProfile } = useAuth();
  const [stats, setStats] = useState(null);
  const [availableTests, setAvailableTests] = useState([]);
  const [myAttempts, setMyAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      if (!currentUser) return;
      setLoading(true);
      try {
        const [statsData, testsData, attemptsData] = await Promise.all([
          getStudentDashboardStats(currentUser.uid),
          getStudentAvailableTests(),
          getStudentAttempts(currentUser.uid)
        ]);
        setStats(statsData);
        setAvailableTests(testsData || []);
        setMyAttempts(attemptsData || []);
      } catch (err) {
        console.error("Failed to load student dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [currentUser]);

  const studentName = userProfile?.fullName || currentUser?.displayName || currentUser?.email?.split("@")[0] || "Student";
  const activeAttempt = stats?.activeAttempt || myAttempts.find((a) => a.status === "in_progress");
  const defaultTest = availableTests.length > 0 ? availableTests[0] : null;

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-44 bg-white rounded-3xl border border-[#E5ECF5]"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="h-24 bg-white rounded-2xl border border-[#E5ECF5]"></div>
          <div className="h-24 bg-white rounded-2xl border border-[#E5ECF5]"></div>
          <div className="h-24 bg-white rounded-2xl border border-[#E5ECF5]"></div>
          <div className="h-24 bg-white rounded-2xl border border-[#E5ECF5]"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-56 bg-white rounded-3xl border border-[#E5ECF5]"></div>
          <div className="h-56 bg-white rounded-3xl border border-[#E5ECF5]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Large Welcome Banner & Date Card */}
      <WelcomeBanner studentName={studentName} />

      {/* 2. Four Summary Statistic Cards */}
      <SummaryStatCards stats={stats} />

      {/* 3. Two-Column Continue Learning & Upcoming Exams */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6 flex flex-col">
          <ContinueLearning
            activeAttempt={activeAttempt}
            defaultTest={defaultTest}
          />
        </div>
        <div className="lg:col-span-6 flex flex-col">
          <UpcomingExams exams={availableTests} />
        </div>
      </div>

      {/* 4. Three-Column Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch">
        {/* Performance Overview (5 cols) */}
        <div className="lg:col-span-5 flex flex-col">
          <PerformanceOverviewCard
            scoreTrends={stats?.scoreTrends}
            stats={stats}
          />
        </div>

        {/* Subject-wise Performance (4 cols) */}
        <div className="lg:col-span-4 flex flex-col">
          <SubjectPerformanceCard
            subjectBreakdown={stats?.subjectBreakdown}
          />
        </div>

        {/* Recent Activity (3 cols) */}
        <div className="md:col-span-2 lg:col-span-3 flex flex-col">
          <RecentActivityCard
            activity={stats?.recentActivity}
          />
        </div>
      </div>

      {/* 5. Bottom Row: My Recent Tests Table & Motivational CTA Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Table (7 cols) */}
        <div className="lg:col-span-7 flex flex-col">
          <RecentTestsTable
            recentResults={stats?.recentResults}
            activeAttempt={activeAttempt}
          />
        </div>

        {/* Motivational Card (5 cols) */}
        <div className="lg:col-span-5 flex flex-col">
          <MotivationalCTACard />
        </div>
      </div>
    </div>
  );
}
