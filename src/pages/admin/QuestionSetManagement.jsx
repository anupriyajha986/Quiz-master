import React, { useState, useEffect, useMemo } from "react";
import {
  getQuestionSets,
  createQuestionSet,
  updateQuestionSet,
  deleteQuestionSet,
  duplicateQuestionSet,
  archiveQuestionSet,
  publishQuestionSet,
  unpublishQuestionSet
} from "../../services/firebase/questionSetService";
import { getQuestions } from "../../services/firebase/questionService";
import { getSubjects } from "../../services/firebase/subjectService";
import { useToast } from "../../context/ToastContext";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Badge from "../../components/common/Badge";
import Modal from "../../components/common/Modal";
import EmptyState from "../../components/common/EmptyState";
import { TableSkeleton } from "../../components/common/LoadingSkeleton";
import { formatDuration } from "../../utils/formatters";
import {
  FolderKanban,
  Plus,
  Trash2,
  Edit,
  Eye,
  CheckSquare,
  Square,
  Search,
  Layers,
  HelpCircle,
  Copy,
  Archive,
  Globe,
  CheckCircle,
  BookOpen,
  AlertTriangle
} from "lucide-react";

export default function QuestionSetManagement() {
  const [sets, setSets] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Filters
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentSet, setCurrentSet] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  // Form State
  const initialForm = {
    title: "",
    setNumber: 1,
    subjectId: "html",
    subject: "HTML",
    description: "",
    instructions: "Read all questions carefully. Standard marking scheme applies: +4 for correct, -1 for incorrect, 0 for unattempted.",
    durationMinutes: 40,
    questionIds: [],
    attemptLimit: 2,
    difficulty: "Easy"
  };
  const [formData, setFormData] = useState(initialForm);
  const [questionSearch, setQuestionSearch] = useState("");

  const toast = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const [setsData, questionsData, subjectsData] = await Promise.all([
        getQuestionSets(),
        getQuestions(),
        getSubjects()
      ]);
      setSets(setsData);
      setAllQuestions(questionsData);
      setSubjects(subjectsData);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load question sets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredSets = useMemo(() => {
    return sets.filter((s) => {
      if (subjectFilter !== "all") {
        const sSubj = (s.subject || "").toLowerCase();
        const sel = subjectFilter.toLowerCase();
        if (sSubj !== sel && s.subjectId !== subjectFilter) return false;
      }
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const titleMatch = (s.title || "").toLowerCase().includes(term);
        const descMatch = (s.description || "").toLowerCase().includes(term);
        if (!titleMatch && !descMatch) return false;
      }
      return true;
    });
  }, [sets, subjectFilter, searchTerm]);

  const handleOpenCreate = () => {
    setIsEdit(false);
    const defaultSubj = subjects[0] || { id: "html", name: "HTML" };
    const matchingSets = sets.filter((s) => (s.subject || "").toLowerCase() === defaultSubj.name.toLowerCase());
    setFormData({
      ...initialForm,
      subjectId: defaultSubj.id,
      subject: defaultSubj.name,
      setNumber: matchingSets.length + 1,
      title: `${defaultSubj.name} — Set ${matchingSets.length + 1}`
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s) => {
    setIsEdit(true);
    setCurrentSet(s);
    setFormData({
      title: s.title || "",
      setNumber: s.setNumber || 1,
      subjectId: s.subjectId || "html",
      subject: s.subject || "HTML",
      description: s.description || "",
      instructions: s.instructions || "",
      durationMinutes: s.durationMinutes || 40,
      questionIds: s.questionIds || [],
      attemptLimit: s.attemptLimit || 2,
      difficulty: s.difficulty || "Easy"
    });
    setIsModalOpen(true);
  };

  const handleToggleQuestion = (qid) => {
    setFormData((prev) => {
      const exists = prev.questionIds.includes(qid);
      const updated = exists
        ? prev.questionIds.filter((id) => id !== qid)
        : [...prev.questionIds, qid];
      return { ...prev, questionIds: updated };
    });
  };

  const handleSaveSet = async () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a title for the set.");
      return;
    }

    setActionLoading(true);
    try {
      if (isEdit && currentSet) {
        await updateQuestionSet(currentSet.id, formData);
        toast.success("Question set updated successfully.");
      } else {
        await createQuestionSet(formData);
        toast.success("Question set created successfully.");
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save set: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleTogglePublish = async (s) => {
    setActionLoading(true);
    try {
      const isPub = s.status === "published" || s.publicationStatus === "published";
      if (isPub) {
        await unpublishQuestionSet(s.id);
        toast.success(`Set "${s.title}" unpublished.`);
      } else {
        await publishQuestionSet(s.id);
        toast.success(`Set "${s.title}" published for students!`);
      }
      loadData();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to toggle publication status.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDuplicate = async (s) => {
    setActionLoading(true);
    try {
      await duplicateQuestionSet(s.id);
      toast.success(`Duplicated set "${s.title}".`);
      loadData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to duplicate set: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleArchive = async (s) => {
    setActionLoading(true);
    try {
      await archiveQuestionSet(s.id);
      toast.success(`Archived set "${s.title}".`);
      loadData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to archive set.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!currentSet) return;
    setActionLoading(true);
    try {
      await deleteQuestionSet(currentSet.id);
      toast.success("Question set deleted.");
      setIsDeleteOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to delete set.");
    } finally {
      setActionLoading(false);
    }
  };

  const availableQuestionsForSetForm = allQuestions.filter((q) => {
    const qSubj = (q.subject || "").toLowerCase();
    const curSubj = (formData.subject || "").toLowerCase();
    const matchSubj = qSubj === curSubj || q.subjectId === formData.subjectId;
    if (!matchSubj) return false;

    if (!questionSearch.trim()) return true;
    const term = questionSearch.toLowerCase();
    return q.questionText?.toLowerCase().includes(term);
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs">
        <div>
          <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" /> Curated Question Sets &bull; Set-Wise Examination Hall Registry
          </span>
          <h1 className="text-2xl font-black text-[#111827] tracking-tight mt-0.5">
            Question Sets Management
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Group, reorder, publish, and manage subject-specific sets with synchronized question snapshots and secure answer keys.
          </p>
        </div>

        <Button icon={Plus} size="sm" onClick={handleOpenCreate}>
          Create Question Set
        </Button>
      </div>

      {/* Filters Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <Input
              icon={Search}
              placeholder="Search question sets by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            options={[
              { value: "all", label: "All Subjects" },
              ...subjects.map((s) => ({ value: s.name, label: s.name }))
            ]}
          />
        </div>
      </Card>

      {/* Sets Grid */}
      {loading ? (
        <TableSkeleton rows={4} cols={4} />
      ) : filteredSets.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No Question Sets Found"
          description="Create your first curated question set under any active subject."
          actionText="Create Question Set"
          onAction={handleOpenCreate}
          actionIcon={Plus}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSets.map((s) => {
            const isPub = s.status === "published" || s.publicationStatus === "published";
            const isArchived = s.status === "archived";
            const qCount = s.questionCount || s.questionIds?.length || 0;
            const marks = s.totalMarks || qCount * 4;

            return (
              <Card key={s.id} className="p-5 flex flex-col justify-between hover:shadow-xs transition-shadow">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="primary">{s.subject || "General"}</Badge>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                        isPub
                          ? "bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]"
                          : isArchived
                          ? "bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]"
                          : "bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]"
                      }`}
                    >
                      {isPub ? "Published" : isArchived ? "Archived" : "Draft"}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-[#111827] line-clamp-1 mb-1">
                    {s.title}
                  </h3>
                  <p className="text-xs text-[#64748B] line-clamp-2 mb-4 leading-relaxed">
                    {s.description || `Assessment questions set for ${s.subject}.`}
                  </p>

                  <div className="grid grid-cols-3 gap-2 p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-center mb-4 text-xs">
                    <div>
                      <span className="text-[10px] text-[#64748B] block font-medium">Questions</span>
                      <span className="font-bold text-[#111827]">{qCount}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#64748B] block font-medium">Duration</span>
                      <span className="font-bold text-[#111827]">{formatDuration(s.durationMinutes || 40)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#64748B] block font-medium">Max Marks</span>
                      <span className="font-bold text-[#16A34A]">{marks}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2">
                  <Button
                    size="xs"
                    variant={isPub ? "secondary" : "primary"}
                    icon={isPub ? Globe : CheckCircle}
                    onClick={() => handleTogglePublish(s)}
                    disabled={actionLoading}
                  >
                    {isPub ? "Unpublish" : "Publish Set"}
                  </Button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setCurrentSet(s);
                        setIsPreviewOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-[#64748B] hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-colors"
                      title="Preview Set"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(s)}
                      className="p-1.5 rounded-lg text-[#64748B] hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-colors"
                      title="Edit Set"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDuplicate(s)}
                      className="p-1.5 rounded-lg text-[#64748B] hover:text-[#7C3AED] hover:bg-[#F5F3FF] transition-colors"
                      title="Duplicate Set"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleArchive(s)}
                      className="p-1.5 rounded-lg text-[#64748B] hover:text-[#D97706] hover:bg-[#FEF3C7] transition-colors"
                      title="Archive Set"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setCurrentSet(s);
                        setIsDeleteOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-[#64748B] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-colors"
                      title="Delete Set"
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

      {/* Modal: Create/Edit Set */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEdit ? "Edit Question Set" : "Create New Question Set"}
        maxWidth="max-w-2xl"
      >
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#111827] block mb-1">
                Subject <span className="text-[#DC2626]">*</span>
              </label>
              <Select
                value={formData.subject}
                onChange={(e) => {
                  const selName = e.target.value;
                  const matchingSubj = subjects.find((s) => s.name === selName);
                  setFormData({
                    ...formData,
                    subject: selName,
                    subjectId: matchingSubj?.id || selName.toLowerCase(),
                    title: `${selName} — Set ${formData.setNumber}`
                  });
                }}
                options={subjects.map((s) => ({ value: s.name, label: s.name }))}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#111827] block mb-1">
                Set Number
              </label>
              <Input
                type="number"
                value={formData.setNumber}
                onChange={(e) => {
                  const num = Number(e.target.value);
                  setFormData({
                    ...formData,
                    setNumber: num,
                    title: `${formData.subject} — Set ${num}`
                  });
                }}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#111827] block mb-1">
              Set Title <span className="text-[#DC2626]">*</span>
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#111827] block mb-1">
                Duration (Minutes)
              </label>
              <Input
                type="number"
                value={formData.durationMinutes}
                onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#111827] block mb-1">
                Attempt Limit
              </label>
              <Input
                type="number"
                value={formData.attemptLimit}
                onChange={(e) => setFormData({ ...formData, attemptLimit: Number(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#111827] block mb-1">
              Instructions
            </label>
            <textarea
              className="w-full px-3.5 py-2 text-xs bg-white border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              rows={2}
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
            />
          </div>

          {/* Question Picker */}
          <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-[#64748B]">
                Assign Questions ({formData.questionIds.length} Selected)
              </label>
              <span className="text-xs font-bold text-[#16A34A]">
                {formData.questionIds.length * 4} Maximum Marks
              </span>
            </div>

            <Input
              icon={Search}
              placeholder="Search questions to attach to this set..."
              value={questionSearch}
              onChange={(e) => setQuestionSearch(e.target.value)}
            />

            <div className="max-h-52 overflow-y-auto border border-[#E2E8F0] rounded-xl divide-y divide-[#E2E8F0]">
              {availableQuestionsForSetForm.length === 0 ? (
                <p className="p-4 text-center text-xs text-[#64748B]">
                  No matching questions found for subject "{formData.subject}".
                </p>
              ) : (
                availableQuestionsForSetForm.map((q) => {
                  const isChecked = formData.questionIds.includes(q.id);
                  return (
                    <div
                      key={q.id}
                      onClick={() => handleToggleQuestion(q.id)}
                      className={`p-3 flex items-start gap-3 cursor-pointer text-xs transition-colors ${
                        isChecked ? "bg-[#EFF6FF]" : "hover:bg-[#F8FAFC]"
                      }`}
                    >
                      <button type="button" className="mt-0.5 text-[#2563EB]">
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 fill-[#2563EB] text-white" />
                        ) : (
                          <Square className="w-4 h-4 text-[#94A3B8]" />
                        )}
                      </button>
                      <div className="flex-1">
                        <p className="font-semibold text-[#111827]">{q.questionText}</p>
                        <span className="text-[10px] text-[#64748B]">
                          Difficulty: {q.difficulty || "Easy"} &bull; Answer: {q.correctAnswer}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSaveSet} disabled={actionLoading}>
            {actionLoading ? "Saving..." : isEdit ? "Update Set" : "Create Set"}
          </Button>
        </div>
      </Modal>

      {/* Modal: Set Preview */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={currentSet ? `Preview: ${currentSet.title}` : "Set Preview"}
        maxWidth="max-w-2xl"
      >
        {currentSet && (
          <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] flex items-center justify-between text-xs">
              <span>Subject: <strong>{currentSet.subject}</strong></span>
              <span>Questions: <strong>{currentSet.questionCount || currentSet.questionIds?.length || 0}</strong></span>
              <span>Marks: <strong className="text-[#16A34A]">{currentSet.totalMarks || 80}</strong></span>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[#64748B] uppercase block">
                Questions List
              </span>
              {allQuestions
                .filter((q) => (currentSet.questionIds || []).includes(q.id) || q.setId === currentSet.id)
                .map((q, idx) => (
                  <div key={q.id} className="p-3 border border-[#E2E8F0] rounded-xl text-xs space-y-1">
                    <span className="font-bold text-[#2563EB]">Q{idx + 1}.</span>
                    <p className="font-semibold text-[#111827]">{q.questionText}</p>
                    <span className="text-[10px] text-[#15803D] font-bold">Correct: Option {q.correctAnswer}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </Modal>

      {/* Modal: Confirm Delete Set */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Confirm Set Deletion"
        maxWidth="max-w-md"
      >
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xl text-[#DC2626]">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p className="text-xs font-semibold">
              Are you sure you want to delete this question set? If students have attempted it, deletion will be safely blocked.
            </p>
          </div>
          <p className="text-xs text-[#64748B]">
            Set: <strong className="text-[#111827]">{currentSet?.title}</strong>
          </p>
        </div>

        <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => setIsDeleteOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleDeleteConfirm} disabled={actionLoading}>
            {actionLoading ? "Deleting..." : "Delete Set"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
