/**
 * ============================================================================
 * QuizMaster — Master Quiz Play Engine (js/quiz.js)
 * State Management, Timer, Live Navigator, Options, LocalStorage & Submission
 * ============================================================================
 */

const QUIZ_SETTINGS = {
    TOTAL_QUESTIONS: 20,
    TOTAL_TIME_SECONDS: 900, // 15 minutes
    WARNING_THRESHOLD_SECONDS: 60 // 1 minute warning
};

class QuizGameController {
    constructor() {
        this.category = 'HTML';
        this.setNumber = 1;
        this.questions = [];
        this.currentIndex = 0;
        this.selectedAnswers = {}; // { [questionId]: selectedOptionString }
        this.bookmarkedQuestions = new Set();
        this.remainingSeconds = QUIZ_SETTINGS.TOTAL_TIME_SECONDS;
        this.timerInterval = null;
    }

    init() {
        // 1. Read Category & Set from URL parameters
        const urlCat = getUrlParam('category', 'HTML');
        const urlSet = parseInt(getUrlParam('set', '1'), 10) || 1;

        this.category = normalizeCategoryName(urlCat);
        this.setNumber = urlSet;

        // 2. Try restoring existing active session state for this exact Category + Set
        const savedSession = this.loadSavedState();
        let restored = false;

        if (savedSession && savedSession.category === this.category && String(savedSession.setNumber) === String(this.setNumber)) {
            if (savedSession.questions && savedSession.questions.length === 20 && savedSession.remainingSeconds > 0) {
                this.questions = savedSession.questions;
                this.currentIndex = savedSession.currentIndex || 0;
                this.selectedAnswers = savedSession.selectedAnswers || {};
                this.bookmarkedQuestions = new Set(savedSession.bookmarkedQuestions || []);
                this.remainingSeconds = savedSession.remainingSeconds;
                restored = true;
            }
        }

        // 3. If no valid saved session, load the 20 questions for this Category + Set
        if (!restored) {
            if (typeof getQuestionsForSet === 'function') {
                this.questions = getQuestionsForSet(this.category, this.setNumber);
            } else {
                alert('Question database not loaded. Please reload the page.');
                return;
            }

            this.currentIndex = 0;
            this.selectedAnswers = {};
            this.bookmarkedQuestions = new Set();
            this.remainingSeconds = QUIZ_SETTINGS.TOTAL_TIME_SECONDS;
            this.saveState();
        }

        this.setupHeaderMetadata();
        this.setupEventListeners();
        this.renderQuestionNavigator();
        this.displayQuestion();
        this.startCountdownTimer();
        this.updateProgressIndicators();
    }

    setupHeaderMetadata() {
        const catMeta = typeof getCategoryMeta === 'function' ? getCategoryMeta(this.category) : { name: this.category, icon: '⚡', difficulty: 'Easy' };
        
        const detailsCatEl = document.getElementById('details-category-val');
        const detailsTotalEl = document.getElementById('details-total-val');
        const difficultyEl = document.getElementById('details-difficulty-val');

        if (detailsCatEl) detailsCatEl.textContent = `${catMeta.name} (Set ${this.setNumber})`;
        if (detailsTotalEl) detailsTotalEl.textContent = this.questions.length;
        if (difficultyEl) difficultyEl.textContent = catMeta.difficulty;
    }

    setupEventListeners() {
        const prevBtn = document.getElementById('btn-prev');
        const nextBtn = document.getElementById('btn-next');
        const submitBtn = document.getElementById('btn-submit');
        const bookmarkBtn = document.getElementById('btn-bookmark');
        const exitBtn = document.getElementById('btn-exit-quiz');

        if (prevBtn) prevBtn.addEventListener('click', () => this.previousQuestion());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextQuestion());
        if (submitBtn) submitBtn.addEventListener('click', () => this.openSubmitModal());
        if (bookmarkBtn) bookmarkBtn.addEventListener('click', () => this.toggleBookmark());

