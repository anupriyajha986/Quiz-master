/**
 * ============================================================================
 * QuizMaster — Master Results Display Engine (js/result.js)
 * Score Gauge, Statistics, Motivational Feedback, Retry & Next Set Actions
 * ============================================================================
 */

class QuizResultController {
    constructor() {
        this.category = 'HTML';
        this.setNumber = 1;
        this.resultData = null;
    }

    init() {
        const urlCat = getUrlParam('category');
        const urlSet = parseInt(getUrlParam('set', '1'), 10) || 1;

        // 1. Try retrieving from STORAGE_KEYS.LATEST_RESULT
        let result = null;
        try {
            const rawLatest = localStorage.getItem(STORAGE_KEYS.LATEST_RESULT);
            if (rawLatest) {
                result = JSON.parse(rawLatest);
            }
        } catch (e) {}

        // 2. If URL parameters specified, check if there's a stored result for that specific category & set
        if (urlCat) {
            this.category = normalizeCategoryName(urlCat);
            this.setNumber = urlSet;

            try {
                const allResults = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUIZ_RESULTS) || '{}');
                const key = `${this.category}_set_${this.setNumber}`;
                if (allResults[key]) {
                    result = allResults[key];
                }
            } catch (e) {}
        } else if (result) {
            this.category = result.category || 'HTML';
            this.setNumber = result.set || 1;
        }

        this.resultData = result;

        if (!this.resultData) {
            this.renderEmptyState();
            return;
        }

        this.renderResults();
        this.setupActionButtons();
    }

    renderEmptyState() {
        const card = document.querySelector('.result-card-main') || document.querySelector('.result-card');
        if (card) {
            card.innerHTML = `
                <div style="font-size: 3.5rem; margin-bottom: 1rem;">🎯</div>
                <h2 style="font-family: var(--font-heading); color: var(--navy-dark); font-size: 1.8rem; margin-bottom: 0.5rem;">No Quiz Results Found</h2>
                <p style="color: var(--text-muted); margin-bottom: 2rem;">You haven't completed a quiz set yet or your session has expired.</p>
                <a href="quizzes.html" class="btn btn-primary btn-lg">
                    <span>Explore Quiz Challenges</span>
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </a>
            `;
        }
    }

    renderResults() {
        const d = this.resultData;
        const catMeta = typeof getCategoryMeta === 'function' ? getCategoryMeta(this.category) : { name: this.category, totalSets: 5 };

        // Badge & Title
        const badgeEl = document.getElementById('result-status-badge');
        if (badgeEl) {
            badgeEl.innerHTML = `<span>🎉</span> <span>${catMeta.name} • Set ${this.setNumber < 10 ? '0' + this.setNumber : this.setNumber} Complete</span>`;
        }

        const headingTitle = document.getElementById('result-heading-title');
        if (headingTitle) {
            const profile = getUserProfile();
            headingTitle.textContent = `Great Job, ${profile.name}!`;
        }

        // Percentage & Points
        const pctEl = document.getElementById('score-percentage-val');
        const fractionEl = document.getElementById('score-fraction-val');
        if (pctEl) pctEl.textContent = `${d.percentage}%`;
        if (fractionEl) fractionEl.textContent = `${d.score} / ${d.totalQuestions || d.total || 20} Points`;

        // Circular Ring Animation (r = 88 -> Circumference = 2 * PI * 88 = 552.92)
        const progressRing = document.getElementById('score-circle-progress');
        if (progressRing) {
            const circumference = 2 * Math.PI * 88;
            progressRing.style.strokeDasharray = `${circumference}`;
            const offset = circumference - (d.percentage / 100) * circumference;
            setTimeout(() => {
                progressRing.style.strokeDashoffset = offset;
            }, 150);
        }

        // Motivational Feedback
        const msgEl = document.getElementById('result-motivational-msg');
        if (msgEl) {
            if (d.percentage >= 90) {
                msgEl.textContent = "🏆 Outstanding Mastery! You have demonstrated exceptional understanding of this track.";
            } else if (d.percentage >= 75) {
                msgEl.textContent = "🌟 Great Job! You have a solid grasp of these core concepts with strong accuracy.";
            } else if (d.percentage >= 50) {
                msgEl.textContent = "👍 Good Effort! You passed the set. Review the explanations below to master the missed concepts.";
            } else {
                msgEl.textContent = "📚 Keep Practicing! Review the detailed solutions below and retake the set to improve.";
            }
        }

        // Detailed Stats
        const statCorrect = document.getElementById('stat-correct-count') || document.getElementById('stat-correct');
        const statWrong = document.getElementById('stat-wrong-count') || document.getElementById('stat-wrong');
        const statSkipped = document.getElementById('stat-skipped-count') || document.getElementById('stat-skipped');
        const statTime = document.getElementById('stat-time-taken') || document.getElementById('stat-time');

        if (statCorrect) statCorrect.textContent = d.correctCount !== undefined ? d.correctCount : d.correct;
        if (statWrong) statWrong.textContent = d.wrongCount !== undefined ? d.wrongCount : d.wrong;
        if (statSkipped) statSkipped.textContent = d.unansweredCount !== undefined ? d.unansweredCount : d.unanswered;
        
        if (statTime) {
            const timeSec = d.timeSpentSeconds || 0;
            const mins = Math.floor(timeSec / 60);
            const secs = timeSec % 60;
            statTime.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
    }

    setupActionButtons() {
        const catMeta = typeof getCategoryMeta === 'function' ? getCategoryMeta(this.category) : { totalSets: 5 };
        const maxSets = catMeta.totalSets || 5;

        // 1. Review Solutions Button
        const reviewBtn = document.getElementById('btn-review-solutions') || document.getElementById('btn-toggle-review');
        if (reviewBtn) {
            reviewBtn.href = `review.html?category=${encodeURIComponent(this.category)}&set=${this.setNumber}`;
        }

        // 2. Retry Set Button
        const retryBtn = document.getElementById('btn-retry-set') || document.getElementById('btn-retry-quiz');
        if (retryBtn) {
            retryBtn.href = `quiz.html?category=${encodeURIComponent(this.category)}&set=${this.setNumber}`;
        }

        // 3. Next Set Button
        const nextSetBtn = document.getElementById('btn-next-set');
        if (nextSetBtn) {
            if (this.setNumber < maxSets) {
                const nextSetNum = this.setNumber + 1;
                nextSetBtn.href = `instructions.html?category=${encodeURIComponent(this.category)}&set=${nextSetNum}`;
                nextSetBtn.innerHTML = `<span>Next Set (Set ${nextSetNum < 10 ? '0' + nextSetNum : nextSetNum}) →</span>`;
                nextSetBtn.style.display = 'inline-flex';
            } else {
                nextSetBtn.style.display = 'none'; // Reached final set
            }
        }
    }
}

// Global instance
let resultController = null;

document.addEventListener('DOMContentLoaded', () => {
    resultController = new QuizResultController();
    resultController.init();
});
