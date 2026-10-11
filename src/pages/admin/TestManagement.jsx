import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getTests,
  deleteTest,
  publishTest,
  unpublishTest,
  archiveTest,
  getTestById
} from "../../services/firebase/testService";
import { getQuestionById } from "../../services/firebase/questionService";
import { useToast } from "../../context/ToastContext";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import Select from "../../components/common/Select";
import Modal from "../../components/common/Modal";
import EmptyState from "../../components/common/EmptyState";
import { TableSkeleton } from "../../components/common/LoadingSkeleton";
import { formatDuration } from "../../utils/formatters";
import {
  FileText,
  Plus,
  Clock,
  Award,
  Eye,
  Trash2,
  Edit,
  Send,
  RotateCcw,
  Archive,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  X
} from "lucide-react";

export default function TestManagement() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Preview Modal State
  const [previewTest, setPreviewTest] = useState(null);
  const [previewQuestions, setPreviewQuestions] = useState([]);
  const [loadingPreview, setLoadingPreview] = useState(false);

  // Publish Confirm Modal State
  const [publishingTest, setPublishingTest] = useState(null);
  const [publishErrors, setPublishErrors] = useState([]);

  const toast = useToast();

  const loadTests = async () => {
    setLoading(true);
    try {
      const data = await getTests(filterStatus);
      setTests(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load examinations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTests();
  }, [filterStatus]);

  const handleOpenPreview = async (test) => {
    setPreviewTest(test);
    setLoadingPreview(true);
    try {
      // If snapshot exists, use it
      if (test.publishedQuestionsSnapshot && test.publishedQuestionsSnapshot.length > 0) {
        setPreviewQuestions(test.publishedQuestionsSnapshot);
      } else if (test.questionIds && test.questionIds.length > 0) {
        // Fetch questions from question bank for draft preview
        const qList = await Promise.all(
          test.questionIds.map(async (qid) => {
            try {
              return await getQuestionById(qid);
            } catch {
              return null;
            }
          })
        );
        setPreviewQuestions(qList.filter(Boolean));
      } else {
        setPreviewQuestions([]);
      }
    } catch (err) {
      console.error("Failed to load preview questions:", err);
      toast.error("Failed to load examination questions for preview.");
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleStartPublish = async (test) => {
    setPublishingTest(test);
    setPublishErrors([]);
    setActionLoadingId(test.id);

    try {
      // Check questions
      const qIds = test.questionIds || [];
      if (qIds.length === 0) {
        setPublishErrors(["Cannot publish an examination with no questions assigned."]);
        return;
      }

      // Pre-validate questions
      const errors = [];
      if (!test.title || test.title.trim().length < 3) {
        errors.push("Title must be at least 3 characters.");
      }
      if (!test.subject) {
        errors.push("Subject/category is required.");
      }
      if (Number(test.durationMinutes) <= 0) {
        errors.push("Duration must be a positive number of minutes.");
      }

      setPublishErrors(errors);
    } catch (err) {
      console.error(err);
      setPublishErrors([err.message || "Validation failed."]);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleConfirmPublish = async () => {
    if (!publishingTest) return;
    setActionLoadingId(publishingTest.id);
    try {
      await publishTest(publishingTest.id);
      toast.success(`"${publishingTest.title}" published successfully! Live in student portal.`);
      setPublishingTest(null);
      loadTests();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to publish examination.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleUnpublish = async (testId, testTitle) => {
    if (!window.confirm(`Withdraw "${testTitle}" back to Draft? Students will no longer see it.`)) return;
    setActionLoadingId(testId);
    try {
      await unpublishTest(testId);
      toast.success("Examination withdrawn back to Draft status.");
      loadTests();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to withdraw examination.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleArchive = async (testId, testTitle) => {
    if (!window.confirm(`Archive "${testTitle}"? It will be retired from active listings.`)) return;
    setActionLoadingId(testId);
    try {
      await archiveTest(testId);
      toast.success("Examination archived.");
      loadTests();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to archive examination.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (testId, testTitle) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${testTitle}"?`)) return;
    try {
      await deleteTest(testId);
      toast.success("Examination deleted.");
      loadTests();
    } catch (err) {
      toast.error("Failed to delete examination.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-[#E2E8F0] rounded-2xl p-6">
        <div>
          <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider">
            Assessment Operations
          </span>
          <h1 className="text-2xl font-black text-[#111827] tracking-tight mt-0.5">
            Examinations & Tests
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Schedule, configure, snapshot, preview, and publish secure online assessments.
          </p>
        </div>

        <Link to="/admin/tests/create">
          <Button icon={Plus} size="sm">
            Create Examination
          </Button>
        </Link>
      </div>

      {/* Filter */}
      <Card className="p-4">
        <div className="max-w-xs">
          <Select
            label="Filter by Status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
              { value: "all", label: "All Statuses" },
              { value: "published", label: "Published (Live)" },
              { value: "draft", label: "Draft" },
              { value: "archived", label: "Archived" }
            ]}
          />
        </div>
      </Card>

      {/* Tests Grid */}
      {loading ? (
        <TableSkeleton rows={4} cols={4} />
      ) : tests.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No Examinations Found"
          description="Create your first computer-based assessment to conduct student examinations."
          actionText="Create Examination"
          onAction={() => {}}
          actionIcon={Plus}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => {
            const isPublished = test.publicationStatus === "published";
            const isArchived = test.publicationStatus === "archived" || test.status === "archived";
            const qCount = test.questionCount || test.questionIds?.length || 0;

            return (
              <Card key={test.id} className="p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge
                      variant={
                        isPublished
                          ? "success"
                          : isArchived
                          ? "default"
                          : "warning"
                      }
                    >
                      {isPublished ? "PUBLISHED (LIVE)" : isArchived ? "ARCHIVED" : "DRAFT"}
                    </Badge>
                    <span className="text-xs font-bold text-[#64748B]">
                      {test.subject || "General"}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#111827] line-clamp-1 mb-1">
                    {test.title}
                  </h3>
                  <p className="text-xs text-[#64748B] line-clamp-2 mb-4 leading-relaxed">
                    {test.description || "No specific instructions provided."}
                  </p>

                  <div className="grid grid-cols-3 gap-2 p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-center mb-4">
                    <div>
                      <span className="text-[10px] text-[#64748B] block">Duration</span>
                      <span className="text-xs font-bold text-[#111827]">
                        {formatDuration(test.durationMinutes)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#64748B] block">Questions</span>
                      <span className="text-xs font-bold text-[#111827]">
                        {qCount}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#64748B] block">Max Marks</span>
                      <span className="text-xs font-bold text-[#16A34A]">
                        {test.maximumMarks || 0}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E2E8F0] space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                    <span>Attempts: {test.attemptLimit || 1}</span>
                    <span>Scoring: +{test.markingScheme?.positiveMarks || 4} / -{test.markingScheme?.negativeMarks || 1}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Button
                        size="xs"
                        variant="secondary"
                        icon={Eye}
                        onClick={() => handleOpenPreview(test)}
                        title="Preview Examination & Questions"
                      >
                        Preview
                      </Button>
                      <Link to={`/admin/tests/${test.id}/edit`}>
                        <Button size="xs" variant="ghost" icon={Edit} title="Edit Configuration">
                          Edit
                        </Button>
                      </Link>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {!isPublished ? (
                        <Button
                          size="xs"
                          variant="success"
                          icon={Send}
                          loading={actionLoadingId === test.id}
                          onClick={() => handleStartPublish(test)}
                        >
                          Publish
                        </Button>
                      ) : (
                        <Button
                          size="xs"
                          variant="secondary"
                          icon={RotateCcw}
                          loading={actionLoadingId === test.id}
                          onClick={() => handleUnpublish(test.id, test.title)}
                          title="Withdraw to Draft"
                        >
                          Withdraw
                        </Button>
                      )}

                      {!isArchived && (
                        <button
                          onClick={() => handleArchive(test.id, test.title)}
                          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#D97706] hover:bg-[#FFFBEB] transition-colors"
                          title="Archive Examination"
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(test.id, test.title)}
                        className="p-1.5 rounded-lg text-[#64748B] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-colors"
                        title="Delete Examination"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Preview Modal */}
      {previewTest && (
        <Modal
          isOpen={!!previewTest}
          onClose={() => setPreviewTest(null)}
          title={`Examination Preview: ${previewTest.title}`}
          size="xl"
        >
          <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-1">
            {/* Metadata Summary */}
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">
                  {previewTest.subject} • {previewTest.publicationStatus?.toUpperCase()}
                </span>
                <span className="text-xs text-[#64748B]">
                  Attempts Limit: {previewTest.attemptLimit || 1}
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#111827]">{previewTest.title}</h3>
              {previewTest.description && (
                <p className="text-xs text-[#64748B]">{previewTest.description}</p>
              )}
              <div className="grid grid-cols-4 gap-3 text-center pt-2 border-t border-[#E2E8F0]">
                <div>
                  <span className="text-[10px] text-[#64748B] block">Duration</span>
                  <span className="text-xs font-bold text-[#111827]">{formatDuration(previewTest.durationMinutes)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#64748B] block">Questions</span>
                  <span className="text-xs font-bold text-[#111827]">{previewQuestions.length}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#64748B] block">Maximum Marks</span>
                  <span className="text-xs font-bold text-[#16A34A]">{previewTest.maximumMarks || 0}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#64748B] block">Marking</span>
                  <span className="text-xs font-bold text-[#111827]">
                    +{previewTest.markingScheme?.positiveMarks || 4} / -{previewTest.markingScheme?.negativeMarks || 1}
                  </span>
                </div>
              </div>
            </div>

            {/* Instructions */}
            {previewTest.instructions && (
              <div className="p-4 rounded-xl bg-white border border-[#E2E8F0]">
                <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-2">Instructions</h4>
                <p className="text-xs text-[#475569] whitespace-pre-line leading-relaxed">
                  {previewTest.instructions}
                </p>
              </div>
            )}

            {/* Questions List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                  Questions ({previewQuestions.length})
                </h4>
                <span className="text-xs text-[#64748B]">
                  {loadingPreview ? "Loading questions..." : "Sanitized Candidate View"}
                </span>
              </div>

              {loadingPreview ? (
                <div className="py-8 text-center text-xs text-[#64748B]">Loading preview questions...</div>
              ) : previewQuestions.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#64748B] border border-dashed rounded-xl">
                  No questions currently attached to this examination.
                </div>
              ) : (
                previewQuestions.map((q, idx) => (
                  <div key={q.id || idx} className="p-4 rounded-xl bg-white border border-[#E2E8F0] space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#64748B]">
                      <span>Question #{idx + 1}</span>
                      <span className="text-[#2563EB]">+{q.positiveMarks || 4} / -{q.negativeMarks || 1}</span>
                    </div>
                    <p className="text-xs font-medium text-[#111827] leading-relaxed whitespace-pre-wrap">
                      {q.questionText}
                    </p>
                    {q.options && q.options.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {q.options.map((opt, oIdx) => (
                          <div
                            key={opt.id || oIdx}
                            className="p-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-xs flex items-center gap-2"
                          >
                            <span className="w-5 h-5 rounded-md bg-white border border-[#CBD5E1] text-[#1E293B] font-bold text-[11px] flex items-center justify-center shrink-0">
                              {opt.id || String.fromCharCode(65 + oIdx)}
                            </span>
                            <span className="text-[#334155]">{typeof opt === "string" ? opt : opt.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Publish Confirmation Modal */}
      {publishingTest && (
        <Modal
          isOpen={!!publishingTest}
          onClose={() => setPublishingTest(null)}
          title={`Publish Examination: ${publishingTest.title}`}
          size="md"
        >
          <div className="space-y-4">
            {publishErrors.length > 0 ? (
              <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#FECACA] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#991B1B]">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  Cannot Publish — Validation Issues:
                </div>
                <ul className="text-xs text-[#991B1B] list-disc list-inside space-y-1">
                  {publishErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
                <p className="text-[11px] text-[#B91C1C] pt-2">
                  Please edit the examination to resolve these issues before publishing.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] space-y-1.5 text-xs text-[#1E40AF]">
                  <div className="font-bold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#2563EB]" />
                    Ready for Official Publication
                  </div>
                  <p>
                    Publishing will snapshot sanitized questions for student delivery, seal the authoritative answer keys into the protected security vault, and broadcast notifications to candidates.
                  </p>
                </div>
                <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs space-y-1 text-[#475569]">
                  <div className="flex justify-between">
                    <span>Questions:</span>
                    <span className="font-bold text-[#111827]">{publishingTest.questionIds?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-bold text-[#111827]">{formatDuration(publishingTest.durationMinutes)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Marks:</span>
                    <span className="font-bold text-[#16A34A]">{publishingTest.maximumMarks || 0}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
              <Button variant="secondary" onClick={() => setPublishingTest(null)}>
                Cancel
              </Button>
              {publishErrors.length === 0 && (
                <Button
                  variant="success"
                  icon={Send}
                  loading={actionLoadingId === publishingTest.id}
                  onClick={handleConfirmPublish}
                >
                  Confirm & Publish
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
