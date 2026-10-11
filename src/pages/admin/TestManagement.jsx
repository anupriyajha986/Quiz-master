import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getTests,
  deleteTest,
  publishTest,
  updateTest
} from "../../services/firebase/testService";
import { useToast } from "../../context/ToastContext";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import Select from "../../components/common/Select";
import EmptyState from "../../components/common/EmptyState";
import { TableSkeleton } from "../../components/common/LoadingSkeleton";
import { formatDuration, formatDate } from "../../utils/formatters";
import {
  FileText,
  Plus,
  Clock,
  Award,
  Users,
  Eye,
  Trash2,
  CheckCircle,
  AlertCircle,
  Copy,
  Radio,
  Send
} from "lucide-react";

export default function TestManagement() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [actionLoadingId, setActionLoadingId] = useState(null);

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

  const handlePublish = async (testId) => {
    setActionLoadingId(testId);
    try {
      await publishTest(testId);
      toast.success("Examination published! Sanitized questions deployed and answer key secured.");
      loadTests();
    } catch (err) {
      console.error(err);
      toast.error("Failed to publish test: " + err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (testId) => {
    if (!window.confirm("Are you sure you want to delete this examination?")) return;
    try {
      await deleteTest(testId);
      toast.success("Examination removed.");
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
            Schedule, configure, snapshot, and publish secure online assessments.
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
              { value: "published", label: "Published" },
              { value: "draft", label: "Draft" },
              { value: "scheduled", label: "Scheduled" },
              { value: "completed", label: "Completed" }
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
            return (
              <Card key={test.id} className="p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge
                      variant={
                        isPublished
                          ? "success"
                          : test.publicationStatus === "scheduled"
                          ? "primary"
                          : "default"
                      }
                    >
                      {test.publicationStatus?.toUpperCase()}
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
                        {test.questionCount || test.questionIds?.length || 0}
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

                <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                  <div className="text-[11px] text-[#64748B]">
                    Attempts Limit: {test.attemptLimit || 1}
                  </div>

                  <div className="flex items-center gap-2">
                    {!isPublished ? (
                      <Button
                        size="sm"
                        variant="success"
                        icon={Send}
                        loading={actionLoadingId === test.id}
                        onClick={() => handlePublish(test.id)}
                      >
                        Publish
                      </Button>
                    ) : (
                      <Badge variant="success" size="xs">
                        Live in Portal
                      </Badge>
                    )}

                    <button
                      onClick={() => handleDelete(test.id)}
                      className="p-2 rounded-xl text-[#64748B] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-colors"
                      title="Delete Test"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
