/**
 * Digital Itinerary Rendering Logic
 * Reads the confirmed itinerary from JS storage and builds the timeline UI.
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
        console.warn("Access Denied: You must unlock all tokens to access the itinerary.");
        window.location.href = 'dashboard.html';
        return; // Halt execution
    }

    const container = document.getElementById('itinerary-content');
    const dateElement = document.getElementById('itinerary-date');
    if (!container) return;

    // Simulate slight loading for the "cute" effect
    setTimeout(() => {
        loadItinerary(container, dateElement);
    }, 600);
});

function loadItinerary(container, dateElement) {
    const stored = localStorage.getItem('pending_itinerary') || sessionStorage.getItem('last_itinerary');

    // Empty state
    if (!stored) {
        container.innerHTML = `
            <div class="loading-state">
                <i class="bi bi-emoji-tear"></i>
                <h2 style="font-family: 'Outfit'; color: #ff8b94; margin-top: 15px;">Oops! No itinerary found.</h2>
                <a href="itinerary-builder.html" style="color: #ffb7b2; display: inline-block; margin-top: 10px; font-weight: bold; text-decoration: none;">Let's build one! <i class="bi bi-arrow-right"></i></a>
            </div>
        `;
        if (dateElement) dateElement.textContent = "Unknown Date";
        return;
    }

    const items = JSON.parse(stored);

    if (typeof ITINERARY_CONFIG === 'undefined') {
        console.error("ITINERARY_CONFIG is not loaded.");
        return;
    }

    // Map items to sections and use shortNames
    const sectionsData = ITINERARY_CONFIG.sections.map(section => {
        const selectedItemsInSection = items.filter(item =>
            section.products.some(p => p.id === item.id)
        ).map(item => {
            const prod = section.products.find(p => p.id === item.id);
            return prod ? (prod.shortName || prod.name) : item.name;
        });

        return {
            title: section.title,
            time: `${section.startTime} - ${section.endTime}`,
            startTime: section.startTime,
            items: selectedItemsInSection
        };
    }).filter(s => s.items.length > 0);

    const sortedSections = sortChronologically(sectionsData);

    // Render
    const date = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    if (dateElement) {
        dateElement.textContent = ``;
    }

    container.innerHTML = buildHTML(sortedSections);
}

function sortChronologically(sections) {
    const timeOrder = {
        '9AM': 1, '10AM': 2, '11AM': 3, '12PM': 4,
        '1PM': 5, '2PM': 6, '3PM': 7, '4PM': 8,
        '5PM': 9, '6PM': 10, '7PM': 11, '8PM': 12,
        '9PM': 13, '10PM': 14, '11PM': 15, '12AM': 16
    };

    return [...sections].sort((a, b) => {
        const timeA = timeOrder[a.startTime] || 99;
        const timeB = timeOrder[b.startTime] || 99;
        return timeA - timeB;
    });
}

function buildHTML(sections) {
    // Array of class modifiers for alternating card colors
    const themes = ['', 'card-mint', 'card-lilac', 'card-peach'];

    return sections.map((section, index) => {
        const theme = themes[index % themes.length];

        return `
            <div class="section-card ${theme}">
                <div class="time-badge">
                    <i class="bi bi-clock-history"></i>
                    ${section.time}
                </div>
                <h2>${section.title}</h2>
                <div class="item-list">
                    ${section.items.map(itemName => `
                        <div class="item-row">
                            <i class="bi bi-stars"></i>
                            <span>${itemName}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');
}
