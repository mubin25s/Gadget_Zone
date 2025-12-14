

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    renderNavbar();
    // setupThemeToggle handled inside renderNavbar
    updateCartBadge();
    setupPageTransitions();
}


function setupPageTransitions() {
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        // Use href directly from attribute to check for internal/external
        const href = link.getAttribute('href');

        

        if (!href || href.startsWith('#') || href.startsWith('javascript:') || link.target === '_blank') return;

        // Simple check for internal relative links or same domain
        const isInternal = !href.startsWith('http') || href.includes(window.location.host);

        if (isInternal) {
            e.preventDefault();
            document.body.classList.add('fade-out');

            setTimeout(() => {
                window.location.href = href;
            }, 300); // Match CSS transition duration
        }
    });

    
}

/**
 * Renders the global navigation bar based on auth state
 */
function renderNavbar() {
    const header = document.getElementById('main-header');
    if (!header) return;

    const user = db.getCurrentUser();
    const isLoggedIn = !!user;
    const isAdmin = user && user.role === 'admin';

    let navLinksHtml = `
        <a href="index.html" class="${isActive('index.html')}">Home</a>
        <a href="shop.html" class="${isActive('shop.html')}">Shop</a>
    `;

    if (isAdmin) {
        navLinksHtml += `<a href="admin.html" class="${isActive('admin.html')}">Admin</a>`;
    }

    let authHtml = '';
    if (isLoggedIn) {
        authHtml = `
            <a href="profile.html" class="btn-icon" title="Profile">
                👤
            </a>
            <button onclick="handleLogout()" class="btn btn-outline" style="padding: 0.4rem 1rem; font-size: 0.9rem;">Logout</button>
        `;
    } else {
        authHtml = `
            <a href="login.html" class="btn btn-primary" style="padding: 0.4rem 1rem;">Login</a>
        `;
    }

    header.innerHTML = `
        <div class="container navbar">
            <a href="index.html" class="logo">Duck Zone</a>
            
            <nav class="nav-links">
                ${navLinksHtml}
            </nav>

            <div class="nav-icons">
                <button id="theme-toggle" class="btn-icon">🌙</button>
                <a href="cart.html" class="btn-icon">
                    🛒
                    <span id="cart-badge" class="badge hidden">0</span>
                </a>
                ${authHtml}
            </div>
        </div>
    `;

    // Re-attach listeners because we overwrote innerHTML
    setupThemeToggle();
}

/**
 * Handles Dark/Light mode toggle
 */
function setupThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;

    // Check saved preference or default
    const savedTheme = localStorage.getItem('theme') || 'light';
    // Apply to ALL of document (html tag) for immediate effect
    document.documentElement.setAttribute('data-theme', savedTheme);
    toggleBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

    toggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        toggleBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    });
}

/**
 * Updates the cart badge count
 */
function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('hr_gadget_cart') || '[]');
    const badge = document.getElementById('cart-badge');
    if (badge) {
        if (cart.length > 0) {
            badge.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }
}

/**
 * Helper to check active link
 */
function isActive(page) {
    return window.location.pathname.includes(page) ? 'active' : '';
}

/**
 * Global Logout handler
 */
function handleLogout() {
    db.logout();
    window.location.href = 'index.html';
}

/**
 * Toast Notification Helper
 */
function showToast(message, type = 'success') {
    // Simple alert for now, can be upgraded to a custom toast
    alert(message);
}

// Make functions globally available for inline onclicks
window.handleLogout = handleLogout;
window.updateCartBadge = updateCartBadge;
window.showToast = showToast;
