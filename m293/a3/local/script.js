const PRODUCTS = [
    { id: 1, name: 'Arch Linux t-shirt', price: 30, category: 'tshirt', img: 'https://via.placeholder.com/200?text=Arch+TShirt' },
    { id: 2, name: 'Ubuntu t-shirt', price: 30, category: 'tshirt', img: 'https://via.placeholder.com/200?text=Ubuntu+TShirt' },
    { id: 3, name: 'FreeBSD t-shirt', price: 30, category: 'tshirt', img: 'https://via.placeholder.com/200?text=FreeBSD+TShirt' },
    { id: 4, name: 'Anti-rust t-shirt', price: 30, category: 'tshirt', img: 'https://via.placeholder.com/200?text=AntiRust+TShirt' },
    { id: 5, name: 'C t-shirt', price: 30, category: 'tshirt', img: 'https://via.placeholder.com/200?text=C+TShirt' },
    { id: 6, name: 'White monster energy 12-pack', price: 20, category: 'drink', img: 'https://via.placeholder.com/200?text=Monster+12pk' },
];

let cart = [];

const router = {
    navigate(pageId, productId = null) {
        document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
        document.getElementById(`page-${pageId}`).classList.remove('hidden');
        
        if (pageId === 'detail' && productId) {
            shop.renderDetail(productId);
        } else if (pageId === 'home') {
            shop.renderHome();
        } else if (pageId === 'shop') {
            shop.render();
        } else if (pageId === 'cart') {
            shop.renderCart();
        }
    }
};

const shop = {
    renderHome() {
        const hotProductsDiv = document.getElementById('hot-products');
        // Show first 3 products as "Hot"
        const hot = PRODUCTS.slice(0, 3);
        hotProductsDiv.innerHTML = hot.map(p => this.createCard(p)).join('');
    },

    render() {
        const listDiv = document.getElementById('product-list');
        const category = document.getElementById('filter-category').value;
        const filtered = category === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === category);
        
        listDiv.innerHTML = filtered.map(p => this.createCard(p)).join('');
    },

    createCard(p) {
        return `
            <div class="card" onclick="router.navigate('detail', ${p.id})">
                <h3>${p.name}</h3>
                <p>Price: ${p.price}.- CHF</p>
                <button class="btn">VIEW DETAILS</button>
            </div>
        `;
    },

    renderDetail(id) {
        const p = PRODUCTS.find(item => item.id === id);
        const detailDiv = document.getElementById('product-detail');
        detailDiv.innerHTML = `
            <div class="terminal-border" style="display: flex; gap: 20px; align-items: center;">
                <img src="${p.img}" alt="${p.name}" style="border: 1px solid var(--text-color)">
                <div>
                    <h1>${p.name}</h1>
                    <p>Category: ${p.category}</p>
                    <p>Price: ${p.price}.- CHF</p>
                    <button class="btn" onclick="shop.addToCart(${p.id})">ADD TO CART</button>
                </div>
            </div>
        `;
    },

    addToCart(id) {
        const p = PRODUCTS.find(item => item.id === id);
        cart.push(p);
        this.updateCartCount();
        alert(`${p.name} added to cart.`);
    },

    updateCartCount() {
        document.getElementById('cart-count').innerText = cart.length;
    },

    renderCart() {
        const itemsDiv = document.getElementById('cart-items');
        const totalDiv = document.getElementById('cart-total');
        
        if (cart.length === 0) {
            itemsDiv.innerHTML = '<p>Your cart is empty.</p>';
            totalDiv.innerText = '';
            document.getElementById('checkout-btn').classList.add('hidden');
            return;
        }

        document.getElementById('checkout-btn').classList.remove('hidden');
        itemsDiv.innerHTML = cart.map((item, index) => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px dotted var(--accent-color)">
                <span>${item.name}</span>
                <span>${item.price}.- CHF <a onclick="shop.removeFromCart(${index})" style="color: red; cursor: pointer; margin-left: 10px">[X]</a></span>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + item.price, 0);
        totalDiv.innerText = `TOTAL: ${total}.- CHF`;
    },

    removeFromCart(index) {
        cart.splice(index, 1);
        this.updateCartCount();
        this.renderCart();
    }
};

// Initial load
window.onload = () => {
    shop.renderHome();
};