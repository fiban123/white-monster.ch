// ==========================================================================
// POSIX STORE - JAVASCRIPT CONTROLLER
// Single Page Application logic, Cart Manager, and Shell CLI Engine
// ==========================================================================

// --- PRODUCTS DATABASE ---
const PRODUCTS = [
    {
        id: "arch-tshirt",
        name: "Arch Linux T-Shirt",
        price: 30.00,
        category: "shirts",
        tags: ["OS", "DIY", "linux"],
        image: "images/arch_tshirt.png",
        description: "Tell everyone you use Arch (btw). Printed on high-grade heavyweight cotton with high durability. Ideal for custom compiles.",
        specs: {
            "Material": "100% Ring-Spun Cotton",
            "Weight": "240 GSM (Heavyweight)",
            "Color": "Slate Obsidian",
            "Print": "Arch Logo (Screenprint / Blue)",
            "Sizes": "S, M, L, XL",
            "Environment": "Linux kernel 2.6+"
        },
        hot: true
    },
    {
        id: "ubuntu-tshirt",
        name: "Ubuntu T-Shirt",
        price: 30.00,
        category: "shirts",
        tags: ["OS", "User-friendly", "linux"],
        image: "images/ubuntu_tshirt.jpg",
        description: "The classic, user-friendly choice. Features the clean Circle of Friends logo. Extremely soft cotton for long hours of comfortable desktop configuration.",
        specs: {
            "Material": "100% Organic Cotton",
            "Weight": "180 GSM (Regular)",
            "Color": "Midnight Black",
            "Print": "Ubuntu CoF Logo (Orange)",
            "Sizes": "M, L, XL",
            "Environment": "Systemd / GNOME"
        },
        hot: false
    },
    {
        id: "freebsd-tshirt",
        name: "FreeBSD T-Shirt",
        price: 30.00,
        category: "shirts",
        tags: ["OS", "BSD", "daemon"],
        image: "images/freebsd_tshirt.jpg",
        description: "For the power users who appreciate stability and advanced networking. Features the classic FreeBSD daemon logo. Compiled for ultimate server comfort.",
        specs: {
            "Material": "100% Cotton",
            "Weight": "200 GSM (Medium-heavy)",
            "Color": "Deep Grey",
            "Print": "Beastie Daemon Logo (Red)",
            "Sizes": "S, M, L, XL",
            "Environment": "FreeBSD Kernel"
        },
        hot: false
    },
    {
        id: "antirust-tshirt",
        name: "Anti-Rust T-Shirt",
        price: 30.00,
        category: "shirts",
        tags: ["Language", "Rust", "Safety", "Slow", "Bloated"],
        image: "images/antirust_tshirt.jpg",
        description: "Anti-Rust developer t-shirt. A pun on the Rust programming language and memory safety. Guaranteed to prevent compiler errors and metal oxidation.",
        specs: {
            "Material": "100% Organic Cotton",
            "Weight": "210 GSM",
            "Color": "Carbon Charcoal",
            "Print": "Rust Gear Emblem (Textured Orange)",
            "Sizes": "S, M, L, XL, XXL",
            "Environment": "Oxidized substances"
        },
        hot: true
    },
    {
        id: "c-tshirt",
        name: "C T-Shirt",
        price: 30.00,
        category: "shirts",
        tags: ["Language", "Modern", "Fast"],
        image: "images/c_tshirt.png",
        description: "The classic C language logo t-shirt. Back to the basics, close to the metal. 100% pure cotton, direct memory access styling.",
        specs: {
            "Material": "100% Premium Cotton",
            "Weight": "220 GSM",
            "Color": "Core Black",
            "Print": "C Block Print (Cyber Blue & White)",
            "Sizes": "S, M, L, XL",
            "Environment": "GCC / Clang"
        },
        hot: false
    },
    {
        id: "monster-pack",
        name: "Monster Energy 12-Pack",
        price: 20.00,
        category: "drinks",
        tags: ["Beverage", "Caffeine", "Zero-Sugar"],
        image: "images/monster_pack.avif",
        description: "White Monster Energy Ultra 12-pack. The essential developer fuel. Zero sugar, zero calories, maximum compile-time speed.",
        specs: {
            "Volume": "12 x 500ml Cans",
            "Caffeine": "150mg per can",
            "Sugar": "0.0g (Zero)",
            "Calories": "0 kcal",
            "Flavor": "Ultra White (Slight Citrus)",
            "Environment": "Late-night debug sessions"
        },
        hot: true
    },
    {
        id: "gentoo-tshirt",
        name: "Gentoo Linux T-Shirt",
        price: 30.00,
        category: "shirts",
        tags: ["OS", "Source", "linux"],
        image: "images/gentoo_tshirt.png",
        description: "Classic black T-shirt featuring the famous Gentoo Linux logo. Pure cotton comfort for compiling everything from scratch.",
        specs: {
            "Material": "100% Ring-Spun Cotton",
            "Weight": "200 GSM (Medium weight)",
            "Color": "Midnight Black",
            "Print": "Gentoo logo (Screenprint)",
            "Sizes": "S, M, L, XL",
            "Environment": "stage3 / emerge --sync"
        },
        hot: false
    },
    {
        id: "linus-god-tshirt",
        name: "Linus 'I am your god' quote T-Shirt",
        price: 30.00,
        category: "shirts",
        tags: ["Linux", "Quote", "linux"],
        image: "images/linus_god.webp",
        description: "T-shirt featuring the Linus Torvalds sketch print with a famous quite",
        specs: {
            "Material": "100% Organic Cotton",
            "Weight": "180 GSM",
            "Color": "Clean White",
            "Print": "Torvalds graphic & quote (Front)",
            "Sizes": "M, L, XL, XXL",
            "Environment": "Torvalds kernel mailing lists"
        },
        hot: false
    },
    {
        id: "linux-tshirt",
        name: "Classic Linux Tux T-Shirt",
        price: 30.00,
        category: "shirts",
        tags: ["OS", "Mascot", "linux"],
        image: "images/linux.png",
        description: "Classic black T-shirt featuring the word Linux with the iconic Tux",
        specs: {
            "Material": "100% Cotton",
            "Weight": "220 GSM (Heavyweight)",
            "Color": "Midnight Black",
            "Print": "Classic Linux & Tux logo",
            "Sizes": "S, M, L, XL",
            "Environment": "Computer"
        },
        hot: false
    },
    {
        id: "linus-unintentional-tshirt",
        name: "Linus 'Unintentional Side Effect' T-Shirt",
        price: 30.00,
        category: "shirts",
        tags: ["Linux", "Quote", "linux"],
        image: "images/linux_microslop.jpg",
        description: "T-shirt featuring Linus Torvalds and a quote on Microslop",
        specs: {
            "Material": "100% Combed Cotton",
            "Weight": "180 GSM",
            "Color": "Clean White",
            "Print": "Torvalds stencil & quote (Front)",
            "Sizes": "S, M, L, XL, XXL",
            "Environment": "Not bill gates"
        },
        hot: true
    },
    {
        id: "microslop-tshirt",
        name: "Microslop T-Shirt",
        price: 30.00,
        category: "shirts",
        tags: ["Windows", "Microslop"],
        image: "images/microslop.jpg",
        description: "T-shirt featuring Microslop's logo next to the word Microslop.",
        specs: {
            "Material": "100% Cotton",
            "Weight": "190 GSM",
            "Color": "Clean White",
            "Print": "Microslop logo & text (Front)",
            "Sizes": "M, L, XL, XXL",
            "Environment": "Not bill gates"
        },
        hot: false
    }

];

