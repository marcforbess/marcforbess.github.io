/**
 * Inventory Page Logic
 * Handles dynamic grid rendering and "locked" state notifications.
 */

const INVENTORY_DATA_KEY = "forbes_inventory_data";

function playAudio(type) {
    if (window.playSharedAudio) {
        window.playSharedAudio(type);
    }
}

const defaultItems = [
    {
        id: 9,
        name: "Cat Whisperer Token",
        color: "#FFE082",
        icon: "bi-cat-fill",
        image: "media/cat-icon.png",
        unlocked: false
    },
    {
        id: 10,
        name: "Coffee Master Token",
        color: "#FFE082",
        icon: "bi-cup-hot",
        image: "media/coffee.png",
        unlocked: false
    },
    {
        id: 11,
        name: "Loyalty Token",
        color: "#FFE082",
        icon: "bi-shield-lock-fill",
        image: "media/loyalty.png",
        unlocked: false
    },
    {
        id: 12,
        name: "Picky Eater Token",
        color: "#FFE082",
        icon: "bi-egg-fried",
        image: "media/picky-eater.png",
        unlocked: false
    },
    {
        id: 13,
        name: "Puzzle Master Token",
        color: "#FFE082",
        icon: "bi-grid-3x3-gap",
        image: "media/puzzle.png",
        unlocked: false
    },
    {
        id: 14,
        name: "Detective Cupid Token",
        color: "#FFE082",
        icon: "bi-search-heart",
        image: "media/detective.png",
        unlocked: false
    },
    {
        id: 15,
        name: "Expert Repairman Token",
        color: "#FFE082",
        icon: "bi-tools",
        image: "media/repair.png",
        unlocked: false
    }
];

let items = [];

// DOM Elements
const gridEl = document.getElementById('inventory-grid');
const progressEl = document.getElementById('inventory-progress');
const modal = document.getElementById('unlock-modal');
const modalCancel = document.getElementById('modal-cancel');

// Redemption Elements
const redeemActionWrap = document.getElementById('redeem-action-wrap');
const redeemBtn = document.getElementById('redeem-btn');
const redeemInviteModal = document.getElementById('redeem-invite-modal');
const craftKeyBtn = document.getElementById('craft-key-btn');
const keyholeModal = document.getElementById('keyhole-modal');
const masterKeyAsset = document.getElementById('master-key');
const keyTarget = document.getElementById('key-target');
const systemLoading = document.getElementById('system-loading');

/**
 * Load data from localStorage or use defaults
 */
function loadData() {
    const savedItems = localStorage.getItem(INVENTORY_DATA_KEY);
    if (savedItems) {
        let loadedItems = JSON.parse(savedItems);

        // Ensure any newly added default items are merged in
        let updated = false;
        defaultItems.forEach(defaultItem => {
            let existing = loadedItems.find(i => i.id === defaultItem.id);
            if (!existing) {
                loadedItems.push({ ...defaultItem });
                updated = true;
                console.log(`🆕 Added missing item to inventory state: ${defaultItem.name}`);
            } else {
                // Sync color and images if they've changed in code
                if (existing.color !== defaultItem.color) { existing.color = defaultItem.color; updated = true; }
                if (defaultItem.image && existing.image !== defaultItem.image) {
                    existing.image = defaultItem.image;
                    updated = true;
                }
            }
        });

        items = loadedItems;
        if (updated) saveData();
    } else {
        items = defaultItems.map(item => ({ ...item }));
        saveData();
    }
    updateProgress();
}

/**
 * Save current items state to localStorage
 */
function saveData() {
    localStorage.setItem(INVENTORY_DATA_KEY, JSON.stringify(items));
}

function updateProgress() {
    const unlockedCount = items.filter(i => i.unlocked).length;
    if (progressEl) progressEl.textContent = `${unlockedCount} of ${items.length} items discovered`;

    // Check if all items are discovered for redemption
    if (unlockedCount === items.length && items.length > 0) {
        if (redeemActionWrap) redeemActionWrap.style.display = 'block';
    } else {
        if (redeemActionWrap) redeemActionWrap.style.display = 'none';
    }
}

/**
 * Global helper to unlock an item
 */
