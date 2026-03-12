document.addEventListener("DOMContentLoaded", () => {
    // Topbar
    const username = localStorage.getItem('forbes_username') || 'jas';
    const statusText = document.getElementById("session-status");
    if (statusText) {
        statusText.textContent = `You're the barista for today`;
    }

    // Pill selectors
    const pillGroups = document.querySelectorAll('.pill-group');
    pillGroups.forEach(group => {
        const btns = group.querySelectorAll('.pill-btn');
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                btns.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
            });
        });
    });

    // Shots counter
    const shotMinus = document.getElementById('shot-minus');
    const shotPlus = document.getElementById('shot-plus');
    const shotCount = document.getElementById('shot-count');

    shotMinus.addEventListener('click', () => {
        let val = parseInt(shotCount.textContent);
        if (val > 0) shotCount.textContent = val - 1;
    });

    shotPlus.addEventListener('click', () => {
        let val = parseInt(shotCount.textContent);
        if (val < 10) shotCount.textContent = val + 1;
    });

    // Syrups counter
    const syrupItems = document.querySelectorAll('.syrup-item');
    syrupItems.forEach(item => {
        const minus = item.querySelector('.syrup-minus');
        const plus = item.querySelector('.syrup-plus');
        const count = item.querySelector('.syrup-count');

        minus.addEventListener('click', () => {
            let val = parseInt(count.textContent);
            if (val > 0) count.textContent = val - 1;
        });

        plus.addEventListener('click', () => {
            let val = parseInt(count.textContent);
            if (val < 10) count.textContent = val + 1;
        });
    });

    // Build Coffee Button
    const brewBtn = document.getElementById('brew-btn');
    const orderDetails = document.getElementById('order-details');

    brewBtn.addEventListener('click', () => {
        // Collect data
        const temp = document.querySelector('#temp-group .selected').dataset.val;
        const roast = document.querySelector('#roast-group .selected').dataset.val;
        const shots = parseInt(document.getElementById('shot-count').textContent);
        const milk = document.querySelector('#milk-group .selected').dataset.val;

        if (shots === 0) {
            const originalText = brewBtn.innerHTML;
            brewBtn.innerHTML = '<i class="bi bi-exclamation-triangle"></i> Needs Espresso!';
            setTimeout(() => {
                brewBtn.innerHTML = originalText;
            }, 2000);
            return;
        }

        const syrupData = [];
        syrupItems.forEach(item => {
            const name = item.dataset.syrup;
            const count = parseInt(item.querySelector('.syrup-count').textContent);
            if (count > 0) syrupData.push({ name, count });
        });

        // Building output strings
        let drinkTitle = temp;

        let syrupStr = '';
        if (syrupData.length > 0) {
            syrupStr = syrupData.map(s => `${s.count} pump(s) ${s.name}`).join(', ');
            drinkTitle += " " + syrupData.map(s => s.name).join("-");
        }

        drinkTitle += milk === 'No Milk' ? " Black Coffee" : " " + milk + " Latte";

        if (shots > 0) {
            drinkTitle = (shots > 2 ? "Extra-Shot " : "") + drinkTitle;
        } else {
            drinkTitle = "Decaf " + drinkTitle;
        }

        let recipeHtml = `<h3 class="order-title">${drinkTitle}</h3>`;

        recipeHtml += `<div class="recipe-item"><span class="recipe-key">Temperature</span><span class="recipe-val">${temp}</span></div>`;
        recipeHtml += `<div class="recipe-item"><span class="recipe-key">Base</span><span class="recipe-val">${shots} Shot(s) ${roast}</span></div>`;

        if (milk !== 'No Milk') {
            recipeHtml += `<div class="recipe-item"><span class="recipe-key">Milk Add-in</span><span class="recipe-val">${milk}</span></div>`;
        }

        if (syrupData.length > 0) {
            recipeHtml += `<div class="ticket-divider"></div>`;
            syrupData.forEach(s => {
                recipeHtml += `<div class="recipe-item"><span class="recipe-key">${s.name} Syrup</span><span class="recipe-val">${s.count} pumps</span></div>`;
            });
        }

        // Add fun easter egg name
        const isJasmineSpecial = temp === 'Iced' &&
            roast === 'Light Roast' &&
            shots === 2 &&
            milk === 'Oat Milk' &&
            syrupData.length === 1 &&
            syrupData[0].name === "Hazelnut" &&
            syrupData[0].count === 2;

        if (isJasmineSpecial) {
            recipeHtml += `<div class="ticket-divider"></div>`;
            recipeHtml += `<div class="recipe-item" style="color:var(--ok)"><span class="recipe-key" style="color:var(--ok)">Note</span><span class="recipe-val">The Jasmine Special 🌸</span></div>`;

            // Check Unlock
            setTimeout(() => {
                if (window.showUnlockModal) {
                    window.showUnlockModal({
                        itemId: 10,
                        title: "New Discovery!",
                        itemName: "Coffee Master Token Unlocked",
                        description: "You've brewed the perfect Jasmine Special.",
                    });
                }
            }, 1000); // Slight delay for dramatic effect
        }

        orderDetails.innerHTML = recipeHtml;

        // Visual feedback on button
        const originalText = brewBtn.innerHTML;
        brewBtn.innerHTML = '<i class="bi bi-check-circle"></i> Order Placed!';
        setTimeout(() => {
            brewBtn.innerHTML = originalText;
        }, 1500);

    });

});
