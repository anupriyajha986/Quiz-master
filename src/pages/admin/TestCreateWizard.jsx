import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createTest, publishTest } from "../../services/firebase/testService";
import { getQuestions } from "../../services/firebase/questionService";
import { getQuestionSets } from "../../services/firebase/questionSetService";
import { getSubjects } from "../../services/firebase/subjectService";
import { useToast } from "../../context/ToastContext";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Badge from "../../components/common/Badge";
import {
  FileText,
  HelpCircle,
  Settings,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Send,
  Save,
  CheckSquare,
  Square,
  Search,
  Clock,
  ShieldCheck,
  AlertTriangle
} from "lucide-react";

export default function TestCreateWizard() {
  const [step, setStep] = useState(1);
  const [allQuestions, setAllQuestions] = useState([]);
  const [questionSets, setQuestionSets] = useState([]);
  const [subjectsList, setSubjectsList] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Wizard state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "HTML",
    instructions: "1. Read all questions thoroughly before answering.\n2. Negative marks are deducted for incorrect responses.\n3. The test submits automatically when the timer reaches zero.",
    questionIds: [],
    durationMinutes: 60,
    attemptLimit: 1,
    markingScheme: {
      positiveMarks: 4,
      negativeMarks: 1,
      unansweredMarks: 0
    },
    navigationSettings: {
      allowRevisit: true,
      reviewAllowed: true
    },
    resultSettings: {
      showResultImmediately: true,
      showLeaderboard: true,
      showExplanations: true
    }
  });

  const [questionFilter, setQuestionFilter] = useState("");
  const [selectedSetId, setSelectedSetId] = useState("");

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    async function loadResources() {
      try {
        const [qList, sList, subList] = await Promise.all([
          getQuestions(),
          getQuestionSets(),
          getSubjects("active")
        ]);
        setAllQuestions(qList);
        setQuestionSets(sList);
        setSubjectsList(subList);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load question resources.");
      } finally {
        setLoadingQuestions(false);
      }
    }
    loadResources();
  }, []);

  const handleApplyQuestionSet = (setId) => {
    setSelectedSetId(setId);
    if (!setId) return;
    const foundSet = questionSets.find((s) => s.id === setId);
    if (foundSet && foundSet.questionIds) {
      setFormData((prev) => ({
        ...prev,
        questionIds: Array.from(new Set([...prev.questionIds, ...foundSet.questionIds]))
      }));
      toast.success(`Appended ${foundSet.questionIds.length} questions from "${foundSet.title}".`);
    }
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

  const calculateMaxMarks = () => {
    return formData.questionIds.reduce((sum, qid) => {
      const q = allQuestions.find((item) => item.id === qid);
      return sum + (q?.positiveMarks || formData.markingScheme.positiveMarks || 4);
    }, 0);
  };

  const validateStep = (currentStep) => {
    if (currentStep === 1) {
      if (!formData.title.trim()) {
        toast.error("Please enter an examination title.");
        return false;
      }
      return true;
    }
    if (currentStep === 2) {
      if (formData.questionIds.length === 0) {
        toast.error("Please select at least 1 question for the examination.");
        return false;
      }
      return true;
    }
    if (currentStep === 3) {
      if (Number(formData.durationMinutes) <= 0) {
        toast.error("Duration must be at least 1 minute.");
        return false;
      }
      return true;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((s) => s + 1);
    }
  };

  const prevStep = () => {
    setStep((s) => s - 1);
  };

  const handleFinalize = async (publishImmediately = false) => {
    setActionLoading(true);
    try {
      const maxMarks = calculateMaxMarks();
      const testPayload = {
        ...formData,
        maximumMarks: maxMarks,
        publicationStatus: publishImmediately ? "published" : "draft"
      };

      const created = await createTest(testPayload);

      if (publishImmediately) {
        await publishTest(created.id);
        toast.success("Examination created and published successfully!");
      } else {
        toast.success("Examination saved as draft.");
      }

      navigate("/admin/tests");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save examination: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredBank = allQuestions.filter((q) => {
    if (!questionFilter) return true;
    const term = questionFilter.toLowerCase();
    return (
      q.questionText?.toLowerCase().includes(term) ||
      q.subject?.toLowerCase().includes(term) ||
      q.topic?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Step Indicator Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider">
              Step {step} of 4
            </span>
            <h1 className="text-xl font-black text-[#111827] mt-0.5">
              {step === 1 && "Basic Information"}
              {step === 2 && "Select Examination Questions"}
              {step === 3 && "Configure Timing & Marking Rules"}
              {step === 4 && "Review & Deploy Examination"}
            </h1>
          </div>
          <Badge variant="primary">QuizMaster Wizard</Badge>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-[#2563EB] h-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: BASIC INFORMATION */}
      {step === 1 && (
        <Card className="p-6 space-y-4">
          <Input
            label="Examination Title *"
            placeholder="e.g. Full-Stack JavaScript & React Certification Exam"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Subject / Category *"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              options={
                subjectsList.length > 0
                  ? subjectsList.map((s) => ({ value: s.name, label: s.name }))
                  : [
                      { value: "HTML", label: "HTML" },
                      { value: "CSS", label: "CSS" },
                      { value: "JavaScript", label: "JavaScript" },
                      { value: "Operating Systems", label: "Operating Systems" },
                      { value: "DBMS", label: "DBMS" },
                      { value: "COA", label: "COA" },
                      { value: "DSA", label: "DSA" },
                      { value: "Full Stack", label: "Full Stack Engineering" }
                    ]
              }
            />

            <Input
              label="Test Description"
              placeholder="e.g. Assessment covering core algorithms, system concepts, and development patterns"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#111827] block mb-1.5">
              Student Instructions & Rules *
            </label>
            <textarea
              className="w-full bg-white border border-[#E2E8F0] rounded-xl text-xs p-3 text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2563EB] font-sans leading-relaxed"
              rows={4}
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
            />
            <p className="text-[11px] text-[#64748B] mt-1">
              These guidelines appear on the candidate pre-exam instruction screen before starting the timer.
            </p>
          </div>
        </Card>
      )}

      {/* STEP 2: SELECT QUESTIONS */}
      {step === 2 && (
        <Card className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl text-xs">
            <span className="font-semibold text-[#1E40AF]">
              Selected: {formData.questionIds.length} Questions &bull; Estimated Max Marks: {calculateMaxMarks()}
            </span>

            {/* Quick Set Loader */}
            {questionSets.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#64748B]">Load from Set:</span>
                <select
                  value={selectedSetId}
                  onChange={(e) => handleApplyQuestionSet(e.target.value)}
                  className="bg-white border border-[#CBD5E1] rounded-lg text-xs px-2.5 py-1 text-[#111827]"
                >
                  <option value="">Select Question Set...</option>
                  {questionSets.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} ({s.questionCount} Qs)
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <Input
            icon={Search}
            placeholder="Search questions by text, topic or subject..."
            value={questionFilter}
            onChange={(e) => setQuestionFilter(e.target.value)}
          />

          <div className="max-h-96 overflow-y-auto border border-[#E2E8F0] rounded-xl divide-y divide-[#E2E8F0] bg-white">
            {filteredBank.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#64748B]">
                No questions found in repository.
              </div>
            ) : (
              filteredBank.map((q) => {
                const isSelected = formData.questionIds.includes(q.id);
                return (
                  <div
                    key={q.id}
                    onClick={() => handleToggleQuestion(q.id)}
                    className={`p-3.5 flex items-start gap-3 cursor-pointer text-xs transition-colors ${
                      isSelected ? "bg-[#EFF6FF]/70" : "hover:bg-[#F8FAFC]"
                    }`}
                  >
                    <button type="button" className="mt-0.5 text-[#2563EB] shrink-0">
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 fill-[#2563EB] text-white" />
                      ) : (
                        <Square className="w-4 h-4 text-[#94A3B8]" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#111827] font-medium leading-relaxed">
                        {q.questionText}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 text-[11px] text-[#64748B]">
                        <span className="font-semibold text-[#111827]">{q.subject}</span>
                        <span>&bull;</span>
                        <span>+{q.positiveMarks} / -{q.negativeMarks} marks</span>
                        <span>&bull;</span>
                        <span className="capitalize">{q.difficulty}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      )}

      {/* STEP 3: CONFIGURE SETTINGS */}
      {step === 3 && (
        <Card className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-[#111827] mb-3">
              1. Duration & Attempt Limits
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Examination Duration (Minutes) *"
                type="number"
                min="1"
                icon={Clock}
                value={formData.durationMinutes}
                onChange={(e) =>
                  setFormData({ ...formData, durationMinutes: Number(e.target.value) })
                }
                helperText="Authoritative server countdown timer duration"
              />

              <Input
                label="Maximum Allowed Attempts"
                type="number"
                min="1"
                value={formData.attemptLimit}
                onChange={(e) =>
                  setFormData({ ...formData, attemptLimit: Number(e.target.value) })
                }
                helperText="How many times a student can take this test"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#E2E8F0]">
            <h3 className="text-sm font-bold text-[#111827] mb-3">
              2. Default Marking Scheme
            </h3>
            <div className="grid grid-cols-3 gap-3 p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
              <Input
                label="Correct Answer (+)"
                type="number"
                value={formData.markingScheme.positiveMarks}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    markingScheme: {
                      ...formData.markingScheme,
                      positiveMarks: Number(e.target.value)
                    }
                  })
                }
              />
              <Input
                label="Incorrect Answer (-)"
                type="number"
                value={formData.markingScheme.negativeMarks}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    markingScheme: {
                      ...formData.markingScheme,
                      negativeMarks: Number(e.target.value)
                    }
                  })
                }
              />
              <Input
                label="Unanswered (0)"
                type="number"
                value={formData.markingScheme.unansweredMarks}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    markingScheme: {
                      ...formData.markingScheme,
                      unansweredMarks: Number(e.target.value)
                    }
                  })
                }
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#E2E8F0]">
            <h3 className="text-sm font-bold text-[#111827] mb-3">
              3. Navigation & Result Policies
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-2.5 text-xs text-[#111827] font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.navigationSettings.allowRevisit}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      navigationSettings: {
                        ...formData.navigationSettings,
                        allowRevisit: e.target.checked
                      }
                    })
                  }
                  className="rounded text-[#2563EB] focus:ring-[#2563EB]"
                />
                Allow candidates to revisit previous questions freely
              </label>

              <label className="flex items-center gap-2.5 text-xs text-[#111827] font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.resultSettings.showResultImmediately}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      resultSettings: {
                        ...formData.resultSettings,
                        showResultImmediately: e.target.checked
                      }
                    })
                  }
                  className="rounded text-[#2563EB] focus:ring-[#2563EB]"
                />
                Display instant scorecard upon submission
              </label>

              <label className="flex items-center gap-2.5 text-xs text-[#111827] font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.resultSettings.showExplanations}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      resultSettings: {
                        ...formData.resultSettings,
                        showExplanations: e.target.checked
                      }
                    })
                  }
                  className="rounded text-[#2563EB] focus:ring-[#2563EB]"
                />
                Include solution explanations on finalized scorecards
              </label>

              <label className="flex items-center gap-2.5 text-xs text-[#111827] font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.resultSettings.showLeaderboard}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      resultSettings: {
                        ...formData.resultSettings,
                        showLeaderboard: e.target.checked
                      }
                    })
                  }
                  className="rounded text-[#2563EB] focus:ring-[#2563EB]"
                />
                Enable public test leaderboard
              </label>
            </div>
          </div>
        </Card>
      )}

      {/* STEP 4: REVIEW & PUBLISH */}
      {step === 4 && (
        <Card className="p-6 space-y-6">
          <div className="p-4 bg-[#DCFCE7] border border-[#86EFAC] rounded-xl text-xs text-[#14532D] flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#16A34A] shrink-0" />
            <div>
              <p className="font-bold">Ready for Deployment</p>
              <p className="text-[11px] mt-0.5">
                Publishing will generate an immutable sanitized question snapshot and store secure answer keys in the backend vault.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-center">
            <div>
              <span className="text-[11px] text-[#64748B] block">Total Questions</span>
              <span className="text-base font-black text-[#111827]">
                {formData.questionIds.length}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[#64748B] block">Max Marks</span>
              <span className="text-base font-black text-[#16A34A]">
                {calculateMaxMarks()}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[#64748B] block">Duration</span>
              <span className="text-base font-black text-[#111827]">
                {formData.durationMinutes} mins
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[#64748B] block">Marking Scheme</span>
              <span className="text-base font-black text-[#111827]">
                +{formData.markingScheme.positiveMarks} / -{formData.markingScheme.negativeMarks}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-[#E2E8F0]">
              <span className="text-[#64748B]">Title:</span>
              <span className="font-semibold text-[#111827]">{formData.title}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#E2E8F0]">
              <span className="text-[#64748B]">Subject:</span>
              <span className="font-semibold text-[#111827]">{formData.subject}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#E2E8F0]">
              <span className="text-[#64748B]">Attempt Limit:</span>
              <span className="font-semibold text-[#111827]">{formData.attemptLimit} Attempt(s)</span>
            </div>
          </div>
        </Card>
      )}

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-2">
        {step > 1 ? (
          <Button variant="secondary" icon={ArrowLeft} onClick={prevStep}>
            Previous
          </Button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-3">
          {step < 4 ? (
            <Button icon={ArrowRight} onClick={nextStep}>
              Next Step
            </Button>
          ) : (
            <>
              <Button
                variant="secondary"
                icon={Save}
                loading={actionLoading}
                onClick={() => handleFinalize(false)}
              >
                Save as Draft
              </Button>
              <Button
                variant="success"
                icon={Send}
                loading={actionLoading}
                onClick={() => handleFinalize(true)}
              >
                Publish Examination Now
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
