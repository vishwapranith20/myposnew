// ==========================================
// 1. SYSTEM STATE & INITIAL DATA
// ==========================================

let currentLang = 'en'; // 'en' හෝ 'si'

// වත්මන් ඇණවුම් ලැයිස්තුව (Cart)
let currentOrder = [
    { id: 1, name: 'Satay Wagyu', price: 450.00, qty: 1 },
    { id: 2, name: 'Beef Curry Rice', price: 1500.00, qty: 2 }
];

// භාෂා පරිවර්තන (English සහ සිංහල)
const translations = {
    en: {
        dashboard: "Dashboard",
        orderLine: "Order Line",
        manageTable: "Manage Table",
        reservationList: "Reservation List",
        tableHistory: "Table History",
        manageDish: "Manage Dish",
        helpCenter: "Help Center",
        setting: "Setting",
        upgradeText: "Ready for the Next Level?",
        upgradeBtn: "Upgrade Plan",
        bannerTitle: "Effortlessly Manage Your Menu!",
        bannerDesc: "Quick access to every dish—add, update, and organize your menu with ease.",
        dishCategory: "Dish Category",
        searchPlaceholder: "Look up any dish you desire...",
        filter: "Filter",
        addDishCat: "Add Dish Category",
        addNewDish: "Add New Dish to",
        emptyOrder: "No items added yet",
        subtotal: "Subtotal",
        tax: "Tax (10%)",
        total: "Total",
        clear: "Clear",
        placeOrder: "Place Order",
        printReceipt: "Print Bill",
        receiptHeader: "LIKE FOOD RESTAURANT",
        receiptThank: "Thank you for dining with us!",
        confirmClear: "Are you sure you want to clear the current order?",
        orderSuccess: "Order placed successfully!"
    },
    si: {
        dashboard: "මුඛ්‍ය පුවරුව (Dashboard)",
        orderLine: "ඇණවුම් ලැයිස්තුව (Order Line)",
        manageTable: "මේස කළමනාකරණය",
        reservationList: "වෙන්කිරීම් ලැයිස්තුව",
        tableHistory: "මේස වාර්තා",
        manageDish: "ආහාර කළමනාකරණය",
        helpCenter: "උදවු මධ්‍යස්ථානය",
        setting: "සැකසුම්",
        upgradeText: "ඊළඟ මට්ටමට සූදානම්ද?",
        upgradeBtn: "ප්ලෑන් එක Upgrade කරන්න",
        bannerTitle: "ඔබේ Menu එක පහසුවෙන්ම පාලනය කරන්න!",
        bannerDesc: "ඕනෑම ආහාරයක් ඉක්මනින් එකතු කිරීමට, වෙනස් කිරීමට සහ සංවිධානය කිරීමට එකම තැනකින්.",
        dishCategory: "ආහාර වර්ගීකරණය",
        searchPlaceholder: "අවශ්‍ය ආහාර සොයන්න...",
        filter: "පෙරහන (Filter)",
        addDishCat: "නව Category එකක් එක් කරන්න",
        addNewDish: "නව ආහාරයක් එක් කරන්න -",
        emptyOrder: "තවම ආහාර එකතු කර නැත",
        subtotal: "එකතුව (Subtotal)",
        tax: "බදු (Tax 10%)",
        total: "මුළු එකතුව (Total)",
        clear: "මකන්න",
        placeOrder: "ඇණවුම් කරන්න",
        printReceipt: "Bill එක Print කරන්න",
        receiptHeader: "ලයික් ෆුඩ් රෙස්ටෝරන්ට්",
        receiptThank: "අප වෙත පැමිණි ඔබට ස්තූතියි!",
        confirmClear: "වත්මන් ඇණවුම ඉවත් කිරීමට ඔබට විශ්වාසද?",
        orderSuccess: "ඇණවුම සාර්ථකව යොමු කරන ලදී!"
    }
};