window.unlockItem = function (id) {
    const item = items.find(i => i.id === id);
    if (item && !item.unlocked) {
        item.unlocked = true;
        saveData();
        updateProgress();
        renderInventory();
        console.log(`✨ item discovered: ${item.name}`);
        return true;
    }
    return false;
};

/**
 * Resets the entire collection to locked state
 */
window.resetInventory = function () {
    localStorage.removeItem(INVENTORY_DATA_KEY);
    loadData();
    renderInventory();
    console.log("♻️ Inventory has been reset to defaults.");
};

/**
 * Renders the inventory grid
 */
function renderInventory() {
    if (!gridEl) return;
    gridEl.innerHTML = '';

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = `inventory-card ${item.unlocked ? '' : 'locked'}`;
        card.style.setProperty('--accent', item.color);

        let visual = `<i class="bi bi-lock-fill"></i>`;

        if (item.unlocked) {
            visual = `<i class="bi ${item.icon}"></i>`;
            if (item.image) {
                if (item.image.trim().startsWith('<svg')) {
                    visual = item.image;
                } else {
                    visual = `<img src="${item.image}" alt="${item.name}" class="inventory-item-asset">`;
                }
            }
        }

        card.innerHTML = `
            <div class="item-visual-wrap">
                <div class="visual-glow"></div>
                ${visual}
            </div>
            <div class="item-info">
                <p class="item-name">${item.unlocked ? item.name : 'Unknown Item'}</p>
                <div class="unlock-status">
                    ${item.unlocked ? '<span class="status-tag">Unlocked</span>' : '<i class="bi bi-lock-fill"></i>'}
                </div>
            </div>
        `;

        card.addEventListener('click', () => {
            if (!item.unlocked) {
                showLockedModal();
            } else {
                console.log(`Inspecting ${item.name}`);
            }
        });

        gridEl.appendChild(card);
    });
}

function showLockedModal() {
    if (modal) modal.style.display = 'flex';
}

function closeLockedModal() {
    if (modal) modal.style.display = 'none';
}

// Redemption Flow Logic
if (redeemBtn) {
    redeemBtn.addEventListener('click', () => {
        playAudio('grand-success');
        if (redeemInviteModal) redeemInviteModal.style.display = 'flex';
    });
}

// Close modals triggers
document.querySelectorAll('.modal-close-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
        const modal = trigger.closest('.modal-overlay');
        if (modal) modal.style.display = 'none';
    });
});

if (craftKeyBtn) {
    craftKeyBtn.addEventListener('click', () => {
        playAudio('craft');
        if (redeemInviteModal) redeemInviteModal.style.display = 'none';
        if (keyholeModal) keyholeModal.style.display = 'flex';
        initDragAndDrop();
    });
}

function initDragAndDrop() {
    if (!masterKeyAsset || !keyTarget) return;

    masterKeyAsset.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', 'master-key');
        masterKeyAsset.style.opacity = '0.5';
    });

    masterKeyAsset.addEventListener('dragend', () => {
        masterKeyAsset.style.opacity = '1';
    });

    keyTarget.addEventListener('dragover', (e) => {
        e.preventDefault();
        keyTarget.classList.add('highlight');
    });

    keyTarget.addEventListener('dragleave', () => {
        keyTarget.classList.remove('highlight');
    });

    keyTarget.addEventListener('drop', (e) => {
        e.preventDefault();
        const data = e.dataTransfer.getData('text/plain');
        if (data === 'master-key') {
            handleFinalUnlock();
        }
    });

    // Touch support for mobile (simplified)
    masterKeyAsset.addEventListener('touchstart', (e) => {
        masterKeyAsset.classList.add('grabbing');
    });
}

function handleFinalUnlock() {
    playAudio('success');
    if (keyholeModal) keyholeModal.style.display = 'none';

    if (systemLoading) {
        systemLoading.classList.add('visible');
        setTimeout(() => {
            window.location.href = 'itinerary-builder.html';
        }, 3000); // 3 seconds of "loading"
    }
}

if (modalCancel) modalCancel.addEventListener('click', closeLockedModal);

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.style.display = 'none';
    }
});

loadData();

function init() {
    renderInventory();
}

document.addEventListener('DOMContentLoaded', init);
