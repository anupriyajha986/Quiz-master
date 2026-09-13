# 🎯 QuizMaster - Interactive Online Quiz & Assessment Portal

[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](#)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)](#)
[![Responsive Design](https://img.shields.io/badge/Responsive-Mobile%20Friendly-green)](#)

> **QuizMaster** is a modern, responsive, and feature-packed interactive quiz portal designed to help students, developers, and learners test their knowledge, practice for exams, and track their growth across multiple technical and general domains.

---

## 🌟 Key Features

- ⚡ **Interactive Quiz Engine**:
  - Real-time countdown timer with automated submission.
  - Interactive Question Palette with status indicators (Answered, Current, Unanswered).
  - Clean question view with instant option selection and keyboard navigation support.
- 📊 **Detailed Result Analytics**:
  - Instant score calculation with percentage, time taken, and accuracy metrics.
  - Performance grade badges (Mastery, Proficient, Needs Practice).
  - Comprehensive question-by-question review with explanations.
- 📚 **Diverse Question Bank & Categories**:
  - **HTML5 & Web Fundamentals**
  - **CSS3 & Modern Layouts (Flexbox, Grid)**
  - **JavaScript (ES6+, Async, DOM)**
  - **Computer Science Core (Data Structures, Algorithms, OS, Networking)**
  - **General Knowledge & Current Affairs**
  - **Quantitative Aptitude & Logical Reasoning**
- 🏆 **Dynamic Leaderboard**:
  - Global rankings, top performers, and category-wise ranking displays.
- 👤 **Student Profile & Dashboard**:
  - Performance analytics and test attempt history stored locally.
- 📱 **100% Responsive & Modern UI**:
  - Premium design with custom gradients, sleek typography, micro-animations, and mobile drawer navigation.
  - Zero external heavy frameworks — ultra-fast load times.

---

## 🚀 Live Demo & Screenshots

| Home Page | Quiz Interface | Result & Solutions |
| :---: | :---: | :---: |
| Overview of featured quizzes, categories & stats | Timed quiz screen with question navigator | Score breakdown & step-by-step review |

---

## 🛠️ Technology Stack

- **Frontend Structure:** HTML5 (Semantic elements, accessible forms)
- **Styling & Design System:** Modern CSS3 (CSS Variables, Flexbox, Grid, Glassmorphism, CSS Animations)
- **Application Logic:** Pure Vanilla JavaScript (ES6+, DOM Manipulation, LocalStorage management)
- **Icons & Graphics:** Clean SVG Icons & Vector Illustrations

---

## 📁 Project Structure

```
Quiz-master/
├── assets/
│   └── images/              # SVGs, category icons, avatar images
├── css/
│   ├── style.css            # Core design system, variables, header/footer
│   ├── quiz.css             # Quiz screen, question card, timer & results
│   └── responsive.css       # Mobile & tablet media queries
├── js/
│   ├── app.js               # Global scripts, navbar, search & local storage
│   ├── quiz.js              # Quiz flow logic, timer, state management
│   ├── quizzes.js           # Category filtering and search logic
│   ├── result.js            # Score computation and display
│   ├── review.js            # Review answers and detailed solutions
│   └── data/
│       └── question-bank.js # Structured questions dataset with explanations
├── index.html               # Landing page / Home
├── quizzes.html             # Quizzes catalog & category browser
├── instructions.html        # Pre-quiz rules and instructions
├── quiz.html                # Main active quiz interface
├── result.html              # Quiz results and performance scorecard
├── review.html              # Question review and explanation page
├── leaderboard.html         # Leaderboard & rank list
├── profile.html             # Student profile and quiz history
├── login.html               # Student login screen
├── signup.html              # Student registration screen
├── about.html               # About platform and team
└── contact.html             # Contact us & feedback form
```

---

## 💻 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/anupriyajha986/Quiz-master.git
```

### 2. Navigate to the project directory
```bash
cd Quiz-master
```

### 3. Run Locally
You don't need to install any heavy packages or build tools. Simply open `index.html` in any modern web browser:

- **Option A:** Double click `index.html` to open it in your browser.
- **Option B (VS Code Live Server):** Right-click `index.html` and click **"Open with Live Server"**.
- **Option C (Python HTTP Server):**
  ```bash
  python -m http.server 3000
  ```
  Then navigate to `http://localhost:3000` in your browser.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](https://github.com/anupriyajha986/Quiz-master/issues).

1. Fork the project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">Made with ❤️ for Learners & Developers</p>
