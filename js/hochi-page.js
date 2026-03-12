/**
 * Hochi Welfare Page Logic
 * Handles stat management and unlocking the inventory item.
 */

const STAT_KEY = "hochi_stats";
const UNLOCK_ITEM_ID = 9; // Cat Whisperer Token

// State
let stats = {
    energy: 50,
    happiness: 50,
    bond: 50
};

// Global Method (Always available)
window.resetHochiStats = function () {
    localStorage.removeItem(STAT_KEY);
    stats = {
        energy: 10,
        happiness: 10,
        bond: 10
    };
    localStorage.setItem(STAT_KEY, JSON.stringify(stats));
    sessionStorage.removeItem('hochi_warning_shown'); // Reset warning flag

    // If we're on the welfare page, refresh the UI
    if (typeof updateHochiUI === 'function') {
        updateHochiUI();
    }
    console.log("♻️ Hochi stats have been reset.");
};

/**
 * UI Update function made available globally for the reset method
 */
function updateHochiUI() {
    const energyBar = document.getElementById('energy-bar');
    const energyVal = document.getElementById('energy-val');
    const happinessBar = document.getElementById('happiness-bar');
    const happinessVal = document.getElementById('happiness-val');
    const bondBar = document.getElementById('bond-bar');
    const bondVal = document.getElementById('bond-val');
    const vibeEl = document.getElementById('hochi-vibe');

    if (energyBar) {
        energyBar.style.width = `${stats.energy}%`;
        energyVal.textContent = `${stats.energy}%`;
    }

    if (happinessBar) {
        happinessBar.style.width = `${stats.happiness}%`;
        happinessVal.textContent = `${stats.happiness}%`;
    }

    if (bondBar) {
        bondBar.style.width = `${stats.bond}%`;
        bondVal.textContent = `${stats.bond}%`;
    }

    if (vibeEl) {
        if (stats.energy >= 100 && stats.happiness >= 100 && stats.bond >= 100) {
            vibeEl.textContent = "Overjoyed! 🐾";
        } else if (stats.energy > 80) {
            vibeEl.textContent = "Super Energetic!";
        } else if (stats.happiness > 80) {
            vibeEl.textContent = "Feeling Loved";
        } else if (stats.energy <= 5 || stats.happiness <= 5 || stats.bond <= 5) {
            vibeEl.textContent = "Need Attention... 😿";
        } else {
            vibeEl.textContent = "Purring... 😸";
        }
    }

    checkHochiUnlock();
    checkHochiWarning();
}

function checkHochiUnlock() {
    if (stats.energy >= 100 && stats.happiness >= 100 && stats.bond >= 100) {
        const invDataStr = localStorage.getItem("forbes_inventory_data") || "[]";
        try {
            const invData = JSON.parse(invDataStr);
            const token = invData.find(i => i.id === UNLOCK_ITEM_ID);

            // Check if already unlocked locally in this session to avoid double modal
            const alreadyShown = sessionStorage.getItem('hochi_modal_shown');
            if (alreadyShown === 'true') return;

            triggerUnlockSequence(token && token.unlocked);
            sessionStorage.setItem('hochi_modal_shown', 'true');

        } catch (e) {
            triggerUnlockSequence(false);
        }
    }
}

function triggerUnlockSequence(alreadyUnlocked) {
    console.log("🏆 Hochi Welfare achievement triggered!");

    setTimeout(() => {
        if (window.showUnlockModal) {
            window.showUnlockModal({
                itemId: UNLOCK_ITEM_ID,
                title: "New Discovery!",
                itemName: "Cat Whisperer Token Unlocked",
                description: "You've maxed out Hochi's stats! Your bond is unbreakable.",
                alreadyUnlockedTitle: "Inventory Item Discovered!",
                alreadyUnlockedDesc: "You've already earned the Cat Whisperer Token, but Hochi still appreciates your love!"
            });
        }
    }, 500);
}

function initHochi() {
    const feedBtn = document.getElementById('feed-btn');
    const playBtn = document.getElementById('play-btn');
    const petBtn = document.getElementById('pet-btn');
    const modalClose = document.getElementById('modal-close');

    // RESET on every visit as requested
    window.resetHochiStats();
    sessionStorage.removeItem('hochi_modal_shown');

    if (!feedBtn) return; // Not on welfare page

    feedBtn.addEventListener('click', () => {
        stats.energy = Math.min(100, stats.energy + 10);
        localStorage.setItem(STAT_KEY, JSON.stringify(stats));
        updateHochiUI();
    });

    playBtn.addEventListener('click', () => {
        // PREVENT EXHAUSTION: Check if energy would drop too low
        const energyCost = 10;
        if (stats.energy - energyCost < 1) {
            triggerWarningModal("Hochi is too tired to play right now! Give her some food first.");
            return;
        }

        stats.happiness = Math.min(100, stats.happiness + 15);
        stats.energy = Math.max(1, stats.energy - energyCost);
        localStorage.setItem(STAT_KEY, JSON.stringify(stats));
        updateHochiUI();
    });

    petBtn.addEventListener('click', () => {
        stats.bond = Math.min(100, stats.bond + 10);
        stats.happiness = Math.min(100, stats.happiness + 5);
        localStorage.setItem(STAT_KEY, JSON.stringify(stats));
        updateHochiUI();
    });

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            const modal = document.getElementById('unlock-modal');
            if (modal) modal.style.display = 'none';
        });
    }

    /**
     * Helper to block action and show warning
     */
    function triggerWarningModal(customMsg) {
        const warningModal = document.getElementById('warning-modal');
        const warningDesc = document.getElementById('warning-desc');
        if (warningModal) {
            if (customMsg && warningDesc) warningDesc.textContent = customMsg;
            warningModal.style.display = 'flex';
        }
    }

    // Warning Modal Logic
    const warningModal = document.getElementById('warning-modal');
    const warningClose = document.getElementById('warning-close');
    if (warningClose && warningModal) {
        warningClose.addEventListener('click', () => {
            warningModal.style.display = 'none';
        });
    }
}

/**
 * Checks if stats are dangerously low and shows a warning modal
 */
function checkHochiWarning() {
    const lowThreshold = 5;
    if (stats.energy <= lowThreshold || stats.happiness <= lowThreshold || stats.bond <= lowThreshold) {
        const warningShown = sessionStorage.getItem('hochi_warning_shown');
        if (warningShown !== 'true') {
            const warningModal = document.getElementById('warning-modal');
            if (warningModal) {
                warningModal.style.display = 'flex';
                sessionStorage.setItem('hochi_warning_shown', 'true');
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', initHochi);
