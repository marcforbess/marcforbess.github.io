/**
 * My Profile Page Logic
 * Handles session synchronization and interactions.
 */

const SESSION_KEY = "forbes_co_session";

function getSession() {
    try {
        const raw = localStorage.getItem(SESSION_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (_error) {
        return null;
    }
}

const galleryData = [
    {
        src: "media/gallery-2.jpeg",
        alt: "My Unfinished Coffee",
        caption: "I love ordering drinks. But you know what I love even more? Drinking until it's almost finished, and then just leaving it there."
    },
    {
        src: "media/gallery-5.jpeg",
        alt: "Heisenberg?!",
        caption: "I am a chemist, and I love what I do. There's just something about chemicals and reactions. It is much better than computer science, I'll tell you that."
    },
    {
        src: "media/gallery-1.jpeg",
        alt: "Part-Time Model",
        caption: "At one point I actually tried venturing into new fields, like modelling. Honestly, I think I did a pretty decent job, don't mean to brag but I may or may not have turned down a kazillion agencies."
    },
    {
        src: "media/gallery-3.jpeg",
        alt: "Pastries",
        caption: "I absolutely have a thing for pastries. Croissants, bagels, you name it. This was us looking at that banofee tart, which my boyfriend thinks is an abomination."
    },
    {
        src: "media/gallery-4.jpeg",
        alt: "Galentine's",
        caption: "Just me and my girlfriends having dinner on Valentine's Day, where I just decided it would be nice to take a picture beside a lamppost."
    },
    {
        src: "media/gallery-6.jpeg",
        alt: "Cafes",
        caption: "This was taken at Broom Artisan Cafe. The coffee & pastries were divine, but the main courses? Meh. But hey, if the cafe looks beautiful, that's all that matters, right?"
    },
    {
        id: "corrupt-1",
        src: "media/gallery-7.jpeg",
        alt: "Sucker for Dresses",
        caption: "I love dresses, by the way. And I'm 1,000% confident in my abilities to be able to identify absolute divine ones. Take this red dress I'm wearing for example.",
        corrupted: true
    }
];

function updateSessionUi() {
    const sessionStatus = document.getElementById("session-status");
    const session = getSession();
    if (sessionStatus && session) {
        sessionStatus.textContent = session.username === 'jasmine' ? "Profile of Jasmine" : `Profile of ${session.username}`;
    }
}

function renderGallery() {
    const track = document.getElementById('profile-carousel');
    if (!track) return;

    // Check if Expert Repairman Token (ID 15) is unlocked
    let isRepairmanUnlocked = false;
    try {
        const invStr = localStorage.getItem("forbes_inventory_data");
        if (invStr) {
            const arr = JSON.parse(invStr);
            isRepairmanUnlocked = arr.find(i => i.id === 15)?.unlocked || false;
        }
    } catch (e) { }

    track.innerHTML = galleryData.map(item => {
        const isCurrentlyCorrupted = item.corrupted && !isRepairmanUnlocked;
        const displayCaption = isCurrentlyCorrupted ? "This image is corrupted and cannot be displayed properly." : item.caption;
        const displayAlt = isCurrentlyCorrupted ? "Memory Block" : item.alt;

        return `
            <div class="carousel-slide flip-card ${isCurrentlyCorrupted ? 'corrupted-card' : ''}" data-id="${item.id || ''}">
                <div class="flip-card-inner">
                    <div class="flip-card-front" id="front-${item.id || ''}">
                        <img src="${item.src}" alt="${displayAlt}">
                        <div class="click-hint">
                            <span>Click to view description</span>
                        </div>
                    </div>
                    <div class="flip-card-back">
                        <div class="back-content">
                            <h4>${displayAlt}</h4>
                            <div class="back-divider"></div>
                            <p>${displayCaption}</p>
                            ${isCurrentlyCorrupted ? `
                                <button class="restore-btn" onclick="openRestoreModal(event, '${item.id}', '${item.src}')">
                                    <i class="bi bi-wrench-adjustable"></i> Restore Image
                                </button>
                            ` : ''}
                            <i class="bi bi-stars back-icon"></i>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function setupCarousel() {
    const track = document.getElementById('profile-carousel');
    const nextBtn = document.getElementById('gallery-next');
    const prevBtn = document.getElementById('gallery-prev');

    if (!track || !nextBtn || !prevBtn) return;

    // Carousel Navigation
    nextBtn.addEventListener('click', () => {
        const slide = track.querySelector('.carousel-slide');
        const gap = parseInt(getComputedStyle(track).columnGap) || 0;
        const scrollWidth = slide.offsetWidth + gap;
        track.scrollBy({ left: scrollWidth, behavior: 'smooth' });
    });

    prevBtn.addEventListener('click', () => {
        const slide = track.querySelector('.carousel-slide');
        const gap = parseInt(getComputedStyle(track).columnGap) || 0;
        const scrollWidth = slide.offsetWidth + gap;
        track.scrollBy({ left: -scrollWidth, behavior: 'smooth' });
    });

    // Flip Card Toggle
    track.addEventListener('click', (e) => {
        const card = e.target.closest('.flip-card');
        if (card) {
            card.classList.toggle('flipped');
        }
    });
}

function setupChickenSelector() {
    const editHint = document.querySelector('.edit-hint');
    const selector = document.getElementById('chicken-selector');
    const valueEl = document.getElementById('chicken-part-value');

    if (!editHint || !selector || !valueEl) return;

    // Toggle selector
    editHint.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = selector.style.display === 'flex';
        selector.style.display = isOpen ? 'none' : 'flex';
    });

    // Handle choice click
    selector.addEventListener('click', (e) => {
        const btn = e.target.closest('.choice-btn');
        if (btn) {
            const newVal = btn.getAttribute('data-val');
            valueEl.style.opacity = '0';

            setTimeout(() => {
                valueEl.textContent = `The Mighty Chicken ${newVal}`;
                valueEl.style.opacity = '1';
                selector.style.display = 'none';

                // Trigger Token Unlock for Drumstick
                if ((newVal === 'Drumstick' || newVal === 'Thigh') && window.showUnlockModal) {
                    window.showUnlockModal({
                        itemId: 12,
                        title: "Tasty Choice!",
                        itemName: "Picky Eater Token Unlocked",
                        description: "You will never back down to such inferior chicken parts, and know you deserve better. Fair enough."
                    });
                }

                // Update active state
                selector.querySelectorAll('.choice-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            }, 200);
        }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!selector.contains(e.target) && !editHint.contains(e.target)) {
            selector.style.display = 'none';
        }
    });
}

/**
 * Restoration Mini-Game Logic (Phase 1, 2, 3)
 */
let currentRestoreTarget = null;
let currentRestoreSrc = null;
let mashCount = 0;
let alignCount = 0;
let mashInterval = null;
const MASH_GOAL = 15;
const ALIGN_GOAL = 6;

function playRestoreAudio(type) {
    if (window.playSharedAudio) {
        if (type === 'success') {
            window.playSharedAudio('grand-success');
        } else {
            window.playSharedAudio(type);
        }
    }
}

window.openRestoreModal = function (e, id, src) {
    if (e) e.stopPropagation();
    currentRestoreTarget = id;
    currentRestoreSrc = src;

    const modal = document.getElementById('restore-modal');
    const content = modal.querySelector('.restore-content');

    // Reset state
    content.setAttribute('data-state', 'phase-1');
    mashCount = 0;
    alignCount = 0;
    if (mashInterval) clearInterval(mashInterval);
    updateMashProgress();
    modal.classList.add('active');
};

function setupRestorationGame() {
    const modal = document.getElementById('restore-modal');
    const content = modal.querySelector('.restore-content');

    // Phase 1 Elements
    const flask = document.getElementById('drag-flask');
    const target = document.getElementById('drop-target');

    // Phase 2 Elements
    const mashCircle = document.getElementById('mash-circle');

    // Phase 3 Elements
    const alignTarget = document.getElementById('alignment-target');

    // Shared Buttons
    const cancelBtn = document.getElementById('cancel-restore');
    const confirmBtn = document.getElementById('confirm-restore');

    if (!flask || !target) return;

    // Phase 1 Drag logic
    flask.setAttribute('draggable', 'true');
    flask.style.touchAction = ''; // remove touchAction none

    flask.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', 'flask');
        flask.style.opacity = '0.5';
    });

    flask.addEventListener('dragend', () => {
        flask.style.opacity = '1';
    });

    target.addEventListener('dragover', (e) => {
        e.preventDefault();
        target.classList.add('drag-over');
    });

    target.addEventListener('dragleave', () => {
        target.classList.remove('drag-over');
    });

    target.addEventListener('drop', (e) => {
        e.preventDefault();
        target.classList.remove('drag-over');
        const data = e.dataTransfer.getData('text/plain');
        if (data === 'flask') {
            playRestoreAudio('drop');
            // Final transition to phase 2
            content.setAttribute('data-state', 'phase-2');

            // Start mashing resistance
            if (mashInterval) clearInterval(mashInterval);
            mashInterval = setInterval(() => {
                if (mashCount > 0) {
                    mashCount -= 0.4; // Mild resistance penalty per tick
                    if (mashCount < 0) mashCount = 0;
                    updateMashProgress();
                }
            }, 100);
        }
    });

    // Touch support for mobile (simplified, matching inventory)
    flask.addEventListener('touchstart', (e) => {
        flask.classList.add('grabbing');
    });

    // Phase 2 Mashing logic
    mashCircle.addEventListener('click', () => {
        playRestoreAudio('mash');
        mashCount++;
        updateMashProgress();

        // Jitter effect
        mashCircle.classList.add('jitter');
        setTimeout(() => mashCircle.classList.remove('jitter'), 100);

        if (mashCount >= MASH_GOAL) {
            playRestoreAudio('phase-complete');
            if (mashInterval) clearInterval(mashInterval);
            content.setAttribute('data-state', 'phase-3');
            moveAlignmentTarget();
        }
    });

    // Phase 3 Alignment logic
    alignTarget.addEventListener('click', () => {
        playRestoreAudio('click');
        alignCount++;
        document.getElementById('align-count').textContent = alignCount;

        if (alignCount >= ALIGN_GOAL) {
            playRestoreAudio('phase-complete');
            content.setAttribute('data-state', 'loading');
            setTimeout(() => {
                playRestoreAudio('success'); // Grand orchestra playback!
                content.setAttribute('data-state', 'confirmation');
            }, 1500);
        } else {
            moveAlignmentTarget();
        }
    });

    // Shared listeners
    cancelBtn.addEventListener('click', () => modal.classList.remove('active'));
    confirmBtn.addEventListener('click', () => finishRestoration());

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });
}

function updateMashProgress() {
    const bar = document.getElementById('mash-progress');
    if (bar) {
        const percent = Math.min((mashCount / MASH_GOAL) * 100, 100);
        bar.style.width = percent + '%';
    }
}

function moveAlignmentTarget() {
    const zone = document.getElementById('alignment-zone');
    const target = document.getElementById('alignment-target');
    if (!zone || !target) return;

    const maxX = zone.clientWidth - target.clientWidth;
    const maxY = zone.clientHeight - target.clientHeight;

    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    target.style.left = x + 'px';
    target.style.top = y + 'px';
}

function finishRestoration() {
    const targetId = currentRestoreTarget;
    const frontEl = document.getElementById(`front-${targetId}`);
    const modal = document.getElementById('restore-modal');

    if (!frontEl || !currentRestoreSrc) return;

    // Hide Modal and Restore unblurred image
    modal.classList.remove('active');
    frontEl.innerHTML = `<img src="${currentRestoreSrc}" alt="Restored Image">
                         <div class="click-hint"><span>Click to view description</span></div>`;

    // Trigger Token Unlock
    if (window.showUnlockModal) {
        window.showUnlockModal({
            itemId: 15,
            title: "Expert Repairman!",
            itemName: "Expert Repairman Token",
            description: "You've successfully salvaged a corrupted data block using experimental restoration potions. The memory is fully restored."
        });
    }

    // Mark card as restored and reveal true content
    const card = document.querySelector(`.carousel-slide[data-id="${targetId}"]`);
    if (card) {
        card.classList.remove('corrupted-card');
        const backP = card.querySelector('.flip-card-back p');
        const backH4 = card.querySelector('.flip-card-back h4');
        const originalItem = galleryData.find(d => d.id === targetId);

        if (originalItem) {
            if (backP) backP.textContent = originalItem.caption;
            if (backH4) backH4.textContent = originalItem.alt;
        }

        const btn = card.querySelector('.restore-btn');
        if (btn) btn.remove();
    }
}

function init() {
    updateSessionUi();
    renderGallery();
    setupCarousel();
    setupChickenSelector();
    setupRestorationGame();
}

document.addEventListener('DOMContentLoaded', init);
