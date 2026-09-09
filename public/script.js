let orderCart = [];

// 1. Add item to order cart
function addToOrder(name, price) {
    const existingItem = orderCart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        orderCart.push({ name, price, quantity: 1 });
    }
    
    updateCartUI();
}

// 2. Change Item Quantity (+ / -)
function updateQuantity(name, change) {
    const item = orderCart.find(item => item.name === name);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            orderCart = orderCart.filter(i => i.name !== name);
        }
    }
    updateCartUI();
}

// 3. Clear all items
function clearOrder() {
    orderCart = [];
    updateCartUI();
}

// 4. Update Cart UI & Calculations
function updateCartUI() {
    const cartContainer = document.getElementById('order-items-list');
    cartContainer.innerHTML = '';

    let subtotal = 0;

    orderCart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const cartItemHTML = `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h5>${item.name}</h5>
                    <span>Rs. ${itemTotal.toFixed(2)}</span>
                </div>
                <div class="cart-controls">
                    <button onclick="updateQuantity('${item.name}', -1)">-</button>
                    <span>x${item.quantity} - Rs. ${itemTotal.toFixed(2)}</span>
                    <button onclick="updateQuantity('${item.name}', 1)">+</button>
                </div>
            </div>
        `;
        cartContainer.innerHTML += cartItemHTML;
    });

    const tax = subtotal * 0.10;
    const total = subtotal + tax;

    document.getElementById('subtotal-val').innerText = `Rs. ${subtotal.toFixed(2)}`;
    document.getElementById('tax-val').innerText = `Rs. ${tax.toFixed(2)}`;
    document.getElementById('total-val').innerText = `Rs. ${total.toFixed(2)}`;
}

// 5. Search / Filter Dishes
function filterDishes() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const dishCards = document.querySelectorAll('.dishes-grid .dish-card:not(.add-dish-card)');

    dishCards.forEach(card => {
        const name = card.getAttribute('data-name').toLowerCase();
        if (name.includes(query)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// 6. Modal Functions (Add New Dish)
function openAddDishModal() {
    document.getElementById('add-dish-modal').style.display = 'flex';
}

function closeAddDishModal() {
    document.getElementById('add-dish-modal').style.display = 'none';
    document.getElementById('add-dish-form').reset();
}

function handleAddNewDish(event) {
    event.preventDefault();
    
    const name = document.getElementById('dish-name-input').value;
    const price = parseFloat(document.getElementById('dish-price-input').value);
    let imgUrl = document.getElementById('dish-img-input').value;

    if (!imgUrl) {
        imgUrl = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300';
    }

    const grid = document.getElementById('dishes-grid');
    const newCard = document.createElement('div');
    newCard.className = 'dish-card';
    newCard.setAttribute('data-name', name);
    newCard.innerHTML = `
        <img src="${imgUrl}" class="dish-img" alt="${name}">
        <h4 class="dish-title">${name}</h4>
        <div class="dish-price">Rs. ${price.toFixed(2)}</div>
        <button class="btn-add-item" onclick="addToOrder('${name}', ${price})">+ Add</button>
    `;

    grid.appendChild(newCard);
    closeAddDishModal();
}

// 7. Print Receipt with Real-time Date and Time
function printReceipt() {
    if (orderCart.length === 0) {
        alert('කරුණාකර මුලින්ම Cart එකට අයිතම එකතු කරන්න!');
        return;
    }

    // වත්මන් දිනය සහ වේලාව සටහන් කිරීම
    const now = new Date();
    const dateStr = now.toLocaleDateString();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    document.getElementById('receipt-date').innerText = `Date: ${dateStr}`;
    document.getElementById('receipt-time').innerText = `Time: ${timeStr}`;

    // Print Window එක Open කිරීම
    window.print();
}