// --- APP STATE ---
let state = {
    cart: [], // Array of { productId, quantity }
    currentView: "home",
    activeProductId: null
};

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
    initClock();
    loadCartFromStorage();
    renderHotProducts();
    renderCatalog();

    // Router Hash Listener
    window.addEventListener("hashchange", handleHashRoute);
    handleHashRoute(); // Trigger first load

    // Listeners for Catalog Filters
    document.getElementById("search-input").addEventListener("input", filterAndRenderCatalog);
    document.querySelectorAll("input[name='category']").forEach(radio => {
        radio.addEventListener("change", filterAndRenderCatalog);
    });
    document.getElementById("sort-select").addEventListener("change", filterAndRenderCatalog);

    // Show fallback video link only if running locally via file://
    if (window.location.protocol === 'file:') {
        const fallback = document.getElementById('video-local-fallback');
        if (fallback) fallback.style.display = 'flex';
    }

    // Dynamic padding adjustments for sticky footer
    window.addEventListener("resize", adjustMainPadding);
    adjustMainPadding();
});

// --- CLOCK WIDGET ---
function initClock() {
    const clockEl = document.getElementById("utc-clock");
    const updateTime = () => {
        const now = new Date();
        const hrs = String(now.getUTCHours()).padStart(2, '0');
        const mins = String(now.getUTCMinutes()).padStart(2, '0');
        const secs = String(now.getUTCSeconds()).padStart(2, '0');
        clockEl.textContent = `${hrs}:${mins}:${secs}`;
    };
    updateTime();
    setInterval(updateTime, 1000);
}