        if (exitBtn) {
            exitBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to exit? Your progress will be saved.')) {
                    window.location.href = `quizzes.html?category=${encodeURIComponent(this.category)}`;
                }
            });
        }

        // Modal Controls
        const submitModal = document.getElementById('submit-confirm-modal');
        const cancelSubmit = document.getElementById('modal-cancel-btn');
        const confirmSubmit = document.getElementById('modal-confirm-submit-btn');

        if (cancelSubmit && submitModal) {
            cancelSubmit.addEventListener('click', () => submitModal.classList.remove('open'));
        }
        if (confirmSubmit) {
            confirmSubmit.addEventListener('click', () => this.calculateAndSubmitResult());
        }
        if (submitModal) {
            submitModal.addEventListener('click', (e) => {
                if (e.target === submitModal) submitModal.classList.remove('open');
            });
        }
    }

    renderQuestionNavigator() {
        const grid = document.getElementById('question-navigator-grid') || document.getElementById('question-nav-grid');
        if (!grid) return;

        grid.innerHTML = this.questions.map((q, idx) => {
            return `
                <button type="button" 
                        class="nav-num-btn" 
                        id="nav-num-${idx}" 
                        onclick="quizGame.jumpToQuestion(${idx})"
                        aria-label="Go to question ${idx + 1}">
                    ${idx + 1 < 10 ? '0' + (idx + 1) : (idx + 1)}
                </button>
            `;
        }).join('');

        this.syncNavigatorStates();
    }

    syncNavigatorStates() {
        this.questions.forEach((q, idx) => {
            const btn = document.getElementById(`nav-num-${idx}`);
            if (!btn) return;

            btn.className = 'nav-num-btn';

            const isAnswered = this.selectedAnswers[q.id] !== undefined;
            const isCurrent = idx === this.currentIndex;
            const isBookmarked = this.bookmarkedQuestions.has(q.id);

            if (isAnswered) btn.classList.add('answered');
            if (isCurrent) btn.classList.add('current');
            if (isBookmarked) btn.classList.add('bookmarked');
        });
    }

    displayQuestion() {
        const q = this.questions[this.currentIndex];
        if (!q) return;

        // Counter & Title
        const counterEl = document.getElementById('question-counter-text');
        const questionTextEl = document.getElementById('question-text');
        const bookmarkBtn = document.getElementById('btn-bookmark');

        if (counterEl) {
            counterEl.textContent = `Question ${this.currentIndex + 1 < 10 ? '0' + (this.currentIndex + 1) : (this.currentIndex + 1)} of ${this.questions.length}`;
        }
        if (questionTextEl) {
            questionTextEl.textContent = q.question;
        }

        // Bookmark button appearance
        if (bookmarkBtn) {
            const isBookmarked = this.bookmarkedQuestions.has(q.id);
            if (isBookmarked) {
                bookmarkBtn.classList.add('active');
                bookmarkBtn.innerHTML = '<span>★</span><span>Bookmarked</span>';
            } else {
                bookmarkBtn.classList.remove('active');
                bookmarkBtn.innerHTML = '<span>☆</span><span>Bookmark</span>';
            }
        }

        // 4 Options Grid
        const optionsContainer = document.getElementById('options-container') || document.getElementById('options-stack');
        const letters = ['A', 'B', 'C', 'D'];
        const selectedOption = this.selectedAnswers[q.id];

        if (optionsContainer) {
            optionsContainer.innerHTML = q.options.map((opt, optIdx) => {
                const isSelected = selectedOption === opt;
                return `
                    <div class="option-card ${isSelected ? 'selected' : ''}" 
                         onclick="quizGame.selectAnswer('${this.escapeQuotes(opt)}')"
                         role="button"
                         tabindex="0"
                         aria-pressed="${isSelected}">
                        <div class="option-key">${letters[optIdx]}</div>
                        <div class="option-label">${this.escapeHtml(opt)}</div>
                        <div style="font-weight: 700; color: var(--primary-purple);">${isSelected ? '✓' : ''}</div>
                    </div>
                `;
            }).join('');
        }

        // Prev & Next Buttons
        const prevBtn = document.getElementById('btn-prev');
        if (prevBtn) {
            prevBtn.disabled = this.currentIndex === 0;
        }

        const nextBtn = document.getElementById('btn-next');
        if (nextBtn) {
            if (this.currentIndex === this.questions.length - 1) {
                nextBtn.style.display = 'none';
            } else {
                nextBtn.style.display = 'inline-flex';
            }
        }

        this.syncNavigatorStates();
        this.updateProgressIndicators();
    }

    selectAnswer(selectedOption) {
        const q = this.questions[this.currentIndex];
        if (!q) return;

        this.selectedAnswers[q.id] = selectedOption;
        this.saveState();
        this.displayQuestion();
    }

    toggleBookmark() {
        const q = this.questions[this.currentIndex];
        if (!q) return;

        if (this.bookmarkedQuestions.has(q.id)) {
            this.bookmarkedQuestions.delete(q.id);
            showToast(`Question ${this.currentIndex + 1} removed from bookmarks`, 'info', 1800);
        } else {
            this.bookmarkedQuestions.add(q.id);
            showToast(`Question ${this.currentIndex + 1} bookmarked! ★`, 'success', 1800);
        }

        this.saveState();
        this.displayQuestion();
    }

    previousQuestion() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.saveState();
            this.displayQuestion();
        }
    }

    nextQuestion() {
        if (this.currentIndex < this.questions.length - 1) {
            this.currentIndex++;
            this.saveState();
            this.displayQuestion();
        }
    }

    jumpToQuestion(index) {
        if (index >= 0 && index < this.questions.length) {
            this.currentIndex = index;
            this.saveState();
            this.displayQuestion();
        }
    }

    openSubmitModal() {
        const answeredCount = Object.keys(this.selectedAnswers).length;
        const total = this.questions.length;
        const summaryText = document.getElementById('modal-answered-status-text');
        const modal = document.getElementById('submit-confirm-modal');

        if (summaryText) {
            summaryText.innerHTML = `You have answered <strong>${answeredCount}</strong> of <strong>${total}</strong> questions.`;
        }
        if (modal) {
            modal.classList.add('open');
        }
    }

    startCountdownTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);

        this.updateTimerDisplay();

        this.timerInterval = setInterval(() => {
            this.remainingSeconds--;

            if (this.remainingSeconds <= 0) {
                clearInterval(this.timerInterval);
                this.remainingSeconds = 0;
                this.updateTimerDisplay();
                showToast('Time is up! Submitting your quiz automatically...', 'warning', 3000);
                setTimeout(() => this.calculateAndSubmitResult(), 1000);
                return;
            }

            this.updateTimerDisplay();

            if (this.remainingSeconds % 10 === 0) {
                this.saveState();
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const timerEl = document.getElementById('quiz-timer-display') || document.getElementById('timer-display');
        if (!timerEl) return;

        const minutes = Math.floor(this.remainingSeconds / 60);
        const seconds = this.remainingSeconds % 60;

        timerEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (this.remainingSeconds <= QUIZ_SETTINGS.WARNING_THRESHOLD_SECONDS) {
            timerEl.classList.add('timer-warning');
        } else {
            timerEl.classList.remove('timer-warning');
        }
    }

    updateProgressIndicators() {
        const answeredCount = Object.keys(this.selectedAnswers).length;
        const total = this.questions.length || 20;
        const percentage = Math.round((answeredCount / total) * 100);

        const progressBar = document.getElementById('quiz-progress-bar') || document.getElementById('horizontal-progress-fill');
        if (progressBar) {
            progressBar.style.width = `${Math.max(5, percentage)}%`;
        }
    }

    calculateAndSubmitResult() {
        clearInterval(this.timerInterval);

        let score = 0;
        let correctCount = 0;
        let wrongCount = 0;
        let unansweredCount = 0;

        const detailedReview = this.questions.map((q, idx) => {
            const userAnswer = this.selectedAnswers[q.id];
            const correctAnswer = q.options[q.answer];
            const isCorrect = userAnswer === correctAnswer;
            const isUnanswered = userAnswer === undefined;

            if (isCorrect) {
                score++;
                correctCount++;
            } else if (isUnanswered) {
                unansweredCount++;
            } else {
                wrongCount++;
            }

            return {
                id: q.id,
                questionIndex: idx + 1,
                question: q.question,
                options: q.options,
                userAnswer: userAnswer || null,
                correctAnswer: correctAnswer,
                status: isCorrect ? 'correct' : (isUnanswered ? 'unanswered' : 'wrong'),
                explanation: q.explanation || 'No explanation provided.'
            };
        });

        const totalQuestions = this.questions.length || 20;
        const percentage = Math.round((score / totalQuestions) * 100);
        const timeSpent = QUIZ_SETTINGS.TOTAL_TIME_SECONDS - this.remainingSeconds;

        const resultPayload = {
            category: this.category,
            set: this.setNumber,
            score: score,
            totalQuestions: totalQuestions,
            percentage: percentage,
            correctCount: correctCount,
            wrongCount: wrongCount,
            unansweredCount: unansweredCount,
            timeSpentSeconds: timeSpent,
            completedAt: new Date().toISOString(),
            detailedReview: detailedReview
        };

        // 1. Save as latest result
        localStorage.setItem(STORAGE_KEYS.LATEST_RESULT, JSON.stringify(resultPayload));

        // 2. Save into all results dictionary
        try {
            const allResults = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUIZ_RESULTS) || '{}');
            const key = `${this.category}_set_${this.setNumber}`;
            allResults[key] = resultPayload;
            localStorage.setItem(STORAGE_KEYS.QUIZ_RESULTS, JSON.stringify(allResults));
        } catch (e) {}

        // 3. Clear active in-progress state
        this.clearState();

        // 4. Redirect to Result Page
        window.location.href = `result.html?category=${encodeURIComponent(this.category)}&set=${this.setNumber}`;
    }

    saveState() {
        const state = {
            category: this.category,
            setNumber: this.setNumber,
            questions: this.questions,
            currentIndex: this.currentIndex,
            selectedAnswers: this.selectedAnswers,
            bookmarkedQuestions: Array.from(this.bookmarkedQuestions),
            remainingSeconds: this.remainingSeconds,
            savedAt: Date.now()
        };
        localStorage.setItem(STORAGE_KEYS.QUIZ_STATE, JSON.stringify(state));
    }

    loadSavedState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.QUIZ_STATE);
            if (raw) return JSON.parse(raw);
        } catch (e) {}
        return null;
    }

    clearState() {
        localStorage.removeItem(STORAGE_KEYS.QUIZ_STATE);
    }

    escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    escapeQuotes(str) {
        if (!str) return '';
        return String(str)
            .replace(/\\/g, '\\\\')
            .replace(/'/g, "\\'")
            .replace(/"/g, '&quot;');
    }
}

// Global Instance
let quizGame = null;

document.addEventListener('DOMContentLoaded', () => {
    quizGame = new QuizGameController();
    quizGame.init();
});
