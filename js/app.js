/**
 * ============================================================================
 * QuizMaster — Master Application Controller (js/app.js)
 * Global Navigation, Active Link Highlighting, Search Modal, Notifications,
 * Profile Syncing, and Mobile Drawer Engine
 * ============================================================================
 */

// Centralized Storage Keys
const STORAGE_KEYS = {
    CURRENT_QUIZ: 'quizMaster_currentQuiz',
    QUIZ_STATE: 'quizMaster_quizState',
    QUIZ_RESULTS: 'quizMaster_results',
    LATEST_RESULT: 'quizMaster_latestResult',
    BOOKMARKS: 'quizMaster_bookmarks',
    USER_PROFILE: 'quizMaster_userProfile'
};

// URL Parameter Helper
function getUrlParam(param, defaultValue = null) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param) || defaultValue;
}

// Global Toast Notification Helper
function showToast(message, type = 'info', duration = 3000) {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `toast-pill toast-${type}`;
    
    let iconSvg = 'ℹ️';
    if (type === 'success') iconSvg = '✓';
    if (type === 'error') iconSvg = '✕';
    if (type === 'warning') iconSvg = '⚠️';

    toast.innerHTML = `
        <span class="toast-icon">${iconSvg}</span>
        <span class="toast-text">${message}</span>
    `;

    toastContainer.appendChild(toast);
    
    // Animation trigger
    setTimeout(() => toast.classList.add('show'), 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// User Profile Management
function getUserProfile() {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
        if (stored) return JSON.parse(stored);
    } catch (e) {}
    return { name: 'Student', role: 'Learner', email: 'student@quizmaster.edu' };
}

function setUserProfile(name, role = 'Learner', email = '') {
    const profile = { 
        name: name || 'Student', 
        role: role || 'Learner',
        email: email || 'student@quizmaster.edu'
    };
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    updateProfileUI();
}

function updateProfileUI() {
    const profile = getUserProfile();
    const nameEls = document.querySelectorAll('.nav-user-name, .user-name-title');
    const roleEls = document.querySelectorAll('.nav-user-role, .user-role-title');
    
    nameEls.forEach(el => el.textContent = profile.name);
    roleEls.forEach(el => el.textContent = profile.role);
}

// Active Navbar Highlighting
function highlightActiveNav() {
    const path = window.location.pathname.toLowerCase();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = (link.getAttribute('href') || '').toLowerCase();
        link.classList.remove('active');
        
        if (path.includes('quizzes.html') || path.includes('instructions.html') || path.includes('quiz.html') || path.includes('result.html') || path.includes('review.html')) {
            if (href.includes('quizzes.html')) link.classList.add('active');
        } else if (path.includes('leaderboard.html') && href.includes('leaderboard.html')) {
            link.classList.add('active');
        } else if (path.includes('about.html') && href.includes('about.html')) {
            link.classList.add('active');
        } else if (path.includes('contact.html') && href.includes('contact.html')) {
            link.classList.add('active');
        } else if ((path.endsWith('/') || path.includes('index.html')) && (href === 'index.html' || href === './')) {
            link.classList.add('active');
        }
    });
}

