import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getTestById } from "../../services/firebase/testService";
import { getQuestionById } from "../../services/firebase/questionService";
import {
  saveResponse,
  getAttemptResponses,
  submitAttempt,
  saveAttemptNotes,
  getAttemptNotes
} from "../../services/firebase/examService";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase/config";
import { useToast } from "../../context/ToastContext";
import confetti from "canvas-confetti";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Clock
} from "lucide-react";

// Exam Components
import ExamHeader from "../../components/exam/ExamHeader";
import ExamSidebar from "../../components/exam/ExamSidebar";
import SubjectTabs from "../../components/exam/SubjectTabs";
import QuestionPanel from "../../components/exam/QuestionPanel";
import QuestionPalette from "../../components/exam/QuestionPalette";
import QuestionInformation from "../../components/exam/QuestionInformation";
import ExamNotepad from "../../components/exam/ExamNotepad";
import QuickNavigation from "../../components/exam/QuickNavigation";
import ExamCalculator from "../../components/exam/ExamCalculator";
import ExamInstructionsModal from "../../components/exam/ExamInstructionsModal";
import QuestionPaperModal from "../../components/exam/QuestionPaperModal";
import ExamAnalysisModal from "../../components/exam/ExamAnalysisModal";
import ExamSubmitDialog from "../../components/exam/ExamSubmitDialog";
import ExamMobileNavigation from "../../components/exam/ExamMobileNavigation";
import MathRenderer from "../../components/exam/MathRenderer";
import { formatTimeRemaining } from "../../utils/formatters";

