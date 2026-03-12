/**
 * Date Itinerary Builder Logic
 * Handles dynamic rendering of sections and products, selection logic, and the sticky checkout bar.
 */

document.addEventListener('DOMContentLoaded', () => {
    // SECURITY CHECK: Ensure all tokens are unlocked
    let allUnlocked = false;
    try {
        const invStr = localStorage.getItem("forbes_inventory_data");
        if (invStr) {
            const arr = JSON.parse(invStr);
            const unlockedTokens = arr.filter(i => i.unlocked).length;
            allUnlocked = (arr.length > 0 && unlockedTokens === arr.length);
        }
    } catch (e) { }

    if (!allUnlocked) {
        const deniedModal = document.getElementById('access-denied-modal');
        if (deniedModal) {
            deniedModal.style.display = 'flex';
            document.getElementById('close-access-denied').addEventListener('click', () => {
                window.location.href = 'dashboard.html';
            });
        }
        return; // Halt further execution
    }

    const gridEl = document.getElementById('itinerary-grid');
    const stickyBar = document.getElementById('sticky-checkout-bar');
    const stickyTotalEl = document.getElementById('sticky-total-val');
    const confirmBtn = document.getElementById('sticky-proceed-btn');

    // Modals
    const emptyModal = document.getElementById('empty-modal');
    const closeEmptyModalBtn = document.getElementById('close-empty-modal');
    const limitModal = document.getElementById('limit-modal');
    const limitModalMsg = document.getElementById('limit-modal-msg');
    const closeLimitModalBtn = document.getElementById('close-limit-modal');
    const incompleteModal = document.getElementById('incomplete-modal');
    const closeIncompleteModalBtn = document.getElementById('close-incomplete-modal');

    let selectedItems = [];

    /**
     * Formats currency with commas for thousands
     */
    function formatCurrency(amount) {
        return `${ITINERARY_CONFIG.currency} ${amount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    }

    /**
     * Render all sections and products from ITINERARY_CONFIG
     */
    function renderBuilder() {
        if (!gridEl) return;
        gridEl.innerHTML = '';

        ITINERARY_CONFIG.sections.forEach(section => {
            const sectionDiv = document.createElement('section');
            sectionDiv.className = 'itinerary-section';
            sectionDiv.id = `section-${section.id}`;

            const selectedInSection = getSelectedInSection(section.id);

            sectionDiv.innerHTML = `
                <div class="section-header">
                    <div class="section-title-wrap">
                        <h2>${section.title}</h2>
                        <span class="selection-indicator">Selected: ${selectedInSection.length}/${section.maxSelection || '∞'}</span>
                    </div>
                    <p>${section.subtitle}</p>
                </div>
                <div class="product-grid" id="grid-${section.id}"></div>
            `;

            gridEl.appendChild(sectionDiv);

            const productGrid = document.getElementById(`grid-${section.id}`);
            section.products.forEach(product => {
                const isSelected = selectedItems.find(i => i.id === product.id);
                const card = document.createElement('div');
                card.className = `product-card ${!product.inStock ? 'out-of-stock' : ''} ${isSelected ? 'selected' : ''}`;
                card.id = `card-${product.id}`;

                card.innerHTML = `
                    <div class="product-image-wrap">
                        <img src="${product.image}" alt="${product.name}" loading="lazy">
                        <span class="stock-badge">${product.inStock ? 'In Stock' : 'Unavailable'}</span>
                    </div>
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p class="product-desc">${product.description}</p>
                        <div class="product-footer">
                            <span class="price-tag">${formatCurrency(product.price)}</span>
                            <button class="add-btn" data-id="${product.id}">
                                <i class="bi ${isSelected ? 'bi-check-lg' : 'bi-plus-lg'}"></i>
                            </button>
                        </div>
                    </div>
                `;

                if (product.inStock) {
                    card.addEventListener('click', (e) => {
                        if (e.target.closest('.add-btn') || !isSelected) {
                            toggleItem(product, section);
                        }
                    });
                }

                productGrid.appendChild(card);
            });
        });
    }

    /**
     * Get all items currently selected in a specific section
     */
    function getSelectedInSection(sectionId) {
        const section = ITINERARY_CONFIG.sections.find(s => s.id === sectionId);
        if (!section) return [];
        return selectedItems.filter(item =>
            section.products.some(p => p.id === item.id)
        );
    }

    /**
     * Add or remove an item from the itinerary with volume/selection limits
     */
    function toggleItem(product, section) {
        const index = selectedItems.findIndex(i => i.id === product.id);
        const max = section.maxSelection || Infinity;
        const currentSelected = getSelectedInSection(section.id);

        if (index === -1) {
            // Adding a new item
            if (currentSelected.length >= max) {
                if (max === 1) {
                    // Auto-replace existing single choice
                    const oldItem = currentSelected[0];
                    const oldIndex = selectedItems.findIndex(i => i.id === oldItem.id);
                    selectedItems.splice(oldIndex, 1);
                    selectedItems.push(product);
                } else {
                    // Multiple max limit reached
                    showLimitWarning(section.title, max);
                    return;
                }
            } else {
                selectedItems.push(product);
            }
        } else {
            // Removing an existing item
            selectedItems.splice(index, 1);
        }

        updateUI();
    }

    /**
     * Show a custom warning for selection limits
     */
    function showLimitWarning(title, max) {
        if (limitModalMsg) {
            limitModalMsg.textContent = `You can only select up to ${max} item(s) for the "${title}" section.`;
        }
        if (limitModal) limitModal.style.display = 'flex';
    }

    /**
     * Updates the counts and visual states
     */
    function updateUI() {
        // Update visuals in the main builder
        document.querySelectorAll('.product-card').forEach(card => {
            const id = card.id.replace('card-', '');
            const isSelected = selectedItems.find(i => i.id === id);
            if (isSelected) {
                card.classList.add('selected');
                const btn = card.querySelector('.add-btn i');
                if (btn) btn.className = 'bi bi-check-lg';
            } else {
                card.classList.remove('selected');
                const btn = card.querySelector('.add-btn i');
                if (btn) btn.className = 'bi bi-plus-lg';
            }
        });

        // Update indicators in headers
        ITINERARY_CONFIG.sections.forEach(section => {
            const indicator = document.querySelector(`#section-${section.id} .selection-indicator`);
            if (indicator) {
                const selected = getSelectedInSection(section.id);
                indicator.textContent = `Selected: ${selected.length}/${section.maxSelection || '∞'}`;
            }
        });

        updateStickyBar();
    }

    /**
     * Update the sticky bottom bar
     */
    function updateStickyBar() {
        if (!stickyBar) return;

        if (selectedItems.length === 0) {
            stickyBar.classList.remove('visible');
            if (stickyTotalEl) stickyTotalEl.textContent = formatCurrency(0);
            return;
        }

        stickyBar.classList.add('visible');
        let total = 0;
        selectedItems.forEach(item => {
            total += item.price;
        });

        if (stickyTotalEl) stickyTotalEl.textContent = formatCurrency(total);
    }

    // Event Listeners
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            if (selectedItems.length === 0) {
                if (emptyModal) emptyModal.style.display = 'flex';
                return;
            }

            // Check if every section has at least one item
            const incompleteSections = ITINERARY_CONFIG.sections.filter(section => {
                const selected = getSelectedInSection(section.id);
                return selected.length === 0;
            });

            if (incompleteSections.length > 0) {
                if (incompleteModal) incompleteModal.style.display = 'flex';
                return;
            }

            // Persistence: Save selected items for the checkout page
            localStorage.setItem('pending_itinerary', JSON.stringify(selectedItems));

            console.log("Proceeding to checkout with items:", selectedItems);

            // Redirect to the checkout page
            window.location.href = 'checkout.html';
        });
    }

    if (closeEmptyModalBtn) {
        closeEmptyModalBtn.addEventListener('click', () => {
            if (emptyModal) emptyModal.style.display = 'none';
        });
    }

    if (closeLimitModalBtn) {
        closeLimitModalBtn.addEventListener('click', () => {
            if (limitModal) limitModal.style.display = 'none';
        });
    }

    if (closeIncompleteModalBtn) {
        closeIncompleteModalBtn.addEventListener('click', () => {
            if (incompleteModal) incompleteModal.style.display = 'none';
        });
    }

    renderBuilder();
});
