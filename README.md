# QuizMaster — Production-Ready Online Examination Platform

QuizMaster is a computer-based online examination platform inspired by professional examination systems and the JEE Main experience. It features synchronized server deadlines, question palettes, automated negative marking, question bank management, and certified printable scorecards.

---

## 1. Technology Stack & Design System

- **Frontend:** React.js (JavaScript only, no TypeScript), HTML5, CSS3, Tailwind CSS v4, React Router v7.
- **Visuals & Charts:** Lucide React icons, Recharts for analytics.
- **Reporting:** HTML5 Canvas, jsPDF, and browser print stylesheets for scorecard PDF generation.
- **Backend & Database:** Firebase Authentication, Cloud Firestore, Firebase Cloud Functions, Firestore Security Rules, and Emulator configuration.
- **Design Tokens:** Strict palette:
  - **White:** `#FFFFFF`
  - **Black:** `#000000`
  - **Blue:** Primary `#2563EB`, Hover `#1D4ED8`, Light `#EFF6FF`
  - **Light Green:** Success `#16A34A`, Light `#DCFCE7`
  - **Neutral Greys:** Surface `#F8FAFC`, Border `#E2E8F0`, Text Secondary `#64748B`, Dark Text `#111827`

---

## 2. Default Provisioned Accounts

| Role | Email | Password | Details |
|---|---|---|---|
| **Administrator** | `admin@quizmaster.com` | `Admin@12345` | System Administrator with full access to question bank, tests, students, analytics |
| **Student** | `student@quizmaster.com` | `Student@12345` | Rahul Sharma (Roll: `2026-JEE-0104`, NIT) |

---

## 3. Project Architecture

```
Quiz Master/
├── firestore.rules               # Strict RBAC Firestore Security Rules
├── firestore.indexes.json        # Composite query indexes for Firestore
├── firebase.json                 # Firebase Hosting, Firestore & Functions config
├── .env                          # Real Firebase project credentials
├── .env.example                  # Environment template without secrets
├── functions/                    # Firebase Cloud Functions backend package
│   ├── index.js                  # Trusted attempt initialization & grading functions
│   └── package.json
├── scripts/
│   ├── seed-and-provision.js     # Seeds admin, student, questions & publishes test
│   ├── test-workflow.js          # Automated end-to-end QA verification suite
│   └── test-evaluation-math.js   # Unit test verifying the JEE marking formula
└── src/
    ├── components/
    │   ├── common/               # Button, Input, Select, Badge, Card, Modal, Skeletons, EmptyState
    │   ├── layout/               # Navbar, Sidebar, Footer
    │   └── common/ScorecardReport.jsx # Reusable official scorecard with PDF export
    ├── context/                  # AuthContext, ToastContext
    ├── layouts/                  # AdminLayout, StudentLayout
    ├── pages/
    │   ├── public/               # LandingPage, LoginPage, RegisterPage, ForgotPasswordPage
    │   ├── student/              # StudentDashboard, AvailableExams, ExamInstructions, ExamLivePage, StudentResults, StudentResultDetail, StudentProfile, StudentNotifications
    │   └── admin/                # AdminDashboard, QuestionBank, QuestionSetManagement, TestManagement, TestCreateWizard, LiveAttemptsMonitor, StudentManagement, AdminResults, AdminResultDetail, AdminAnalytics, AuditLogs, AdminSettings
    ├── routes/                   # AppRoutes, ProtectedRoute, AdminRoute
    ├── services/firebase/        # config.js, authService, questionService, testService, examService, studentService, analyticsService, notificationService
    └── utils/                    # formatters.js, pdfGenerator.js, csvExport.js
```

---

## 4. Key Architectural Implementations

### Authoritative Server-Synchronized Timer
- **No Client Clock Drift:** The countdown timer does not start on the test details or instructions page.
- **Explicit Initialization:** Starts only when the candidate clicks "Start Test", generating a server timestamp deadline.
- **Refresh & Disconnection Resilience:** If the candidate refreshes or closes the tab, the exam engine restores the existing attempt and calculates `timeRemaining = deadline - Date.now()`. The timer is never reset or extended.
- **Auto-Submission:** When the deadline expires, the exam automatically submits and grades the candidate's persisted responses.

### Question Bank & Answer Key Vault
- **Sanitized Snapshots:** When an administrator publishes a test, QuizMaster generates an immutable question snapshot attached to the test *without* correct answers or explanations.
- **Restricted Vault:** Correct answers are isolated in the `answerKeys/{testId}` collection, guarded by Firestore Security Rules so students cannot read or list answer keys.

### JEE Main Question Palette
The live examination interface provides 5 distinct visual states:
1. **Not Visited (Grey):** Questions not yet viewed.
2. **Not Answered (Neutral border):** Visited questions without an answer selected.
3. **Answered (Light Green):** Successfully answered and saved to Cloud Firestore.
4. **Marked for Review (Blue):** Flagged for review without an answer.
5. **Answered & Marked for Review (Light Green with Blue outline):** Answered and flagged for later verification.

### Configurable Evaluation Engine
- Standard formula: $\text{Score} = (\text{Correct} \times \text{Positive}) - (\text{Incorrect} \times \text{Negative}) + (\text{Unanswered} \times \text{Unanswered})$
- Verified against prompt Section 9 example: 30 questions (20 correct, 5 incorrect, 5 unanswered) = **75 out of 120 (62.5%)**.

---

## 5. Development & Testing Commands

### Install Dependencies
```bash
npm install
```

### Run Local Development Server
```bash
npm run dev
```

### Seed Real Database & Provision Accounts
```bash
npm run seed
```

### Run End-to-End Automated QA Suite
```bash
npm run test:e2e
```

### Run Evaluation Formula Verification
```bash
node scripts/test-evaluation-math.js
```

### Build Production Bundle
```bash
npm run build
```

### Deploy to Firebase
```bash
firebase deploy
```
