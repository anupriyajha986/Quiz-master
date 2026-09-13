/**
 * ============================================================================
 * QuizMaster - Category & Sets Dashboard Controller (js/quizzes.js)
 * Modern UI Engine: Category Explorer & Animated Sets Selection Modal
 * ============================================================================
 */

class QuizzesDashboardController {
    constructor() {
        this.selectedFilter = 'all';
        this.categorySearchQuery = '';
        this.currentModalCategory = null;
        this.setSearchQuery = '';
    }

    init() {
        this.setupFilterEvents();
        this.setupCategorySearchEvents();
        this.setupModalEvents();
        this.renderCategoriesGrid();

        // Check if category is passed via URL parameter (e.g., quizzes.html?category=HTML)
        const urlCat = getUrlParam('category');
        if (urlCat) {
            const normalized = normalizeCategoryName(urlCat);
            // Open the sets modal with sleek animation
            setTimeout(() => {
                this.openSetsModal(normalized);
            }, 150);
        }
    }

    /**
     * Category Grid Filter Pills (All, HTML, CSS, JavaScript, etc.)
     */
    setupFilterEvents() {
        const filterBtns = document.querySelectorAll('.pill-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterVal = btn.getAttribute('data-filter');
                this.selectedFilter = filterVal;
                this.renderCategoriesGrid();
            });
        });
    }

    /**
     * Category Grid Live Search
     */
    setupCategorySearchEvents() {
        const searchInput = document.getElementById('category-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.categorySearchQuery = e.target.value.trim().toLowerCase();
                this.renderCategoriesGrid();
            });
        }
    }

    /**
     * Sets Modal Event Listeners
     */
    setupModalEvents() {
        const modalOverlay = document.getElementById('sets-modal');
        const closeBtn = document.getElementById('close-sets-modal-btn');
        const footerCloseBtn = document.getElementById('footer-close-modal-btn');
        const setSearchInput = document.getElementById('modal-set-search');
        const clearSearchBtn = document.getElementById('clear-set-search');

        // Close on button click
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeSetsModal());
        }
        if (footerCloseBtn) {
            footerCloseBtn.addEventListener('click', () => this.closeSetsModal());
        }

        // Close on backdrop click
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    this.closeSetsModal();
                }
            });
        }

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('open')) {
                this.closeSetsModal();
            }
        });

        // Search sets within modal
        if (setSearchInput) {
            setSearchInput.addEventListener('input', (e) => {
                this.setSearchQuery = e.target.value.trim().toLowerCase();
                if (clearSearchBtn) {
                    clearSearchBtn.style.display = this.setSearchQuery ? 'block' : 'none';
                }
                this.renderModalSets();
            });
        }

        // Clear modal set search
        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', () => {
                if (setSearchInput) {
                    setSearchInput.value = '';
                    this.setSearchQuery = '';
                    clearSearchBtn.style.display = 'none';
                    this.renderModalSets();
                    setSearchInput.focus();
                }
            });
        }
    }

    /**
     * Get completion / in-progress status of a specific set
     */
    getSetStatus(category, setNumber) {
        try {
            const allResults = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUIZ_RESULTS) || '{}');
            const key = `${category}_set_${setNumber}`;
            const result = allResults[key];
            if (result) {
                return {
                    status: 'completed',
                    score: result.score,
                    total: result.total || 20,
                    percentage: result.percentage
                };
            }

            // Check if in-progress
            const activeState = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUIZ_STATE) || 'null');
            if (activeState && activeState.category === category && String(activeState.set) === String(setNumber)) {
                return { status: 'in-progress' };
            }
        } catch (e) {}

        return { status: 'not-started' };
    }

    /**
     * Render the main 6 Categories Grid on quizzes.html
     */
    renderCategoriesGrid() {
        const container = document.getElementById('all-categories-grid');
        if (!container || typeof quizCategories === 'undefined') return;

        let filtered = quizCategories;

        // Apply Pill Filter
        if (this.selectedFilter && this.selectedFilter !== 'all') {
            const filterNorm = normalizeCategoryName(this.selectedFilter);
            filtered = filtered.filter(cat => cat.id === filterNorm);
        }

        // Apply Search Filter
        if (this.categorySearchQuery) {
            filtered = filtered.filter(cat =>
                cat.name.toLowerCase().includes(this.categorySearchQuery) ||
                cat.id.toLowerCase().includes(this.categorySearchQuery) ||
                cat.description.toLowerCase().includes(this.categorySearchQuery) ||
                (cat.badge && cat.badge.toLowerCase().includes(this.categorySearchQuery))
            );
        }

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="no-results-card" style="grid-column: 1 / -1; padding: 3.5rem 2rem; text-align: center; background: #fff; border-radius: 20px; border: 1.5px dashed var(--border);">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
                    <h3 style="font-size: 1.4rem; color: var(--dark); margin-bottom: 0.5rem;">No quiz categories match "${this.categorySearchQuery}"</h3>
                    <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Try searching for HTML, CSS, JavaScript, Computer Science, GK, or Aptitude.</p>
                    <button type="button" class="btn btn-outline" onclick="document.getElementById('category-search').value=''; quizDashboard.categorySearchQuery=''; quizDashboard.renderCategoriesGrid();">Clear Search</button>
                </div>
            `;
            return;
        }

        container.innerHTML = filtered.map(cat => {
            // Count completed sets & calculate percentage
            let completedSetsCount = 0;
            for (let i = 1; i <= cat.totalSets; i++) {
                const status = this.getSetStatus(cat.id, i);
                if (status.status === 'completed') completedSetsCount++;
            }
            const progressPercent = Math.round((completedSetsCount / cat.totalSets) * 100);

            // Determine difficulty class
            const diffLower = cat.difficulty.toLowerCase();
            const diffClass = diffLower.includes('easy') && !diffLower.includes('medium') ? 'easy' : (diffLower.includes('hard') ? 'hard' : 'medium');
            
            // Map theme
            const themeMap = {
                'HTML': 'html',
                'CSS': 'css',
                'JavaScript': 'js',
                'Computer Science': 'cs',
                'General Knowledge': 'gk',
                'Aptitude': 'aptitude'
            };
            const themeClass = themeMap[cat.id] || 'default';
            const svgIcon = typeof getCategorySvgIcon === 'function' ? getCategorySvgIcon(cat.id) : (cat.icon || '🎯');

            return `
                <div class="category-card cat-card-theme-${themeClass}" onclick="quizDashboard.openSetsModal('${cat.id}')" role="button" tabindex="0" title="Click to view all ${cat.totalSets} sets in ${cat.name}">
                    <!-- Card Top Header with Official Vector Icon & Badges -->
                    <div class="cat-card-header">
                        <div class="cat-icon-chip cat-icon-${themeClass}">
                            ${svgIcon}
                        </div>
                        <div class="cat-header-badges">
                            <span class="cat-domain-badge">${cat.badge || 'Domain'}</span>
                            <span class="cat-diff-badge ${diffClass}">
                                ${cat.difficulty}
                            </span>
                        </div>
                    </div>

                    <!-- Card Body Content -->
                    <div class="cat-card-body">
                        <div class="cat-title-wrap">
                            <h3 class="cat-title">${cat.name}</h3>
                        </div>

                        <p class="cat-desc">${cat.description}</p>

                        <!-- Micro Stats Strip -->
                        <div class="cat-stats-row">
                            <div class="cat-stat-chip">
                                <strong>${cat.totalSets}</strong>
                                <span>Sets</span>
                            </div>
                            <div class="cat-stat-chip">
                                <strong>20</strong>
                                <span>Qs/Set</span>
                            </div>
                            <div class="cat-stat-chip">
                                <strong>${cat.totalQuestions}</strong>
                                <span>Total Qs</span>
                            </div>
                        </div>

                        <!-- Progress Tracker Bar -->
                        <div class="cat-progress-wrap">
                            <div class="cat-progress-info">
                                <span class="progress-status-label ${completedSetsCount > 0 ? 'completed' : ''}">
                                    ${completedSetsCount > 0 ? `✓ ${completedSetsCount}/${cat.totalSets} Sets Done` : 'Ready to start'}
                                </span>
                                <span class="progress-percent">${progressPercent}%</span>
                            </div>
                            <div class="cat-progress-track">
                                <div class="cat-progress-fill" style="width: ${progressPercent}%;"></div>
                            </div>
                        </div>

                        <!-- Action Footer -->
                        <div class="cat-card-footer">
                            <span class="cat-action-text">
                                <span>Select Challenge Set</span>
                                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                            </span>
                            <button type="button" class="btn-start-circle" aria-label="Open ${cat.name} Sets">
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Opens the Sets Selection Modal with stylish animations
     */
    openSetsModal(catName) {
        this.currentModalCategory = normalizeCategoryName(catName);
        const meta = getCategoryMeta(this.currentModalCategory);
        if (!meta) return;

        // Populate Modal Header Info
        const iconEl = document.getElementById('modal-category-icon');
        const titleEl = document.getElementById('modal-category-title');
        const domainEl = document.getElementById('modal-category-domain');
        const diffEl = document.getElementById('modal-category-diff');
        const subtitleEl = document.getElementById('modal-category-subtitle');

        if (iconEl) {
            iconEl.innerHTML = typeof getCategorySvgIcon === 'function' ? getCategorySvgIcon(meta.id) : (meta.icon || '🎯');
        }
        if (titleEl) titleEl.textContent = meta.name;
        if (domainEl) domainEl.textContent = meta.badge || 'Track';
        if (diffEl) diffEl.innerHTML = `${meta.difficulty} &bull; 15 Mins / Set`;
        if (subtitleEl) subtitleEl.textContent = `Explore ${meta.totalSets} Curated Sets \u2022 ${meta.totalQuestions} Total Questions \u2022 Instant Explanations`;

        // Reset Set Search
        const searchInput = document.getElementById('modal-set-search');
        const clearSearchBtn = document.getElementById('clear-set-search');
        if (searchInput) searchInput.value = '';
        if (clearSearchBtn) clearSearchBtn.style.display = 'none';
        this.setSearchQuery = '';

        // Render Sets
        this.renderModalSets();

        // Update URL cleanly without page reload
        try {
            const url = new URL(window.location);
            url.searchParams.set('category', this.currentModalCategory);
            window.history.replaceState({}, '', url);
        } catch (e) {}

        // Open Modal
        const modalOverlay = document.getElementById('sets-modal');
        if (modalOverlay) {
            modalOverlay.classList.add('open');
            modalOverlay.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            if (searchInput) {
                setTimeout(() => searchInput.focus(), 300);
            }
        }
    }

    /**
     * Closes the Sets Selection Modal
     */
    closeSetsModal() {
        const modalOverlay = document.getElementById('sets-modal');
        if (modalOverlay) {
            modalOverlay.classList.remove('open');
            modalOverlay.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        this.currentModalCategory = null;

        // Clean URL parameter
        try {
            const url = new URL(window.location);
            url.searchParams.delete('category');
            window.history.replaceState({}, '', url);
        } catch (e) {}

        // Re-render categories to refresh any new completed progress bars
        this.renderCategoriesGrid();
    }

    /**
     * Renders Sets inside the Modal Dialog
     */
    renderModalSets() {
        if (!this.currentModalCategory) return;

        const container = document.getElementById('modal-sets-grid');
        const meta = getCategoryMeta(this.currentModalCategory);
        const setsList = getSetsForCategory(this.currentModalCategory);
        if (!container || !meta) return;

        // Calculate Category Completion
        let completedCount = 0;
        setsList.forEach(s => {
            const st = this.getSetStatus(s.category, s.setNumber);
            if (st.status === 'completed') completedCount++;
        });

        const progressPercent = setsList.length > 0 ? Math.round((completedCount / setsList.length) * 100) : 0;
        const progressTextEl = document.getElementById('modal-progress-text');
        const progressFillEl = document.getElementById('modal-progress-fill');
        if (progressTextEl) progressTextEl.textContent = `${completedCount} / ${setsList.length} Sets Completed (${progressPercent}%)`;
        if (progressFillEl) progressFillEl.style.width = `${progressPercent}%`;

        // Apply In-Modal Set Search
        let filteredSets = setsList;
        if (this.setSearchQuery) {
            filteredSets = setsList.filter(s =>
                s.title.toLowerCase().includes(this.setSearchQuery) ||
                s.theme.toLowerCase().includes(this.setSearchQuery) ||
                `set ${s.setNumber}`.includes(this.setSearchQuery) ||
                `set 0${s.setNumber}`.includes(this.setSearchQuery)
            );
        }

        if (filteredSets.length === 0) {
            container.innerHTML = `
                <div class="no-sets-found" style="grid-column: 1 / -1; padding: 3rem 1.5rem; text-align: center;">
                    <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">🔍</div>
                    <h4 style="font-family: var(--font-heading); font-size: 1.2rem; color: var(--navy-dark); margin-bottom: 0.35rem;">No sets matching "${this.setSearchQuery}"</h4>
                    <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1rem;">Try searching by set number (e.g. Set 1) or topic keyword.</p>
                    <button type="button" class="btn btn-outline btn-sm" onclick="document.getElementById('modal-set-search').value=''; quizDashboard.setSearchQuery=''; quizDashboard.renderModalSets();">Show All Sets</button>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredSets.map((set, idx) => {
            const statusInfo = this.getSetStatus(set.category, set.setNumber);
            let statusBadge = '<span class="set-status-badge status-not-started">Not Started</span>';
            let actionText = 'Start Quiz';
            let cardStatusClass = 'status-default';

            if (statusInfo.status === 'completed') {
                statusBadge = `<span class="set-status-badge status-completed">✓ Score: ${statusInfo.score}/${statusInfo.total} (${statusInfo.percentage}%)</span>`;
                actionText = 'Retake Quiz';
                cardStatusClass = 'status-done';
            } else if (statusInfo.status === 'in-progress') {
                statusBadge = '<span class="set-status-badge status-in-progress">⏱ In Progress</span>';
                actionText = 'Resume Quiz';
                cardStatusClass = 'status-active';
            }

            const targetUrl = `instructions.html?category=${encodeURIComponent(set.category)}&set=${set.setNumber}`;

            return `
                <div class="set-popup-card ${cardStatusClass}" style="animation-delay: ${idx * 0.04}s" onclick="window.location.href='${targetUrl}'" role="button" tabindex="0" title="Start ${meta.name} Set ${set.setNumber}">
                    <div class="set-card-top">
                        <span class="set-num-badge">SET ${String(set.setNumber).padStart(2, '0')}</span>
                        ${statusBadge}
                    </div>

                    <h4 class="set-theme-title">${set.theme}</h4>

                    <div class="set-meta-pills">
                        <span class="set-meta-pill">📝 ${set.questionCount} Questions</span>
                        <span class="set-meta-pill">⏱ 15 Mins</span>
                        <span class="set-meta-pill">🎯 ${set.difficulty}</span>
                    </div>

                    <div class="set-card-bottom">
                        <a href="${targetUrl}" class="btn btn-primary set-action-btn" onclick="event.stopPropagation();">
                            <span>${actionText}</span>
                            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                            </svg>
                        </a>
                    </div>
                </div>
            `;
        }).join('');
    }
}

// Instantiate Global Controller
let quizDashboard = null;

document.addEventListener('DOMContentLoaded', () => {
    quizDashboard = new QuizzesDashboardController();
    quizDashboard.init();
});
