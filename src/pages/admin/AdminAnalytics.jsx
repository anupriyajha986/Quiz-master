import React, { useState, useEffect } from "react";
import { getAllResults } from "../../services/firebase/analyticsService";
import { getTests } from "../../services/firebase/testService";
import Card from "../../components/common/Card";
import Select from "../../components/common/Select";
import Badge from "../../components/common/Badge";
import { CardSkeleton } from "../../components/common/LoadingSkeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { BarChart3, TrendingUp, Award, Users, CheckCircle2 } from "lucide-react";

export default function AdminAnalytics() {
  const [results, setResults] = useState([]);
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [rData, tData] = await Promise.all([
          getAllResults(selectedTest),
          getTests()
        ]);
        setResults(rData);
        setTests(tData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedTest]);

  // Aggregate metrics
  const totalSubmissions = results.length;
  const scores = results.map((r) => Number(r.percentage) || 0);
  const highestScore = scores.length ? Math.max(...scores) : 0;
  const lowestScore = scores.length ? Math.min(...scores) : 0;
  const avgScore = scores.length
    ? Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1))
    : 0;

  // Score distribution brackets
  const distribution = [
    { bracket: "0-40%", count: 0 },
    { bracket: "41-60%", count: 0 },
    { bracket: "61-80%", count: 0 },
    { bracket: "81-100%", count: 0 }
  ];

  results.forEach((r) => {
    const p = Number(r.percentage) || 0;
    if (p <= 40) distribution[0].count++;
    else if (p <= 60) distribution[1].count++;
    else if (p <= 80) distribution[2].count++;
    else distribution[3].count++;
  });

  // Subject accuracy aggregation
  const subjectAgg = {};
  results.forEach((r) => {
    if (r.subjectBreakdown) {
      Object.entries(r.subjectBreakdown).forEach(([subj, data]) => {
        if (!subjectAgg[subj]) {
          subjectAgg[subj] = { correct: 0, total: 0 };
        }
        subjectAgg[subj].correct += data.correct || 0;
        subjectAgg[subj].total += data.total || 0;
      });
    }
  });

  const subjectData = Object.entries(subjectAgg).map(([subject, data]) => ({
    subject,
    accuracy: data.total > 0 ? Number(((data.correct / data.total) * 100).toFixed(1)) : 0
  }));

  const COLORS = ["#64748B", "#2563EB", "#16A34A", "#1D4ED8"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-[#E2E8F0] rounded-2xl p-6">
        <div>
          <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider">
            Evaluation Analytics
          </span>
          <h1 className="text-2xl font-black text-[#111827] tracking-tight mt-0.5">
            Performance Intelligence
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Empirical score distributions, subject mastery rates, and testing benchmarks.
          </p>
        </div>

        <div className="w-56">
          <Select
            value={selectedTest}
            onChange={(e) => setSelectedTest(e.target.value)}
          >
            <option value="all">All Examinations</option>
            {tests.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <>
          {/* Top KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="p-5">
              <span className="text-xs text-[#64748B] font-semibold block mb-1">
                Submissions
              </span>
              <div className="text-2xl font-black text-[#111827]">
                {totalSubmissions}
              </div>
            </Card>

            <Card className="p-5">
              <span className="text-xs text-[#64748B] font-semibold block mb-1">
                Average Mark
              </span>
              <div className="text-2xl font-black text-[#2563EB]">
                {avgScore}%
              </div>
            </Card>

            <Card className="p-5">
              <span className="text-xs text-[#64748B] font-semibold block mb-1">
                Top Score
              </span>
              <div className="text-2xl font-black text-[#16A34A]">
                {highestScore}%
              </div>
            </Card>

            <Card className="p-5">
              <span className="text-xs text-[#64748B] font-semibold block mb-1">
                Lowest Mark
              </span>
              <div className="text-2xl font-black text-[#64748B]">
                {lowestScore}%
              </div>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Score Distribution Histogram */}
            <Card className="p-6">
              <h3 className="text-sm font-bold text-[#111827] mb-1">
                Candidate Score Distribution
              </h3>
              <p className="text-xs text-[#64748B] mb-6">
                Frequency count of candidate scores categorized in performance quartiles
              </p>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={distribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="bracket" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        borderColor: "#E2E8F0",
                        borderRadius: "12px",
                        fontSize: "12px"
                      }}
                    />
                    <Bar dataKey="count" fill="#2563EB" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Subject Accuracy Bar Chart */}
            <Card className="p-6">
              <h3 className="text-sm font-bold text-[#111827] mb-1">
                Subject Accuracy Benchmarks
              </h3>
              <p className="text-xs text-[#64748B] mb-6">
                Aggregate percentage of correct answers achieved across subjects
              </p>

              <div className="h-64 w-full">
                {subjectData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={subjectData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                      <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                      <YAxis type="category" dataKey="subject" tick={{ fontSize: 11 }} width={90} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#FFFFFF",
                          borderColor: "#E2E8F0",
                          borderRadius: "12px",
                          fontSize: "12px"
                        }}
                      />
                      <Bar dataKey="accuracy" fill="#16A34A" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-[#64748B]">
                    No subject breakdown data recorded yet.
                  </div>
                )}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
