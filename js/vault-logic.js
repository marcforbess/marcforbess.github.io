/**
 * Modern Vault Logic - Gallery Edition
 * Handles the glass keypad input and the interactive vault gallery.
 */

document.addEventListener('DOMContentLoaded', () => {
    const code = "83075";
    let currentInput = "";

    const dotsContainer = document.getElementById('code-dots');
    const keypad = document.querySelector('.modern-keypad');
    const vaultWrapper = document.getElementById('vault-wrapper');
    const vaultGallery = document.getElementById('vault-gallery');

    // Generate dots dynamically
    dotsContainer.innerHTML = '';
    for (let i = 0; i < code.length; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot';
        dotsContainer.appendChild(dot);
    }
    const dots = document.querySelectorAll('.dot');

    // Modal Elements
    const vaultModal = document.getElementById('vault-modal');
    const modalClose = document.getElementById('modal-close');
    const itemLetter = document.getElementById('item-letter');
    const itemChest = document.getElementById('item-chest');
    const contentLetter = document.getElementById('modal-content-letter');

    function updateDots() {
        dots.forEach((dot, index) => {
            if (index < currentInput.length) {
                dot.classList.add('filled');
            } else {
                dot.classList.remove('filled');
            }
        });
    }

    function playAudio(type) {
        if (window.playSharedAudio) {
            window.playSharedAudio(type);
        }
    }

    function checkCode() {
        if (currentInput === code) {
            unlockVault();
        } else {
            failCode();
        }
    }

    function unlockVault() {
        playAudio('success');
        vaultWrapper.classList.add('unlocked');

        // Transition to the gallery room
        setTimeout(() => {
            vaultWrapper.style.display = 'none';
            vaultGallery.style.display = 'grid'; // Show as grid to allow stacking

            // Check initial state of items
            if (isItemUnlocked(14)) {
                itemChest.classList.add('opened');
                document.getElementById('chest-status').textContent = "Chest opened";
                document.getElementById('chest-desc').textContent = "Contents Discovered";
            }

            setTimeout(() => {
                vaultGallery.classList.add('visible');
            }, 50);
            document.body.style.background = "#050505";
        }, 1000);
    }

    function failCode() {
        playAudio('error');
        dots.forEach(dot => dot.classList.add('error'));
        setTimeout(() => {
            currentInput = "";
            dots.forEach(dot => {
                dot.classList.remove('filled');
                dot.classList.remove('error');
            });
        }, 600);
    }

    // Keypad Logic
    keypad.addEventListener('click', (e) => {
        const btn = e.target.closest('.keypad-btn');
        if (!btn) return;

        playAudio('tap');
        const val = btn.dataset.val;

        if (val === 'C') {
            currentInput = "";
            updateDots();
        } else if (val === 'OK') {
            if (currentInput.length > 0) checkCode();
        } else {
            if (currentInput.length < code.length) {
                currentInput += val;
                updateDots();
                if (currentInput.length === code.length) setTimeout(checkCode, 400);
            }
        }
    });

    // Discovery Helper
    function isItemUnlocked(id) {
        const invStr = localStorage.getItem("forbes_inventory_data") || "[]";
        try {
            const invData = JSON.parse(invStr);
            return invData.some(i => i.id === id && i.unlocked);
        } catch (e) { return false; }
    }

    window.unlockItem = function (id) {
        const invStr = localStorage.getItem("forbes_inventory_data") || "[]";
        try {
            let invData = JSON.parse(invStr);
            const item = invData.find(i => i.id === id);
            if (item) {
                item.unlocked = true;
            } else {
                // If it doesn't exist in saved data, we add it with default state
                invData.push({ id, unlocked: true });
            }
            localStorage.setItem("forbes_inventory_data", JSON.stringify(invData));
        } catch (e) { }
    };

    // Gallery Interaction Logic
    itemLetter.addEventListener('click', () => {
        playAudio('tap');
        showModal();
    });

    itemChest.addEventListener('click', () => {
        if (isItemUnlocked(14)) return; // Disable once opened

        playAudio('tap');

        // Unlock Detective Cupid Token (ID 14)
        if (!isItemUnlocked(14)) {
            if (typeof window.showUnlockModal === 'function') {
                window.showUnlockModal({
                    itemId: 14,
                    title: "What Have We Here?",
                    itemName: "Detective Cupid Token",
                    itemImage: "media/detective.png",
                    description: "You've uncovered the secret vault and found some stuff that some would deem intimate and private."
                });

                // Update visual state
                itemChest.classList.add('opened');
                document.getElementById('chest-status').textContent = "Chest opened";
                document.getElementById('chest-desc').textContent = "Contents Discovered";
            }
        }
    });

    function showModal() {
        vaultModal.style.display = 'flex';
        contentLetter.style.display = 'block';
    }

    function closeModal() {
        playAudio('tap');
        vaultModal.style.display = 'none';
        contentLetter.style.display = 'none';
    }

    modalClose.addEventListener('click', closeModal);
    vaultModal.addEventListener('click', (e) => {
        if (e.target === vaultModal) closeModal();
    });

    // Support keyboard typing
    window.addEventListener('keydown', (e) => {
        if (e.key >= '0' && e.key <= '9') {
            playAudio('tap');
            if (currentInput.length < code.length) {
                currentInput += e.key;
                updateDots();
                if (currentInput.length === code.length) setTimeout(checkCode, 400);
            }
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
            playAudio('tap');
            currentInput = currentInput.slice(0, -1);
            updateDots();
        } else if (e.key === 'Enter') {
            playAudio('tap');
            if (currentInput.length > 0) checkCode();
        } else if (e.key === 'Escape') {
            if (vaultModal.style.display === 'flex') {
                closeModal();
            } else {
                currentInput = "";
                updateDots();
            }
        }
    });
});