export default function ExamLivePage() {
  const { attemptId } = useParams();
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  // Core Attempt & Test State
  const [attempt, setAttempt] = useState(null);
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Authoritative Deadline State
  const [deadlineMs, setDeadlineMs] = useState(null);

  // Responses dictionary: { [questionId]: { selectedAnswer, markedForReview } }
  const [responses, setResponses] = useState({});
  // Set of visited question IDs
  const [visitedSet, setVisitedSet] = useState(new Set());

  // Active Subject Navigation
  const [activeSubject, setActiveSubject] = useState("");

  // Notes state
  const [notes, setNotes] = useState("");
  const [notesSaveState, setNotesSaveState] = useState("saved");
  const notesTimerRef = useRef(null);

  // Save status & Submission
  const [saveStatus, setSaveStatus] = useState("saved"); // 'saved' | 'saving' | 'error'
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modals & Panels State
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showQuestionPaper, setShowQuestionPaper] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [activeRailView, setActiveRailView] = useState("questions");
  const [paletteTab, setPaletteTab] = useState("palette"); // 'palette' | 'instructions'

  // Authoritative Countdown Timer State
  const [secondsRemaining, setSecondsRemaining] = useState(null);
  const deadlineRef = useRef(null);
  const autoSubmitRef = useRef(null);

  // Group questions by Subject
  const subjects = useMemo(() => {
    if (!questions || questions.length === 0) return [];
    const set = new Set();
    questions.forEach((q) => {
      set.add(q.subject || "General");
    });
    return Array.from(set);
  }, [questions]);

  // Subject Question Counts
  const subjectQuestionCounts = useMemo(() => {
    const counts = {};
    questions.forEach((q) => {
      const s = q.subject || "General";
      counts[s] = (counts[s] || 0) + 1;
    });
    return counts;
  }, [questions]);

  // Subject-wise stats for Quick Navigation
  const subjectStats = useMemo(() => {
    const stats = {};
    subjects.forEach((s) => {
      stats[s] = { total: 0, attempted: 0 };
    });
    questions.forEach((q) => {
      const s = q.subject || "General";
      if (!stats[s]) stats[s] = { total: 0, attempted: 0 };
      stats[s].total++;
      const resp = responses[q.id];
      if (resp?.selectedAnswer !== undefined && resp?.selectedAnswer !== null && resp?.selectedAnswer !== "") {
        stats[s].attempted++;
      }
    });
    return stats;
  }, [questions, subjects, responses]);

  // Global Counts Summary
  const summaryCounts = useMemo(() => {
    let answered = 0;
    let unanswered = 0;
    let marked = 0;

    questions.forEach((q) => {
      const resp = responses[q.id];
      const hasAnswer = resp?.selectedAnswer !== undefined && resp?.selectedAnswer !== null && resp?.selectedAnswer !== "";
      const isMarked = !!resp?.markedForReview;

      if (hasAnswer) answered++;
      else unanswered++;
      if (isMarked) marked++;
    });

    return { answered, unanswered, marked };
  }, [questions, responses]);

  const initExamRef = useRef(false);

  // Load Attempt and Sanitized Questions Snapshot
  useEffect(() => {
    if (initExamRef.current) return;
    initExamRef.current = true;

    async function initExam() {
      try {
        const attemptDoc = await getDoc(doc(db, "attempts", attemptId));
        if (!attemptDoc.exists()) {
          toast.error("Examination attempt not found.");
          navigate("/student/exams");
          return;
        }

        const attData = { id: attemptDoc.id, ...attemptDoc.data() };
        if (attData.status === "submitted") {
          toast.info("This examination has already been submitted.");
          navigate(`/student/results/${attData.resultId || ""}`);
          return;
        }

        // Fetch published test
        const testData = await getTestById(attData.testId);
        if (!testData) {
          toast.error("Test specification unavailable.");
          navigate("/student/exams");
          return;
        }

        let qList = testData.publishedQuestionsSnapshot || [];

        // Fail-safe: If snapshot is empty, dynamically hydrate questions from questionIds
        if (qList.length === 0 && Array.isArray(testData.questionIds) && testData.questionIds.length > 0) {
          console.warn("Test snapshot was empty, hydrating from questionIds...");
          const hydrated = [];
          for (const qid of testData.questionIds) {
            const q = await getQuestionById(qid);
            if (q) {
              hydrated.push({
                id: q.id,
                questionText: q.questionText || q.question,
                questionType: q.questionType || "single_choice",
                options: (q.options || []).map((opt, idx) => {
                  if (typeof opt === "string") return { id: String.fromCharCode(65 + idx), text: opt };
                  return opt;
                }),
                subject: q.subject || testData.subject || "General",
                topic: q.topic || "",
                difficulty: q.difficulty || "medium",
                positiveMarks: Number(q.positiveMarks) || Number(testData.markingScheme?.positiveMarks) || 4,
                negativeMarks: Number(q.negativeMarks) || Number(testData.markingScheme?.negativeMarks) || 1,
                unansweredMarks: Number(q.unansweredMarks) || Number(testData.markingScheme?.unansweredMarks) || 0,
                imageUrl: q.imageUrl || null
              });
            }
          }
          qList = hydrated;
        }

        if (qList.length === 0) {
          toast.error("Test snapshot has no questions.");
          navigate("/student/exams");
          return;
        }

        // Set authoritative deadline
        const deadline = attData.deadlineAt?.toMillis
          ? attData.deadlineAt.toMillis()
          : new Date(attData.deadlineAt).getTime();
        deadlineRef.current = deadline;
        setDeadlineMs(deadline);

        // Restore saved responses from Firestore
        const savedResponses = await getAttemptResponses(attemptId);

        // Restore candidate notes
        const localCachedNotes = localStorage.getItem(`qm_notes_${attemptId}`);
        const remoteNotes = attData.candidateNotes || await getAttemptNotes(attemptId);
        const resolvedNotes = localCachedNotes !== null ? localCachedNotes : (remoteNotes || "");

        setAttempt(attData);
        setTest(testData);
        setQuestions(qList);
        setResponses(savedResponses);
        setNotes(resolvedNotes);

        const initialSubj = qList[0]?.subject || "General";
        setActiveSubject(initialSubj);

        // Mark first question as visited
        if (qList[0]?.id) {
          setVisitedSet(new Set([qList[0].id]));
        }
      } catch (err) {
        console.error("Exam init error:", err);
        toast.error("Failed to initialize examination environment.");
        navigate("/student/exams");
      }
    }

    initExam();
  }, [attemptId, navigate, toast]);

  // Master Countdown Timer Loop (Synchronized with deadlineMs)
  useEffect(() => {
    if (!deadlineMs) return;

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((deadlineMs - now) / 1000));
      setSecondsRemaining(diff);

      if (diff <= 0) {
        // Authoritative timeout: Trigger automatic submission
        autoSubmitRef.current?.();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [deadlineMs]);

  // Current Question Helpers
  const currentQuestion = questions[currentIndex] || null;
  const currentQId = currentQuestion?.id;
  const currentResponse = currentQId ? responses[currentQId] || {} : {};

  // Subject-relative index
  const { currentSubjectQuestionIndex, currentSubjectTotalQuestions } = useMemo(() => {
    if (!currentQuestion) return { currentSubjectQuestionIndex: 0, currentSubjectTotalQuestions: 0 };
    const currentSubj = currentQuestion.subject || "General";
    const subjQuestions = questions.filter((q) => (q.subject || "General") === currentSubj);
    const localIdx = subjQuestions.findIndex((q) => q.id === currentQuestion.id);
    return {
      currentSubjectQuestionIndex: localIdx >= 0 ? localIdx : 0,
      currentSubjectTotalQuestions: subjQuestions.length
    };
  }, [currentQuestion, questions]);

  // Navigation to arbitrary question index
  const navigateToQuestion = (index) => {
    if (index < 0 || index >= questions.length) return;
    const targetQ = questions[index];
    if (targetQ?.id) {
      setVisitedSet((prev) => new Set([...prev, targetQ.id]));
    }
    if (targetQ?.subject) {
      setActiveSubject(targetQ.subject);
    }
    setCurrentIndex(index);
    setActiveRailView("questions");
  };

  // Switch to Subject
  const handleSelectSubject = (subj) => {
    setActiveSubject(subj);
    const targetIdx = questions.findIndex((q) => (q.subject || "General") === subj);
    if (targetIdx !== -1) {
      navigateToQuestion(targetIdx);
    }
  };

  // Option Selection Handler
  const handleSelectOption = (optId) => {
    if (!currentQId) return;
    setResponses((prev) => ({
      ...prev,
      [currentQId]: {
        ...prev[currentQId],
        selectedAnswer: optId
      }
    }));
  };

  // Clear Response Handler
  const handleClearResponse = async () => {
    if (!currentQId) return;
    const updated = {
      ...responses[currentQId],
      selectedAnswer: null
    };

    setResponses((prev) => ({
      ...prev,
      [currentQId]: updated
    }));

    // Persist clear state to Firestore
    setSaveStatus("saving");
    try {
      await saveResponse(attemptId, currentQId, updated);
      setSaveStatus("saved");
    } catch (err) {
      console.error(err);
      setSaveStatus("error");
    }
  };

  // Mark for Review & Next Handler
  const handleToggleReview = async () => {
    if (!currentQId) return;
    const isCurrentlyMarked = !!currentResponse.markedForReview;
    const updated = {
      ...currentResponse,
      markedForReview: !isCurrentlyMarked
    };

    setResponses((prev) => ({
      ...prev,
      [currentQId]: updated
    }));

    setSaveStatus("saving");
    try {
      await saveResponse(attemptId, currentQId, updated);
      setSaveStatus("saved");
    } catch (err) {
      console.error("Review toggle error:", err);
      setSaveStatus("error");
    }
  };

  // Save & Next Handler
  const handleSaveAndNext = async () => {
    if (!currentQId) return;

    setSaveStatus("saving");
    try {
      await saveResponse(attemptId, currentQId, currentResponse);
      setSaveStatus("saved");
    } catch (err) {
      console.error(err);
      setSaveStatus("error");
    }

    if (currentIndex < questions.length - 1) {
      navigateToQuestion(currentIndex + 1);
    } else {
      toast.info("You have reached the final question. Review responses or submit.");
    }
  };

  // Next Question Button Handler
  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      navigateToQuestion(currentIndex + 1);
    }
  };

  // Previous Question Button Handler
  const handlePreviousQuestion = () => {
    if (currentIndex > 0) {
      navigateToQuestion(currentIndex - 1);
    }
  };

  // Debounced Notepad Auto-Save Handler
  const handleChangeNotes = (newText) => {
    setNotes(newText);
    setNotesSaveState("saving");
    localStorage.setItem(`qm_notes_${attemptId}`, newText);

    if (notesTimerRef.current) {
      clearTimeout(notesTimerRef.current);
    }

    notesTimerRef.current = setTimeout(async () => {
      try {
        await saveAttemptNotes(attemptId, newText);
        setNotesSaveState("saved");
      } catch (err) {
        console.error("Notes save error:", err);
      }
    }, 1200);
  };

  const handleClearNotes = async () => {
    setNotes("");
    localStorage.removeItem(`qm_notes_${attemptId}`);
    try {
      await saveAttemptNotes(attemptId, "");
      setNotesSaveState("saved");
    } catch (err) {
      console.error(err);
    }
  };

  // Final Submission Handler
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await submitAttempt(attemptId, responses, test, userProfile);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      toast.success("Examination submitted successfully!");
      setShowSubmitModal(false);
      const targetId = result.resultId || attemptId;
      navigate(`/student/results/${targetId}`);
    } catch (err) {
      console.error("Submission error:", err);
      toast.error(err.message || "Failed to finalize test submission.");
      setIsSubmitting(false);
    }
  };

  // Auto-Submit on Deadline Expiry
  const handleAutoSubmit = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    toast.info("Time limit reached! Authoritative auto-submission in progress...");
    try {
      const result = await submitAttempt(attemptId, responses, test, userProfile);
      const targetId = result?.resultId || attemptId;
      navigate(`/student/results/${targetId}`);
    } catch (err) {
      console.error("Auto submit error:", err);
    }
  }, [attemptId, responses, test, userProfile, isSubmitting, navigate, toast]);

  autoSubmitRef.current = handleAutoSubmit;

  // Loading State
  if (!attempt || !test || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F8FC]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#0B63F6] animate-spin" />
          <p className="text-xs font-bold text-[#52627F]">
            Initializing examination environment...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F8FC] flex flex-col select-none antialiased">
      {/* 1. TOP EXAM HEADER (Matches reference image) */}
      <ExamHeader
        test={test}
        secondsRemaining={secondsRemaining}
        saveStatus={saveStatus}
        onSubmitClick={() => setShowSubmitModal(true)}
        subjectsList={subjects}
        totalQuestions={questions.length}
      />

      {/* 2. DESKTOP MAIN EXAM WORKSPACE */}
      <div className="hidden lg:flex flex-1 p-4 sm:p-5 gap-4 max-w-[1600px] w-full mx-auto min-h-0 items-start">
        {/* LEFT UTILITY RAIL (Matches reference image) */}
        <ExamSidebar
          activeView={activeRailView}
          onSelectView={setActiveRailView}
          onOpenCalculator={() => setShowCalculator(true)}
          onOpenNotepad={() => {
            const notepadEl = document.getElementById("notepad-panel");
            if (notepadEl) notepadEl.scrollIntoView({ behavior: "smooth" });
          }}
          onOpenQuestionPaper={() => setShowQuestionPaper(true)}
          onOpenInstructions={() => setShowInstructions(true)}
          onOpenAnalysis={() => setShowAnalysis(true)}
        />

        {/* CENTER CONTENT COLUMN */}
        <main className="flex-1 flex flex-col gap-4 min-w-0">
          {/* SUBJECT NAVIGATION TABS (Row 1) */}
          <SubjectTabs
            subjects={subjects}
            activeSubject={activeSubject}
            onSelectSubject={handleSelectSubject}
            subjectQuestionCounts={subjectQuestionCounts}
          />

          {/* MAIN QUESTION PANEL (Row 2) */}
          <QuestionPanel
            question={currentQuestion}
            currentIndex={currentIndex}
            totalQuestions={questions.length}
            currentSubjectQuestionIndex={currentSubjectQuestionIndex}
            currentSubjectTotalQuestions={currentSubjectTotalQuestions}
            currentResponse={currentResponse}
            onSelectOption={handleSelectOption}
            onClearResponse={handleClearResponse}
            onToggleReview={handleToggleReview}
            onPrevious={handlePreviousQuestion}
            onSaveAndNext={handleSaveAndNext}
            onNext={handleNextQuestion}
            canGoPrevious={currentIndex > 0}
            canGoNext={currentIndex < questions.length - 1}
            saveStatus={saveStatus}
          />

          {/* 3 BOTTOM SUPPORTING PANELS (Row 3, Exact Match with Reference Image) */}
          <div className="grid grid-cols-3 gap-4" id="notepad-panel">
            {/* 1. Question Information Card */}
            <QuestionInformation question={currentQuestion} />

            {/* 2. Persistent Autosaved Notepad Card */}
            <ExamNotepad
              notes={notes}
              onChangeNotes={handleChangeNotes}
              onClearNotes={handleClearNotes}
              saveState={notesSaveState}
            />

            {/* 3. Quick Navigation Card */}
            <QuickNavigation
              onPrevious={handlePreviousQuestion}
              onNext={handleNextQuestion}
              canGoPrevious={currentIndex > 0}
              canGoNext={currentIndex < questions.length - 1}
              subjects={subjects}
              activeSubject={activeSubject}
              onSelectSubject={handleSelectSubject}
              subjectStats={subjectStats}
            />
          </div>
        </main>

        {/* RIGHT COLUMN: QUESTION PALETTE & INSTRUCTIONS */}
        <aside className="w-[330px] shrink-0 self-stretch flex flex-col">
          <QuestionPalette
            questions={questions}
            currentIndex={currentIndex}
            responses={responses}
            visitedSet={visitedSet}
            subjects={subjects}
            activeSubject={activeSubject}
            onSelectSubject={handleSelectSubject}
            onNavigateToQuestion={navigateToQuestion}
            activeTab={paletteTab}
            onTabChange={(tab) => {
              setPaletteTab(tab);
              if (tab === "instructions") {
                setShowInstructions(true);
              }
            }}
          />
        </aside>
      </div>

      {/* 3. MOBILE EXAM WORKSPACE (Matches right-hand phone view in reference image) */}
      <div className="lg:hidden flex-1 flex flex-col p-3 pb-20 space-y-3">
        {/* Mobile Test Title Bar */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#DCE5F0] space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-[#111C3A]">
                {test.title}
              </span>
              <span className="inline-flex items-center gap-1 bg-[#DCFCE7] text-[#15803D] text-[10px] font-semibold px-2 py-0.5 rounded-full border border-[#86EFAC]">
                Live
              </span>
            </div>
          </div>

          <p className="text-[11px] text-[#52627F]">
            {questions.length} Questions | {test.durationMinutes || 180} Mins | +{test.markingScheme?.positiveMarks ?? 4} / -{test.markingScheme?.negativeMarks ?? 1}
          </p>

          {/* Timer and Submit Button Row */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F0F6FF] border border-[#BFDBFE] text-[#0B63F6] flex-1">
              <Clock className="w-4 h-4 text-[#0B63F6]" />
              <div className="flex items-baseline gap-1.5">
                <span className="text-[10px] uppercase font-semibold text-[#52627F]">Time Left</span>
                <span className="text-sm font-black font-mono">
                  {secondsRemaining !== null ? formatTimeRemaining(secondsRemaining) : "--:--:--"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowSubmitModal(true)}
              className="bg-[#F43F5E] text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs"
            >
              Submit
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Subject Tabs */}
        <SubjectTabs
          subjects={subjects}
          activeSubject={activeSubject}
          onSelectSubject={handleSelectSubject}
          subjectQuestionCounts={subjectQuestionCounts}
        />

        {/* Mobile Question Card */}
        <div className="bg-white rounded-2xl border border-[#DCE5F0] p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#DCE5F0]">
            <button
              type="button"
              onClick={handlePreviousQuestion}
              disabled={currentIndex === 0}
              className="p-1.5 rounded-lg border border-[#DCE5F0] disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-bold text-[#111C3A]">
              Q {currentSubjectQuestionIndex + 1} of {currentSubjectTotalQuestions}
            </span>

            <button
              type="button"
              onClick={handleToggleReview}
              className={`p-1.5 rounded-lg border ${
                currentResponse.markedForReview
                  ? "bg-[#FAF5FF] border-[#DDD6FE] text-[#8B5CF6]"
                  : "border-[#DCE5F0] text-[#52627F]"
              }`}
            >
              <Bookmark className={`w-4 h-4 ${currentResponse.markedForReview ? "fill-[#8B5CF6]" : ""}`} />
            </button>

            <button
              type="button"
              onClick={handleNextQuestion}
              disabled={currentIndex === questions.length - 1}
              className="p-1.5 rounded-lg border border-[#DCE5F0] disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Question Text */}
          <div className="text-sm font-medium text-[#111C3A] leading-relaxed">
            <MathRenderer text={currentQuestion?.questionText} />
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQuestion?.options?.map((opt) => {
              const isSelected = currentResponse.selectedAnswer === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer text-xs ${
                    isSelected
                      ? "bg-[#EFF6FF] border-2 border-[#0B63F6] font-semibold text-[#0B63F6]"
                      : "bg-white border-[#DCE5F0] text-[#111C3A]"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected ? "border-[#0B63F6] bg-white" : "border-[#DCE5F0]"
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-[#0B63F6]" />}
                  </div>
                  <span className="w-5 h-5 rounded-full bg-[#F8FAFC] border border-[#DCE5F0] flex items-center justify-center font-bold text-[10px] shrink-0">
                    {opt.id}
                  </span>
                  <span>{opt.text}</span>
                </div>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#DCE5F0]">
            <button
              type="button"
              onClick={handleClearResponse}
              disabled={!currentResponse.selectedAnswer}
              className="border border-[#DCE5F0] text-[#52627F] text-xs font-semibold px-4 py-2 rounded-xl"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={handleSaveAndNext}
              className="bg-[#0B63F6] text-white text-xs font-bold px-6 py-2 rounded-xl"
            >
              Save & Next
            </button>
          </div>
        </div>

        {/* Mobile Question Palette Accordion */}
        <div className="bg-white rounded-2xl border border-[#DCE5F0] p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#111C3A]">
              Question Palette
            </span>
            <span className="text-[11px] text-[#52627F]">
              {activeSubject} ({subjectQuestionCounts[activeSubject] || 0})
            </span>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {questions
              .map((q, idx) => ({ q, idx }))
              .filter(({ q }) => (q.subject || "General") === activeSubject)
              .map(({ q, idx }, localIdx) => {
                const resp = responses[q.id];
                const isVisited = visitedSet.has(q.id) || !!resp;
                const hasAnswer = resp?.selectedAnswer !== undefined && resp?.selectedAnswer !== null && resp?.selectedAnswer !== "";
                const isMarked = !!resp?.markedForReview;

                let btnStyle = "bg-[#F1F5F9] text-[#52627F] border border-[#E2E8F0]";
                if (hasAnswer && isMarked) {
                  btnStyle = "bg-[#A78BFA] text-white font-bold border-2 border-[#8B5CF6]";
                } else if (isMarked) {
                  btnStyle = "bg-[#8B5CF6] text-white font-bold";
                } else if (hasAnswer) {
                  btnStyle = "bg-[#25A56A] text-white font-bold";
                } else if (isVisited) {
                  btnStyle = "bg-white text-[#111C3A] font-bold border border-[#CBD5E1]";
                }

                if (idx === currentIndex) {
                  btnStyle += " ring-2 ring-offset-1 ring-[#0B63F6] scale-105";
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => navigateToQuestion(idx)}
                    className={`h-8 rounded-lg text-xs font-bold transition-all ${btnStyle}`}
                  >
                    {localIdx + 1}
                  </button>
                );
              })}
          </div>
        </div>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <ExamMobileNavigation
        activeTab={activeRailView}
        onSelectTab={setActiveRailView}
        onOpenCalculator={() => setShowCalculator(true)}
        onOpenNotepad={() => setShowAnalysis(true)}
        onOpenQuestionPaper={() => setShowQuestionPaper(true)}
        onOpenMore={() => setShowInstructions(true)}
      />

      {/* 4. MODALS & EXAM UTILITIES */}
      {/* On-Screen Calculator */}
      <ExamCalculator
        isOpen={showCalculator}
        onClose={() => setShowCalculator(false)}
      />

      {/* Instructions Modal */}
      <ExamInstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        test={test}
      />

      {/* Question Paper Overview Modal */}
      <QuestionPaperModal
        isOpen={showQuestionPaper}
        onClose={() => setShowQuestionPaper(false)}
        questions={questions}
        subjects={subjects}
        responses={responses}
        onJumpToQuestion={navigateToQuestion}
      />

      {/* Live Exam Analysis Modal */}
      <ExamAnalysisModal
        isOpen={showAnalysis}
        onClose={() => setShowAnalysis(false)}
        totalQuestions={questions.length}
        answeredCount={summaryCounts.answered}
        unansweredCount={summaryCounts.unanswered}
        markedCount={summaryCounts.marked}
        secondsRemaining={secondsRemaining}
        durationMinutes={test.durationMinutes || 180}
        subjectStats={subjectStats}
      />

      {/* Submission Confirmation Dialog */}
      <ExamSubmitDialog
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onConfirmSubmit={handleFinalSubmit}
        isSubmitting={isSubmitting}
        totalQuestions={questions.length}
        answeredCount={summaryCounts.answered}
        unansweredCount={summaryCounts.unanswered}
        markedCount={summaryCounts.marked}
        secondsRemaining={secondsRemaining}
      />
    </div>
  );
}
