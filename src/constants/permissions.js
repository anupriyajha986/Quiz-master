/**
 * Centralized Role-Based Access Control (RBAC) Permissions Catalog
 * Exactly maps the 26 platform permissions defined in QuizMaster specification.
 */

export const PERMISSION_MODULES = [
  {
    id: "dashboard",
    name: "Dashboard & Overview",
    permissions: [
      { id: "dashboard.view", label: "View Dashboard", desc: "View permitted dashboard overview and KPI metrics" }
    ]
  },
  {
    id: "questions",
    name: "Question Bank",
    permissions: [
      { id: "questions.view", label: "View Questions", desc: "View authorized question repository records" },
      { id: "questions.create", label: "Create Questions", desc: "Add single questions to question bank" },
      { id: "questions.edit", label: "Edit Questions", desc: "Modify question statements, choices and explanations" },
      { id: "questions.archive", label: "Archive Questions", desc: "Archive or delete questions from bank" },
      { id: "questions.import", label: "Import Questions", desc: "Bulk import questions via CSV/JSON" },
      { id: "questions.export", label: "Export Questions", desc: "Export question bank data to spreadsheet" }
    ]
  },
  {
    id: "sets",
    name: "Question Sets",
    permissions: [
      { id: "sets.view", label: "View Question Sets", desc: "View assembled question sets" },
      { id: "sets.manage", label: "Manage Question Sets", desc: "Create, reorder, assemble and archive question sets" }
    ]
  },
  {
    id: "exams",
    name: "Exam Management & Scheduling",
    permissions: [
      { id: "exams.view", label: "View Examinations", desc: "View drafted and active examination papers" },
      { id: "exams.create", label: "Create Exams", desc: "Create new examination papers and drafts" },
      { id: "exams.edit", label: "Edit Exams", desc: "Modify duration, instructions and marking schemes" },
      { id: "exams.publish", label: "Publish Exams", desc: "Publish and schedule exams for student access" }
    ]
  },
  {
    id: "attempts",
    name: "Live Attempts & Monitoring",
    permissions: [
      { id: "attempts.view", label: "Monitor Attempts", desc: "Monitor live examination sessions in real time" },
      { id: "attempts.intervene", label: "Attempt Intervention", desc: "Force-submit, reconcile, or extend candidate sessions" }
    ]
  },
  {
    id: "students",
    name: "Student Management",
    permissions: [
      { id: "students.view", label: "View Students", desc: "Browse candidate roster and profiles" },
      { id: "students.manage", label: "Manage Students", desc: "Register, provision, edit, and toggle student status" }
    ]
  },
  {
    id: "results",
    name: "Results & Evaluation",
    permissions: [
      { id: "results.view", label: "View Results", desc: "View generated scorecards and attempt submissions" },
      { id: "results.evaluate", label: "Evaluate Submissions", desc: "Score submitted attempts against answer key vault" },
      { id: "results.publish", label: "Publish Results", desc: "Publish candidate scorecards and reports" }
    ]
  },
  {
    id: "analytics",
    name: "Analytics & Trends",
    permissions: [
      { id: "analytics.view", label: "View Analytics", desc: "Inspect platform KPIs, score distributions, and trends" }
    ]
  },
  {
    id: "reports",
    name: "Reports & Exports",
    permissions: [
      { id: "reports.export", label: "Export Reports", desc: "Export exam, candidate, and score analytics to CSV" }
    ]
  },
  {
    id: "notifications",
    name: "Announcements & Alerts",
    permissions: [
      { id: "notifications.manage", label: "Manage Announcements", desc: "Draft and broadcast notifications to candidates" }
    ]
  },
  {
    id: "settings",
    name: "Platform Settings",
    permissions: [
      { id: "settings.manage", label: "Manage Settings", desc: "Update institute details and platform preferences" }
    ]
  },
  {
    id: "admins",
    name: "Administrator Management",
    permissions: [
      { id: "admins.manage", label: "Manage Admin Users", desc: "Provision administrators and configure feature permissions" }
    ]
  },
  {
    id: "auditLogs",
    name: "Audit Trail",
    permissions: [
      { id: "auditLogs.view", label: "View Audit Logs", desc: "Inspect immutable security and administrative actions" }
    ]
  }
];

export const ALL_PERMISSION_IDS = PERMISSION_MODULES.flatMap((m) =>
  m.permissions.map((p) => p.id)
);

export const DEFAULT_ADMIN_PERMISSIONS = ALL_PERMISSION_IDS.filter(
  (id) => id !== "admins.manage"
);

/**
 * Check if a role or permission list contains the target permission
 */
export function checkHasPermission(userProfile, permissionId) {
  if (!userProfile) return false;
  if (userProfile.role === "super_admin") return true;
  if (userProfile.accountStatus === "inactive") return false;
  const userPerms = Array.isArray(userProfile.permissions) ? userProfile.permissions : [];
  return userPerms.includes(permissionId);
}
