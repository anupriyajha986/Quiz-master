import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getTests, updateTest } from "../../services/firebase/testService";
import { useToast } from "../../context/ToastContext";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  CalendarCheck,
  AlertCircle,
  FileText,
  MapPin,
  CheckCircle2
} from "lucide-react";

export default function ExamSchedule() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'calendar'
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [newScheduleDate, setNewScheduleDate] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const toast = useToast();

  const loadSchedule = async () => {
    setLoading(true);
    try {
      const data = await getTests("all");
      setTests(data || []);
    } catch (err) {
      console.error("Failed to load schedule:", err);
      toast.error("Failed to load exam schedule.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedule();
  }, []);

  const handleOpenReschedule = (test) => {
    setSelectedTest(test);
    setNewScheduleDate(test.scheduledDate || "");
    setRescheduleModalOpen(true);
  };

  const handleSaveReschedule = async () => {
    if (!newScheduleDate) {
      toast.error("Please specify a valid schedule date.");
      return;
    }
    setIsUpdating(true);
    try {
      await updateTest(selectedTest.id, {
        scheduledDate: newScheduleDate,
        updatedAt: new Date().toISOString()
      });
      toast.success(`Exam "${selectedTest.title}" rescheduled successfully!`);
      setRescheduleModalOpen(false);
      loadSchedule();
    } catch (err) {
      console.error(err);
      toast.error("Failed to reschedule examination.");
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredTests = tests.filter((t) => {
    const matchesSearch =
      t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && t.publicationStatus === "published") ||
      (statusFilter === "draft" && t.publicationStatus === "draft");
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white border border-[#E5EAF2] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#EFF6FF] text-[#2563EB]">
              <CalendarIcon className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider">
              Examination Timeline
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#172B4D] tracking-tight">
            Exam Schedule Management
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Monitor examination slots, schedule conflict checks, and timing rules.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex p-1 bg-[#F6F8FC] border border-[#E5EAF2] rounded-xl text-xs font-bold">
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === "list"
                  ? "bg-white text-[#2563EB] shadow-2xs"
                  : "text-[#64748B] hover:text-[#172B4D]"
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === "calendar"
                  ? "bg-white text-[#2563EB] shadow-2xs"
                  : "text-[#64748B] hover:text-[#172B4D]"
              }`}
            >
              Calendar View
            </button>
          </div>

          <Link to="/admin/tests/create">
            <Button icon={Plus} size="sm">
              Schedule Exam
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E5EAF2] rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search exam or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#F6F8FC] border border-[#E5EAF2] focus:border-[#2563EB] rounded-xl outline-none text-[#172B4D]"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-[#F6F8FC] border border-[#E5EAF2] rounded-xl text-[#172B4D] font-medium outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published Slots</option>
            <option value="draft">Draft Slots</option>
          </select>
        </div>
      </div>

      {/* List or Calendar View */}
      {viewMode === "list" ? (
        <div className="bg-white border border-[#E5EAF2] rounded-2xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#F1F5F9] bg-[#F8FAFC] text-[11px] font-bold text-[#64748B]">
                  <th className="py-3 px-4">Examination</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Scheduled Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8FAFC] text-xs">
                {filteredTests.length > 0 ? (
                  filteredTests.map((t) => (
                    <tr key={t.id} className="hover:bg-[#F8FAFD] transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#172B4D]">
                        {t.title}
                      </td>
                      <td className="py-3.5 px-4 text-[#64748B]">
                        {t.subject || "Combined"}
                      </td>
                      <td className="py-3.5 px-4 text-[#64748B]">
                        {t.durationMinutes ? `${t.durationMinutes} Mins` : "60 Mins"}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#172B4D]">
                        {t.scheduledDate || "Immediate / Open Window"}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            t.publicationStatus === "published"
                              ? "bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]"
                              : "bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]"
                          }`}
                        >
                          {t.publicationStatus === "published" ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenReschedule(t)}
                          className="px-2.5 py-1 rounded-lg bg-[#EFF6FF] text-[#2563EB] hover:bg-[#2563EB] hover:text-white font-bold text-xs transition-colors"
                        >
                          Reschedule
                        </button>
                        <Link
                          to={`/admin/tests`}
                          className="px-2.5 py-1 rounded-lg bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0] font-bold text-xs transition-colors"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-xs text-[#64748B]">
                      No scheduled examinations found matching the filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Calendar Grid View */
        <div className="bg-white border border-[#E5EAF2] rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
            <h3 className="font-bold text-sm text-[#172B4D]">
              October 2026 Examination Slots
            </h3>
            <span className="text-xs text-[#2563EB] font-bold">
              Standard Time (IST)
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-[#64748B] pb-2 border-b border-[#F8FAFC]">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {[...Array(31)].map((_, i) => {
              const day = i + 1;
              const hasTest = day === 11 || day === 15 || day === 20 || day === 22;
              return (
                <div
                  key={i}
                  className={`min-h-[72px] p-2 rounded-xl border text-left transition-all ${
                    hasTest
                      ? "bg-[#EFF6FF] border-[#BFDBFE]"
                      : "bg-[#F8FAFD] border-[#F1F5F9]"
                  }`}
                >
                  <span className={`text-[11px] font-bold ${hasTest ? "text-[#2563EB]" : "text-[#94A3B8]"}`}>
                    {day}
                  </span>
                  {hasTest && (
                    <div className="mt-1">
                      <span className="block px-1.5 py-0.5 rounded-md bg-[#2563EB] text-white text-[9px] font-bold truncate">
                        {day === 11 ? "JS Core Exam" : day === 20 ? "DSA Slot 01" : "OS & DBMS"}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleModalOpen && (
        <Modal
          isOpen={rescheduleModalOpen}
          onClose={() => setRescheduleModalOpen(false)}
          title={`Reschedule "${selectedTest?.title}"`}
        >
          <div className="space-y-4">
            <p className="text-xs text-[#64748B]">
              Changing the schedule date will update all upcoming attempt slots and notify registered students.
            </p>

            <div>
              <label className="block text-xs font-bold text-[#172B4D] mb-1">
                New Schedule Slot (Date / Window)
              </label>
              <input
                type="text"
                value={newScheduleDate}
                onChange={(e) => setNewScheduleDate(e.target.value)}
                placeholder="e.g. 24 Jan 2026, 10:00 AM"
                className="w-full px-3 py-2 text-xs bg-[#F6F8FC] border border-[#E5EAF2] rounded-xl outline-none focus:border-[#2563EB] text-[#172B4D]"
              />
            </div>

            <div className="p-3 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl text-xs text-[#92400E] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Ensure no existing attempts are active before changing schedules.</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1F5F9]">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setRescheduleModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                loading={isUpdating}
                onClick={handleSaveReschedule}
              >
                Save Schedule
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
