import React, { useState, useEffect } from "react";
import {
  getAllStudents,
  setStudentStatus,
  getStudentAttempts,
  createStudentByAdmin,
  updateStudent,
  deleteStudent
} from "../../services/firebase/studentService";
import { exportToCsv } from "../../utils/csvExport";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Badge from "../../components/common/Badge";
import Modal from "../../components/common/Modal";
import EmptyState from "../../components/common/EmptyState";
import { TableSkeleton } from "../../components/common/LoadingSkeleton";
import { formatDate } from "../../utils/formatters";
import {
  Users,
  Search,
  Download,
  UserCheck,
  UserX,
  History,
  GraduationCap,
  Building,
  Mail,
  Hash,
  Plus,
  UserPlus,
  Edit,
  Trash2
} from "lucide-react";

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // History modal
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentAttempts, setStudentAttempts] = useState([]);
  const [loadingAttempts, setLoadingAttempts] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Add student modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const initialNewStudent = {
    fullName: "",
    email: "",
    password: "",
    rollNumber: "",
    instituteName: "",
    phone: ""
  };
  const [newStudentData, setNewStudentData] = useState(initialNewStudent);

  // Edit student modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isUpdatingStudent, setIsUpdatingStudent] = useState(false);
  const [editStudentData, setEditStudentData] = useState({
    fullName: "",
    rollNumber: "",
    instituteName: "",
    phone: "",
    accountStatus: "active"
  });

  // Delete student modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingStudent, setDeletingStudent] = useState(null);
  const [isDeletingStudent, setIsDeletingStudent] = useState(false);

  const { currentUser, userProfile } = useAuth();
  const toast = useToast();

  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await getAllStudents({
        search,
        status: statusFilter
      });
      setStudents(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load student directory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [search, statusFilter]);

  const handleToggleStatus = async (student) => {
    const newStatus = student.accountStatus === "active" ? "inactive" : "active";
    const confirmMsg =
      newStatus === "inactive"
        ? `Deactivate ${student.fullName}? They will be blocked from starting examinations.`
        : `Activate ${student.fullName}?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      await setStudentStatus(student.uid, newStatus);
      toast.success(`Account marked as ${newStatus}.`);
      loadStudents();
    } catch (err) {
      toast.error("Failed to update student account status.");
    }
  };

  const handleViewHistory = async (student) => {
    setSelectedStudent(student);
    setIsHistoryOpen(true);
    setLoadingAttempts(true);
    try {
      const attempts = await getStudentAttempts(student.uid);
      setStudentAttempts(attempts);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load candidate attempt history.");
    } finally {
      setLoadingAttempts(false);
    }
  };

  const handleOpenAddModal = () => {
    setNewStudentData(initialNewStudent);
    setIsAddModalOpen(true);
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    if (!newStudentData.fullName.trim() || !newStudentData.email.trim() || !newStudentData.password.trim()) {
      toast.error("Please fill in candidate full name, email, and password.");
      return;
    }
    if (newStudentData.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setIsAddingStudent(true);
    try {
      await createStudentByAdmin(newStudentData, {
        adminUid: currentUser?.uid || "admin",
        adminEmail: currentUser?.email || "admin",
        adminName: userProfile?.fullName || currentUser?.displayName || "Administrator"
      });
      toast.success(`Candidate account for ${newStudentData.fullName} created successfully!`);
      setIsAddModalOpen(false);
      setNewStudentData(initialNewStudent);
      await loadStudents();
    } catch (err) {
      console.error("Failed to provision student:", err);
      toast.error(err.message || "Failed to create student account.");
    } finally {
      setIsAddingStudent(false);
    }
  };

  const handleOpenEditModal = (student) => {
    setEditingStudent(student);
    setEditStudentData({
      fullName: student.fullName || "",
      rollNumber: student.normalizedRollNumber || "",
      instituteName: student.instituteName || "",
      phone: student.phone || "",
      accountStatus: student.accountStatus || "active"
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    if (!editingStudent) return;
    if (!editStudentData.fullName.trim()) {
      toast.error("Candidate full name cannot be empty.");
      return;
    }

    setIsUpdatingStudent(true);
    try {
      await updateStudent(editingStudent.uid, editStudentData, {
        adminUid: currentUser?.uid || "admin",
        adminEmail: currentUser?.email || "admin",
        adminName: userProfile?.fullName || currentUser?.displayName || "Administrator"
      });
      toast.success(`Candidate details for ${editStudentData.fullName} updated successfully!`);
      setIsEditModalOpen(false);
      setEditingStudent(null);
      await loadStudents();
    } catch (err) {
      console.error("Failed to update student:", err);
      toast.error(err.message || "Failed to update candidate profile.");
    } finally {
      setIsUpdatingStudent(false);
    }
  };

  const handleOpenDeleteModal = (student) => {
    setDeletingStudent(student);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingStudent) return;
    setIsDeletingStudent(true);
    try {
      await deleteStudent(deletingStudent.uid, {
        adminUid: currentUser?.uid || "admin",
        adminEmail: currentUser?.email || "admin",
        adminName: userProfile?.fullName || currentUser?.displayName || "Administrator"
      });
      toast.success(`Candidate account for ${deletingStudent.fullName} removed.`);
      setIsDeleteModalOpen(false);
      setDeletingStudent(null);
      await loadStudents();
    } catch (err) {
      console.error("Failed to delete student:", err);
      toast.error(err.message || "Failed to delete student account.");
    } finally {
      setIsDeletingStudent(false);
    }
  };

  const handleExportCsv = () => {
    const headers = [
      { key: "fullName", label: "FullName" },
      { key: "normalizedRollNumber", label: "RollNumber" },
      { key: "email", label: "Email" },
      { key: "instituteName", label: "Institute" },
      { key: "phone", label: "Phone" },
      { key: "accountStatus", label: "Status" }
    ];
    exportToCsv("QuizMaster_Student_Directory.csv", students, headers);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-2xs">
        <div>
          <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider">
            Directory & Access Controls
          </span>
          <h1 className="text-2xl font-black text-[#111827] tracking-tight mt-0.5">
            Student Management
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Manage examinee accounts, roll number verifications, and attempt histories.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            icon={Download}
            size="sm"
            onClick={handleExportCsv}
          >
            Export Directory (CSV)
          </Button>
          <Button
            variant="primary"
            icon={UserPlus}
            size="sm"
            onClick={handleOpenAddModal}
          >
            Provision Student
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <Input
              icon={Search}
              placeholder="Search by student name, roll number, institute, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: "all", label: "All Account Statuses" },
              { value: "active", label: "Active Only" },
              { value: "inactive", label: "Inactive Only" }
            ]}
          />
        </div>
      </Card>

      {/* Students Table */}
      {loading ? (
        <TableSkeleton rows={5} cols={5} />
      ) : students.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Students Found"
          description="No student records match the specified search or filter criteria."
          actionText="Add First Student"
          actionIcon={Plus}
          onAction={handleOpenAddModal}
        />
      ) : (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Student Name</th>
                  <th className="px-4 py-3.5">Roll / Reg No.</th>
                  <th className="px-4 py-3.5">Email & Contact</th>
                  <th className="px-4 py-3.5">Institute</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {students.map((s) => (
                  <tr key={s.uid} className="hover:bg-[#F8FAFC]/60 transition-colors">
                    <td className="px-5 py-4 font-bold text-[#111827]">
                      {s.fullName}
                    </td>
                    <td className="px-4 py-4 font-mono font-medium text-[#2563EB]">
                      {s.normalizedRollNumber || "N/A"}
                    </td>
                    <td className="px-4 py-4 text-[#111827]">
                      <p>{s.email}</p>
                      <span className="text-[11px] text-[#64748B]">
                        {s.phone || "No phone"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-[#64748B] max-w-xs truncate">
                      {s.instituteName || "General Candidate"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Badge
                        variant={s.accountStatus === "active" ? "success" : "danger"}
                        size="xs"
                      >
                        {s.accountStatus?.toUpperCase() || "ACTIVE"}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleViewHistory(s)}
                          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-colors cursor-pointer"
                          title="View Exam History"
                        >
                          <History className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(s)}
                          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-colors cursor-pointer"
                          title="Edit Student Details"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(s)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            s.accountStatus === "active"
                              ? "text-[#DC2626] hover:bg-[#FEF2F2]"
                              : "text-[#16A34A] hover:bg-[#DCFCE7]"
                          }`}
                          title={s.accountStatus === "active" ? "Deactivate Account" : "Activate Account"}
                        >
                          {s.accountStatus === "active" ? (
                            <UserX className="w-4 h-4" />
                          ) : (
                            <UserCheck className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(s)}
                          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-colors cursor-pointer"
                          title="Delete Student Account"
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
        </div>
      )}

      {/* PROVISION STUDENT MODAL */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Provision New Candidate Account"
        >
          <form onSubmit={handleCreateStudent} className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">
                Candidate Full Name *
              </label>
              <input
                type="text"
                required
                value={newStudentData.fullName}
                onChange={(e) => setNewStudentData({ ...newStudentData, fullName: e.target.value })}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-3 py-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl outline-none focus:border-[#2563EB] text-[#111827]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={newStudentData.email}
                  onChange={(e) => setNewStudentData({ ...newStudentData, email: e.target.value })}
                  placeholder="e.g. rahul@example.com"
                  className="w-full px-3 py-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl outline-none focus:border-[#2563EB] text-[#111827]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Temporary Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newStudentData.password}
                  onChange={(e) => setNewStudentData({ ...newStudentData, password: e.target.value })}
                  placeholder="Min 6 characters"
                  className="w-full px-3 py-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl outline-none focus:border-[#2563EB] text-[#111827]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Roll / Registration No.
                </label>
                <input
                  type="text"
                  value={newStudentData.rollNumber}
                  onChange={(e) => setNewStudentData({ ...newStudentData, rollNumber: e.target.value })}
                  placeholder="e.g. 260310045"
                  className="w-full px-3 py-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl outline-none focus:border-[#2563EB] text-[#111827] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={newStudentData.phone}
                  onChange={(e) => setNewStudentData({ ...newStudentData, phone: e.target.value })}
                  placeholder="e.g. +91 9876543210"
                  className="w-full px-3 py-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl outline-none focus:border-[#2563EB] text-[#111827]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">
                Affiliated Institute / School
              </label>
              <input
                type="text"
                value={newStudentData.instituteName}
                onChange={(e) => setNewStudentData({ ...newStudentData, instituteName: e.target.value })}
                placeholder="e.g. Delhi Public School, R.K. Puram"
                className="w-full px-3 py-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl outline-none focus:border-[#2563EB] text-[#111827]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F1F5F9]">
              <Button
                variant="secondary"
                size="sm"
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                disabled={isAddingStudent}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                type="submit"
                loading={isAddingStudent}
              >
                Create Account & Provision
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* STUDENT HISTORY MODAL */}
      <Modal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        title={`${selectedStudent?.fullName} — Examination History`}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs">
            <span className="font-semibold text-[#111827]">
              Roll: {selectedStudent?.normalizedRollNumber || "N/A"}
            </span>
            <span className="text-[#64748B]">
              Institute: {selectedStudent?.instituteName || "N/A"}
            </span>
          </div>

          {loadingAttempts ? (
            <div className="p-8 text-center text-xs text-[#64748B]">
              Loading attempt logs...
            </div>
          ) : studentAttempts.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#64748B]">
              No examination attempts recorded for this candidate.
            </div>
          ) : (
            <div className="divide-y divide-[#E2E8F0] max-h-72 overflow-y-auto">
              {studentAttempts.map((att) => (
                <div key={att.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-[#111827]">{att.testTitle || att.testId}</p>
                    <p className="text-[11px] text-[#64748B]">
                      Started: {formatDate(att.startedAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={att.status === "submitted" ? "success" : "primary"}
                      size="xs"
                    >
                      {att.status?.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button variant="secondary" onClick={() => setIsHistoryOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* EDIT STUDENT MODAL */}
      {isEditModalOpen && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Edit Candidate — ${editingStudent?.fullName}`}
        >
          <form onSubmit={handleUpdateStudent} className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">
                Candidate Full Name *
              </label>
              <input
                type="text"
                required
                value={editStudentData.fullName}
                onChange={(e) => setEditStudentData({ ...editStudentData, fullName: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl outline-none focus:border-[#2563EB] text-[#111827]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Roll / Registration No.
                </label>
                <input
                  type="text"
                  value={editStudentData.rollNumber}
                  onChange={(e) => setEditStudentData({ ...editStudentData, rollNumber: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl outline-none focus:border-[#2563EB] text-[#111827] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={editStudentData.phone}
                  onChange={(e) => setEditStudentData({ ...editStudentData, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl outline-none focus:border-[#2563EB] text-[#111827]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">
                Affiliated Institute / School
              </label>
              <input
                type="text"
                value={editStudentData.instituteName}
                onChange={(e) => setEditStudentData({ ...editStudentData, instituteName: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl outline-none focus:border-[#2563EB] text-[#111827]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">
                Account Status
              </label>
              <select
                value={editStudentData.accountStatus}
                onChange={(e) => setEditStudentData({ ...editStudentData, accountStatus: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl outline-none focus:border-[#2563EB] text-[#111827]"
              >
                <option value="active">Active (Permitted to take exams)</option>
                <option value="inactive">Inactive / Suspended</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F1F5F9]">
              <Button
                variant="secondary"
                size="sm"
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                disabled={isUpdatingStudent}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                type="submit"
                loading={isUpdatingStudent}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Confirm Candidate Deletion"
        >
          <div className="space-y-4 text-xs text-[#111827]">
            <p>
              Are you sure you want to permanently delete candidate account for{" "}
              <strong className="text-[#DC2626]">{deletingStudent?.fullName}</strong> (
              {deletingStudent?.email})?
            </p>
            <p className="text-[#64748B]">
              This action will remove the candidate from the student directory. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F1F5F9]">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeletingStudent}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleConfirmDelete}
                loading={isDeletingStudent}
              >
                Permanently Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