// --- CART STORAGE & COUNT ---
function loadCartFromStorage() {
    const stored = localStorage.getItem("posix_store_cart");
    if (stored) {
        try {
            state.cart = JSON.parse(stored);
        } catch (e) {
            state.cart = [];
        }
    }
    updateCartBadge();
}

function saveCartToStorage() {
    localStorage.setItem("posix_store_cart", JSON.stringify(state.cart));
    updateCartBadge();
}

function updateCartBadge() {
    const badge = document.getElementById("cart-count");
    const totalQty = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalQty;

    // Visual bump animation
    badge.classList.remove("bounce");
    void badge.offsetWidth; // Force reflow
    badge.classList.add("bounce");

    // Sync header navigation link
    const cartNavLink = document.querySelector(".cart-nav");
    if (cartNavLink) {
        const navNumText = cartNavLink.querySelector(".nav-num").outerHTML;
        cartNavLink.innerHTML = `${navNumText}cart <span class="cart-badge bounce" id="cart-count">${totalQty}</span>`;
    }
}

// --- NAVIGATION & ROUTER ---
function handleHashRoute() {
    const hash = window.location.hash || "#home";
    const parts = hash.split("/");
    const viewName = parts[0].substring(1); // Remove '#'

    // Handle view classes
    document.querySelectorAll(".app-view").forEach(view => {
        view.classList.remove("active");
    });
    document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.remove("active");
    });

    // Check routing path
    if (viewName === "product" && parts[1]) {
        state.currentView = "detail";
        state.activeProductId = parts[1];
        renderProductDetail(parts[1]);
        const targetView = document.getElementById("view-detail");
        if (targetView) targetView.classList.add("active");
    } else {
        state.currentView = viewName;
        state.activeProductId = null;

        const targetView = document.getElementById(`view-${viewName}`);
        if (targetView) {
            targetView.classList.add("active");
        } else {
            // Default fallback
            document.getElementById("view-home").classList.add("active");
            state.currentView = "home";
        }

        // Highlight Nav
        const navLink = document.querySelector(`.nav-link[data-view="${state.currentView}"]`);
        if (navLink) navLink.classList.add("active");

        // Specific view actions
        if (viewName === "cart") {
            renderCart();
        }
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Recalculate layout spacing
    adjustMainPadding();
}

function navigateTo(view, productId = null) {
    if (productId) {
        window.location.hash = `#product/${productId}`;
    } else {
        window.location.hash = `#${view}`;
    }
}

// Helper to manually trigger routing (e.g. from links)
window.navigateTo = navigateTo;

// --- RENDER HOME PAGE ---
function renderHotProducts() {
    const grid = document.getElementById("hot-products-grid");
    if (!grid) return;

    const hotItems = PRODUCTS.filter(p => p.hot);
    grid.innerHTML = hotItems.map(p => generateProductCardHTML(p)).join("");
}

// --- RENDER CATALOG & FILTERS ---
function renderCatalog(filteredList = PRODUCTS) {
    const grid = document.getElementById("catalog-products-grid");
    if (!grid) return;

    grid.innerHTML = filteredList.map(p => generateProductCardHTML(p)).join("");
    document.getElementById("results-count").textContent = filteredList.length;
}

