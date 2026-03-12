/**
 * Shared Unlock Modal Logic
 * Creates and triggers a consistent unlock modal across pages
 */
window.showUnlockModal = function (options) {
    const { itemId, title, itemName, description, itemImage, itemIcon, alreadyUnlockedTitle, alreadyUnlockedDesc } = options;

    let alreadyUnlocked = false;
    let itemInfo = null;

    if (typeof defaultItems !== 'undefined') {
        itemInfo = defaultItems.find(i => i.id === itemId);
    }

    // If not found in defaults or defaults not loaded, use provided overrides
    if (!itemInfo) {
        itemInfo = {
            name: itemName,
            id: itemId,
            image: itemImage || "",
            icon: itemIcon || ""
        };
    }

    const invStr = localStorage.getItem("forbes_inventory_data") || "[]";
    try {
        const invData = JSON.parse(invStr);
        const token = invData.find(i => i.id === itemId);
        if (token && token.unlocked) {
            alreadyUnlocked = true;
        }
    } catch (e) { }

    // Unlock logic
    if (!alreadyUnlocked && typeof window.unlockItem === 'function') {
        window.unlockItem(itemId);
    }

    // Modal structure
    let modal = document.getElementById('shared-unlock-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'shared-unlock-modal';
        modal.className = 'shared-modal modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-visual" id="shared-modal-visual"></div>
                <h2 id="shared-modal-title"></h2>
                <p id="shared-modal-item-name"></p>
                <p id="shared-modal-desc"></p>
                <div class="modal-actions">
                    <button id="shared-modal-close" class="btn solid" style="width: 100%;">Amazing!</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('shared-modal-close').addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    // Populate content
    const mTitle = document.getElementById('shared-modal-title');
    const mDesc = document.getElementById('shared-modal-desc');
    const mName = document.getElementById('shared-modal-item-name');
    const mVisual = document.getElementById('shared-modal-visual');

    if (alreadyUnlocked && alreadyUnlockedTitle && alreadyUnlockedDesc) {
        mTitle.textContent = alreadyUnlockedTitle;
        mDesc.textContent = alreadyUnlockedDesc;
    } else {
        mTitle.textContent = title;
        mDesc.textContent = description;
    }
    mName.textContent = itemInfo.name || itemName;

    // Reset styles
    mVisual.style.background = '';
    mVisual.innerHTML = '';

    if (itemInfo) {
        if (itemInfo.image) {
            if (itemInfo.image.trim().startsWith('<svg')) {
                mVisual.innerHTML = itemInfo.image;
            } else {
                let filterClass = itemId === 10 ? 'drop-shadow(0 8px 15px rgba(0,0,0,0.15))' : 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))';
                mVisual.innerHTML = `<img src="${itemInfo.image}" alt="${itemInfo.name}" style="filter: ${filterClass};">`;
            }
        } else if (itemInfo.icon) {
            mVisual.innerHTML = `<i class="bi ${itemInfo.icon}" style="color: var(--burgundy);"></i>`;
        }

        if (itemId === 9) mVisual.style.background = 'white'; // Hochi specific
        else mVisual.style.background = '#fff8e1';
    }

    modal.style.display = 'flex';

    // Shimmering Audio
    if (window.playSharedAudio) {
        window.playSharedAudio('shimmer');
    }
};