// ==========================================
// 2. INITIALIZATION ON PAGE LOAD
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    renderOrderList();
    setupSearchFilter();
    setupPrintButton();

    // නව ආහාරයක් එකතු කිරීමේ Card එක සක්‍රිය කිරීම
    const addDishCard = document.querySelector('.add-dish-card');
    if (addDishCard) {
        addDishCard.style.cursor = 'pointer';
        addDishCard.onclick = openAddDishModal;
    }

    // නව ආහාර Form එක Submit වන විට ක්‍රියාත්මක වන කොටස
    const addDishForm = document.getElementById('add-dish-form');
    if (addDishForm) {
        addDishForm.addEventListener('submit', handleAddNewDish);
    }
});

// ==========================================
// 3. CART & ORDER LINE FUNCTIONS
// ==========================================

function addToOrder(name, price) {
    const existingItem = currentOrder.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.qty += 1;
    } else {
        currentOrder.push({
            id: Date.now(),
            name: name,
            price: price,
            qty: 1
        });
    }
    
    renderOrderList();
}

function changeQty(index, delta) {
    if (index >= 0 && index < currentOrder.length) {
        currentOrder[index].qty += delta;
        
        if (currentOrder[index].qty <= 0) {
            currentOrder.splice(index, 1);
        }
        
        renderOrderList();
    }
}

function renderOrderList() {
    const listContainer = document.getElementById('order-items-list');
    if (!listContainer) return;
    
    listContainer.innerHTML = '';
    let subtotal = 0;

    if (currentOrder.length === 0) {
        listContainer.innerHTML = `<p style="color: var(--text-muted); text-align: center; margin-top: 20px; font-size: 13px;">${translations[currentLang].emptyOrder}</p>`;
    } else {
        currentOrder.forEach((item, index) => {
            const itemTotal = item.price * item.qty;
            subtotal += itemTotal;

            const itemElement = document.createElement('div');
            itemElement.className = 'order-item';
            itemElement.innerHTML = `
                <div class="order-item-details">
                    <h5>${item.name}</h5>
                    <p>Rs. ${item.price.toFixed(2)}</p>
                </div>
                <div class="qty-controls">
                    <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
                </div>
            `;
            listContainer.appendChild(itemElement);
        });
    }

    const tax = subtotal * 0.10;
    const total = subtotal + tax;

    const subtotalEl = document.getElementById('subtotal-val');
    const taxEl = document.getElementById('tax-val');
    const totalEl = document.getElementById('total-val');

    if (subtotalEl) subtotalEl.innerText = `Rs. ${subtotal.toFixed(2)}`;
    if (taxEl) taxEl.innerText = `Rs. ${tax.toFixed(2)}`;
    if (totalEl) totalEl.innerText = `Rs. ${total.toFixed(2)}`;
}

function clearOrder() {
    if (currentOrder.length === 0) return;
    
    if (confirm(translations[currentLang].confirmClear)) {
        currentOrder = [];
        renderOrderList();
    }
}

function placeOrder() {
    if (currentOrder.length === 0) {
        alert(translations[currentLang].emptyOrder);
        return;
    }
    
    alert(translations[currentLang].orderSuccess);
    currentOrder = [];
    renderOrderList();
}

// ==========================================
// 4. ADD NEW DISH MODAL FUNCTIONS
// ==========================================

function openAddDishModal() {
    const modal = document.getElementById('add-dish-modal');
    if (modal) modal.style.display = 'flex';
}

function closeAddDishModal() {
    const modal = document.getElementById('add-dish-modal');
    if (modal) modal.style.display = 'none';
    const form = document.getElementById('add-dish-form');
    if (form) form.reset();
}