function filterAndRenderCatalog() {
    const searchVal = document.getElementById("search-input").value.toLowerCase();
    const categoryVal = document.querySelector("input[name='category']:checked").value;
    const sortVal = document.getElementById("sort-select").value;

    let list = [...PRODUCTS];

    // 1. Text Search
    if (searchVal) {
        list = list.filter(p =>
            p.name.toLowerCase().includes(searchVal) ||
            p.description.toLowerCase().includes(searchVal) ||
            p.tags.some(t => t.toLowerCase().includes(searchVal))
        );
    }

    // 2. Category
    if (categoryVal !== "all") {
        list = list.filter(p => p.category === categoryVal);
    }

    // 3. Sorting
    if (sortVal === "price-asc") {
        list.sort((a, b) => a.price - b.price);
    } else if (sortVal === "price-desc") {
        list.sort((a, b) => b.price - a.price);
    } else if (sortVal === "name-asc") {
        list.sort((a, b) => a.name.localeCompare(b.name));
    }

    renderCatalog(list);
}

function resetFilters() {
    document.getElementById("search-input").value = "";
    document.querySelector("input[name='category'][value='all']").checked = true;
    document.getElementById("sort-select").value = "default";
    filterAndRenderCatalog();
}
window.resetFilters = resetFilters;

// HTML Card Generator
function generateProductCardHTML(product) {
    const tagHtml = product.tags.map(t => `<span class="tag">[${t}]</span>`).join("");
    return `
        <div class="product-card">
            <div class="card-img-container" onclick="navigateTo('product', '${product.id}')" style="cursor:pointer;">
                ${product.hot ? `<span class="hot-badge"><i class="fa-solid fa-fire"></i> HOT</span>` : ''}
                <img src="${product.image}" alt="${product.name}" class="product-img">
            </div>
            <div class="card-content">
                <div class="card-tags">${tagHtml}</div>
                <h3 class="product-name" onclick="navigateTo('product', '${product.id}')" style="cursor:pointer;">${product.name}</h3>
                <div class="product-price">CHF ${product.price.toFixed(2)}</div>
                <div class="card-actions">
                    <button class="terminal-btn btn-primary" onclick="handleAddToCartClick('${product.id}')">
                        <i class="fa-solid fa-cart-plus"></i> Add
                    </button>
                    <button class="terminal-btn" onclick="navigateTo('product', '${product.id}')">
                        <i class="fa-solid fa-file-code"></i> Details
                    </button>
                </div>
            </div>
        </div>
    `;
}
window.handleAddToCartClick = handleAddToCartClick;

// Intercept Add to Cart to provide shell echo
function handleAddToCartClick(productId) {
    addToCart(productId, 1);
}

// --- VIEW: DETAIL PAGE ---
function renderProductDetail(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    const container = document.getElementById("product-detail-content");
    if (!container) return;

    if (!product) {
        container.innerHTML = `
            <div class="cart-empty-state">
                <div class="cart-empty-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
                <p>Error 404: Product '${productId}' not found in catalog.</p>
                <button class="terminal-btn" onclick="navigateTo('catalog')">cd /catalog</button>
            </div>
        `;
        return;
    }

    const tagsHtml = product.tags.map(t => `<span class="tag">[${t}]</span>`).join("");

    // Generate specifications lines
    let specsRows = "";
    for (const [key, val] of Object.entries(product.specs)) {
        specsRows += `
            <div class="specs-row">
                <div class="specs-key">${key}</div>
                <div class="specs-val">${val}</div>
            </div>
        `;
    }

    container.innerHTML = `
        <div class="detail-img-box">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="detail-info-box">
            <div class="detail-header">
                <div class="card-tags">${tagsHtml}</div>
                <h2>${product.name}</h2>
                <div class="detail-price-row">
                    <span class="detail-price">CHF ${product.price.toFixed(2)}</span>
                    <span class="text-dim">(Swiss VAT included)</span>
                </div>
            </div>
            
            <p class="detail-desc">${product.description}</p>
            
            <div class="detail-specs-table">
                ${specsRows}
            </div>

            <div class="qty-selector">
                <span class="qty-label">Quantity:</span>
                <div class="qty-controls">
                    <button class="qty-btn" onclick="adjustDetailQty(-1)">-</button>
                    <input type="text" id="detail-qty" value="1" readonly class="qty-input">
                    <button class="qty-btn" onclick="adjustDetailQty(1)">+</button>
                </div>
                <button class="terminal-btn btn-primary" onclick="addDetailToCart('${product.id}')">
                    <i class="fa-solid fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        </div>
    `;

    initImageZoom();
}

