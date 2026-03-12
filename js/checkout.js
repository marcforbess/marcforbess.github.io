/**
 * Checkout Logic
 * Handles order loading, payment selection, and mock transaction flow.
 */

document.addEventListener('DOMContentLoaded', () => {
    const listEl = document.getElementById('order-items-list');
    const subtotalEl = document.getElementById('subtotal-val');
    const grandTotalEl = document.getElementById('grand-total-val');
    const paymentGrid = document.getElementById('payment-methods-grid');
    const payBtn = document.getElementById('pay-now-btn');
    const loadingOverlay = document.getElementById('loading-overlay');
    const successView = document.getElementById('success-view');

    function playAudio(type) {
        if (window.playSharedAudio) {
            window.playSharedAudio(type);
        }
    }

    let orderItems = [];
    let selectedMethod = null;

    // Define Payment Methods
    const PAYMENT_METHODS = [
        { id: 'fpx', name: 'FPX Online Banking', icon: 'bi-bank', description: 'Pay via your favorite bank portal', available: false },
        { id: 'ewallet', name: 'Digital e-Wallet', icon: 'bi-wallet2', description: 'Boost, GrabPay, Touch n Go, or ShopeePay', available: false },
        { id: 'card', name: 'Credit/Debit Card', icon: 'bi-credit-card', description: 'Visa, Mastercard, or AMEX', available: false },
        { id: 'lovepoints', name: 'Love Points', icon: 'bi-heart-fill', description: 'Redeem your accumulated affection', available: true }
    ];

    /**
     * Load pending order from localStorage
     */
    function loadOrder() {
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

        const stored = localStorage.getItem('pending_itinerary');

        if (!allUnlocked || !stored) {
            const deniedModal = document.getElementById('access-denied-modal');
            if (deniedModal) {
                deniedModal.style.display = 'flex';
                document.getElementById('close-access-denied').addEventListener('click', () => {
                    window.location.href = 'dashboard.html';
                });
            } else {
                window.location.href = 'dashboard.html';
            }
            return;
        }

        orderItems = JSON.parse(stored);
        renderOrder();
    }

    /**
     * Render the list of items and totals
         */
    function renderOrder() {
        if (!listEl) return;
        listEl.innerHTML = '';
        let total = 0;

        orderItems.forEach(item => {
            total += item.price;
            const itemDiv = document.createElement('div');
            itemDiv.className = 'checkout-item';
            itemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="checkout-item-img">
                <div class="checkout-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.description.substring(0, 60)}...</p>
                </div>
                <div class="checkout-item-price">${formatCurrency(item.price)}</div>
            `;
            listEl.appendChild(itemDiv);
        });

        subtotalEl.textContent = formatCurrency(total);
        grandTotalEl.textContent = formatCurrency(total);
    }

    /**
     * Render payment methods selection
     */
    function renderPaymentMethods() {
        if (!paymentGrid) return;
        paymentGrid.innerHTML = '';

        PAYMENT_METHODS.forEach(method => {
            const card = document.createElement('div');
            card.className = `payment-method-card ${!method.available ? 'disabled' : ''}`;
            card.dataset.id = method.id;

            card.innerHTML = `
                <i class="bi ${method.icon}"></i>
                <div class="method-info">
                    <h5>${method.name}</h5>
                    <p>${method.available ? method.description : 'Coming Soon'}</p>
                </div>
                <div class="check-icon"><i class="bi bi-check-circle-fill"></i></div>
            `;

            if (method.available) {
                card.addEventListener('click', () => selectPayment(method.id));
            }

            paymentGrid.appendChild(card);
        });
    }

    /**
     * Handle payment method selection
     */
    function selectPayment(methodId) {
        selectedMethod = methodId;

        // Update UI
        document.querySelectorAll('.payment-method-card').forEach(card => {
            card.classList.toggle('selected', card.dataset.id === methodId);
        });

        // Enable pay button
        payBtn.disabled = false;
    }

    /**
     * Format currency helper
     */
    function formatCurrency(amount) {
        return `${ITINERARY_CONFIG.currency} ${amount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    }

    /**
     * Handle final payment process
     */
    function handlePayment() {
        if (!selectedMethod) return;

        // Show loading state
        loadingOverlay.style.display = 'flex';

        // Mock API delay
        setTimeout(() => {
            loadingOverlay.style.display = 'none';

            // Backup for PDF download on success page
            sessionStorage.setItem('last_itinerary', JSON.stringify(orderItems));

            showSuccess();
            // Clear order
            localStorage.removeItem('pending_itinerary');
        }, 3000);
    }

    /**
     * Transition to success view
     */
    function showSuccess() {
        successView.style.display = 'flex';
        playAudio('grand-success');

        // Use the dedicated canvas in the success view
        const myCanvas = document.getElementById('confetti-canvas');
        const myConfetti = confetti.create(myCanvas, {
            resize: true,
            useWorker: true
        });

        myConfetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff8b94', '#ffb7b2', '#ffdac1', '#b5ead7', '#c7ceea']
        });

        console.log("Order confirmed successfully!");
    }

    /**
     * Handle Digital Itinerary Opening
     */
    function openDigitalItinerary() {
        // Ensure there's an itinerary stored
        const stored = localStorage.getItem('pending_itinerary') || sessionStorage.getItem('last_itinerary');
        if (stored) {
            window.open('digital-itinerary.html', '_blank');
        } else {
            console.warn("No itinerary found to view. Please build one first.");
            window.location.href = 'dashboard.html';
        }
    }

    // Initialize
    loadOrder();
    renderPaymentMethods();

    if (payBtn) payBtn.addEventListener('click', handlePayment);

    // Bind new View Itinerary buttons
    const viewBtn = document.getElementById('view-itinerary-btn');
    const successViewBtn = document.getElementById('success-view-btn');

    if (viewBtn) viewBtn.addEventListener('click', openDigitalItinerary);
    if (successViewBtn) successViewBtn.addEventListener('click', openDigitalItinerary);
});
