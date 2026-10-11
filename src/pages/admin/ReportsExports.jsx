import React, { useState, useEffect } from "react";
import { getTests } from "../../services/firebase/testService";
import { getAllResults } from "../../services/firebase/analyticsService";
import { exportToCsv } from "../../utils/csvExport";
import { useToast } from "../../context/ToastContext";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import jsPDF from "jspdf";
import {
  FileSpreadsheet,
  Download,
  Filter,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  Printer,
  Table
} from "lucide-react";

export default function ReportsExports() {
  const [reportType, setReportType] = useState("exam_performance");
  const [selectedTestId, setSelectedTestId] = useState("all");
  const [tests, setTests] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const toast = useToast();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [testsData, resultsData] = await Promise.all([
          getTests("all"),
          getAllResults()
        ]);
        setTests(testsData || []);
        setResults(resultsData || []);
      } catch (err) {
        console.error("Failed to load reports data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleExportCsv = () => {
    setIsExporting(true);
    try {
      if (reportType === "exam_performance") {
        const rows = tests.map((t) => ({
          ID: t.id,
          Title: t.title,
          Subject: t.subject || "Combined",
          Duration: `${t.durationMinutes || 60} mins`,
          Questions: t.questionCount || 90,
          Status: t.publicationStatus,
          CreatedAt: t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "N/A"
        }));
        exportToCsv(`QuizMaster_Exam_Report_${Date.now()}.csv`, rows);
      } else {
        const rows = results.map((r) => ({
          ResultID: r.id,
          StudentName: r.studentName || "Student",
          TestTitle: r.testTitle || "Mock Test",
          Score: r.totalScore,
          MaxMarks: r.maximumMarks,
          Percentage: `${r.percentage}%`,
          Accuracy: `${r.accuracy || 80}%`,
          Date: r.evaluatedAt ? new Date(r.evaluatedAt).toLocaleDateString() : "N/A"
        }));
        exportToCsv(`QuizMaster_Results_Report_${Date.now()}.csv`, rows);
      }
      toast.success("CSV report downloaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate CSV report.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPdf = () => {
    try {
      const doc = new jsPDF();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(37, 99, 235); // #2563EB
      doc.text("QuizMaster Examination Authority", 14, 20);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text("Official Platform Performance & Assessment Report", 14, 26);
      doc.text(`Generated On: ${new Date().toLocaleString()}`, 14, 32);

      doc.setDrawColor(229, 234, 242);
      doc.line(14, 36, 196, 36);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(23, 43, 77);
      doc.text(`Report Type: ${reportType.replace(/_/g, " ").toUpperCase()}`, 14, 44);

      let yPos = 54;
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("Record Name", 14, yPos);
      doc.text("Specification", 80, yPos);
      doc.text("Metric / Score", 140, yPos);
      doc.text("Status", 175, yPos);
      yPos += 4;
      doc.line(14, yPos, 196, yPos);
      yPos += 6;

      doc.setFont("helvetica", "normal");
      const sampleRows =
        reportType === "exam_performance"
          ? tests.slice(0, 15).map((t) => [t.title, t.subject || "Combined", `${t.durationMinutes || 60}m`, t.publicationStatus])
          : results.slice(0, 15).map((r) => [r.studentName || "Student", r.testTitle || "Mock Test", `${r.totalScore}/${r.maximumMarks}`, "Evaluated"]);

      sampleRows.forEach((row) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(String(row[0]).slice(0, 32), 14, yPos);
        doc.text(String(row[1]).slice(0, 25), 80, yPos);
        doc.text(String(row[2]), 140, yPos);
        doc.text(String(row[3]), 175, yPos);
        yPos += 7;
      });

      doc.save(`QuizMaster_Report_${Date.now()}.pdf`);
      toast.success("PDF report generated and downloaded!");
    } catch (err) {
      console.error("PDF export error:", err);
      toast.error("Failed to generate PDF report.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E5EAF2] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#EFF6FF] text-[#2563EB]">
              <FileSpreadsheet className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider">
              Auditing & Exports
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#172B4D] tracking-tight">
            Reports & Data Exports
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Export comprehensive examination statistics, scorecards, and student cohorts in CSV and PDF formats.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button icon={Download} size="sm" variant="secondary" onClick={handleExportCsv} loading={isExporting}>
            Export CSV
          </Button>
          <Button icon={Printer} size="sm" onClick={handleExportPdf}>
            Export PDF
          </Button>
        </div>
      </div>

      {/* Control Filters */}
      <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-[#172B4D] mb-1.5">
            Report Type
          </label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-[#F6F8FC] border border-[#E5EAF2] rounded-xl outline-none focus:border-[#2563EB] text-[#172B4D] font-medium"
          >
            <option value="exam_performance">Exam Performance Report</option>
            <option value="student_results">Student Results & Scorecards</option>
            <option value="participation_audit">Participation & Completion Audit</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#172B4D] mb-1.5">
            Examination Scope
          </label>
          <select
            value={selectedTestId}
            onChange={(e) => setSelectedTestId(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-[#F6F8FC] border border-[#E5EAF2] rounded-xl outline-none focus:border-[#2563EB] text-[#172B4D] font-medium"
          >
            <option value="all">All Examinations (Aggregate)</option>
            {tests.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#172B4D] mb-1.5">
            Date Window
          </label>
          <select
            className="w-full px-3 py-2 text-xs bg-[#F6F8FC] border border-[#E5EAF2] rounded-xl outline-none focus:border-[#2563EB] text-[#172B4D] font-medium"
          >
            <option value="current_month">Current Month (Oct 2026)</option>
            <option value="last_quarter">Last 90 Days</option>
            <option value="all_time">All Time Cumulative</option>
          </select>
        </div>
      </div>

      {/* Preview Table */}
      <div className="bg-white border border-[#E5EAF2] rounded-2xl overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-[#F1F5F9] flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#172B4D]">Report Dataset Preview</h3>
          <span className="text-xs font-semibold text-[#64748B]">
            Showing first 10 records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#F1F5F9] bg-[#F8FAFC] text-[11px] font-bold text-[#64748B]">
                <th className="py-3 px-4">Title / Name</th>
                <th className="py-3 px-4">Scope / Subject</th>
                <th className="py-3 px-4">Metric</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F8FAFC]">
              {reportType === "exam_performance" ? (
                tests.slice(0, 8).map((t) => (
                  <tr key={t.id} className="hover:bg-[#F8FAFD]">
                    <td className="py-3 px-4 font-bold text-[#172B4D]">{t.title}</td>
                    <td className="py-3 px-4 text-[#64748B]">{t.subject || "Combined"}</td>
                    <td className="py-3 px-4 font-semibold text-[#2563EB]">{t.questionCount || (t.questionIds ? t.questionIds.length : 0)} Questions</td>
                    <td className="py-3 px-4 text-[#64748B]">
                      {t.createdAt?.toMillis
                        ? new Date(t.createdAt.toMillis()).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                        : (t.createdAt ? new Date(t.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "-")}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]">
                        {t.publicationStatus || "Published"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                results.slice(0, 8).map((r) => (
                  <tr key={r.id} className="hover:bg-[#F8FAFD]">
                    <td className="py-3 px-4 font-bold text-[#172B4D]">{r.studentName || "Student"}</td>
                    <td className="py-3 px-4 text-[#64748B]">{r.testTitle || "Exam"}</td>
                    <td className="py-3 px-4 font-semibold text-[#2563EB]">{r.totalScore} / {r.maximumMarks} ({r.percentage}%)</td>
                    <td className="py-3 px-4 text-[#64748B]">
                      {r.evaluatedAt ? new Date(r.evaluatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "-"}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]">
                        Evaluated
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