function initImageZoom() {
    const box = document.querySelector('.detail-img-box');
    if (!box) return;
    const img = box.querySelector('img');
    if (!img) return;

    box.addEventListener('mousemove', (e) => {
        const rect = box.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        img.style.transformOrigin = `${x}% ${y}%`;
        img.style.transform = 'scale(2.5)';
    });

    box.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1)';
        img.style.transformOrigin = 'center center';
    });
}

function adjustDetailQty(delta) {
    const input = document.getElementById("detail-qty");
    if (!input) return;
    let val = parseInt(input.value) || 1;
    val += delta;
    if (val < 1) val = 1;
    input.value = val;
}
window.adjustDetailQty = adjustDetailQty;

function addDetailToCart(productId) {
    const input = document.getElementById("detail-qty");
    const qty = parseInt(input.value) || 1;
    addToCart(productId, qty);
}
window.addDetailToCart = addDetailToCart;

// --- CART OPERATIONS ---
function addToCart(productId, quantity = 1) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = state.cart.findIndex(item => item.productId === productId);
    if (existingIndex > -1) {
        state.cart[existingIndex].quantity += quantity;
    } else {
        state.cart.push({ productId, quantity });
    }

    saveCartToStorage();

    // Display a toast feedback alert
    showToast("CART_ADD_SUCCESS", `Successfully added ${quantity}x "${product.name}" to cart.`, 3000);
}

function updateCartQuantity(productId, delta) {
    const index = state.cart.findIndex(item => item.productId === productId);
    if (index === -1) return;

    state.cart[index].quantity += delta;
    if (state.cart[index].quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCartToStorage();
        renderCart();
    }
}
window.updateCartQuantity = updateCartQuantity;

function removeFromCart(productId) {
    state.cart = state.cart.filter(item => item.productId !== productId);
    saveCartToStorage();
    renderCart();
}
window.removeFromCart = removeFromCart;

