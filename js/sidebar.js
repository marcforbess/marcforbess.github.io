/**
 * Sidebar Interactivity & Logic
 * Handles toggling, mobile navigation, and nav item states
 */

const SIDEBAR_STATE_KEY = "sidebar-collapsed";
const shell = document.querySelector(".dashboard-shell");
const sidebarToggle = document.getElementById("sidebar-toggle");
const sidebarOverlay = document.getElementById("sidebar-overlay");
const navItems = document.querySelectorAll(".nav-item");

function initSidebar() {
    if (!shell || !sidebarToggle) return;

    updateSidebarDate();

    const isCollapsed = localStorage.getItem(SIDEBAR_STATE_KEY) === "true";

    // 1. Initial State Persistence (Desktop only)
    if (window.innerWidth > 980 && isCollapsed) {
        shell.classList.add("collapsed");
    }

    // 2. Toggle Click Handler
    sidebarToggle.addEventListener("click", () => {
        if (window.innerWidth <= 980) {
            shell.classList.toggle("mobile-nav-open");
        } else {
            shell.classList.toggle("collapsed");
            localStorage.setItem(
                SIDEBAR_STATE_KEY,
                shell.classList.contains("collapsed")
            );
        }
    });

    // 3. Mobile Overlay Click Handler
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener("click", () => {
            shell.classList.remove("mobile-nav-open");
        });
    }

    // 4. Navigation Item Interactivity
    navItems.forEach((item) => {
        // Click active state
        item.addEventListener("click", () => {
            navItems.forEach((i) => i.classList.remove("active"));
            item.classList.add("active");

            // Auto-close on mobile after selecting a page
            if (window.innerWidth <= 980) {
                shell.classList.remove("mobile-nav-open");
            }
        });

        // Hover effects via JS for more refined control if desired 
        // (though CSS handles most hover states, we can add logic here)
        item.addEventListener("mouseenter", () => {
            if (shell.classList.contains("collapsed") && window.innerWidth > 980) {
                // Optional: show tooltips or expanded text on hover
            }
        });
    });

    // 5. Handle window resizing
    window.addEventListener("resize", () => {
        if (window.innerWidth > 980) {
            shell.classList.remove("mobile-nav-open");
            const shouldCollapse = localStorage.getItem(SIDEBAR_STATE_KEY) === "true";
            if (shouldCollapse) {
                shell.classList.add("collapsed");
            } else {
                shell.classList.remove("collapsed");
            }
        }
    });

    // 6. Global Logout Handler
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.clear(); // Wipe entire local storage on logout
            window.location.href = "index.html"; // Redirect to login
        });
    }
}

function updateSidebarDate() {
    const dateEl = document.getElementById("brand-date");
    if (!dateEl) return;

    const date = new Date();
    const day = date.getDate();
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    // Calculate ordinal suffix
    let suffix = 'th';
    if (day % 10 === 1 && day !== 11) suffix = 'st';
    else if (day % 10 === 2 && day !== 12) suffix = 'nd';
    else if (day % 10 === 3 && day !== 13) suffix = 'rd';

    dateEl.textContent = `${day}${suffix} ${month} ${year}`;
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", initSidebar);
