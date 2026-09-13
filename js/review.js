/**
 * ============================================================================
 * QuizMaster — Detailed Answer Review Engine (js/review.js)
 * Question Breakdown, Option Highlighting, Explanations & Filter Tabs
 * ============================================================================
 */

class QuizReviewController {
    constructor() {
        this.category = 'HTML';
        this.setNumber = 1;
        this.resultData = null;
        this.currentFilter = 'all'; // 'all', 'correct', 'wrong', 'unanswered'
    }

    init() {
        const urlCat = getUrlParam('category');
        const urlSet = parseInt(getUrlParam('set', '1'), 10) || 1;

        let result = null;
        try {
            const rawLatest = localStorage.getItem(STORAGE_KEYS.LATEST_RESULT);
            if (rawLatest) result = JSON.parse(rawLatest);
        } catch (e) {}

        if (urlCat) {
            this.category = normalizeCategoryName(urlCat);
            this.setNumber = urlSet;

            try {
                const allResults = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUIZ_RESULTS) || '{}');
                const key = `${this.category}_set_${this.setNumber}`;
                if (allResults[key]) result = allResults[key];
            } catch (e) {}
        } else if (result) {
            this.category = result.category || 'HTML';
            this.setNumber = result.set || 1;
        }

        this.resultData = result;
        this.setupFilterTabs();
        this.renderReview();
    }

    setupFilterTabs() {
        const filterBtns = document.querySelectorAll('.review-tab-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.getAttribute('data-filter') || 'all';
                this.renderReviewList();
            });
        });
    }

    renderReview() {
        const catMeta = typeof getCategoryMeta === 'function' ? getCategoryMeta(this.category) : { name: this.category, totalSets: 5 };
        const headerTitle = document.getElementById('review-set-title');
        const scoreBadge = document.getElementById('review-score-badge');
        const retryBtn = document.getElementById('review-retry-btn');

        if (headerTitle) {
            headerTitle.textContent = `${catMeta.name} • Set ${this.setNumber < 10 ? '0' + this.setNumber : this.setNumber} Solutions`;
        }

        if (retryBtn) {
            retryBtn.href = `quiz.html?category=${encodeURIComponent(this.category)}&set=${this.setNumber}`;
        }

        if (!this.resultData || !this.resultData.detailedReview || this.resultData.detailedReview.length === 0) {
            const container = document.getElementById('review-questions-list');
            if (container) {
                container.innerHTML = `
                    <div style="padding: 3.5rem 2rem; text-align: center; background: #fff; border-radius: 20px; border: 1.5px dashed var(--border);">
                        <div style="font-size: 3.5rem; margin-bottom: 1rem;">🎯</div>
                        <h3 style="color: var(--navy-dark); font-size: 1.4rem; margin-bottom: 0.5rem; font-family: var(--font-heading);">No Review Data Available</h3>
                        <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Please complete the quiz set first to view the detailed question breakdown.</p>
                        <a href="quizzes.html" class="btn btn-primary btn-lg">Explore Quiz Challenges</a>
                    </div>
                `;
            }
            return;
        }

        const d = this.resultData;
        if (scoreBadge) {
            scoreBadge.innerHTML = `🏆 Score: <strong>${d.score}/${d.totalQuestions || 20}</strong> (${d.percentage}%)`;
        }

        // Update counts on filter tabs if present
        const countAll = document.getElementById('tab-count-all');
        const countCorrect = document.getElementById('tab-count-correct');
        const countWrong = document.getElementById('tab-count-wrong');
        const countSkipped = document.getElementById('tab-count-skipped');

        if (countAll) countAll.textContent = d.detailedReview.length;
        if (countCorrect) countCorrect.textContent = d.correctCount !== undefined ? d.correctCount : d.correct;
        if (countWrong) countWrong.textContent = d.wrongCount !== undefined ? d.wrongCount : d.wrong;
        if (countSkipped) countSkipped.textContent = d.unansweredCount !== undefined ? d.unansweredCount : d.unanswered;

        this.renderReviewList();
    }

    renderReviewList() {
        const container = document.getElementById('review-questions-list');
        if (!container || !this.resultData || !this.resultData.detailedReview) return;

        const d = this.resultData;
        let list = d.detailedReview;

        if (this.currentFilter === 'correct') {
            list = list.filter(item => item.status === 'correct');
        } else if (this.currentFilter === 'wrong') {
            list = list.filter(item => item.status === 'wrong');
        } else if (this.currentFilter === 'unanswered') {
            list = list.filter(item => item.status === 'unanswered' || !item.userAnswer);
        }

        if (list.length === 0) {
            container.innerHTML = `
                <div style="padding: 2.5rem; text-align: center; background: #fff; border-radius: 18px; border: 1.5px dashed var(--border);">
                    <p style="color: var(--text-muted); font-size: 1.05rem; margin: 0;">
                        No questions in the <strong>${this.currentFilter}</strong> category.
                    </p>
                </div>
            `;
            return;
        }

        const letters = ['A', 'B', 'C', 'D'];

        container.innerHTML = list.map((item) => {
            const originalIndex = item.questionIndex !== undefined ? item.questionIndex : 1;
            let statusBadge = '<span class="badge badge-amber">⏳ Skipped</span>';
            let cardStateClass = 'state-unanswered';

            if (item.status === 'correct') {
                statusBadge = '<span class="badge badge-green">✓ Correct (+1)</span>';
                cardStateClass = 'state-correct';
            } else if (item.status === 'wrong') {
                statusBadge = '<span class="badge badge-red">✕ Incorrect (0)</span>';
                cardStateClass = 'state-wrong';
            }

            const optionsHtml = item.options.map((opt, optIdx) => {
                const isCorrect = opt === item.correctAnswer;
                const isUserSelected = opt === item.userAnswer;

                let pillClass = '';
                let statusIcon = '';

                if (isCorrect) {
                    pillClass = 'is-correct';
                    statusIcon = '✓ Correct Answer';
                } else if (isUserSelected && !isCorrect) {
                    pillClass = 'is-user-wrong';
                    statusIcon = '✕ Your Choice';
                }

                return `
                    <div class="review-option-pill ${pillClass}">
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <strong style="font-size: 0.88rem; color: var(--navy-dark);">${letters[optIdx]}.</strong>
                            <span>${this.escapeHtml(opt)}</span>
                        </div>
                        <span style="font-size: 0.8rem; font-weight: 700;">${statusIcon}</span>
                    </div>
                `;
            }).join('');

            return `
                <div class="review-item-card ${cardStateClass}">
                    <div class="review-card-top">
                        <span style="font-size: 0.9rem; font-weight: 700; color: var(--navy-dark);">
                            Question ${originalIndex < 10 ? '0' + originalIndex : originalIndex}
                        </span>
                        ${statusBadge}
                    </div>

                    <h3 style="font-size: 1.15rem; color: var(--navy-dark); margin-bottom: 1.25rem; line-height: 1.5;">
                        ${this.escapeHtml(item.question)}
                    </h3>

                    <div class="review-options-list">
                        ${optionsHtml}
                    </div>

                    <div class="review-explanation-box">
                        <div class="explanation-title">
                            <span>💡</span>
                            <span>Explanation &amp; Key Concept</span>
                        </div>
                        <p class="explanation-text">${this.escapeHtml(item.explanation)}</p>
                    </div>
                </div>
            `;
        }).join('');
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
}

// Global instance
let reviewController = null;

document.addEventListener('DOMContentLoaded', () => {
    reviewController = new QuizReviewController();
    reviewController.init();
});
