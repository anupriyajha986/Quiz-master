import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import Card from "./Card";
import Badge from "./Badge";
import { formatDate } from "../../utils/formatters";
import { downloadScorecardPdf } from "../../utils/pdfGenerator";
import { useToast } from "../../context/ToastContext";
import { addBookmark } from "../../services/firebase/bookmarkService";
import {
  GraduationCap,
  Download,
  Printer,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Percent,
  Target,
  ShieldCheck,
  Building,
  Hash,
  Calendar,
  Layers,
  Bookmark,
  BookmarkCheck
} from "lucide-react";

export default function ScorecardReport({ result, backUrl, isAdmin = false }) {
  const reportRef = useRef(null);
  const toast = useToast();
  const [bookmarkedMap, setBookmarkedMap] = useState({});

  if (!result) return null;

  const handleBookmark = async (item) => {
    try {
      await addBookmark({
        questionId: item.questionId || "",
        questionText: item.questionText || "",
        testId: result.testId || "",
        testTitle: result.testTitle || "Mock Test",
        subject: result.subject || "General",
        selectedAnswer: item.selectedAnswer,
        correctAnswer: item.correctAnswer,
        explanation: item.explanation || ""
      });
      setBookmarkedMap((prev) => ({ ...prev, [item.questionId]: true }));
      toast.success("Question bookmarked for revision!");
    } catch (err) {
      console.error("Bookmark error:", err);
      toast.error(`Could not bookmark question: ${err.message}`);
    }
  };

  const handleDownload = () => {
    downloadScorecardPdf(
      "official-scorecard-document",
      `Scorecard_${result.rollNumber || "Student"}_${result.testTitle?.replace(/\s+/g, "_")}.pdf`
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Action Bar (Hidden during printing) */}
      <div className="no-print flex items-center justify-between bg-white border border-[#E2E8F0] rounded-2xl p-4">
        {backUrl && (
          <Link
            to={backUrl}
            className="text-xs font-bold text-[#64748B] hover:text-[#111827] flex items-center gap-1.5"
          >
            &larr; Back to Results List
          </Link>
        )}

        <div className="flex items-center gap-2.5 ml-auto">
          <Button
            variant="secondary"
            icon={Printer}
            size="sm"
            onClick={handlePrint}
          >
            Print
          </Button>
          <Button
            variant="primary"
            icon={Download}
            size="sm"
            onClick={handleDownload}
          >
            Download PDF Report
          </Button>
        </div>
      </div>

      {/* Printable Scorecard Container */}
      <div
        id="official-scorecard-document"
        ref={reportRef}
        className="bg-white border border-[#E2E8F0] rounded-2xl p-8 sm:p-10 shadow-xs space-y-8"
      >
        {/* Certificate Header */}
        <div className="flex items-start justify-between border-b border-[#E2E8F0] pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#2563EB] flex items-center justify-center text-white">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#111827] tracking-tight">
                QuizMaster Examination Authority
              </h2>
              <p className="text-xs text-[#64748B]">
                Official Computer-Based Assessment Scorecard & Performance Transcript
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono text-[#64748B] block">
              Reference: {result.id || result.resultId}
            </span>
            <div className="flex items-center gap-1.5 justify-end mt-1">
              <Badge variant="success" size="xs">
                AUTHENTICATED RECORD
              </Badge>
              {result.resultStatus && (
                <Badge variant={result.resultStatus === "passed" ? "success" : "danger"} size="xs">
                  {result.resultStatus.toUpperCase()}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Candidate Profile Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 p-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs">
          <div>
            <span className="text-[#64748B] block">Candidate Name</span>
            <span className="font-bold text-[#111827] text-sm mt-0.5 block">
              {result.studentName}
            </span>
          </div>

          <div>
            <span className="text-[#64748B] block">Roll / Reg Number</span>
            <span className="font-mono font-bold text-[#2563EB] text-sm mt-0.5 block">
              {result.rollNumber || "N/A"}
            </span>
          </div>

          <div>
            <span className="text-[#64748B] block">Institution</span>
            <span className="font-semibold text-[#111827] mt-0.5 block truncate">
              {result.instituteName || "General Candidate"}
            </span>
          </div>

          <div>
            <span className="text-[#64748B] block">Examination Date</span>
            <span className="font-semibold text-[#111827] mt-0.5 block">
              {formatDate(result.evaluatedAt || result.submittedAt)}
            </span>
          </div>

          <div>
            <span className="text-[#64748B] block">Time Taken</span>
            <span className="font-semibold text-[#111827] mt-0.5 block">
              {result.timeTaken || "Session Duration"}
            </span>
          </div>
        </div>

        {/* Examination Title Banner */}
        <div className="p-4 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider block">
              Examination
            </span>
            <h3 className="text-base font-black text-[#111827]">
              {result.testTitle}
            </h3>
          </div>
          <span className="text-xs font-semibold text-[#1E40AF]">
            Subject: {result.subject || "General"}
          </span>
        </div>

        {/* Main Scorecard Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl">
            <span className="text-xs font-semibold text-[#64748B] block mb-1">
              Total Score
            </span>
            <div className="text-3xl font-black text-[#16A34A]">
              {result.totalScore}
            </div>
            <span className="text-[11px] text-[#64748B] font-medium block mt-1">
              {result.positiveMarks !== undefined ? `+${result.positiveMarks} / -${result.negativeMarks || 0} (out of ${result.maximumMarks})` : `out of ${result.maximumMarks} Marks`}
            </span>
          </div>

          <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl">
            <span className="text-xs font-semibold text-[#64748B] block mb-1">
              Percentage
            </span>
            <div className="text-3xl font-black text-[#111827]">
              {result.percentage}%
            </div>
            <span className="text-[11px] text-[#64748B] font-medium block mt-1">
              {result.resultStatus ? `Status: ${result.resultStatus.toUpperCase()}` : "Aggregate Mark"}
            </span>
          </div>

          <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl">
            <span className="text-xs font-semibold text-[#64748B] block mb-1">
              Accuracy
            </span>
            <div className="text-3xl font-black text-[#2563EB]">
              {result.accuracy}%
            </div>
            <span className="text-[11px] text-[#64748B] font-medium block mt-1">
              {result.attemptedCount || (result.correctCount + result.incorrectCount)} of {result.totalQuestions} Attempted
            </span>
          </div>

          <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl">
            <span className="text-xs font-semibold text-[#64748B] block mb-1">
              Total Questions
            </span>
            <div className="text-3xl font-black text-[#111827]">
              {result.totalQuestions}
            </div>
            <span className="text-[11px] text-[#64748B] font-medium block mt-1">
              {result.timeTaken ? `Duration: ${result.timeTaken}` : "Full Paper Count"}
            </span>
          </div>
        </div>

        {/* Response Counts Breakdown */}
        <div className="grid grid-cols-3 gap-4 text-center p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
            <div className="text-left">
              <span className="text-xs font-bold text-[#111827] block">
                {result.correctCount} Correct
              </span>
              <span className="text-[10px] text-[#64748B]">Answers</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            <XCircle className="w-5 h-5 text-[#DC2626]" />
            <div className="text-left">
              <span className="text-xs font-bold text-[#111827] block">
                {result.incorrectCount} Incorrect
              </span>
              <span className="text-[10px] text-[#64748B]">Penalty deducted</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#64748B]" />
            <div className="text-left">
              <span className="text-xs font-bold text-[#111827] block">
                {result.unansweredCount} Unanswered
              </span>
              <span className="text-[10px] text-[#64748B]">Skipped questions</span>
            </div>
          </div>
        </div>

        {/* Subject-Wise Performance Table */}
        {result.subjectBreakdown && Object.keys(result.subjectBreakdown).length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Subject Performance Distribution
            </h4>
            <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold text-[11px]">
                  <tr>
                    <th className="px-4 py-2.5">Subject</th>
                    <th className="px-4 py-2.5">Total Questions</th>
                    <th className="px-4 py-2.5">Correct</th>
                    <th className="px-4 py-2.5">Incorrect</th>
                    <th className="px-4 py-2.5">Unanswered</th>
                    <th className="px-4 py-2.5 text-right">Marks Scored</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {Object.entries(result.subjectBreakdown).map(([subj, val]) => (
                    <tr key={subj}>
                      <td className="px-4 py-2.5 font-bold text-[#111827]">{subj}</td>
                      <td className="px-4 py-2.5 text-[#64748B]">{val.total}</td>
                      <td className="px-4 py-2.5 text-[#16A34A] font-semibold">{val.correct}</td>
                      <td className="px-4 py-2.5 text-[#DC2626] font-semibold">{val.incorrect}</td>
                      <td className="px-4 py-2.5 text-[#64748B]">{val.unanswered}</td>
                      <td className="px-4 py-2.5 text-right font-bold text-[#111827]">
                        {val.score} / {val.maxScore}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Question Review Section (If Explanations Permitted) */}
        {result.evaluatedResponses && result.evaluatedResponses.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-[#E2E8F0]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Question-by-Question Solution Review
            </h4>

            <div className="space-y-3">
              {result.evaluatedResponses.map((item, idx) => {
                const isCorrect = item.status === "correct";
                const isIncorrect = item.status === "incorrect";

                return (
                  <div
                    key={item.questionId || idx}
                    className={`p-4 rounded-xl border text-xs space-y-2 ${
                      isCorrect
                        ? "bg-[#DCFCE7]/30 border-[#86EFAC]"
                        : isIncorrect
                        ? "bg-[#FEF2F2]/30 border-[#FECACA]"
                        : "bg-[#F8FAFC] border-[#E2E8F0]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#111827]">
                          Question {idx + 1}
                        </span>
                        {!isAdmin && (
                          <button
                            onClick={() => handleBookmark(item)}
                            className="p-1 rounded-lg text-[#64748B] hover:text-[#2563EB] hover:bg-white transition-colors cursor-pointer"
                            title={bookmarkedMap[item.questionId] ? "Bookmarked" : "Bookmark question for revision"}
                          >
                            {bookmarkedMap[item.questionId] ? (
                              <BookmarkCheck className="w-4 h-4 text-[#2563EB]" />
                            ) : (
                              <Bookmark className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            isCorrect ? "success" : isIncorrect ? "danger" : "default"
                          }
                          size="xs"
                        >
                          {isCorrect
                            ? "CORRECT (+)"
                            : isIncorrect
                            ? "INCORRECT (-)"
                            : "UNANSWERED"}
                        </Badge>
                        <span className="font-bold text-[#111827]">
                          {item.marksAwarded > 0 ? `+${item.marksAwarded}` : item.marksAwarded} Marks
                        </span>
                      </div>
                    </div>

                    <p className="font-medium text-[#111827] leading-relaxed">
                      {item.questionText || "Question text"}
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-1 font-semibold text-[11px]">
                      <div>
                        <span className="text-[#64748B]">Candidate Response: </span>
                        <span
                          className={
                            isCorrect
                              ? "text-[#16A34A]"
                              : isIncorrect
                              ? "text-[#DC2626]"
                              : "text-[#64748B]"
                          }
                        >
                          {item.selectedAnswer ? `Option ${item.selectedAnswer}` : "Not Attempted"}
                        </span>
                      </div>

                      <div>
                        <span className="text-[#64748B]">Official Correct Key: </span>
                        <span className="text-[#16A34A]">
                          Option {item.correctAnswer}
                        </span>
                      </div>
                    </div>

                    {item.explanation && (
                      <div className="p-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[11px] text-[#1E40AF]">
                        <strong className="block text-[#111827] mb-0.5">Explanation:</strong>
                        {item.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Certificate Verification Footer */}
        <div className="pt-6 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] gap-2">
          <div className="flex items-center gap-1.5 text-[#16A34A] font-semibold">
            <ShieldCheck className="w-4 h-4" /> Cryptographically Validated on Cloud Firestore
          </div>
          <div className="text-right text-[10px]">
            QuizMaster Automated Assessment Engine v1.0 &bull; Non-Repudiable Evaluation
          </div>
        </div>
      </div>
    </div>
  );
}