// Interactive Profile Prompt Modal
function promptLoginModal() {
    const profile = getUserProfile();
    const modalHtml = `
        <div class="search-modal-overlay open" id="profile-modal" style="z-index: 2500;">
            <div class="search-modal-box" style="padding: 2rem; max-width: 460px;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem;">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <div class="logo-icon" style="width: 36px; height: 36px; font-size: 1rem;">🎓</div>
                        <h3 style="font-size: 1.25rem; color: var(--navy-dark); font-family: var(--font-heading); margin: 0;">Student Profile</h3>
                    </div>
                    <button type="button" class="btn-close-search" onclick="document.getElementById('profile-modal').remove()">✕</button>
                </div>
                <form id="profile-form" onsubmit="event.preventDefault(); saveProfileModal();">
                    <div class="form-group">
                        <label class="form-label">Display Name</label>
                        <input type="text" id="profile-name-input" class="form-input" value="${profile.name}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Role / Goal</label>
                        <select id="profile-role-input" class="form-input">
                            <option value="Learner" ${profile.role === 'Learner' ? 'selected' : ''}>Learner</option>
                            <option value="Web Developer" ${profile.role === 'Web Developer' ? 'selected' : ''}>Web Developer</option>
                            <option value="CS Student" ${profile.role === 'CS Student' ? 'selected' : ''}>CS Student</option>
                            <option value="Competitive Aspirant" ${profile.role === 'Competitive Aspirant' ? 'selected' : ''}>Competitive Aspirant</option>
                        </select>
                    </div>
                    <div style="display: flex; gap: 0.75rem; margin-top: 1.5rem;">
                        <button type="submit" class="btn btn-primary" style="flex: 1;">Save Profile</button>
                        <a href="profile.html" class="btn btn-secondary" style="flex: 1;">Full Dashboard</a>
                    </div>
                </form>
            </div>
        </div>
    `;

    const existing = document.getElementById('profile-modal');
    if (existing) existing.remove();

    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function saveProfileModal() {
    const name = document.getElementById('profile-name-input').value.trim();
    const role = document.getElementById('profile-role-input').value;
    setUserProfile(name, role);
    const modal = document.getElementById('profile-modal');
    if (modal) modal.remove();
    showToast(`Profile updated: ${name} (${role})`, 'success');
}

// Global Initialization on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    updateProfileUI();
    highlightActiveNav();

    // 1. Mobile Drawer Navigation Toggle
    const navToggle = document.getElementById('nav-toggle');
    const mobileNav = document.getElementById('mobile-nav');

    if (navToggle && mobileNav) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navToggle.classList.toggle('active');
            mobileNav.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (!mobileNav.contains(e.target) && !navToggle.contains(e.target)) {
                navToggle.classList.remove('active');
                mobileNav.classList.remove('open');
            }
        });
    }

    // 2. Navbar Scroll Shadow Effect
    const navbar = document.getElementById('navbar') || document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 15) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // 3. Search Modal Functionality
    const searchBtn = document.getElementById('search-btn') || document.querySelector('.btn-search-trigger');
    const searchModal = document.getElementById('search-modal');
    const closeSearchBtn = document.getElementById('close-search-btn');
    const quickSearchInput = document.getElementById('quick-search-input');
    const quickSearchResults = document.getElementById('quick-search-results');

    if (searchBtn && searchModal) {
        searchBtn.addEventListener('click', () => {
            searchModal.classList.add('open');
            if (quickSearchInput) {
                setTimeout(() => quickSearchInput.focus(), 100);
            }
        });
    }

    if (closeSearchBtn && searchModal) {
        closeSearchBtn.addEventListener('click', () => {
            searchModal.classList.remove('open');
        });
    }

    if (searchModal) {
        searchModal.addEventListener('click', (e) => {
            if (e.target === searchModal) {
                searchModal.classList.remove('open');
            }
        });
    }

    // Escape Key Listener for Modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (searchModal) searchModal.classList.remove('open');
            const profileModal = document.getElementById('profile-modal');
            if (profileModal) profileModal.remove();
        }
    });

    // Quick Search Input filtering
    if (quickSearchInput && quickSearchResults) {
        quickSearchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim().toLowerCase();
            if (!query) {
                quickSearchResults.innerHTML = '';
                return;
            }

            if (typeof quizCategories !== 'undefined') {
                const matched = quizCategories.filter(cat => 
                    cat.name.toLowerCase().includes(query) || 
                    cat.id.toLowerCase().includes(query) ||
                    cat.description.toLowerCase().includes(query)
                );

                if (matched.length === 0) {
                    quickSearchResults.innerHTML = `
                        <div style="padding: 1.5rem; text-align: center; color: var(--text-muted);">
                            No matching quiz categories found for "${e.target.value}".
                        </div>
                    `;
                } else {
                    quickSearchResults.innerHTML = matched.map(cat => `
                        <a href="quizzes.html?category=${encodeURIComponent(cat.id)}" class="search-result-item" style="text-decoration: none; color: inherit;">
                            <div style="display: flex; align-items: center; gap: 0.75rem;">
                                <span style="font-size: 1.4rem;">${cat.icon}</span>
                                <div>
                                    <strong style="color: var(--navy-dark); font-size: 0.95rem;">${cat.name}</strong>
                                    <div style="font-size: 0.8rem; color: var(--text-muted);">${cat.totalSets} Sets &bull; ${cat.totalQuestions} Questions</div>
                                </div>
                            </div>
                            <span class="badge ${cat.difficulty.toLowerCase().includes('easy') ? 'badge-easy' : 'badge-medium'}">
                                ${cat.difficulty}
                            </span>
                        </a>
                    `).join('');
                }
            }
        });
    }

    // Notification bell trigger
    const bellBtns = document.querySelectorAll('.icon-bell-btn, #bell-btn');
    bellBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            showToast('No new notifications. Keep practicing!', 'info');
        });
    });

    // User Profile badge click
    const profileBadges = document.querySelectorAll('.nav-user-profile, .user-profile-badge');
    profileBadges.forEach(badge => {
        badge.addEventListener('click', (e) => {
            e.preventDefault();
            promptLoginModal();
        });
    });
});
