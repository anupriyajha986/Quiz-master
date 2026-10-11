import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getStudentDashboardStats } from "../../services/firebase/analyticsService";
import PerformanceOverviewCard from "../../components/student/dashboard/PerformanceOverviewCard";
import SubjectPerformanceCard from "../../components/student/dashboard/SubjectPerformanceCard";
import { BarChart2, TrendingUp, Target, Award } from "lucide-react";

export default function StudentAnalytics() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!currentUser) return;
      try {
        const data = await getStudentDashboardStats(currentUser.uid);
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [currentUser]);

  if (loading) {
    return <div className="p-8 text-center text-xs text-[#64748B]">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#111A36]">Performance Analytics</h1>
        <p className="text-xs text-[#64748B] mt-1">
          Detailed metrics, subject strengths, and score accuracy breakdown.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 flex flex-col">
          <PerformanceOverviewCard scoreTrends={stats?.scoreTrends} stats={stats} />
        </div>
        <div className="lg:col-span-5 flex flex-col">
          <SubjectPerformanceCard subjectBreakdown={stats?.subjectBreakdown} />
        </div>
      </div>
    </div>
  );
}
