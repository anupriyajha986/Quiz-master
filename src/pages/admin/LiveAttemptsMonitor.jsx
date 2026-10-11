import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllAttempts, adminForceSubmitAttempt } from "../../services/firebase/examService";
import { getTests } from "../../services/firebase/testService";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Card from "../../components/common/Card";
import Select from "../../components/common/Select";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import EmptyState from "../../components/common/EmptyState";
import { TableSkeleton } from "../../components/common/LoadingSkeleton";
import { formatDate } from "../../utils/formatters";
import {
  Activity,
  Clock,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Eye,
  ShieldAlert,
  Send,
  Timer
} from "lucide-react";

export default function LiveAttemptsMonitor() {
  const [attempts, setAttempts] = useState([]);
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState("all");
  const [loading, setLoading] = useState(true);

  // Reconciliation & evaluation state
  const [reconcileModalOpen, setReconcileModalOpen] = useState(false);
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [reconcileReason, setReconcileReason] = useState("Session expired / candidate network disconnected");
  const [isSubmittingReconciliation, setIsSubmittingReconciliation] = useState(false);
  const [evaluatingId, setEvaluatingId] = useState(null);
  const [isBatchEvaluating, setIsBatchEvaluating] = useState(false);

  const { currentUser, userProfile } = useAuth();
  const toast = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const [attData, testData] = await Promise.all([
        getAllAttempts(selectedTest),
        getTests()
      ]);
      setAttempts(attData);
      setTests(testData);
    } catch (err) {
      console.error(err);
      toast.error("Failed to refresh live attempts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Periodic refresh every 15s to monitor active sessions
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, [selectedTest]);

  const handleOpenReconcile = (att) => {
    setSelectedAttempt(att);
    setReconcileReason(
      new Date(att.deadlineAt).getTime() < Date.now()
        ? "Deadline expired: Authoritative administrative reconciliation"
        : "Session interrupted: Force submit requested by examination authority"
    );
    setReconcileModalOpen(true);
  };

  const handleConfirmReconcile = async () => {
    if (!selectedAttempt) return;
    setIsSubmittingReconciliation(true);
    try {
      await adminForceSubmitAttempt(selectedAttempt.id, {
        reason: reconcileReason,
        adminUid: currentUser?.uid || "admin",
        adminName: userProfile?.fullName || currentUser?.displayName || "Admin",
        adminEmail: currentUser?.email || "admin"
      });
      toast.success(`Session for ${selectedAttempt.studentName} successfully reconciled and evaluated!`);
      setReconcileModalOpen(false);
      setSelectedAttempt(null);
      await loadData();
    } catch (err) {
      console.error("Reconciliation error:", err);
      toast.error(`Reconciliation failed: ${err.message}`);
    } finally {
      setIsSubmittingReconciliation(false);
    }
  };

  const handleEvaluateAttempt = async (att) => {
    setEvaluatingId(att.id);
    try {
      await adminForceSubmitAttempt(att.id, {
        reason: "Standard administrative evaluation & scorecard publication",
        adminUid: currentUser?.uid || "admin",
        adminName: userProfile?.fullName || currentUser?.displayName || "Admin",
        adminEmail: currentUser?.email || "admin"
      });
      toast.success(`Attempt for ${att.studentName || "Candidate"} evaluated and published!`);
      await loadData();
    } catch (err) {
      console.error("Evaluation error:", err);
      toast.error(`Evaluation failed: ${err.message}`);
    } finally {
      setEvaluatingId(null);
    }
  };

  const handleBatchEvaluate = async () => {
    const pending = attempts.filter((a) => a.status === "submitted" && !a.resultId);
    if (pending.length === 0) return;
    setIsBatchEvaluating(true);
    let successCount = 0;
    for (const att of pending) {
      try {
        await adminForceSubmitAttempt(att.id, {
          reason: "Batch administrative evaluation & scorecard publication",
          adminUid: currentUser?.uid || "admin",
          adminName: userProfile?.fullName || currentUser?.displayName || "Admin",
          adminEmail: currentUser?.email || "admin"
        });
        successCount++;
      } catch (err) {
        console.error(`Error evaluating attempt ${att.id}:`, err);
      }
    }
    toast.success(`Successfully evaluated ${successCount} pending submission(s).`);
    setIsBatchEvaluating(false);
    await loadData();
  };

  // Compute live telemetry summaries
  const now = Date.now();
  const activeCount = attempts.filter((a) => a.status === "in_progress" && new Date(a.deadlineAt).getTime() >= now).length;
  const expiredCount = attempts.filter((a) => a.status === "in_progress" && new Date(a.deadlineAt).getTime() < now).length;
  const pendingEvaluationCount = attempts.filter((a) => a.status === "submitted" && !a.resultId).length;
  const submittedCount = attempts.filter((a) => a.status === "submitted").length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-2xs">
        <div>
          <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider">
            Live Telemetry & Intervention
          </span>
          <h1 className="text-2xl font-black text-[#111827] tracking-tight mt-0.5">
            Active Examination Sessions
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Real-time tracking of candidate attempt progress, deadline integrity, and administrative reconciliation.
          </p>
        </div>

        <button
          onClick={loadData}
          className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] rounded-xl text-xs font-semibold text-[#111827] transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#2563EB]" /> Refresh Telemetry
        </button>
      </div>

      {/* Session Telemetry Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 flex items-center gap-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB] shrink-0">
            <Timer className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#64748B]">Active Sessions</p>
            <p className="text-xl font-black text-[#111827] mt-0.5">{activeCount}</p>
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 flex items-center gap-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center text-[#EF4444] shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#64748B]">Expired (Needs Finalize)</p>
            <p className="text-xl font-black text-[#EF4444] mt-0.5">{expiredCount}</p>
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 flex items-center gap-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#D97706] shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#64748B]">Pending Evaluation</p>
            <p className="text-xl font-black text-[#D97706] mt-0.5">{pendingEvaluationCount}</p>
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 flex items-center gap-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center text-[#16A34A] shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#64748B]">Total Submitted</p>
            <p className="text-xl font-black text-[#16A34A] mt-0.5">{submittedCount}</p>
          </div>
        </div>
      </div>

      {/* Filter Card */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="w-full sm:max-w-xs">
            <Select
              label="Filter by Examination"
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

          {pendingEvaluationCount > 0 && (
            <div className="pt-2 sm:pt-4">
              <Button
                variant="primary"
                size="sm"
                icon={CheckCircle}
                onClick={handleBatchEvaluate}
                disabled={isBatchEvaluating}
              >
                {isBatchEvaluating ? "Evaluating Submissions..." : `Evaluate All Pending (${pendingEvaluationCount})`}
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Sessions Table */}
      {loading ? (
        <TableSkeleton rows={5} cols={6} />
      ) : attempts.length === 0 ? (
        <EmptyState
          icon={Activity}
          title="No Examination Sessions Found"
          description="Candidates will appear here once they begin taking an active test."
        />
      ) : (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Candidate Details</th>
                  <th className="px-4 py-3.5">Examination</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Started At</th>
                  <th className="px-4 py-3.5">Authoritative Deadline</th>
                  <th className="px-4 py-3.5">Progress</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {attempts.map((att) => {
                  const deadlineMs = new Date(att.deadlineAt).getTime();
                  const isExpired = att.status === "in_progress" && deadlineMs < now;

                  return (
                    <tr key={att.id} className="hover:bg-[#F8FAFC]/60 transition-colors">
                      <td className="px-5 py-4 font-semibold text-[#111827]">
                        <p>{att.studentName}</p>
                        <span className="text-[10px] text-[#64748B] block font-normal">
                          Roll: {att.studentRollNumber || "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-[#111827] max-w-xs truncate">
                        {att.testTitle || att.testId}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Badge
                          variant={
                            att.status === "submitted"
                              ? "success"
                              : isExpired
                              ? "danger"
                              : "primary"
                          }
                          size="xs"
                        >
                          {att.status === "submitted"
                            ? "SUBMITTED"
                            : isExpired
                            ? "EXPIRED"
                            : "IN PROGRESS"}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-[#64748B] whitespace-nowrap">
                        {formatDate(att.startedAt)}
                      </td>
                      <td className="px-4 py-4 text-[#64748B] whitespace-nowrap">
                        {formatDate(att.deadlineAt)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap font-medium text-[#111827]">
                        <span className="text-[#16A34A]">
                          {att.responseSummary?.answered || 0} Ans
                        </span>{" "}
                        &bull;{" "}
                        <span className="text-[#64748B]">
                          {att.responseSummary?.unanswered || 0} Unans
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap space-x-2">
                        {att.status === "in_progress" ? (
                          <button
                            onClick={() => handleOpenReconcile(att)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              isExpired
                                ? "bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] hover:bg-[#FEE2E2]"
                                : "bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] hover:bg-[#DBEAFE]"
                            }`}
                          >
                            <ShieldAlert className="w-3.5 h-3.5" />
                            {isExpired ? "Reconcile / Finalize" : "Force Submit"}
                          </button>
                        ) : att.resultId ? (
                          <Link
                            to={`/admin/results/${att.resultId}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#F1F5F9] text-xs font-bold text-[#111827] transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#2563EB]" /> View Report
                          </Link>
                        ) : att.status === "submitted" ? (
                          <button
                            onClick={() => handleEvaluateAttempt(att)}
                            disabled={evaluatingId === att.id}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] hover:bg-[#DBEAFE] text-xs font-bold text-[#2563EB] transition-all cursor-pointer disabled:opacity-50"
                          >
                            <CheckCircle className="w-3.5 h-3.5 text-[#2563EB]" />
                            {evaluatingId === att.id ? "Evaluating..." : "Evaluate & Publish"}
                          </button>
                        ) : (
                          <span className="text-[11px] text-[#64748B]">Completed</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Force Submit & Reconciliation Modal */}
      {reconcileModalOpen && selectedAttempt && (
        <Modal
          isOpen={reconcileModalOpen}
          onClose={() => setReconcileModalOpen(false)}
          title="Authoritative Session Reconciliation"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xl text-[#991B1B]">
              <p className="font-bold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                Administrative Finalization Notice
              </p>
              <p className="text-[11px] mt-1 leading-relaxed">
                This intervention will authoritatively evaluate the candidate's persisted responses against the secure answer key vault, mark the attempt as submitted, generate the official result ledger entry, and log an audit trail.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
              <div>
                <span className="text-[#64748B] block">Candidate</span>
                <span className="font-bold text-[#111827] block">{selectedAttempt.studentName}</span>
                <span className="text-[10px] text-[#64748B] font-mono">Roll: {selectedAttempt.studentRollNumber || "N/A"}</span>
              </div>
              <div>
                <span className="text-[#64748B] block">Examination</span>
                <span className="font-bold text-[#111827] block truncate">{selectedAttempt.testTitle}</span>
                <span className="text-[10px] text-[#16A34A] font-bold">
                  {selectedAttempt.responseSummary?.answered || 0} Responses Recorded
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">
                Administrative Justification / Reason
              </label>
              <textarea
                value={reconcileReason}
                onChange={(e) => setReconcileReason(e.target.value)}
                rows={3}
                className="w-full p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#111827] outline-none focus:border-[#2563EB]"
                placeholder="Specify the operational justification for manual submission..."
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F1F5F9]">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setReconcileModalOpen(false)}
                disabled={isSubmittingReconciliation}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={Send}
                loading={isSubmittingReconciliation}
                onClick={handleConfirmReconcile}
              >
                Execute Authoritative Submission
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
