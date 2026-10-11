import React, { useState, useEffect, useMemo } from "react";
import {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  duplicateQuestion,
  importQuestionsBulk
} from "../../services/firebase/questionService";
import {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject
} from "../../services/firebase/subjectService";
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
import { exportToCsv } from "../../utils/csvExport";
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
  HelpCircle,
  Plus,
  Search,
  Upload,
  Download,
  Trash2,
  Edit,
  Eye,
  CheckCircle,
  FileSpreadsheet,
  X,
  Layers,
  FolderKanban,
  BookOpen,
  Copy,
  Archive,
  Globe,
  RefreshCw,
  Check,
  AlertTriangle,
  Sparkles
} from "lucide-react";

export default function QuestionBank() {
  // Active Navigation Tab: "questions" | "subjects" | "sets" | "import"
  const [activeTab, setActiveTab] = useState("questions");

  // Core Data States
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [questionSets, setQuestionSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Filters for Questions Tab
  const [questionSearch, setQuestionSearch] = useState("");
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState("all");
  const [selectedSetFilter, setSelectedSetFilter] = useState("all");
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");

  // Filters for Sets Tab
  const [setSubjectFilter, setSetSubjectFilter] = useState("all");
  const [setSearch, setSetSearch] = useState("");

  // Filters for Subjects Tab
  const [subjectSearch, setSubjectSearch] = useState("");

  // Modals States
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isQuestionPreviewOpen, setIsQuestionPreviewOpen] = useState(false);
  const [isQuestionDeleteOpen, setIsQuestionDeleteOpen] = useState(false);

  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isSubjectDeleteOpen, setIsSubjectDeleteOpen] = useState(false);

  const [isSetModalOpen, setIsSetModalOpen] = useState(false);
  const [isSetPreviewOpen, setIsSetPreviewOpen] = useState(false);
  const [isSetDeleteOpen, setIsSetDeleteOpen] = useState(false);

  // Active / Selected Entities
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentSubject, setCurrentSubject] = useState(null);
  const [currentSet, setCurrentSet] = useState(null);

  // Question Form State
  const initialQuestionForm = {
    questionText: "",
    questionType: "single_choice",
    subjectId: "html",
    subject: "HTML",
    setId: "",
    difficulty: "Easy",
    positiveMarks: 4,
    negativeMarks: 1,
    unansweredMarks: 0,
    options: [
      { id: "A", text: "" },
      { id: "B", text: "" },
      { id: "C", text: "" },
      { id: "D", text: "" }
    ],
    correctAnswer: "A",
    explanation: "",
    status: "active",
    reviewRequired: false
  };
  const [questionFormData, setQuestionFormData] = useState(initialQuestionForm);

  // Subject Form State
  const initialSubjectForm = {
    name: "",
    code: "",
    description: "",
    color: "blue",
    icon: "BookOpen",
    status: "active"
  };
  const [subjectFormData, setSubjectFormData] = useState(initialSubjectForm);

  // Question Set Form State
  const initialSetForm = {
    title: "",
    setNumber: 1,
    subjectId: "html",
    subject: "HTML",
    description: "",
    instructions: "Read all questions carefully. Standard marking scheme applies: +4 for correct, -1 for incorrect, 0 for unattempted.",
    durationMinutes: 40,
    totalMarks: 80,
    difficulty: "Easy",
    markingScheme: { positiveMarks: 4, negativeMarks: 1, unansweredMarks: 0 },
    attemptLimit: 2,
    status: "draft"
  };
  const [setFormData, setSetFormData] = useState(initialSetForm);

  // Bulk Import State
  const [importFile, setImportFile] = useState(null);
  const [importJsonText, setImportJsonText] = useState("");
  const [importTargetSubject, setImportTargetSubject] = useState("auto");
  const [importTargetSet, setImportTargetSet] = useState("");
  const [parsedPreviewList, setParsedPreviewList] = useState([]);
  const [importErrorsList, setImportErrorsList] = useState([]);
  const [importProgress, setImportProgress] = useState(0);
  const [importCompletedReport, setImportCompletedReport] = useState(null);

  const toast = useToast();

  // Load all data
  const loadAllData = async () => {
    setLoading(true);
    try {
      const [questionsData, subjectsData, setsData] = await Promise.all([
        getQuestions(),
        getSubjects(),
        getQuestionSets()
      ]);
      setQuestions(questionsData);
      setSubjects(subjectsData);
      setQuestionSets(setsData);
    } catch (err) {
      console.error("Error loading question bank data:", err);
      toast.error("Failed to load question bank data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Real-time Database Statistics
  const stats = useMemo(() => {
    const totalQ = questions.length;
    const activeQ = questions.filter((q) => q.status === "active").length;
    const draftQ = questions.filter((q) => q.status === "draft").length;
    const reviewQ = questions.filter((q) => q.reviewRequired === true || q.status === "review" || q.status === "awaiting_review").length;

    let easyCount = 0;
    let mediumCount = 0;
    let hardCount = 0;

    questions.forEach((q) => {
      const diff = (q.difficulty || "").toLowerCase();
      if (diff === "easy") easyCount++;
      else if (diff === "medium") mediumCount++;
      else if (diff === "hard") hardCount++;
    });

    const totalSets = questionSets.length;
    const publishedSets = questionSets.filter((s) => s.status === "published" || s.publicationStatus === "published").length;
    const totalSubj = subjects.length;

    return {
      totalSubjects: totalSubj,
      totalSets,
      publishedSets,
      totalQuestions: totalQ,
      activeQuestions: activeQ,
      draftQuestions: draftQ,
      reviewQuestions: reviewQ,
      easyCount,
      mediumCount,
      hardCount
    };
  }, [questions, subjects, questionSets]);

  // Filtered Questions
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      // Status & Review filter
      if (selectedStatusFilter === "review_required") {
        if (!q.reviewRequired && q.status !== "review" && q.status !== "awaiting_review") return false;
      } else if (selectedStatusFilter !== "all") {
        if (q.status !== selectedStatusFilter) return false;
      }

      // Subject filter
      if (selectedSubjectFilter !== "all") {
        const qSubj = (q.subject || "").toLowerCase();
        const selSubj = selectedSubjectFilter.toLowerCase();
        if (qSubj !== selSubj && q.subjectId !== selectedSubjectFilter) {
          return false;
        }
      }

      // Set filter
      if (selectedSetFilter !== "all") {
        if (q.setId !== selectedSetFilter) return false;
      }

      // Difficulty filter
      if (selectedDifficultyFilter !== "all") {
        if ((q.difficulty || "").toLowerCase() !== selectedDifficultyFilter.toLowerCase()) {
          return false;
        }
      }

      // Search term
      if (questionSearch.trim()) {
        const term = questionSearch.toLowerCase();
        const textMatch = (q.questionText || "").toLowerCase().includes(term);
        const optMatch = q.options?.some((o) => (o.text || "").toLowerCase().includes(term));
        const expMatch = (q.explanation || "").toLowerCase().includes(term);
        if (!textMatch && !optMatch && !expMatch) return false;
      }

      return true;
    });
  }, [questions, selectedStatusFilter, selectedSubjectFilter, selectedSetFilter, selectedDifficultyFilter, questionSearch]);

  // Filtered Question Sets
  const filteredSets = useMemo(() => {
    return questionSets.filter((s) => {
      if (setSubjectFilter !== "all") {
        const sSubj = (s.subject || "").toLowerCase();
        const selSubj = setSubjectFilter.toLowerCase();
        if (sSubj !== selSubj && s.subjectId !== setSubjectFilter) return false;
      }
      if (setSearch.trim()) {
        const term = setSearch.toLowerCase();
        const titleMatch = (s.title || "").toLowerCase().includes(term);
        const descMatch = (s.description || "").toLowerCase().includes(term);
        if (!titleMatch && !descMatch) return false;
      }
      return true;
    });
  }, [questionSets, setSubjectFilter, setSearch]);

  // Filtered Subjects
  const filteredSubjects = useMemo(() => {
    return subjects.filter((s) => {
      if (subjectSearch.trim()) {
        const term = subjectSearch.toLowerCase();
        return (
          (s.name || "").toLowerCase().includes(term) ||
          (s.code || "").toLowerCase().includes(term) ||
          (s.description || "").toLowerCase().includes(term)
        );
      }
      return true;
    });
  }, [subjects, subjectSearch]);

  // Sets available for the subject currently selected in Question Form
  const availableSetsForQuestionForm = useMemo(() => {
    const curSubj = (questionFormData.subject || "").toLowerCase();
    return questionSets.filter(
      (s) => (s.subject || "").toLowerCase() === curSubj || s.subjectId === questionFormData.subjectId
    );
  }, [questionSets, questionFormData.subject, questionFormData.subjectId]);

  // Sets available for Questions Tab filter
  const availableSetsForFilter = useMemo(() => {
    if (selectedSubjectFilter === "all") return questionSets;
    return questionSets.filter(
      (s) =>
        (s.subject || "").toLowerCase() === selectedSubjectFilter.toLowerCase() ||
        s.subjectId === selectedSubjectFilter
    );
  }, [questionSets, selectedSubjectFilter]);

  // ==========================================
  // QUESTION ACTIONS
  // ==========================================

  const handleOpenCreateQuestion = () => {
    setCurrentQuestion(null);
    const defaultSubj = subjects[0] || { id: "html", name: "HTML" };
    const matchingSets = questionSets.filter((s) => (s.subject || "").toLowerCase() === defaultSubj.name.toLowerCase());
    setQuestionFormData({
      ...initialQuestionForm,
      subjectId: defaultSubj.id,
      subject: defaultSubj.name,
      setId: matchingSets[0]?.id || ""
    });
    setIsQuestionModalOpen(true);
  };

  const handleOpenEditQuestion = (q) => {
    setCurrentQuestion(q);
    setQuestionFormData({
      questionText: q.questionText || "",
      questionType: q.questionType || "single_choice",
      subjectId: q.subjectId || "html",
      subject: q.subject || "HTML",
      setId: q.setId || "",
      difficulty: q.difficulty || "Easy",
      positiveMarks: q.positiveMarks || 4,
      negativeMarks: q.negativeMarks || 1,
      unansweredMarks: q.unansweredMarks || 0,
      options: q.options && q.options.length > 0 ? q.options : [
        { id: "A", text: "" },
        { id: "B", text: "" },
        { id: "C", text: "" },
        { id: "D", text: "" }
      ],
      correctAnswer: q.correctAnswer || "A",
      explanation: q.explanation || "",
      status: q.status || "active",
      reviewRequired: Boolean(q.reviewRequired)
    });
    setIsQuestionModalOpen(true);
  };

  const handleOpenPreviewQuestion = (q) => {
    setCurrentQuestion(q);
    setIsQuestionPreviewOpen(true);
  };

  const handleOpenDeleteQuestion = (q) => {
    setCurrentQuestion(q);
    setIsQuestionDeleteOpen(true);
  };

  const handleQuestionOptionTextChange = (idx, text) => {
    const updated = [...questionFormData.options];
    updated[idx].text = text;
    setQuestionFormData({ ...questionFormData, options: updated });
  };

  const handleAddQuestionOption = () => {
    if (questionFormData.options.length >= 6) {
      toast.error("Maximum 6 options supported.");
      return;
    }
    const nextChar = String.fromCharCode(65 + questionFormData.options.length);
    setQuestionFormData({
      ...questionFormData,
      options: [...questionFormData.options, { id: nextChar, text: "" }]
    });
  };

  const handleRemoveQuestionOption = (idx) => {
    if (questionFormData.options.length <= 2) {
      toast.error("A question must have at least 2 options.");
      return;
    }
    const updated = questionFormData.options.filter((_, i) => i !== idx);
    // Re-index option IDs
    const reindexed = updated.map((o, i) => ({
      id: String.fromCharCode(65 + i),
      text: o.text
    }));
    // Check if correctAnswer is still in bounds
    let correct = questionFormData.correctAnswer;
    if (!reindexed.some((o) => o.id === correct)) {
      correct = "A";
    }
    setQuestionFormData({ ...questionFormData, options: reindexed, correctAnswer: correct });
  };

  const handleSaveQuestion = async (andAddAnother = false, saveAsDraft = false) => {
    if (!questionFormData.questionText.trim()) {
      toast.error("Please enter question text.");
      return;
    }
    const emptyOpt = questionFormData.options.some((o) => !o.text.trim());
    if (emptyOpt) {
      toast.error("Please provide text for all answer options.");
      return;
    }

    setActionLoading(true);
    try {
      const payload = {
        ...questionFormData,
        reviewRequired: Boolean(questionFormData.reviewRequired),
        status: saveAsDraft ? "draft" : questionFormData.status
      };

      if (currentQuestion) {
        await updateQuestion(currentQuestion.id, payload);
        toast.success("Question updated successfully.");
        setIsQuestionModalOpen(false);
      } else {
        await createQuestion(payload);
        toast.success("Question created successfully.");
        if (andAddAnother) {
          setQuestionFormData({
            ...questionFormData,
            questionText: "",
            explanation: "",
            options: questionFormData.options.map((o) => ({ id: o.id, text: "" }))
          });
        } else {
          setIsQuestionModalOpen(false);
        }
      }
      loadAllData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save question: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDuplicateQuestion = async (q) => {
    setActionLoading(true);
    try {
      await duplicateQuestion(q.id);
      toast.success(`Duplicated question: "${q.questionText.substring(0, 30)}..."`);
      loadAllData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to duplicate question: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteQuestionConfirm = async () => {
    if (!currentQuestion) return;
    setActionLoading(true);
    try {
      await deleteQuestion(currentQuestion.id);
      toast.success("Question removed from bank.");
      setIsQuestionDeleteOpen(false);
      loadAllData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete question: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // SUBJECT ACTIONS
  // ==========================================

  const handleOpenCreateSubject = () => {
    setCurrentSubject(null);
    setSubjectFormData(initialSubjectForm);
    setIsSubjectModalOpen(true);
  };

  const handleOpenEditSubject = (s) => {
    setCurrentSubject(s);
    setSubjectFormData({
      name: s.name || "",
      code: s.code || "",
      description: s.description || "",
      color: s.color || "blue",
      icon: s.icon || "BookOpen",
      status: s.status || "active"
    });
    setIsSubjectModalOpen(true);
  };

  const handleSaveSubject = async () => {
    if (!subjectFormData.name.trim()) {
      toast.error("Subject name is required.");
      return;
    }
    if (!subjectFormData.code.trim()) {
      toast.error("Subject code is required.");
      return;
    }

    setActionLoading(true);
    try {
      if (currentSubject) {
        await updateSubject(currentSubject.id, subjectFormData);
        toast.success(`Subject "${subjectFormData.name}" updated successfully.`);
      } else {
        await createSubject(subjectFormData);
        toast.success(`Subject "${subjectFormData.name}" created successfully.`);
      }
      setIsSubjectModalOpen(false);
      loadAllData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save subject: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleSubjectStatus = async (s) => {
    const nextStatus = s.status === "active" ? "inactive" : "active";
    try {
      await updateSubject(s.id, { status: nextStatus });
      toast.success(`Subject "${s.name}" is now ${nextStatus}.`);
      loadAllData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to change subject status.");
    }
  };

  const handleDeleteSubjectConfirm = async () => {
    if (!currentSubject) return;
    setActionLoading(true);
    try {
      await deleteSubject(currentSubject.id);
      toast.success(`Subject "${currentSubject.name}" deleted successfully.`);
      setIsSubjectDeleteOpen(false);
      loadAllData();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to delete subject.");
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // QUESTION SET ACTIONS
  // ==========================================

  const handleOpenCreateSet = () => {
    setCurrentSet(null);
    const defaultSubj = subjects[0] || { id: "html", name: "HTML" };
    const matchingSets = questionSets.filter((s) => (s.subject || "").toLowerCase() === defaultSubj.name.toLowerCase());
    setSetFormData({
      ...initialSetForm,
      subjectId: defaultSubj.id,
      subject: defaultSubj.name,
      setNumber: matchingSets.length + 1,
      title: `${defaultSubj.name} — Set ${matchingSets.length + 1}`
    });
    setIsSetModalOpen(true);
  };

  const handleOpenEditSet = (s) => {
    setCurrentSet(s);
    setSetFormData({
      title: s.title || "",
      setNumber: s.setNumber || 1,
      subjectId: s.subjectId || "html",
      subject: s.subject || "HTML",
      description: s.description || "",
      instructions: s.instructions || "",
      durationMinutes: s.durationMinutes || 40,
      totalMarks: s.totalMarks || (s.questionCount || 20) * 4,
      difficulty: s.difficulty || "Easy",
      attemptLimit: s.attemptLimit || 2,
      status: s.status || "draft"
    });
    setIsSetModalOpen(true);
  };

  const handleOpenPreviewSet = (s) => {
    setCurrentSet(s);
    setIsSetPreviewOpen(true);
  };

  const handleSaveSet = async () => {
    if (!setFormData.title.trim()) {
      toast.error("Set title is required.");
      return;
    }

    setActionLoading(true);
    try {
      if (currentSet) {
        await updateQuestionSet(currentSet.id, setFormData);
        toast.success(`Set "${setFormData.title}" updated successfully.`);
      } else {
        await createQuestionSet(setFormData);
        toast.success(`Set "${setFormData.title}" created successfully.`);
      }
      setIsSetModalOpen(false);
      loadAllData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save set: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleTogglePublishSet = async (s) => {
    setActionLoading(true);
    try {
      if (s.status === "published" || s.publicationStatus === "published") {
        await unpublishQuestionSet(s.id);
        toast.success(`Set "${s.title}" unpublished (set to draft).`);
      } else {
        await publishQuestionSet(s.id);
        toast.success(`Set "${s.title}" published! Available in student examination hall.`);
      }
      loadAllData();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to change publication status.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleArchiveSet = async (s) => {
    setActionLoading(true);
    try {
      await archiveQuestionSet(s.id);
      toast.success(`Set "${s.title}" archived successfully.`);
      loadAllData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to archive set.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDuplicateSet = async (s) => {
    setActionLoading(true);
    try {
      await duplicateQuestionSet(s.id);
      toast.success(`Duplicated set "${s.title}".`);
      loadAllData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to duplicate set: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSetConfirm = async () => {
    if (!currentSet) return;
    setActionLoading(true);
    try {
      await deleteQuestionSet(currentSet.id);
      toast.success(`Set "${currentSet.title}" deleted.`);
      setIsSetDeleteOpen(false);
      loadAllData();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to delete set.");
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // BULK IMPORT PARSER & VALIDATOR
  // ==========================================

  const handleParseImportContent = (content) => {
    setParsedPreviewList([]);
    setImportErrorsList([]);
    setImportCompletedReport(null);

    try {
      let rawList = [];
      const trimmed = content.trim();

      if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
        // Parse JSON format
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          rawList = parsed;
        } else {
          // Flatten subject/set object structure
          Object.keys(parsed).forEach((cat) => {
            const catObj = parsed[cat];
            if (Array.isArray(catObj)) {
              catObj.forEach((q) => rawList.push({ ...q, category: cat }));
            } else if (typeof catObj === "object") {
              Object.keys(catObj).forEach((setNum) => {
                const setArr = catObj[setNum];
                if (Array.isArray(setArr)) {
                  setArr.forEach((q) => rawList.push({ ...q, category: cat, set: setNum }));
                }
              });
            }
          });
        }
      } else {
        // Parse CSV format
        const lines = trimmed.split("\n");
        const headers = lines[0].split(",").map((h) => h.replace(/^"|"$/g, "").trim().toLowerCase());

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          const cols = line.split(",").map((c) => c.replace(/^"|"$/g, "").trim());

          // Build row object
          const qObj = {
            questionText: cols[0] || "",
            subject: cols[1] || "General",
            difficulty: cols[2] || "Easy",
            options: [cols[3] || "", cols[4] || "", cols[5] || "", cols[6] || ""].filter(Boolean),
            correctAnswer: cols[7] || "A",
            explanation: cols[8] || ""
          };
          rawList.push(qObj);
        }
      }

      // Validate every question
      const valid = [];
      const errors = [];

      rawList.forEach((q, idx) => {
        const rowErrors = [];
        const qText = q.questionText || q.question || "";
        if (!qText.trim()) rowErrors.push("Missing question text");

        let opts = q.options || [];
        if (!Array.isArray(opts) || opts.length < 2) {
          rowErrors.push("Must have at least 2 options");
        }

        let ans = q.correctAnswer;
        if (ans === undefined && q.answer !== undefined) {
          const idxNum = Number(q.answer);
          if (idxNum >= 0 && idxNum < opts.length) {
            ans = String.fromCharCode(65 + idxNum);
          } else {
            rowErrors.push(`Answer index (${q.answer}) out of options range`);
          }
        }

        const validItem = {
          rawIndex: idx + 1,
          id: q.id || `import-q-${idx + 1}`,
          questionText: qText,
          subject: q.category || q.subject || (importTargetSubject !== "auto" ? importTargetSubject : "General"),
          setNumber: q.set || q.setNumber || 1,
          difficulty: q.difficulty || "Easy",
          options: opts.map((opt, oIdx) => ({
            id: String.fromCharCode(65 + oIdx),
            text: typeof opt === "string" ? opt : opt.text || ""
          })),
          correctAnswer: ans || "A",
          explanation: q.explanation || "",
          errors: rowErrors,
          isValid: rowErrors.length === 0
        };

        if (rowErrors.length > 0) {
          errors.push(`Row #${idx + 1}: ${rowErrors.join(", ")}`);
        }
        valid.push(validItem);
      });

      setParsedPreviewList(valid);
      setImportErrorsList(errors);
      toast.info(`Parsed ${valid.length} records (${valid.filter((v) => v.isValid).length} valid, ${errors.length} with errors).`);
    } catch (parseErr) {
      console.error(parseErr);
      toast.error("File parsing error: " + parseErr.message);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImportFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      setImportJsonText(content);
      handleParseImportContent(content);
    };
    reader.readAsText(file);
  };

  const handleExecuteImport = async () => {
    const validQuestions = parsedPreviewList.filter((q) => q.isValid);
    if (validQuestions.length === 0) {
      toast.error("No valid questions to import.");
      return;
    }

    setActionLoading(true);
    setImportProgress(10);
    try {
      const destinationSet = importTargetSet ? importTargetSet : null;
      const targetSubj = importTargetSubject !== "auto" ? importTargetSubject : null;

      const preparedList = validQuestions.map((q) => ({
        id: q.id,
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: q.difficulty,
        subject: targetSubj || q.subject,
        setId: destinationSet || (q.setNumber ? `${(targetSubj || q.subject).toLowerCase()}-set-${q.setNumber}` : null),
        setNumber: Number(q.setNumber) || 1,
        positiveMarks: 4,
        negativeMarks: 1,
        unansweredMarks: 0
      }));

      setImportProgress(40);
      const importedIds = await importQuestionsBulk(preparedList, {
        subject: targetSubj,
        setId: destinationSet
      });

      setImportProgress(100);
      setImportCompletedReport({
        totalParsed: parsedPreviewList.length,
        importedCount: importedIds.length,
        failedCount: importErrorsList.length
      });

      toast.success(`Successfully imported ${importedIds.length} questions into Firebase!`);
      loadAllData();
    } catch (err) {
      console.error("Bulk import failed:", err);
      toast.error("Bulk import failed: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // CSV Export for filtered questions
  const handleExportQuestionsCsv = () => {
    const headers = [
      { key: "questionText", label: "QuestionText" },
      { key: "subject", label: "Subject" },
      { key: "setId", label: "SetId" },
      { key: "difficulty", label: "Difficulty" },
      { key: "positiveMarks", label: "PositiveMarks" },
      { key: "negativeMarks", label: "NegativeMarks" },
      { key: "correctAnswer", label: "CorrectAnswer" },
      { key: "explanation", label: "Explanation" }
    ];
    exportToCsv("QuizMaster_Questions.csv", filteredQuestions, headers);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs">
        <div>
          <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Repository Architecture &bull; Subject-Wise &rarr; Set-Wise System
          </span>
          <h1 className="text-2xl font-black text-[#111827] tracking-tight mt-0.5">
            Question Bank &amp; Set Registry
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Create, organize, import, and publish question sets. Connected dynamically to Cloud Firestore.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            onClick={loadAllData}
            disabled={loading}
          >
            Refresh
          </Button>

          {activeTab === "questions" && (
            <>
              <Button
                variant="secondary"
                size="sm"
                icon={Download}
                onClick={handleExportQuestionsCsv}
              >
                Export CSV
              </Button>
              <Button size="sm" icon={Plus} onClick={handleOpenCreateQuestion}>
                Add Question
              </Button>
            </>
          )}

          {activeTab === "subjects" && (
            <Button size="sm" icon={Plus} onClick={handleOpenCreateSubject}>
              Add Subject
            </Button>
          )}

          {activeTab === "sets" && (
            <Button size="sm" icon={Plus} onClick={handleOpenCreateSet}>
              Create Question Set
            </Button>
          )}
        </div>
      </div>

      {/* Real-Time Database Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <Card className="p-3.5 flex items-center gap-3 border-l-4 border-l-[#2563EB]">
          <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-[#64748B] block truncate">Total Subjects</span>
            <span className="text-lg font-black text-[#111827]">{stats.totalSubjects}</span>
          </div>
        </Card>

        <Card className="p-3.5 flex items-center gap-3 border-l-4 border-l-[#16A34A]">
          <div className="w-9 h-9 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0">
            <FolderKanban className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-[#64748B] block truncate">Question Sets</span>
            <span className="text-lg font-black text-[#111827]">
              {stats.publishedSets} <span className="text-xs font-medium text-[#64748B]">/ {stats.totalSets}</span>
            </span>
          </div>
        </Card>

        <Card className="p-3.5 flex items-center gap-3 border-l-4 border-l-[#D97706]">
          <div className="w-9 h-9 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-[#64748B] block truncate">Total Questions</span>
            <span className="text-lg font-black text-[#111827]">{stats.totalQuestions}</span>
          </div>
        </Card>

        <Card className="p-3.5 flex items-center gap-3 border-l-4 border-l-[#7C3AED]">
          <div className="w-9 h-9 rounded-xl bg-[#F5F3FF] text-[#7C3AED] flex items-center justify-center shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-[#64748B] block truncate">Difficulty</span>
            <span className="text-xs font-bold text-[#111827] block mt-0.5 truncate">
              <span className="text-[#16A34A]">{stats.easyCount}E</span> &bull;{" "}
              <span className="text-[#D97706]">{stats.mediumCount}M</span> &bull;{" "}
              <span className="text-[#DC2626]">{stats.hardCount}H</span>
            </span>
          </div>
        </Card>

        <Card className={`p-3.5 flex items-center gap-3 border-l-4 ${stats.reviewQuestions > 0 ? "border-l-[#DC2626] bg-[#FEF2F2]/30" : "border-l-[#64748B]"}`}>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${stats.reviewQuestions > 0 ? "bg-[#FEE2E2] text-[#DC2626]" : "bg-[#F1F5F9] text-[#64748B]"}`}>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-[#64748B] block truncate">Awaiting Review</span>
            <span className={`text-lg font-black ${stats.reviewQuestions > 0 ? "text-[#DC2626]" : "text-[#111827]"}`}>
              {stats.reviewQuestions || 0}
            </span>
          </div>
        </Card>
      </div>

      {/* Main Feature Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2">
        <button
          onClick={() => setActiveTab("questions")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "questions"
              ? "bg-[#2563EB] text-white shadow-xs shadow-blue-500/20"
              : "text-[#64748B] hover:text-[#111827] hover:bg-white"
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Questions</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
              activeTab === "questions" ? "bg-white/20 text-white" : "bg-[#F1F5F9] text-[#475569]"
            }`}
          >
            {questions.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("subjects")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "subjects"
              ? "bg-[#2563EB] text-white shadow-xs shadow-blue-500/20"
              : "text-[#64748B] hover:text-[#111827] hover:bg-white"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Subjects</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
              activeTab === "subjects" ? "bg-white/20 text-white" : "bg-[#F1F5F9] text-[#475569]"
            }`}
          >
            {subjects.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("sets")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "sets"
              ? "bg-[#2563EB] text-white shadow-xs shadow-blue-500/20"
              : "text-[#64748B] hover:text-[#111827] hover:bg-white"
          }`}
        >
          <FolderKanban className="w-4 h-4" />
          <span>Question Sets</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
              activeTab === "sets" ? "bg-white/20 text-white" : "bg-[#F1F5F9] text-[#475569]"
            }`}
          >
            {questionSets.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("import")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "import"
              ? "bg-[#2563EB] text-white shadow-xs shadow-blue-500/20"
              : "text-[#64748B] hover:text-[#111827] hover:bg-white"
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Bulk Import</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: QUESTIONS MANAGEMENT */}
      {/* ======================================================== */}
      {activeTab === "questions" && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <Card className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              <div className="sm:col-span-1">
                <Input
                  icon={Search}
                  placeholder="Search questions, options, explanation..."
                  value={questionSearch}
                  onChange={(e) => setQuestionSearch(e.target.value)}
                />
              </div>

              <Select
                value={selectedSubjectFilter}
                onChange={(e) => {
                  setSelectedSubjectFilter(e.target.value);
                  setSelectedSetFilter("all");
                }}
                options={[
                  { value: "all", label: "All Subjects" },
                  ...subjects.map((s) => ({ value: s.name, label: s.name }))
                ]}
              />

              <Select
                value={selectedSetFilter}
                onChange={(e) => setSelectedSetFilter(e.target.value)}
                options={[
                  { value: "all", label: "All Question Sets" },
                  ...availableSetsForFilter.map((s) => ({ value: s.id, label: s.title }))
                ]}
              />

              <Select
                value={selectedDifficultyFilter}
                onChange={(e) => setSelectedDifficultyFilter(e.target.value)}
                options={[
                  { value: "all", label: "All Difficulties" },
                  { value: "easy", label: "Easy" },
                  { value: "medium", label: "Medium" },
                  { value: "hard", label: "Hard" }
                ]}
              />

              <Select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                options={[
                  { value: "all", label: "All Statuses" },
                  { value: "active", label: "Active Only" },
                  { value: "draft", label: "Draft Only" },
                  { value: "review_required", label: `Needs Review (${stats.reviewQuestions || 0})` }
                ]}
              />
            </div>
          </Card>

          {/* Questions Table */}
          {loading ? (
            <TableSkeleton rows={8} />
          ) : filteredQuestions.length === 0 ? (
            <EmptyState
              icon={HelpCircle}
              title="No Questions Found"
              description="No questions match your current filter criteria. You can create a new question or import questions."
              actionLabel="Add Question"
              onAction={handleOpenCreateQuestion}
            />
          ) : (
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4 w-12 text-center">#</th>
                      <th className="py-3 px-4 min-w-[320px]">Question Details</th>
                      <th className="py-3 px-4">Subject &amp; Set</th>
                      <th className="py-3 px-4">Difficulty</th>
                      <th className="py-3 px-4">Correct Option</th>
                      <th className="py-3 px-4">Marks</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {filteredQuestions.map((q, idx) => (
                      <tr key={q.id} className="hover:bg-[#F8FAFC] transition-colors">
                        <td className="py-3 px-4 text-center font-bold text-[#64748B]">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-[#111827] line-clamp-2 leading-relaxed flex items-center flex-wrap gap-1.5">
                            {q.questionText}
                            {q.reviewRequired && (
                              <span className="inline-flex items-center gap-1 bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                                <AlertTriangle className="w-3 h-3 text-[#DC2626]" /> Review Required
                              </span>
                            )}
                          </p>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {(q.options || []).map((opt) => (
                              <span
                                key={opt.id}
                                className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                                  opt.id === q.correctAnswer
                                    ? "bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]"
                                    : "bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]"
                                }`}
                              >
                                {opt.id}. {opt.text?.substring(0, 20)}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="primary" size="xs">
                            {q.subject || "General"}
                          </Badge>
                          <span className="text-[11px] text-[#64748B] block mt-1">
                            {q.setId || `Set ${q.setNumber || "—"}`}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              (q.difficulty || "").toLowerCase() === "easy"
                                ? "success"
                                : (q.difficulty || "").toLowerCase() === "medium"
                                ? "warning"
                                : "danger"
                            }
                            size="xs"
                          >
                            {q.difficulty || "Easy"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 font-black text-xs text-[#15803D] bg-[#DCFCE7] px-2.5 py-1 rounded-lg border border-[#BBF7D0]">
                            <Check className="w-3.5 h-3.5" /> Option {q.correctAnswer}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-[#111827]">
                          <span className="text-[#16A34A]">+{q.positiveMarks || 4}</span> /{" "}
                          <span className="text-[#DC2626]">-{q.negativeMarks || 1}</span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenPreviewQuestion(q)}
                              className="p-1.5 rounded-lg text-[#64748B] hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-colors"
                              title="Preview Question"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenEditQuestion(q)}
                              className="p-1.5 rounded-lg text-[#64748B] hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-colors"
                              title="Edit Question"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDuplicateQuestion(q)}
                              className="p-1.5 rounded-lg text-[#64748B] hover:text-[#7C3AED] hover:bg-[#F5F3FF] transition-colors"
                              title="Duplicate Question"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenDeleteQuestion(q)}
                              className="p-1.5 rounded-lg text-[#64748B] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-colors"
                              title="Delete Question"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: SUBJECT MANAGEMENT */}
      {/* ======================================================== */}
      {activeTab === "subjects" && (
        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="w-full sm:w-72">
                <Input
                  icon={Search}
                  placeholder="Search subjects by name or code..."
                  value={subjectSearch}
                  onChange={(e) => setSubjectSearch(e.target.value)}
                />
              </div>

              <Button size="sm" icon={Plus} onClick={handleOpenCreateSubject}>
                Add New Subject
              </Button>
            </div>
          </Card>

          {loading ? (
            <TableSkeleton rows={4} />
          ) : filteredSubjects.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No Subjects Found"
              description="Create a subject to begin organizing question sets."
              actionLabel="Add Subject"
              onAction={handleOpenCreateSubject}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubjects.map((s) => {
                const subjectSets = questionSets.filter(
                  (qs) => (qs.subject || "").toLowerCase() === s.name.toLowerCase() || qs.subjectId === s.id
                );
                const subjectQuestions = questions.filter(
                  (q) => (q.subject || "").toLowerCase() === s.name.toLowerCase() || q.subjectId === s.id
                );

                return (
                  <Card key={s.id} className="p-6 flex flex-col justify-between hover:shadow-xs transition-shadow">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
                          {s.code || s.name.substring(0, 4).toUpperCase()}
                        </span>
                        <button
                          onClick={() => handleToggleSubjectStatus(s)}
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border cursor-pointer ${
                            s.status === "active"
                              ? "bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]"
                              : "bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]"
                          }`}
                        >
                          {s.status === "active" ? "Active" : "Inactive"}
                        </button>
                      </div>

                      <h3 className="text-lg font-black text-[#111827] mb-1">{s.name}</h3>
                      <p className="text-xs text-[#64748B] line-clamp-2 mb-4 leading-relaxed">
                        {s.description || "Comprehensive subject examination curriculum."}
                      </p>

                      <div className="grid grid-cols-2 gap-2 p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-center mb-4 text-xs">
                        <div>
                          <span className="text-[10px] text-[#64748B] block font-medium">Question Sets</span>
                          <span className="font-bold text-[#111827]">{subjectSets.length} Sets</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#64748B] block font-medium">Questions</span>
                          <span className="font-bold text-[#111827]">{subjectQuestions.length} Total</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                      <Button
                        size="xs"
                        variant="secondary"
                        icon={Layers}
                        onClick={() => {
                          setSetSubjectFilter(s.name);
                          setActiveTab("sets");
                        }}
                      >
                        View Question Sets
                      </Button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditSubject(s)}
                          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-colors"
                          title="Edit Subject"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setCurrentSubject(s);
                            setIsSubjectDeleteOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-colors"
                          title="Delete Subject"
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
      )}

      {/* ======================================================== */}
      {/* TAB 3: QUESTION SETS MANAGEMENT */}
      {/* ======================================================== */}
      {activeTab === "sets" && (
        <div className="space-y-4">
          <Card className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <Input
                  icon={Search}
                  placeholder="Search sets by title or description..."
                  value={setSearch}
                  onChange={(e) => setSetSearch(e.target.value)}
                />
              </div>

              <Select
                value={setSubjectFilter}
                onChange={(e) => setSetSubjectFilter(e.target.value)}
                options={[
                  { value: "all", label: "All Subjects" },
                  ...subjects.map((s) => ({ value: s.name, label: s.name }))
                ]}
              />

              <div className="flex justify-end">
                <Button size="sm" icon={Plus} onClick={handleOpenCreateSet}>
                  Create New Set
                </Button>
              </div>
            </div>
          </Card>

          {loading ? (
            <TableSkeleton rows={5} />
          ) : filteredSets.length === 0 ? (
            <EmptyState
              icon={FolderKanban}
              title="No Question Sets Found"
              description="Create a question set under your chosen subject to group questions."
              actionLabel="Create Set"
              onAction={handleOpenCreateSet}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSets.map((s) => {
                const isPub = s.status === "published" || s.publicationStatus === "published";
                const isArchived = s.status === "archived";
                const qCount = s.questionCount || s.questionIds?.length || 0;
                const marks = s.totalMarks || qCount * 4;

                return (
                  <Card key={s.id} className="p-6 flex flex-col justify-between hover:shadow-xs transition-shadow">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="primary">{s.subject || "General"}</Badge>
                        <span
                          className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
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
                        {s.description || `Assessment set for ${s.subject}.`}
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
                        onClick={() => handleTogglePublishSet(s)}
                        disabled={actionLoading}
                      >
                        {isPub ? "Unpublish" : "Publish Set"}
                      </Button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenPreviewSet(s)}
                          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-colors"
                          title="Preview Set"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEditSet(s)}
                          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-colors"
                          title="Edit Set"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicateSet(s)}
                          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#7C3AED] hover:bg-[#F5F3FF] transition-colors"
                          title="Duplicate Set"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleArchiveSet(s)}
                          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#D97706] hover:bg-[#FEF3C7] transition-colors"
                          title="Archive Set"
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setCurrentSet(s);
                            setIsSetDeleteOpen(true);
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
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: BULK IMPORT WORKFLOW */}
      {/* ======================================================== */}
      {activeTab === "import" && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-black text-[#111827] mb-1">
              Bulk Question Bank Import (JSON / CSV)
            </h2>
            <p className="text-xs text-[#64748B] mb-6">
              Upload existing questions file. Pre-validates options, correct-answer indices (0-based or letters A-D), and writes in safe batches to Firebase.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* File Upload Zone */}
              <div className="md:col-span-2 border-2 border-dashed border-[#CBD5E1] rounded-2xl p-8 text-center hover:border-[#2563EB] transition-colors bg-[#F8FAFC]">
                <Upload className="w-10 h-10 text-[#2563EB] mx-auto mb-3" />
                <h4 className="text-sm font-bold text-[#111827] mb-1">
                  Upload Master Question Bank File
                </h4>
                <p className="text-xs text-[#64748B] mb-4">
                  Supports JSON (Master Question Bank structure) and standard CSV files
                </p>

                <input
                  type="file"
                  id="bank-file-upload"
                  className="hidden"
                  accept=".json,.csv"
                  onChange={handleFileUpload}
                />
                <label htmlFor="bank-file-upload">
                  <Button as="span" variant="primary" size="sm" icon={Upload}>
                    Select File From Device
                  </Button>
                </label>

                {importFile && (
                  <div className="mt-4 p-3 bg-white border border-[#E2E8F0] rounded-xl text-left inline-flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-[#2563EB]" />
                    <span className="text-xs font-bold text-[#111827]">{importFile.name}</span>
                    <span className="text-[11px] text-[#64748B]">
                      ({(importFile.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                )}
              </div>

              {/* Import Mapping Config */}
              <div className="space-y-4 bg-[#F8FAFC] p-5 rounded-2xl border border-[#E2E8F0]">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#64748B]">
                  Destination Mapping
                </h4>

                <div>
                  <label className="text-xs font-bold text-[#111827] block mb-1">
                    Target Subject
                  </label>
                  <Select
                    value={importTargetSubject}
                    onChange={(e) => setImportTargetSubject(e.target.value)}
                    options={[
                      { value: "auto", label: "Auto-detect from file" },
                      ...subjects.map((s) => ({ value: s.name, label: s.name }))
                    ]}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#111827] block mb-1">
                    Destination Set (Optional)
                  </label>
                  <Select
                    value={importTargetSet}
                    onChange={(e) => setImportTargetSet(e.target.value)}
                    options={[
                      { value: "", label: "Auto-detect or Create Set from file" },
                      ...questionSets.map((s) => ({ value: s.id, label: `${s.subject}: ${s.title}` }))
                    ]}
                  />
                </div>

                {parsedPreviewList.length > 0 && (
                  <div className="pt-4 border-t border-[#E2E8F0] space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#64748B]">Total Parsed:</span>
                      <strong className="text-[#111827]">{parsedPreviewList.length}</strong>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-[#16A34A]">Valid Records:</span>
                      <strong className="text-[#16A34A]">
                        {parsedPreviewList.filter((p) => p.isValid).length}
                      </strong>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-[#DC2626]">Invalid Records:</span>
                      <strong className="text-[#DC2626]">{importErrorsList.length}</strong>
                    </div>

                    <Button
                      className="w-full mt-3"
                      size="sm"
                      icon={CheckCircle}
                      onClick={handleExecuteImport}
                      disabled={actionLoading || parsedPreviewList.filter((p) => p.isValid).length === 0}
                    >
                      {actionLoading ? "Writing to Firebase..." : "Confirm & Commit to Firebase"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Validation Preview Table */}
          {parsedPreviewList.length > 0 && (
            <Card className="overflow-hidden">
              <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-[#111827]">
                    Validation Preview &amp; Pre-Import Inspection
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Review parsed rows before committing to Cloud Firestore database.
                  </p>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-bold sticky top-0">
                    <tr>
                      <th className="py-2.5 px-3 w-12 text-center">Row</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 min-w-[260px]">Question Text</th>
                      <th className="py-2.5 px-3">Subject</th>
                      <th className="py-2.5 px-3">Options</th>
                      <th className="py-2.5 px-3">Answer</th>
                      <th className="py-2.5 px-3">Validation Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {parsedPreviewList.slice(0, 50).map((item) => (
                      <tr key={item.rawIndex} className={item.isValid ? "" : "bg-[#FEF2F2]"}>
                        <td className="py-2.5 px-3 text-center font-bold text-[#64748B]">
                          {item.rawIndex}
                        </td>
                        <td className="py-2.5 px-3">
                          {item.isValid ? (
                            <Badge variant="success" size="xs">Valid</Badge>
                          ) : (
                            <Badge variant="danger" size="xs">Error</Badge>
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-[#111827] line-clamp-1">
                          {item.questionText}
                        </td>
                        <td className="py-2.5 px-3">
                          <Badge variant="primary" size="xs">{item.subject}</Badge>
                        </td>
                        <td className="py-2.5 px-3 text-[#64748B]">
                          {item.options.length} Options
                        </td>
                        <td className="py-2.5 px-3 font-bold text-[#16A34A]">
                          {item.correctAnswer}
                        </td>
                        <td className="py-2.5 px-3 text-xs">
                          {item.isValid ? (
                            <span className="text-[#16A34A] text-[11px]">Ready for batch write</span>
                          ) : (
                            <span className="text-[#DC2626] font-semibold text-[11px]">
                              {item.errors.join("; ")}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: CREATE / EDIT QUESTION */}
      {/* ======================================================== */}
      <Modal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        title={currentQuestion ? "Edit Question" : "Create New Question"}
        maxWidth="max-w-2xl"
      >
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Subject & Set Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#111827] block mb-1">
                Subject <span className="text-[#DC2626]">*</span>
              </label>
              <Select
                value={questionFormData.subject}
                onChange={(e) => {
                  const selName = e.target.value;
                  const matchingSubj = subjects.find((s) => s.name === selName);
                  const matchingSets = questionSets.filter((s) => (s.subject || "").toLowerCase() === selName.toLowerCase());
                  setQuestionFormData({
                    ...questionFormData,
                    subject: selName,
                    subjectId: matchingSubj?.id || selName.toLowerCase(),
                    setId: matchingSets[0]?.id || ""
                  });
                }}
                options={subjects.map((s) => ({ value: s.name, label: s.name }))}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#111827] block mb-1">
                Question Set
              </label>
              <Select
                value={questionFormData.setId}
                onChange={(e) => setQuestionFormData({ ...questionFormData, setId: e.target.value })}
                options={[
                  { value: "", label: "-- Standalone Question (No Set) --" },
                  ...availableSetsForQuestionForm.map((s) => ({ value: s.id, label: s.title }))
                ]}
              />
            </div>
          </div>

          {/* Question Text */}
          <div>
            <label className="text-xs font-bold text-[#111827] block mb-1">
              Question Statement <span className="text-[#DC2626]">*</span>
            </label>
            <textarea
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] font-sans"
              rows={4}
              placeholder="Enter question text. Code blocks and mathematical symbols are fully supported."
              value={questionFormData.questionText}
              onChange={(e) => setQuestionFormData({ ...questionFormData, questionText: e.target.value })}
            />
          </div>

          {/* Options Section */}
          <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-black uppercase tracking-wider text-[#64748B]">
                Answer Options &amp; Correct Answer Key
              </label>
              <Button size="xs" variant="secondary" icon={Plus} onClick={handleAddQuestionOption}>
                Add Option
              </Button>
            </div>

            {questionFormData.options.map((opt, idx) => (
              <div key={opt.id} className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 cursor-pointer shrink-0">
                  <input
                    type="radio"
                    name="correct-answer-selector"
                    checked={questionFormData.correctAnswer === opt.id}
                    onChange={() => setQuestionFormData({ ...questionFormData, correctAnswer: opt.id })}
                    className="w-4 h-4 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                  />
                  <span className="w-6 h-6 rounded-md bg-[#F1F5F9] font-black text-xs flex items-center justify-center text-[#111827]">
                    {opt.id}
                  </span>
                </label>

                <input
                  type="text"
                  className="flex-1 px-3 py-2 text-xs bg-white border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  placeholder={`Option ${opt.id} text...`}
                  value={opt.text}
                  onChange={(e) => handleQuestionOptionTextChange(idx, e.target.value)}
                />

                {questionFormData.options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestionOption(idx)}
                    className="p-1.5 text-[#64748B] hover:text-[#DC2626] rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Difficulty & Marks Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#E2E8F0]">
            <div>
              <label className="text-xs font-bold text-[#111827] block mb-1">Difficulty</label>
              <Select
                value={questionFormData.difficulty}
                onChange={(e) => setQuestionFormData({ ...questionFormData, difficulty: e.target.value })}
                options={[
                  { value: "Easy", label: "Easy" },
                  { value: "Medium", label: "Medium" },
                  { value: "Hard", label: "Hard" }
                ]}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#111827] block mb-1">Correct (+Marks)</label>
              <Input
                type="number"
                value={questionFormData.positiveMarks}
                onChange={(e) => setQuestionFormData({ ...questionFormData, positiveMarks: Number(e.target.value) })}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#111827] block mb-1">Negative (-Marks)</label>
              <Input
                type="number"
                value={questionFormData.negativeMarks}
                onChange={(e) => setQuestionFormData({ ...questionFormData, negativeMarks: Number(e.target.value) })}
              />
            </div>
          </div>

          {/* Explanation */}
          <div>
            <label className="text-xs font-bold text-[#111827] block mb-1">
              Explanation &bull; Solution Walkthrough
            </label>
            <textarea
              className="w-full px-3.5 py-2 text-xs bg-white border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              rows={3}
              placeholder="Enter explanation shown on the student scorecard after exam evaluation."
              value={questionFormData.explanation}
              onChange={(e) => setQuestionFormData({ ...questionFormData, explanation: e.target.value })}
            />
          </div>

          {/* Flag for Admin Review */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors">
              <input
                type="checkbox"
                checked={Boolean(questionFormData.reviewRequired)}
                onChange={(e) => setQuestionFormData({ ...questionFormData, reviewRequired: e.target.checked })}
                className="w-4 h-4 text-[#DC2626] rounded border-[#CBD5E1] focus:ring-[#DC2626]"
              />
              <span className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-[#DC2626]" />
                Flag for Verification &amp; Admin Review
              </span>
            </label>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex flex-wrap items-center justify-between gap-2">
          <Button variant="secondary" size="sm" onClick={() => setIsQuestionModalOpen(false)}>
            Cancel
          </Button>

          <div className="flex items-center gap-2">
            {!currentQuestion && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleSaveQuestion(true, false)}
                disabled={actionLoading}
              >
                Save &amp; Add Another
              </Button>
            )}

            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleSaveQuestion(false, true)}
              disabled={actionLoading}
            >
              Save as Draft
            </Button>

            <Button
              size="sm"
              onClick={() => handleSaveQuestion(false, false)}
              disabled={actionLoading}
            >
              {actionLoading ? "Saving..." : currentQuestion ? "Update Question" : "Save Question"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ======================================================== */}
      {/* MODAL 2: QUESTION PREVIEW */}
      {/* ======================================================== */}
      <Modal
        isOpen={isQuestionPreviewOpen}
        onClose={() => setIsQuestionPreviewOpen(false)}
        title="Question Preview &amp; Verification"
        maxWidth="max-w-xl"
      >
        {currentQuestion && (
          <div className="p-6 space-y-4">
            {currentQuestion.reviewRequired && (
              <div className="p-3.5 bg-[#FEF2F2] border border-[#FECACA] rounded-xl flex items-start gap-2.5 text-xs text-[#991B1B]">
                <AlertTriangle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Flagged for Admin Review:</strong>
                  <span>This question was marked for verification during import (e.g. Question 15 syntax audit). Please review code snippets and options before live testing.</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <Badge variant="primary">{currentQuestion.subject || "General"}</Badge>
              <Badge
                variant={
                  (currentQuestion.difficulty || "").toLowerCase() === "easy"
                    ? "success"
                    : (currentQuestion.difficulty || "").toLowerCase() === "medium"
                    ? "warning"
                    : "danger"
                }
              >
                {currentQuestion.difficulty || "Easy"}
              </Badge>
            </div>

            <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
              <p className="text-sm font-bold text-[#111827] leading-relaxed">
                {currentQuestion.questionText}
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
                Answer Options
              </span>
              {(currentQuestion.options || []).map((opt) => {
                const isCorrect = opt.id === currentQuestion.correctAnswer;
                return (
                  <div
                    key={opt.id}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-medium ${
                      isCorrect
                        ? "bg-[#DCFCE7] border-[#86EFAC] text-[#15803D]"
                        : "bg-white border-[#E2E8F0] text-[#111827]"
                    }`}
                  >
                    <span>
                      <strong className="mr-2 font-black">{opt.id}.</strong> {opt.text}
                    </span>
                    {isCorrect && (
                      <span className="text-[10px] font-black uppercase bg-[#15803D] text-white px-2 py-0.5 rounded-md">
                        Correct Answer
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {currentQuestion.explanation && (
              <div className="p-4 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl">
                <span className="text-[11px] font-black text-[#2563EB] uppercase block mb-1">
                  Explanation &bull; Solution
                </span>
                <p className="text-xs text-[#1E3A8A] leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* ======================================================== */}
      {/* MODAL 3: CREATE / EDIT SUBJECT */}
      {/* ======================================================== */}
      <Modal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        title={currentSubject ? "Edit Subject" : "Create New Subject"}
        maxWidth="max-w-md"
      >
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-[#111827] block mb-1">
              Subject Name <span className="text-[#DC2626]">*</span>
            </label>
            <Input
              placeholder="e.g. React.js, Python, TypeScript, DSA, DBMS, OS"
              value={subjectFormData.name}
              onChange={(e) => setSubjectFormData({ ...subjectFormData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#111827] block mb-1">
              Subject Code <span className="text-[#DC2626]">*</span>
            </label>
            <Input
              placeholder="e.g. REACT, PY, MATH"
              value={subjectFormData.code}
              onChange={(e) => setSubjectFormData({ ...subjectFormData, code: e.target.value.toUpperCase() })}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#111827] block mb-1">
              Description
            </label>
            <textarea
              className="w-full px-3.5 py-2 text-xs bg-white border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              rows={3}
              placeholder="Curriculum overview and core topics covered..."
              value={subjectFormData.description}
              onChange={(e) => setSubjectFormData({ ...subjectFormData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#111827] block mb-1">
              Status
            </label>
            <Select
              value={subjectFormData.status}
              onChange={(e) => setSubjectFormData({ ...subjectFormData, status: e.target.value })}
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" }
              ]}
            />
          </div>
        </div>

        <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => setIsSubjectModalOpen(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSaveSubject} disabled={actionLoading}>
            {actionLoading ? "Saving..." : currentSubject ? "Update Subject" : "Create Subject"}
          </Button>
        </div>
      </Modal>

      {/* ======================================================== */}
      {/* MODAL 4: CREATE / EDIT QUESTION SET */}
      {/* ======================================================== */}
      <Modal
        isOpen={isSetModalOpen}
        onClose={() => setIsSetModalOpen(false)}
        title={currentSet ? "Edit Question Set" : "Create New Question Set"}
        maxWidth="max-w-lg"
      >
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#111827] block mb-1">
                Subject <span className="text-[#DC2626]">*</span>
              </label>
              <Select
                value={setFormData.subject}
                onChange={(e) => {
                  const selName = e.target.value;
                  const matchingSubj = subjects.find((s) => s.name === selName);
                  setSetFormData({
                    ...setFormData,
                    subject: selName,
                    subjectId: matchingSubj?.id || selName.toLowerCase(),
                    title: `${selName} — Set ${setFormData.setNumber}`
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
                value={setFormData.setNumber}
                onChange={(e) => {
                  const num = Number(e.target.value);
                  setSetFormData({
                    ...setFormData,
                    setNumber: num,
                    title: `${setFormData.subject} — Set ${num}`
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
              value={setFormData.title}
              onChange={(e) => setSetFormData({ ...setFormData, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#111827] block mb-1">
                Duration (Minutes)
              </label>
              <Input
                type="number"
                value={setFormData.durationMinutes}
                onChange={(e) => setSetFormData({ ...setFormData, durationMinutes: Number(e.target.value) })}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#111827] block mb-1">
                Attempt Limit
              </label>
              <Input
                type="number"
                value={setFormData.attemptLimit}
                onChange={(e) => setSetFormData({ ...setFormData, attemptLimit: Number(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#111827] block mb-1">
              Instructions
            </label>
            <textarea
              className="w-full px-3.5 py-2 text-xs bg-white border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              rows={3}
              value={setFormData.instructions}
              onChange={(e) => setSetFormData({ ...setFormData, instructions: e.target.value })}
            />
          </div>
        </div>

        <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => setIsSetModalOpen(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSaveSet} disabled={actionLoading}>
            {actionLoading ? "Saving..." : currentSet ? "Update Set" : "Create Set"}
          </Button>
        </div>
      </Modal>

      {/* ======================================================== */}
      {/* MODAL 5: DELETE QUESTION CONFIRMATION */}
      {/* ======================================================== */}
      <Modal
        isOpen={isQuestionDeleteOpen}
        onClose={() => setIsQuestionDeleteOpen(false)}
        title="Confirm Question Deletion"
        maxWidth="max-w-md"
      >
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xl text-[#DC2626]">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p className="text-xs font-semibold">
              This action will permanently delete this question from the database.
            </p>
          </div>
          <p className="text-xs text-[#64748B]">
            Question: <strong className="text-[#111827]">{currentQuestion?.questionText}</strong>
          </p>
        </div>

        <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => setIsQuestionDeleteOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleDeleteQuestionConfirm} disabled={actionLoading}>
            {actionLoading ? "Deleting..." : "Delete Question"}
          </Button>
        </div>
      </Modal>

      {/* ======================================================== */}
      {/* MODAL 6: DELETE SUBJECT CONFIRMATION */}
      {/* ======================================================== */}
      <Modal
        isOpen={isSubjectDeleteOpen}
        onClose={() => setIsSubjectDeleteOpen(false)}
        title="Confirm Subject Deletion"
        maxWidth="max-w-md"
      >
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xl text-[#DC2626]">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p className="text-xs font-semibold">
              Are you sure you want to delete this subject? Ensure no question sets depend on it.
            </p>
          </div>
          <p className="text-xs text-[#64748B]">
            Subject: <strong className="text-[#111827]">{currentSubject?.name}</strong>
          </p>
        </div>

        <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => setIsSubjectDeleteOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleDeleteSubjectConfirm} disabled={actionLoading}>
            {actionLoading ? "Deleting..." : "Delete Subject"}
          </Button>
        </div>
      </Modal>

      {/* ======================================================== */}
      {/* MODAL 7: DELETE QUESTION SET CONFIRMATION */}
      {/* ======================================================== */}
      <Modal
        isOpen={isSetDeleteOpen}
        onClose={() => setIsSetDeleteOpen(false)}
        title="Confirm Set Deletion"
        maxWidth="max-w-md"
      >
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xl text-[#DC2626]">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p className="text-xs font-semibold">
              Warning: Deleting a set will remove it from the examination registry. If students have attempted this set, delete will be blocked to preserve student attempt history.
            </p>
          </div>
          <p className="text-xs text-[#64748B]">
            Set: <strong className="text-[#111827]">{currentSet?.title}</strong>
          </p>
        </div>

        <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => setIsSetDeleteOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleDeleteSetConfirm} disabled={actionLoading}>
            {actionLoading ? "Deleting..." : "Delete Set"}
          </Button>
        </div>
      </Modal>

      {/* ======================================================== */}
      {/* MODAL 8: PREVIEW QUESTION SET */}
      {/* ======================================================== */}
      <Modal
        isOpen={isSetPreviewOpen}
        onClose={() => setIsSetPreviewOpen(false)}
        title={currentSet ? `Set Preview: ${currentSet.title}` : "Set Preview"}
        maxWidth="max-w-3xl"
      >
        {currentSet && (
          <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs">
              <div>
                <span className="text-[#64748B] block">Subject</span>
                <strong className="text-[#111827]">{currentSet.subject}</strong>
              </div>
              <div>
                <span className="text-[#64748B] block">Duration</span>
                <strong className="text-[#111827]">{currentSet.durationMinutes || 40} Mins</strong>
              </div>
              <div>
                <span className="text-[#64748B] block">Questions</span>
                <strong className="text-[#111827]">
                  {currentSet.questionCount || currentSet.questionIds?.length || 0} Questions
                </strong>
              </div>
              <div>
                <span className="text-[#64748B] block">Total Marks</span>
                <strong className="text-[#16A34A]">{currentSet.totalMarks || 80} Marks</strong>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#64748B]">
                Questions Assigned to this Set
              </h4>

              {questions.filter((q) => q.setId === currentSet.id).length === 0 ? (
                <p className="text-xs text-[#64748B] italic p-4 text-center">
                  No questions currently linked to this set. Add questions to this set or import questions.
                </p>
              ) : (
                questions
                  .filter((q) => q.setId === currentSet.id)
                  .map((q, idx) => (
                    <div key={q.id} className="p-3 border border-[#E2E8F0] rounded-xl text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#2563EB]">Q{idx + 1}.</span>
                        <span className="text-[10px] font-black text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded-md">
                          Correct: {q.correctAnswer}
                        </span>
                      </div>
                      <p className="font-medium text-[#111827]">{q.questionText}</p>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
