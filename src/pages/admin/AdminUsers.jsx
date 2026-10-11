import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import {
  PERMISSION_MODULES,
  ALL_PERMISSION_IDS,
  DEFAULT_ADMIN_PERMISSIONS
} from "../../constants/permissions";
import {
  getAdminStaffMembers,
  createAdminStaffMember,
  updateAdminStaffPermissions,
  toggleAdminStaffStatus,
  sendStaffPasswordResetEmail
} from "../../services/firebase/adminStaffService";
import {
  ShieldCheck,
  UserPlus,
  Key,
  Search
} from "lucide-react";

export default function AdminUsers() {
  const [adminUsers, setAdminUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Provision Modal
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newConfirmPassword, setNewConfirmPassword] = useState("");
  const [newRole, setNewRole] = useState("admin");
  const [newRoleTitle, setNewRoleTitle] = useState("Administrator");
  const [newPermissions, setNewPermissions] = useState([...DEFAULT_ADMIN_PERMISSIONS]);
  const [newStatus, setNewStatus] = useState("active");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Permissions Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [editRole, setEditRole] = useState("admin");
  const [editRoleTitle, setEditRoleTitle] = useState("Administrator");
  const [editPermissions, setEditPermissions] = useState([]);
  const [editStatus, setEditStatus] = useState("active");
  const [isUpdating, setIsUpdating] = useState(false);

  const { currentUser, userProfile } = useAuth();
  const toast = useToast();

  const loadStaff = async () => {
    setLoading(true);
    try {
      const list = await getAdminStaffMembers();
      setAdminUsers(list || []);
    } catch (err) {
      console.error("Failed to load admin staff:", err);
      toast.error("Failed to fetch administrative users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const handleRoleChange = (roleVal, isEdit = false) => {
    let title = "Administrator";
    let defaultPerms = [...DEFAULT_ADMIN_PERMISSIONS];

    if (roleVal === "manager") {
      title = "Exam Manager";
      defaultPerms = [
        "dashboard.view",
        "questions.view",
        "questions.create",
        "questions.edit",
        "sets.view",
        "sets.manage",
        "exams.view",
        "exams.create",
        "exams.edit",
        "exams.publish",
        "attempts.view",
        "attempts.intervene"
      ];
    } else if (roleVal === "evaluator") {
      title = "Evaluator";
      defaultPerms = [
        "dashboard.view",
        "attempts.view",
        "results.view",
        "results.evaluate",
        "results.publish"
      ];
    } else if (roleVal === "support") {
      title = "Support Staff";
      defaultPerms = [
        "dashboard.view",
        "students.view",
        "attempts.view",
        "notifications.manage"
      ];
    } else if (roleVal === "admin") {
      title = "Administrator";
      defaultPerms = [...DEFAULT_ADMIN_PERMISSIONS];
    }

    if (isEdit) {
      setEditRole(roleVal);
      setEditRoleTitle(title);
      setEditPermissions(defaultPerms);
    } else {
      setNewRole(roleVal);
      setNewRoleTitle(title);
      setNewPermissions(defaultPerms);
    }
  };

  const togglePermission = (permId, isEdit = false) => {
    if (isEdit) {
      setEditPermissions((prev) =>
        prev.includes(permId) ? prev.filter((p) => p !== permId) : [...prev, permId]
      );
    } else {
      setNewPermissions((prev) =>
        prev.includes(permId) ? prev.filter((p) => p !== permId) : [...prev, permId]
      );
    }
  };

  const toggleModulePermissions = (module, isEdit = false) => {
    const modulePermIds = module.permissions.map((p) => p.id);
    const currentList = isEdit ? editPermissions : newPermissions;
    const allSelected = modulePermIds.every((id) => currentList.includes(id));

    let updated;
    if (allSelected) {
      updated = currentList.filter((id) => !modulePermIds.includes(id));
    } else {
      updated = Array.from(new Set([...currentList, ...modulePermIds]));
    }

    if (isEdit) setEditPermissions(updated);
    else setNewPermissions(updated);
  };

  const handleSelectAll = (isEdit = false) => {
    if (isEdit) setEditPermissions([...ALL_PERMISSION_IDS]);
    else setNewPermissions([...ALL_PERMISSION_IDS]);
  };

  const handleClearAll = (isEdit = false) => {
    if (isEdit) setEditPermissions([]);
    else setNewPermissions([]);
  };

  // Submit new admin
  const handleProvisionStaff = async (e) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim() || !newPassword) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== newConfirmPassword) {
      toast.error("Password confirmation does not match.");
      return;
    }

    if (newPermissions.length === 0) {
      toast.error("At least one permission must be granted to the administrator.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createAdminStaffMember(
        {
          fullName: newName.trim(),
          email: newEmail.trim(),
          password: newPassword,
          role: newRole,
          roleTitle: newRoleTitle,
          permissions: newPermissions,
          accountStatus: newStatus
        },
        userProfile || { uid: currentUser?.uid, email: currentUser?.email }
      );

      toast.success(`Staff account for ${newName} provisioned successfully!`);
      setInviteModalOpen(false);
      setNewName("");
      setNewEmail("");
      setNewPassword("");
      setNewConfirmPassword("");
      setNewPermissions([...DEFAULT_ADMIN_PERMISSIONS]);
      await loadStaff();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to provision administrator.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open edit modal
  const handleOpenEdit = (staff) => {
    const isTargetSuperAdmin = staff.role === "super_admin";

    setSelectedStaff(staff);
    setEditRole(staff.role || "admin");
    setEditRoleTitle(staff.roleTitle || "Administrator");
    setEditPermissions(
      isTargetSuperAdmin
        ? [...ALL_PERMISSION_IDS]
        : Array.isArray(staff.permissions)
        ? [...staff.permissions]
        : [...DEFAULT_ADMIN_PERMISSIONS]
    );
    setEditStatus(staff.accountStatus || "active");
    setEditModalOpen(true);
  };

  // Save edited permissions
  const handleSaveEdit = async () => {
    if (!selectedStaff) return;

    if (editPermissions.length === 0 && editRole !== "super_admin") {
      toast.error("At least one permission must be granted.");
      return;
    }

    setIsUpdating(true);
    try {
      await updateAdminStaffPermissions(
        selectedStaff.id || selectedStaff.uid,
        {
          role: editRole,
          roleTitle: editRoleTitle,
          permissions: editPermissions,
          accountStatus: editStatus
        },
        userProfile || { uid: currentUser?.uid, email: currentUser?.email }
      );

      toast.success(`Permissions updated for ${selectedStaff.fullName || selectedStaff.displayName}!`);
      setEditModalOpen(false);
      setSelectedStaff(null);
      await loadStaff();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update permissions.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Toggle status
  const handleToggleStatus = async (staff) => {
    const isTargetSuperAdmin = staff.role === "super_admin";

    if (isTargetSuperAdmin) {
      toast.error("The root Super Admin account cannot be suspended.");
      return;
    }

    const nextStatus = staff.accountStatus === "inactive" ? "active" : "inactive";
    try {
      await toggleAdminStaffStatus(
        staff.id || staff.uid,
        nextStatus,
        userProfile || { uid: currentUser?.uid, email: currentUser?.email }
      );
      toast.success(
        `Staff account ${staff.fullName} is now ${nextStatus === "active" ? "Activated" : "Suspended"}.`
      );
      await loadStaff();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to change account status.");
    }
  };

  // Send Password Reset
  const handleSendReset = async (staff) => {
    try {
      await sendStaffPasswordResetEmail(staff.email);
      toast.success(`Password reset email dispatched to ${staff.email}.`);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to send reset email.");
    }
  };

  // Filtered users
  const filteredUsers = adminUsers.filter((u) => {
    const nameMatch = (u.fullName || u.displayName || "").toLowerCase().includes(searchQuery.toLowerCase());
    const emailMatch = (u.email || "").toLowerCase().includes(searchQuery.toLowerCase());
    const queryMatch = nameMatch || emailMatch;

    const roleMatch = roleFilter === "all" || u.role === roleFilter;
    const statusMatch = statusFilter === "all" || (u.accountStatus || "active") === statusFilter;

    return queryMatch && roleMatch && statusMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E5EAF2] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#EFF6FF] text-[#2563EB]">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider">
              Governance & Security
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#172B4D] tracking-tight">
            Admin Users & Feature Access Control
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Super Admin center to provision administrators, configure role tiers, and control feature-level permissions.
          </p>
        </div>

        <Button icon={UserPlus} size="sm" onClick={() => setInviteModalOpen(true)}>
          Provision Administrator
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E5EAF2] rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search administrators by name or email..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl outline-none focus:border-[#2563EB] text-[#172B4D]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl outline-none focus:border-[#2563EB] text-[#172B4D] font-medium"
          >
            <option value="all">All Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin">Administrator</option>
            <option value="manager">Exam Manager</option>
            <option value="evaluator">Evaluator</option>
            <option value="support">Support Staff</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl outline-none focus:border-[#2563EB] text-[#172B4D] font-medium"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Suspended</option>
          </select>
        </div>
      </div>

      {/* Staff Members List */}
      <div className="bg-white border border-[#E5EAF2] rounded-2xl overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-[#F1F5F9] flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#172B4D]">Authorized Personnel Roster</h3>
          <span className="text-xs font-semibold text-[#64748B]">
            {filteredUsers.length} of {adminUsers.length} Staff Accounts
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-[#64748B]">
            Loading administrative personnel...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#64748B]">
            No administrators match the selected filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#F1F5F9] bg-[#F8FAFC] text-[11px] font-bold text-[#64748B]">
                  <th className="py-3 px-4">Staff Member</th>
                  <th className="py-3 px-4">Role Tier</th>
                  <th className="py-3 px-4">Feature Permissions</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8FAFC] text-xs">
                {filteredUsers.map((u) => {
                  const isSuper = u.role === "super_admin";
                  const permCount = isSuper
                    ? ALL_PERMISSION_IDS.length
                    : Array.isArray(u.permissions)
                    ? u.permissions.length
                    : 0;

                  return (
                    <tr key={u.id} className="hover:bg-[#F8FAFD] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                              isSuper
                                ? "bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]"
                                : "bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]"
                            }`}
                          >
                            {(u.fullName || u.displayName || u.email || "A").slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-[#172B4D]">
                                {u.fullName || u.displayName || "Administrator"}
                              </p>
                              {isSuper && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] bg-[#FEF3C7] text-[#B45309] font-black border border-[#FDE68A]">
                                  Super Admin
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-[#64748B]">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isSuper
                              ? "bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]"
                              : "bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]"
                          }`}
                        >
                          {u.roleTitle || (u.role === "admin" ? "Administrator" : u.role)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#172B4D]">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
                          {isSuper
                            ? "All 26 Features (Full Platform)"
                            : `${permCount} of 26 Features`}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            u.accountStatus === "inactive"
                              ? "bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]"
                              : "bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]"
                          }`}
                        >
                          {u.accountStatus === "inactive" ? "Suspended" : "Active"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1.5">
                        <button
                          onClick={() => handleOpenEdit(u)}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#F6F8FC] border border-[#E5EAF2] hover:bg-[#EFF6FF] text-[#172B4D] transition-colors cursor-pointer"
                          title="Configure feature permissions and role"
                        >
                          Edit Permissions
                        </button>

                        {!isSuper && (
                          <button
                            onClick={() => handleToggleStatus(u)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                              u.accountStatus === "inactive"
                                ? "bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0] hover:bg-[#DCFCE7]"
                                : "bg-[#FEF2F2] text-[#DC2626] border-[#FECACA] hover:bg-[#FEE2E2]"
                            }`}
                            title={u.accountStatus === "inactive" ? "Reactivate administrator" : "Suspend administrator"}
                          >
                            {u.accountStatus === "inactive" ? "Activate" : "Suspend"}
                          </button>
                        )}

                        <button
                          onClick={() => handleSendReset(u)}
                          className="p-1 rounded-lg text-[#64748B] hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-colors"
                          title="Send Password Reset Email"
                        >
                          <Key className="w-3.5 h-3.5 inline" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Provision Staff Modal */}
      {inviteModalOpen && (
        <Modal
          isOpen={inviteModalOpen}
          onClose={() => setInviteModalOpen(false)}
          title="Provision New Administrator"
        >
          <form onSubmit={handleInviteAdmin || handleProvisionStaff} className="space-y-4 text-xs max-h-[80vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#172B4D] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Dr. Rajesh Sharma"
                  className="w-full px-3 py-2 text-xs bg-[#F6F8FC] border border-[#E5EAF2] rounded-xl outline-none focus:border-[#2563EB] text-[#172B4D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172B4D] mb-1">
                  Work Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. rajesh@quizmaster.com"
                  className="w-full px-3 py-2 text-xs bg-[#F6F8FC] border border-[#E5EAF2] rounded-xl outline-none focus:border-[#2563EB] text-[#172B4D]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#172B4D] mb-1">
                  Initial Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full px-3 py-2 text-xs bg-[#F6F8FC] border border-[#E5EAF2] rounded-xl outline-none focus:border-[#2563EB] text-[#172B4D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172B4D] mb-1">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newConfirmPassword}
                  onChange={(e) => setNewConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full px-3 py-2 text-xs bg-[#F6F8FC] border border-[#E5EAF2] rounded-xl outline-none focus:border-[#2563EB] text-[#172B4D]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#172B4D] mb-1">
                  Role Tier
                </label>
                <select
                  value={newRole}
                  onChange={(e) => handleRoleChange(e.target.value, false)}
                  className="w-full px-3 py-2 text-xs bg-[#F6F8FC] border border-[#E5EAF2] rounded-xl outline-none focus:border-[#2563EB] text-[#172B4D] font-medium"
                >
                  <option value="admin">Administrator (Full Admin Access)</option>
                  <option value="manager">Exam Manager (Tests & Schedule)</option>
                  <option value="evaluator">Evaluator (Results & Evaluation)</option>
                  <option value="support">Support Staff (Students & Alerts)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172B4D] mb-1">
                  Initial Account Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#F6F8FC] border border-[#E5EAF2] rounded-xl outline-none focus:border-[#2563EB] text-[#172B4D] font-medium"
                >
                  <option value="active">Active (Immediate Login Permitted)</option>
                  <option value="inactive">Suspended (Login Blocked)</option>
                </select>
              </div>
            </div>

            {/* Feature Permissions Matrix Selector */}
            <div className="border border-[#E2E8F0] rounded-xl p-3 bg-[#F8FAFC] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                <div>
                  <h4 className="text-xs font-bold text-[#172B4D]">Feature-Level Permissions</h4>
                  <p className="text-[10px] text-[#64748B]">
                    {newPermissions.length} of {ALL_PERMISSION_IDS.length} features selected
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectAll(false)}
                    className="text-[10px] font-bold text-[#2563EB] hover:underline"
                  >
                    Select All
                  </button>
                  <span className="text-[#CBD5E1]">|</span>
                  <button
                    type="button"
                    onClick={() => handleClearAll(false)}
                    className="text-[10px] font-bold text-[#DC2626] hover:underline"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {PERMISSION_MODULES.map((module) => {
                  const modulePermIds = module.permissions.map((p) => p.id);
                  const allInModule = modulePermIds.every((id) => newPermissions.includes(id));
                  const someInModule = modulePermIds.some((id) => newPermissions.includes(id));

                  return (
                    <div key={module.id} className="border border-[#E5EAF2] rounded-lg p-2.5 bg-white">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#172B4D]">
                          <input
                            type="checkbox"
                            checked={allInModule}
                            ref={(el) => {
                              if (el) el.indeterminate = someInModule && !allInModule;
                            }}
                            onChange={() => toggleModulePermissions(module, false)}
                            className="rounded text-[#2563EB]"
                          />
                          <span>{module.name}</span>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-5 pt-1">
                        {module.permissions.map((perm) => (
                          <label
                            key={perm.id}
                            className="flex items-start gap-1.5 cursor-pointer text-[11px] text-[#475569] hover:text-[#172B4D]"
                          >
                            <input
                              type="checkbox"
                              checked={newPermissions.includes(perm.id)}
                              onChange={() => togglePermission(perm.id, false)}
                              className="rounded text-[#2563EB] mt-0.5"
                            />
                            <span>{perm.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1F5F9]">
              <Button
                variant="secondary"
                size="sm"
                type="button"
                onClick={() => setInviteModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button size="sm" type="submit" loading={isSubmitting}>
                Provision Administrator
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Permissions Modal */}
      {editModalOpen && selectedStaff && (
        <Modal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title={`Edit Permissions — ${selectedStaff.fullName || selectedStaff.displayName}`}
        >
          <div className="space-y-4 text-xs max-h-[80vh] overflow-y-auto pr-1">
            <div className="p-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl text-[#1E40AF]">
              <p className="font-bold">Administrative Access Control</p>
              <p className="text-[11px] mt-0.5">
                Staff Email: <span className="font-mono font-bold">{selectedStaff.email}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#172B4D] mb-1">
                  Select Role Tier
                </label>
                <select
                  value={editRole}
                  disabled={selectedStaff.role === "super_admin"}
                  onChange={(e) => handleRoleChange(e.target.value, true)}
                  className="w-full px-3 py-2 text-xs bg-[#F6F8FC] border border-[#E5EAF2] rounded-xl outline-none focus:border-[#2563EB] text-[#172B4D] font-medium disabled:opacity-60"
                >
                  <option value="admin">Administrator</option>
                  <option value="manager">Exam Manager</option>
                  <option value="evaluator">Evaluator</option>
                  <option value="support">Support Staff</option>
                  {selectedStaff.role === "super_admin" && (
                    <option value="super_admin">Super Admin (Locked)</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172B4D] mb-1">
                  Account Status
                </label>
                <select
                  value={editStatus}
                  disabled={selectedStaff.role === "super_admin"}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#F6F8FC] border border-[#E5EAF2] rounded-xl outline-none focus:border-[#2563EB] text-[#172B4D] font-medium disabled:opacity-60"
                >
                  <option value="active">Active (Access Allowed)</option>
                  <option value="inactive">Suspended (Access Denied)</option>
                </select>
              </div>
            </div>

            {/* Feature Permissions Matrix Selector */}
            <div className="border border-[#E2E8F0] rounded-xl p-3 bg-[#F8FAFC] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                <div>
                  <h4 className="text-xs font-bold text-[#172B4D]">Granted Feature Permissions</h4>
                  <p className="text-[10px] text-[#64748B]">
                    {editPermissions.length} of {ALL_PERMISSION_IDS.length} features active
                  </p>
                </div>
                {selectedStaff.role !== "super_admin" && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSelectAll(true)}
                      className="text-[10px] font-bold text-[#2563EB] hover:underline"
                    >
                      Select All
                    </button>
                    <span className="text-[#CBD5E1]">|</span>
                    <button
                      type="button"
                      onClick={() => handleClearAll(true)}
                      className="text-[10px] font-bold text-[#DC2626] hover:underline"
                    >
                      Clear All
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {PERMISSION_MODULES.map((module) => {
                  const modulePermIds = module.permissions.map((p) => p.id);
                  const allInModule = modulePermIds.every((id) => editPermissions.includes(id));
                  const someInModule = modulePermIds.some((id) => editPermissions.includes(id));

                  return (
                    <div key={module.id} className="border border-[#E5EAF2] rounded-lg p-2.5 bg-white">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#172B4D]">
                          <input
                            type="checkbox"
                            checked={allInModule}
                            disabled={selectedStaff.role === "super_admin"}
                            ref={(el) => {
                              if (el) el.indeterminate = someInModule && !allInModule;
                            }}
                            onChange={() => toggleModulePermissions(module, true)}
                            className="rounded text-[#2563EB]"
                          />
                          <span>{module.name}</span>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-5 pt-1">
                        {module.permissions.map((perm) => (
                          <label
                            key={perm.id}
                            className="flex items-start gap-1.5 cursor-pointer text-[11px] text-[#475569] hover:text-[#172B4D]"
                          >
                            <input
                              type="checkbox"
                              checked={editPermissions.includes(perm.id)}
                              disabled={selectedStaff.role === "super_admin"}
                              onChange={() => togglePermission(perm.id, true)}
                              className="rounded text-[#2563EB] mt-0.5"
                            />
                            <span>{perm.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1F5F9]">
              <Button
                variant="secondary"
                size="sm"
                type="button"
                onClick={() => setEditModalOpen(false)}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                type="button"
                loading={isUpdating}
                onClick={handleSaveEdit}
              >
                Save Permissions
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