function handleAddNewDish(event) {
    event.preventDefault();

    const name = document.getElementById('dish-name-input').value.trim();
    const price = parseFloat(document.getElementById('dish-price-input').value);
    let imgUrl = document.getElementById('dish-img-input').value.trim();

    if (!imgUrl) {
        imgUrl = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200';
    }

    if (name && !isNaN(price)) {
        const dishesGrid = document.getElementById('dishes-grid');
        if (dishesGrid) {
            const newCard = document.createElement('div');
            newCard.className = 'dish-card';
            newCard.innerHTML = `
                <img src="${imgUrl}" class="dish-img" alt="${name}">
                <h4 class="dish-title">${name}</h4>
                <div class="dish-price">Rs. ${price.toFixed(2)}</div>
                <button class="btn-add-item" onclick="addToOrder('${name}', ${price})">+ Add</button>
            `;

            dishesGrid.appendChild(newCard);
        }
        closeAddDishModal();
    }
}

// ==========================================
// 5. SEARCH FILTER FUNCTION
// ==========================================

function setupSearchFilter() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const dishCards = document.querySelectorAll('.dishes-grid .dish-card');

        dishCards.forEach(card => {
            const title = card.querySelector('.dish-title')?.innerText.toLowerCase() || '';
            if (title.includes(query)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// ==========================================
// 6. BILL PRINTING FUNCTION (RECEIPT)
// ==========================================

function setupPrintButton() {
    const orderActions = document.querySelector('.order-actions');
    if (orderActions && !document.getElementById('btn-print-bill')) {
        const printBtn = document.createElement('button');
        printBtn.id = 'btn-print-bill';
        printBtn.className = 'btn-place-order';
        printBtn.style.backgroundColor = '#3b82f6';
        printBtn.style.color = '#fff';
        printBtn.style.marginTop = '8px';
        printBtn.style.width = '100%';
        printBtn.innerHTML = `<i class="fa-solid fa-print"></i> ${translations[currentLang].printReceipt}`;
        printBtn.onclick = printReceipt;
        orderActions.parentNode.appendChild(printBtn);
    }
}

function printReceipt() {
    if (currentOrder.length === 0) {
        alert(translations[currentLang].emptyOrder);
        return;
    }

    let subtotal = 0;
    let itemsHtml = '';

    currentOrder.forEach(item => {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;
        itemsHtml += `
            <tr>
                <td style="padding: 4px 0;">${item.name} x ${item.qty}</td>
                <td style="text-align: right; padding: 4px 0;">Rs. ${itemTotal.toFixed(2)}</td>
            </tr>
        `;
    });

    const tax = subtotal * 0.10;
    const total = subtotal + tax;
    const dateStr = new Date().toLocaleString();

    const printWindow = window.open('', '', 'width=400,height=600');
    printWindow.document.write(`
        <html>
        <head>
            <title>Print Receipt</title>
            <style>
                body {
                    font-family: 'Courier New', Courier, monospace;
                    width: 280px;
                    margin: 0 auto;
                    padding: 10px;
                    color: #000;
                }
                .text-center { text-align: center; }
                .text-right { text-align: right; }
                .line { border-bottom: 1px dashed #000; margin: 10px 0; }
                table { width: 100%; border-collapse: collapse; font-size: 13px; }
                h3 { margin: 5px 0; }
                p { margin: 3px 0; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="text-center">
                <h3>${translations[currentLang].receiptHeader}</h3>
                <p>No 123, Green Road, Colombo</p>
                <p>Tel: +94 11 234 5678</p>
                <p>Date: ${dateStr}</p>
            </div>
            <div class="line"></div>
            <table>
                <thead>
                    <tr style="border-bottom: 1px solid #000;">
                        <th style="text-align: left;">Item</th>
                        <th style="text-align: right;">Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>
            <div class="line"></div>
            <table>
                <tr>
                    <td>Subtotal:</td>
                    <td class="text-right">Rs. ${subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>Tax (10%):</td>
                    <td class="text-right">Rs. ${tax.toFixed(2)}</td>
                </tr>
                <tr style="font-weight: bold; font-size: 14px;">
                    <td>TOTAL:</td>
                    <td class="text-right">Rs. ${total.toFixed(2)}</td>
                </tr>
            </table>
            <div class="line"></div>
            <div class="text-center">
                <p>${translations[currentLang].receiptThank}</p>
            </div>
        </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 250);
}