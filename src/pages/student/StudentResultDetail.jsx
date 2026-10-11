import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getResultById, getResultByAttemptId } from "../../services/firebase/analyticsService";
import { getAttemptById } from "../../services/firebase/examService";
import ScorecardReport from "../../components/common/ScorecardReport";
import { CardSkeleton } from "../../components/common/LoadingSkeleton";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import { formatDate } from "../../utils/formatters";
import {
  Award,
  CheckCircle2,
  Clock,
  FileCheck2,
  ArrowRight,
  Home,
  Layers,
  HelpCircle,
  AlertCircle
} from "lucide-react";

export default function StudentResultDetail() {
  const { resultId } = useParams();
  const [result, setResult] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecord() {
      setLoading(true);
      try {
        // 1. Attempt to fetch result directly by ID
        let resData = await getResultById(resultId);

        // 2. If not found by doc ID, check if the param is an attempt ID that already has a result
        if (!resData) {
          resData = await getResultByAttemptId(resultId);
        }

        if (resData) {
          setResult(resData);
        } else {
          // 3. Fallback: check if param is a submitted attempt awaiting evaluation
          const attData = await getAttemptById(resultId);
          if (attData) {
            setAttempt(attData);
          }
        }
      } catch (err) {
        console.error("Error loading result/attempt detail:", err);
      } finally {
        setLoading(false);
      }
    }
    loadRecord();
  }, [resultId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  // 1. Result exists and is published
  if (result && result.publicationStatus === "published") {
    return (
      <ScorecardReport
        result={result}
        backUrl="/student/results"
        isAdmin={false}
      />
    );
  }

  // 2. Result exists but is marked as hidden/unpublished by the examination authority
  if (result && result.publicationStatus === "hidden") {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 sm:p-10 shadow-xs text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <Badge variant="warning" size="sm">Scorecard Awaiting Publication</Badge>
            <h1 className="text-2xl font-black text-[#111827] tracking-tight">
              Evaluation Concluded &bull; Awaiting Official Release
            </h1>
            <p className="text-sm text-[#64748B] max-w-lg mx-auto">
              Your test for <span className="font-bold text-[#111827]">{result.testTitle}</span> has been securely evaluated. The examination authority will announce official scores according to the scheduled declaration time.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-[#F1F5F9]">
            <Link to="/student/dashboard">
              <Button variant="secondary" icon={Home}>Student Dashboard</Button>
            </Link>
            <Link to="/student/results">
              <Button variant="primary" icon={Layers}>View Results Portal</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Attempt exists and was submitted (Awaiting Admin Evaluation / Scoring)
  if (attempt && attempt.status === "submitted") {
    const answered = attempt.responseSummary?.answered ?? 0;
    const unanswered = attempt.responseSummary?.unanswered ?? 0;
    const totalQ = answered + unanswered;

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 sm:p-10 shadow-xs space-y-8">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="success" size="xs">AUTHENTICATED SUBMISSION</Badge>
                <span className="text-xs text-[#64748B] font-mono">ID: {attempt.id}</span>
              </div>
              <h1 className="text-2xl font-black text-[#111827] tracking-tight">
                Examination Submitted Successfully
              </h1>
              <p className="text-sm text-[#64748B]">
                Your responses have been securely finalized and recorded on the QuizMaster server.
              </p>
            </div>
          </div>

          {/* Test & Submission Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm">
            <div>
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">Examination</span>
              <span className="font-bold text-[#111827] text-base block mt-0.5">{attempt.testTitle || "Mock Test"}</span>
            </div>
            <div>
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">Submitted At</span>
              <span className="font-semibold text-[#111827] block mt-0.5">{formatDate(attempt.submittedAt)}</span>
            </div>
            <div>
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">Candidate Name</span>
              <span className="font-semibold text-[#111827] block mt-0.5">{attempt.studentName || "Candidate"}</span>
            </div>
            <div>
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">Roll Number</span>
              <span className="font-semibold text-[#111827] font-mono block mt-0.5">{attempt.studentRollNumber || "N/A"}</span>
            </div>
          </div>

          {/* Submission Metrics */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl">
              <span className="text-2xl font-black text-[#16A34A] block">{answered}</span>
              <span className="text-xs font-bold text-[#15803D]">Questions Answered</span>
            </div>
            <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
              <span className="text-2xl font-black text-[#64748B] block">{unanswered}</span>
              <span className="text-xs font-bold text-[#64748B]">Unanswered</span>
            </div>
            <div className="p-4 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl">
              <span className="text-2xl font-black text-[#2563EB] block">{totalQ}</span>
              <span className="text-xs font-bold text-[#1D4ED8]">Total Questions</span>
            </div>
          </div>

          {/* Evaluation Notice */}
          <div className="flex items-start gap-3 p-4 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl text-xs text-[#1E40AF]">
            <FileCheck2 className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">Status: Awaiting Official Evaluation</span>
              <p className="text-[12px] leading-relaxed text-[#1E3A8A]">
                To maintain competitive integrity, answer keys and official scores are validated authoritatively by the examination board. Once processed, your scorecard, rank, and detailed question-by-question breakdown will appear on the Results portal.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#F1F5F9]">
            <Link to="/student/results">
              <Button variant="secondary" icon={Layers}>View Results Portal</Button>
            </Link>
            <div className="flex items-center gap-2">
              <Link to="/student/exams">
                <Button variant="outline">Browse Tests</Button>
              </Link>
              <Link to="/student/dashboard">
                <Button variant="primary" icon={ArrowRight}>Return to Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. Attempt exists but is still in progress
  if (attempt && attempt.status === "in_progress") {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-[#111827]">Examination In Progress</h1>
            <p className="text-sm text-[#64748B]">
              This test session is currently active and has not been submitted yet.
            </p>
          </div>
          <div className="pt-2">
            <Link to={`/student/attempts/${attempt.id}`}>
              <Button variant="primary" icon={ArrowRight}>Resume Test Session</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 5. Default: Not found
  return (
    <EmptyState
      icon={Award}
      title="Record Not Found"
      description="The requested examination scorecard or attempt record does not exist or has not been created."
      actionLabel="Return to Results"
      actionHref="/student/results"
    />
  );
}
