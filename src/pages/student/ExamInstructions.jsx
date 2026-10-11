import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getTestById } from "../../services/firebase/testService";
import { startAttempt } from "../../services/firebase/examService";
import { useToast } from "../../context/ToastContext";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import { CardSkeleton } from "../../components/common/LoadingSkeleton";
import { formatDuration } from "../../utils/formatters";
import {
  GraduationCap,
  Clock,
  Award,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Wifi,
  RotateCcw
} from "lucide-react";

export default function ExamInstructions() {
  const { testId } = useParams();
  const { currentUser, userProfile } = useAuth();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const [starting, setStarting] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    async function loadTest() {
      setLoading(true);
      try {
        const data = await getTestById(testId);
        if (!data || data.publicationStatus !== "published") {
          toast.error("This examination is not currently available.");
          navigate("/student/exams");
          return;
        }
        setTest(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load test details.");
      } finally {
        setLoading(false);
      }
    }
    loadTest();
  }, [testId]);

  const handleStartExam = async () => {
    if (!confirmed) {
      toast.error("Please confirm that you have read and accepted the instructions.");
      return;
    }

    setStarting(true);
    try {
      // Authoritative start attempt: sets server timestamp deadline
      const { attempt } = await startAttempt(testId, userProfile);
      toast.success("Examination initialized! Timer has started.");
      navigate(`/student/attempts/${attempt.id}`);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to start examination.");
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (!test) return null;

  const pos = test.markingScheme?.positiveMarks || 4;
  const neg = test.markingScheme?.negativeMarks || 1;
  const unans = test.markingScheme?.unansweredMarks || 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Title Header */}
      <div className="flex items-center justify-between bg-white border border-[#E2E8F0] rounded-2xl p-6">
        <div>
          <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider">
            Pre-Examination Briefing
          </span>
          <h1 className="text-2xl font-black text-[#111827] tracking-tight mt-0.5">
            {test.title}
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Subject: {test.subject || "General"} &bull; Read all instructions before initiating timer.
          </p>
        </div>

        <Link
          to="/student/exams"
          className="text-xs font-semibold text-[#64748B] hover:text-[#111827] flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Exit
        </Link>
      </div>

      {/* Critical Timing Notice */}
      <div className="p-4 bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl flex items-start gap-3">
        <Clock className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
        <div className="text-xs text-[#1E40AF]">
          <strong className="block font-bold mb-0.5">Notice Regarding Examination Timing:</strong>
          The countdown timer is currently <strong>inactive</strong> on this screen.
          The official server-synchronized timer will begin <strong>only</strong> when you click the "Start Examination" button below.
        </div>
      </div>

      {/* Test Parameters Overview */}
      <Card className="p-6">
        <h3 className="text-sm font-bold text-[#111827] mb-4">
          Examination Summary Parameters
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs mb-6">
          <div>
            <span className="text-[#64748B] block mb-0.5">Total Questions</span>
            <span className="text-lg font-black text-[#111827]">
              {test.publishedQuestionsSnapshot?.length || test.questionCount || 0}
            </span>
          </div>

          <div>
            <span className="text-[#64748B] block mb-0.5">Duration</span>
            <span className="text-lg font-black text-[#111827]">
              {formatDuration(test.durationMinutes)}
            </span>
          </div>

          <div>
            <span className="text-[#64748B] block mb-0.5">Maximum Marks</span>
            <span className="text-lg font-black text-[#16A34A]">
              {test.maximumMarks || 0}
            </span>
          </div>

          <div>
            <span className="text-[#64748B] block mb-0.5">Marking Formula</span>
            <span className="text-lg font-black text-[#111827]">
              +{pos} / -{neg}
            </span>
          </div>
        </div>

        {/* Detailed Guidelines */}
        <div className="space-y-4 text-xs text-[#475569] leading-relaxed">
          <div className="border-b border-[#E2E8F0] pb-3">
            <h4 className="font-bold text-[#111827] mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" /> 1. Question Palette State Indicators
            </h4>
            <p className="mb-2">
              The examination console provides real-time state feedback for each question:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-[#F1F5F9] border border-[#CBD5E1] text-[#64748B] flex items-center justify-center font-bold text-[10px]">1</span>
                <span>Grey: Not Visited yet</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-white border border-[#CBD5E1] text-[#111827] flex items-center justify-center font-bold text-[10px]">2</span>
                <span>Neutral: Visited, but Not Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-[#DCFCE7] border border-[#86EFAC] text-[#15803D] flex items-center justify-center font-bold text-[10px]">3</span>
                <span>Green: Answered & Saved</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] flex items-center justify-center font-bold text-[10px]">4</span>
                <span>Blue: Marked for Review</span>
              </div>
            </div>
          </div>

          <div className="border-b border-[#E2E8F0] pb-3">
            <h4 className="font-bold text-[#111827] mb-1.5 flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-[#2563EB]" /> 2. Refresh & Connection Resilience
            </h4>
            <p>
              If your internet disconnects momentarily or you reload the browser tab, your active attempt and saved responses are securely maintained. The timer calculates remaining time from the server-defined deadline and will not reset.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#111827] mb-1.5 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#16A34A]" /> 3. Submission Policy
            </h4>
            <p>
              You may review and change responses anytime prior to final submission. When the timer reaches 00:00, your exam will be automatically submitted and finalized by the backend.
            </p>
          </div>
        </div>

        {/* Confirmation Checkbox */}
        <div className="mt-8 pt-6 border-t border-[#E2E8F0]">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-0.5 rounded text-[#2563EB] focus:ring-[#2563EB]"
            />
            <span className="text-xs font-semibold text-[#111827]">
              I have read, understood, and agreed to all examination instructions, timing guidelines, and marking regulations. I am ready to begin the test.
            </span>
          </label>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            size="lg"
            disabled={!confirmed}
            loading={starting}
            onClick={handleStartExam}
            icon={ArrowRight}
          >
            Start Examination Now
          </Button>
        </div>
      </Card>
    </div>
  );
}