// Render Cart view
function renderCart() {
    const listContainer = document.getElementById("cart-items-container");
    if (!listContainer) return;

    if (state.cart.length === 0) {
        listContainer.innerHTML = `
            <div class="cart-empty-state">
                <div class="cart-empty-icon"><i class="fa-solid fa-basket-shopping"></i></div>
                <p>Your shopping cart is currently empty. Direct access: '/products'</p>
                <button class="terminal-btn btn-primary" onclick="navigateTo('catalog')">
                    <i class="fa-solid fa-folder-open"></i> ls /products
                </button>
            </div>
        `;
        updateSummary(0);
        return;
    }

    let itemsHtml = '<div class="cart-items-list">';
    let subtotal = 0;

    state.cart.forEach(item => {
        const product = PRODUCTS.find(p => p.id === item.productId);
        if (!product) return;

        const rowTotal = product.price * item.quantity;
        subtotal += rowTotal;

        itemsHtml += `
            <div class="cart-item-row">
                <div class="cart-item-img">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="cart-item-info">
                    <span class="cart-item-name">${product.name}</span>
                    <span class="cart-item-meta">Price: CHF ${product.price.toFixed(2)}</span>
                </div>
                <div class="qty-controls">
                    <button class="qty-btn" onclick="updateCartQuantity('${product.id}', -1)">-</button>
                    <span class="qty-input">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateCartQuantity('${product.id}', 1)">+</button>
                </div>
                <div class="cart-item-total">
                    CHF ${rowTotal.toFixed(2)}
                </div>
                <button class="btn-remove" onclick="removeFromCart('${product.id}')" title="Delete entry">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;
    });

    itemsHtml += '</div>';
    listContainer.innerHTML = itemsHtml;
    updateSummary(subtotal);
}

function updateSummary(subtotal) {
    // Swiss VAT is included in the price, calculate it backwards (7.7% of catalog price)
    // VAT = subtotal - (subtotal / 1.077)
    const vat = subtotal - (subtotal / 1.077);

    document.getElementById("summary-subtotal").textContent = `CHF ${subtotal.toFixed(2)}`;
    document.getElementById("summary-vat").textContent = `CHF ${vat.toFixed(2)}`;
    document.getElementById("summary-total").textContent = `CHF ${subtotal.toFixed(2)}`;
}

// --- CHECKOUT SIMULATOR ---
function handlePayment(event) {
    event.preventDefault();

    if (state.cart.length === 0) {
        alert("Cart is empty.");
        return;
    }

    const email = document.getElementById("pay-email").value;
    const name = document.getElementById("pay-name").value;
    const card = document.getElementById("pay-card").value;
    const totalText = document.getElementById("summary-total").textContent;

    // Show simulation modal
    const modal = document.getElementById("checkout-modal");
    modal.classList.add("active");

    const terminalBody = document.getElementById("modal-terminal-output");
    terminalBody.innerHTML = ""; // Clear log

    // Print lines sequentially to make it feel like compilation & transaction approval
    const logLines = [
        { text: `[SYSTEM] Initializing transaction gateway pipeline...`, type: "dim" },
        { text: `Connecting to secure Swiss-Transact server (api.swiss-transact.ch)...`, type: "default" },
        { text: `[OK] Socket open. Cryptographic Handshake successful (TLS 1.3).`, type: "green" },
        { text: `Validating merchant configuration (POSIX Store ID: 0x93FA8B)...`, type: "default" },
        { text: `Processing payload with token for credit card ending in ${card.slice(-4)}...`, type: "dim" },
        { text: `Executing credit card check (Luhn formula verification)...`, type: "default" },
        { text: `[OK] Luhn checksum matches standard ISO/IEC 7812.`, type: "green" },
        { text: `Contacting banking authority server for approval of ${totalText}...`, type: "default" },
        { text: `Waiting for issuer authorization response... [0x17A]`, type: "dim" },
        { text: `[OK] Transaction approved by card issuer. AuthCode: POSIX-${Math.floor(Math.random() * 90000 + 10000)}`, type: "green" },
        { text: `Clearing local shopping cart database caches...`, type: "default" },
        { text: `[OK] Local Cache Flushed. localStorage cleared.`, type: "green" },
        { text: `Formatting POSIX receipt format. Generating raw ASCII data...`, type: "dim" },
        { text: `================================================`, type: "default" },
        { text: `      POSIX STORE SWITZERLAND - RECEIPT         `, type: "green" },
        { text: `      Invoice Number: INV-2026-${Math.floor(Math.random() * 90000 + 10000)}`, type: "green" },
        { text: `      Date: ${new Date().toISOString().replace('T', ' ').substring(0, 19)} UTC`, type: "green" },
        { text: `------------------------------------------------`, type: "default" },
    ];

    // Append cart item lines to receipt
    state.cart.forEach(item => {
        const prod = PRODUCTS.find(p => p.id === item.productId);
        if (prod) {
            const lineTotal = prod.price * item.quantity;
            const spacer = " ".repeat(Math.max(2, 35 - prod.name.length - String(item.quantity).length));
            logLines.push({ text: `      ${item.quantity}x ${prod.name}${spacer}CHF ${lineTotal.toFixed(2)}`, type: "green" });
        }
    });

    logLines.push(
        { text: `------------------------------------------------`, type: "default" },
        { text: `      Grand Total:${" ".repeat(21)}${totalText}`, type: "green" },
        { text: `================================================`, type: "default" },
        { text: `Sending invoice copy to user email...`, type: "default" },
        { text: `$ mail -s "Invoice: POSIX-Store order" ${email} < invoice.txt`, type: "dim" },
        { text: `[OK] Mail sent. Delivery route established.`, type: "green" },
        { text: `Scheduling Swiss Post package courier system dispatch...`, type: "default" },
        { text: `[OK] Logistics scheduled. Tracking label #CH-${Math.floor(Math.random() * 9000000 + 1000000)} created.`, type: "green" },
        { text: `[SUCCESS] transaction complete. Status: 0 (Success).`, type: "green" }
    );

    let lineIdx = 0;
    const printInterval = setInterval(() => {
        if (lineIdx < logLines.length) {
            const line = logLines[lineIdx];
            const div = document.createElement("div");
            div.className = "cli-line";

            if (line.type === "green") div.classList.add("cli-success");
            else if (line.type === "dim") div.classList.add("text-dim");
            else if (line.type === "warn") div.classList.add("cli-warn");
            else if (line.type === "error") div.classList.add("cli-error");

            div.textContent = line.text;
            terminalBody.appendChild(div);
            terminalBody.scrollTop = terminalBody.scrollHeight;
            lineIdx++;
        } else {
            clearInterval(printInterval);
            // Empty the actual cart and update UI
            state.cart = [];
            saveCartToStorage();
        }
    }, 200);
}
window.handlePayment = handlePayment;

function closeCheckoutModal() {
    document.getElementById("checkout-modal").classList.remove("active");
    // Navigate back to home or catalog after checkout
    navigateTo("home");
}
window.closeCheckoutModal = closeCheckoutModal;

// --- CONTACT FORM SUBMISSION ---
function handleContactSubmit(event) {
    event.preventDefault();

    const name = document.getElementById("contact-name").value;
    const email = document.getElementById("contact-email").value;
    const subject = document.getElementById("contact-subject").value;
    const message = document.getElementById("contact-message").value;

    const successBox = document.getElementById("contact-success-msg");
    successBox.classList.remove("hidden");

    successBox.innerHTML = `
        <div class="cli-line text-dim">$ mail -s "${subject}" support@posix-store.ch &lt;&lt;EOF</div>
        <div class="cli-line text-dim">Sender: ${name} &lt;${email}&gt;</div>
        <div class="cli-line text-dim">Message length: ${message.length} bytes</div>
        <div class="cli-line">Connecting to mail SMTP server...</div>
        <div class="cli-line cli-success">[OK] Mail delivered. Queue job ID: ${Math.floor(Math.random() * 900000 + 100000)}</div>
        <div class="cli-line cli-success">[OK] PGP cryptosign verified. Thank you!</div>
    `;

    // Clear form
    document.getElementById("contact-form").reset();


}
window.handleContactSubmit = handleContactSubmit;

// --- NEWSLETTER SIGNUP ---
function handleNewsletterSubmit(event) {
    event.preventDefault();
    const emailInput = document.getElementById("news-email");
    const email = emailInput.value;
    const statusMsg = document.getElementById("news-status");

    statusMsg.className = "news-status-msg cli-success";
    statusMsg.innerHTML = `<i class="fa-solid fa-check"></i> Cron success: added ${email}`;

    emailInput.value = "";

    setTimeout(() => {
        statusMsg.innerHTML = "";
    }, 5000);

}
window.handleNewsletterSubmit = handleNewsletterSubmit;



// --- DYNAMIC PADDING ADJUSTMENT ---
function adjustMainPadding() {
    const footer = document.querySelector(".app-footer");
    const main = document.querySelector(".app-main");
    if (footer && main) {
        const footerHeight = footer.offsetHeight;
        main.style.paddingBottom = `${footerHeight + 24}px`; // Add 24px extra breathing room
    }
}
window.adjustMainPadding = adjustMainPadding;

// --- TOAST NOTIFICATION UTILITY ---
function showToast(title, message, duration = 3000) {
    let container = document.querySelector(".toast-container");
    if (!container) {
        container = document.createElement("div");
        container.className = "toast-container";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
        <div class="toast-header">
            <span class="toast-title"><i class="fa-solid fa-terminal"></i> ${title}</span>
            <span class="toast-close" onclick="this.parentElement.parentElement.remove()"><i class="fa-solid fa-xmark"></i></span>
        </div>
        <div class="toast-body">${message}</div>
    `;

    container.appendChild(toast);

    // Auto-remove after duration
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(50px)";
        setTimeout(() => {
            toast.remove();
            if (container.children.length === 0) {
                container.remove();
            }
        }, 300);
    }, duration);
}
window.showToast = showToast;
