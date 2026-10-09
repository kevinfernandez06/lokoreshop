const WHATSAPP_PHONE = '595984862642';

const ADMIN_CREDENTIALS = {
    user: 'admin',
    pass: 'admin123'
};

const DEFAULT_COUPONS = {
    'LOKORE10': 0.10,
    'LOKORE20': 0.20,
    'PARAGUAY': 0.15
};

let validCoupons = JSON.parse(localStorage.getItem('lokore_coupons_v1')) || DEFAULT_COUPONS;

const INITIAL_PRODUCTS = [
    {
        id: '1',
        title: 'Remera Personalizada CR7',
        category: 'remeras',
        price: 150000,
        stock: 4,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        image: 'https://cdn.discordapp.com/attachments/1235380821477691403/1557922088210276495/5f8dbc0e6b0d39091f084d1bb8a7ddce.png?ex=6ac98f82&is=6ac83e02&hm=994bc6532957b96778b90b79b769cd24364f469dd375dacb7966dc30e99e9abe&'
    },
        {
        id: '2',
        title: 'Remera Personalizada MESSI',
        category: 'remeras',
        price: 150000,
        stock: 3,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        image: 'https://cdn.discordapp.com/attachments/1235380821477691403/1557922314748694640/88ff6acecb56b817a9a961d598f51a3d.png?ex=6aca3878&is=6ac8e6f8&hm=70fdf45b9f53479dd3d5eee1a655ccaf7c7c8acc95afac459ad24295bb1478cb&'
    },
        {
        id: '3',
        title: 'Remera Personalizada GOKU',
        category: 'remeras',
        price: 150000,
        stock: 3,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        image: 'https://cdn.discordapp.com/attachments/1235380821477691403/1557924430695374869/a6b8cdf21e659fc56d53d4df5b739837.png?ex=6aca3a71&is=6ac8e8f1&hm=179c163a37472a191119f9c24302d041606d6f8b8efa99fe54f5ba8548aaaa59&'
    },
        {
        id: '4',
        title: 'Remera Personalizada GOJO',
        category: 'remeras',
        price: 150000,
        stock: 2,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        image: 'https://cdn.discordapp.com/attachments/1235380821477691403/1557929168962986024/3e7c64eb495f5b79dd6f8de2da51b11c.png?ex=6aca3eda&is=6ac8ed5a&hm=dad34efdf55531fcc531765d14352d4a27889a4d7237148b58af1076425c2397&'
    },
        {
        id: '5',
        title: 'Remera Personalizada LUFFY',
        category: 'remeras',
        price: 150000,
        stock: 1,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        image: 'https://cdn.discordapp.com/attachments/1235380821477691403/1557929283400241242/2d1ec35e8fc409f5c35da07557f05a39.png?ex=6aca3ef6&is=6ac8ed76&hm=61011ca01ac66b9775805e744c5ed6ce2927cdd2d71560109a1ef998bdbc2371&'
    },
    {
        id: '6',
        title: 'Hoodie Personalizado CR7',
        category: 'hoodies',
        price: 180000,
        stock: 2,
        sizes: ['M', 'L', 'XL', 'XXL'],
        image: 'https://cdn.discordapp.com/attachments/1235380821477691403/1558247759415476234/D_NQ_NP_889851-MLM88314911592_072025-O.png?ex=6acabed0&is=6ac96d50&hm=938599045e440535a8bac503f42432421b062d028214d50cdc073aaaaa50d78f&'
    },
    {
        id: '7',
        title: 'Short Urbano Lokore Street',
        category: 'shorts',
        price: 115000,
        stock: 8,
        sizes: ['S', 'M', 'L'],
        image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: '8',
        title: 'Taza Lokore Matte Gold',
        category: 'tazas',
        price: 50000,
        stock: 20,
        sizes: ['Único'],
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: '9',
        title: 'Gorra Lokore Snapback',
        category: 'gorras',
        price: 90000,
        stock: 3,
        sizes: ['Ajustable'],
        image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80'
    }
];

let products = JSON.parse(localStorage.getItem('lokore_products_v1')) || INITIAL_PRODUCTS;
let cart = JSON.parse(localStorage.getItem('lokore_cart_v1')) || [];
let wishlist = JSON.parse(localStorage.getItem('lokore_wishlist_v1')) || [];
let selectedSizesMap = {};
let isAdminLoggedIn = JSON.parse(sessionStorage.getItem('lokore_admin_logged')) || false;
let activeCategory = 'ALL';
let currentSearch = '';
let currentSort = 'default';
let currentBase64Image = '';
let activeQuickViewProdId = null;
let appliedDiscountRate = 0;
let appliedCouponCode = '';

let audioCtx = null;

function playSound(type = 'click') {
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        const now = audioCtx.currentTime;

        if (type === 'click') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
        } else if (type === 'success') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.setValueAtTime(880, now + 0.1);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.25);
            osc.start(now);
            osc.stop(now + 0.25);
        } else if (type === 'delete') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.linearRampToValueAtTime(100, now + 0.15);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.15);
            osc.start(now);
            osc.stop(now + 0.15);
        }
    } catch (e) {}
}

function formatPYG(amount) {
    return '₲ ' + Math.round(amount).toLocaleString('es-PY');
}

function saveCoupons() {
    localStorage.setItem('lokore_coupons_v1', JSON.stringify(validCoupons));
}

function saveWishlist() {
    localStorage.setItem('lokore_wishlist_v1', JSON.stringify(wishlist));
}

function toggleWishlist(productId) {
    if (wishlist.includes(productId)) {
        wishlist = wishlist.filter(id => id !== productId);
        playSound('delete');
    } else {
        wishlist.push(productId);
        playSound('success');
    }
    saveWishlist();
    renderApp();
    renderWishlistModal();
}

function updateLiveClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('es-PY', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    });
    const dateStr = now.toLocaleDateString('es-PY', {
        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
    });

    const liveTimeEl = document.getElementById('liveTime');
    const currentDateEl = document.getElementById('currentDateDisplay');

    if (liveTimeEl) liveTimeEl.textContent = timeStr;
    if (currentDateEl) currentDateEl.textContent = dateStr;
}

function startSocialProofToasts() {
    const cities = ['Asunción', 'San Lorenzo', 'Luque', 'Ciudad del Este', 'Encarnación', 'Lambaré', 'Capiatá'];
    const toast = document.getElementById('toastNotification');
    const toastMsg = document.getElementById('toastMessage');

    setInterval(() => {
        if (!products.length) return;
        const randomCity = cities[Math.floor(Math.random() * cities.length)];
        const randomProd = products[Math.floor(Math.random() * products.length)];

        toastMsg.innerHTML = `Alguien de <span class="font-bold text-amber-300">${randomCity}</span> compró <span class="font-bold text-white">${randomProd.title}</span>`;
        
        toast.classList.remove('translate-y-20', 'opacity-0');
        
        setTimeout(() => {
            toast.classList.add('translate-y-20', 'opacity-0');
        }, 4500);
    }, 12000);
}

function calculateSize(heightCm, weightKg) {
    if (!heightCm || !weightKg) return 'M';
    if (weightKg < 60) return 'S';
    if (weightKg >= 60 && weightKg < 76) return 'M';
    if (weightKg >= 76 && weightKg < 90) return 'L';
    return 'XL';
}

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const sortBy = document.getElementById('sortBy');
const categoryTabs = document.getElementById('categoryTabs');

const openLoginModalBtn = document.getElementById('openLoginModalBtn');
const loginModal = document.getElementById('loginModal');
const closeLoginModalBtn = document.getElementById('closeLoginModalBtn');
const loginForm = document.getElementById('loginForm');
const loginErrorMsg = document.getElementById('loginErrorMsg');
const adminBadgeHeader = document.getElementById('adminBadgeHeader');
const logoutBtn = document.getElementById('logoutBtn');
const adminMetrics = document.getElementById('adminMetrics');
const openAddModalBtn = document.getElementById('openAddModalBtn');
const openCouponsModalBtn = document.getElementById('openCouponsModalBtn');

const statTotalItems = document.getElementById('statTotalItems');
const statTotalStock = document.getElementById('statTotalStock');
const statLowStock = document.getElementById('statLowStock');
const statTotalValue = document.getElementById('statTotalValue');

const productModal = document.getElementById('productModal');
const productForm = document.getElementById('productForm');
const modalTitle = document.getElementById('modalTitle');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelModalBtn = document.getElementById('cancelModalBtn');
const prodFileInput = document.getElementById('prodFileInput');
const imagePreview = document.getElementById('imagePreview');
const prodImage = document.getElementById('prodImage');

// FAQ Modal DOM
const openFaqModalBtn = document.getElementById('openFaqModalBtn');
const faqModal = document.getElementById('faqModal');
const closeFaqModalBtn = document.getElementById('closeFaqModalBtn');

// Parallax Hero DOM
const heroCard = document.getElementById('heroCard');
const heroImage3D = document.getElementById('heroImage3D');

// Coupons Modal DOM
const couponsModal = document.getElementById('couponsModal');
const closeCouponsModalBtn = document.getElementById('closeCouponsModalBtn');
const addCouponForm = document.getElementById('addCouponForm');
const newCouponCode = document.getElementById('newCouponCode');
const newCouponRate = document.getElementById('newCouponRate');
const couponsListContainer = document.getElementById('couponsListContainer');

// Wishlist Modal DOM
const wishlistModalBtn = document.getElementById('wishlistModalBtn');
const wishlistBadge = document.getElementById('wishlistBadge');
const wishlistModal = document.getElementById('wishlistModal');
const closeWishlistModalBtn = document.getElementById('closeWishlistModalBtn');
const wishlistItemsContainer = document.getElementById('wishlistItemsContainer');

// Care Guide Modal DOM
const openCareGuideBtn = document.getElementById('openCareGuideBtn');
const careGuideModal = document.getElementById('careGuideModal');
const closeCareGuideModalBtn = document.getElementById('closeCareGuideModalBtn');

// Size Calc Modal DOM
const sizeCalcModal = document.getElementById('sizeCalcModal');
const openSizeCalcHeroBtn = document.getElementById('openSizeCalcHeroBtn');
const qvOpenSizeCalcBtn = document.getElementById('qvOpenSizeCalcBtn');
const closeSizeCalcModalBtn = document.getElementById('closeSizeCalcModalBtn');
const calculateSizeBtn = document.getElementById('calculateSizeBtn');
const calcHeight = document.getElementById('calcHeight');
const calcWeight = document.getElementById('calcWeight');
const sizeResultContainer = document.getElementById('sizeResultContainer');
const recommendedSizeText = document.getElementById('recommendedSizeText');

const quickViewModal = document.getElementById('quickViewModal');
const closeQuickViewBtn = document.getElementById('closeQuickViewBtn');
const qvImage = document.getElementById('qvImage');
const qvCategory = document.getElementById('qvCategory');
const qvId = document.getElementById('qvId');
const qvTitle = document.getElementById('qvTitle');
const qvPrice = document.getElementById('qvPrice');
const qvSizesContainer = document.getElementById('qvSizesContainer');
const qvAddToCartBtn = document.getElementById('qvAddToCartBtn');

const cartBtn = document.getElementById('cartBtn');
const cartDrawer = document.getElementById('cartDrawer');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartBadge = document.getElementById('cartBadge');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartTotal = document.getElementById('cartTotal');
const checkoutWhatsAppBtn = document.getElementById('checkoutWhatsAppBtn');
const clientNameInput = document.getElementById('clientNameInput');

// Coupon Cart DOM
const couponCodeInput = document.getElementById('couponCodeInput');
const applyCouponBtn = document.getElementById('applyCouponBtn');
const couponMsg = document.getElementById('couponMsg');
const discountRow = document.getElementById('discountRow');
const discountAmountText = document.getElementById('discountAmountText');

document.addEventListener('DOMContentLoaded', () => {
    saveProducts();
    renderApp();
    setupEventListeners();
    
    updateLiveClock();
    setInterval(updateLiveClock, 1000);
    startSocialProofToasts();
});

function saveProducts() {
    localStorage.setItem('lokore_products_v1', JSON.stringify(products));
}

function saveCart() {
    localStorage.setItem('lokore_cart_v1', JSON.stringify(cart));
}

function renderApp() {
    adminBadgeHeader.classList.toggle('hidden', !isAdminLoggedIn);
    adminMetrics.classList.toggle('hidden', !isAdminLoggedIn);
    openAddModalBtn.classList.toggle('hidden', !isAdminLoggedIn);
    openCouponsModalBtn.classList.toggle('hidden', !isAdminLoggedIn);

    wishlistBadge.textContent = wishlist.length;
    wishlistBadge.classList.toggle('hidden', wishlist.length === 0);

    if (isAdminLoggedIn) renderStats();
    renderProducts();
    renderCart();
}

function renderWishlistModal() {
    if (wishlist.length === 0) {
        wishlistItemsContainer.innerHTML = '<p class="text-xs text-slate-500 text-center py-6">No tienes productos en tus favoritos.</p>';
        return;
    }

    wishlistItemsContainer.innerHTML = wishlist.map(id => {
        const prod = products.find(p => p.id === id);
        if (!prod) return '';
        return `
            <div class="flex items-center justify-between gap-3 p-3 bg-[#07070a] border border-[#242432] rounded-2xl">
                <img src="${prod.image}" class="w-12 h-12 object-cover rounded-xl bg-[#111118]">
                <div class="flex-grow">
                    <h5 class="text-xs font-bold text-white line-clamp-1">${prod.title}</h5>
                    <span class="text-xs font-bold text-amber-400">${formatPYG(prod.price)}</span>
                </div>
                <button onclick="addToCart('${prod.id}')" class="px-3 py-1.5 bg-amber-500/10 border border-amber-500/40 text-amber-400 text-xs font-bold rounded-xl hover:bg-amber-500/20">
                    <i class="fa-solid fa-cart-plus"></i>
                </button>
                <button onclick="toggleWishlist('${prod.id}')" class="text-red-400 hover:text-red-300 p-1">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;
    }).join('');
}

function renderStats() {
    statTotalItems.textContent = products.length;
    statTotalStock.textContent = `${products.reduce((acc, item) => acc + item.stock, 0)} u.`;
    statLowStock.textContent = products.filter(item => item.stock <= 3).length;
    statTotalValue.textContent = formatPYG(products.reduce((acc, item) => acc + (item.price * item.stock), 0));
}

function renderCouponsList() {
    const codes = Object.keys(validCoupons);
    if (codes.length === 0) {
        couponsListContainer.innerHTML = '<p class="text-xs text-slate-500">No hay cupones creados.</p>';
        return;
    }

    couponsListContainer.innerHTML = codes.map(code => {
        const ratePercent = Math.round(validCoupons[code] * 100);
        return `
            <div class="flex items-center justify-between p-2.5 bg-[#07070a] border border-[#242432] rounded-xl text-xs">
                <div class="flex items-center gap-2">
                    <span class="font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">${code}</span>
                    <span class="text-slate-300 font-bold">-${ratePercent}% Off</span>
                </div>
                <button onclick="deleteCoupon('${code}')" class="text-red-400 hover:text-red-300 font-bold p-1" title="Eliminar Cupón">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;
    }).join('');
}

function deleteCoupon(code) {
    if (confirm(`¿Eliminar el cupón ${code}?`)) {
        delete validCoupons[code];
        saveCoupons();
        renderCouponsList();
        playSound('delete');
    }
}

function getFilteredProducts() {
    return products.filter(item => {
        const matchesCategory = activeCategory === 'ALL' || item.category === activeCategory;
        const matchesSearch = item.title.toLowerCase().includes(currentSearch.toLowerCase()) || 
                              item.category.toLowerCase().includes(currentSearch.toLowerCase()) ||
                              item.id.includes(currentSearch);
        return matchesCategory && matchesSearch;
    }).sort((a, b) => {
        if (currentSort === 'price-asc') return a.price - b.price;
        if (currentSort === 'price-desc') return b.price - a.price;
        if (currentSort === 'stock-desc') return b.stock - a.stock;
        return 0;
    });
}

function selectSize(productId, size) {
    selectedSizesMap[productId] = size;
    playSound('click');
    renderProducts();
}

function openQuickView(productId) {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;
    
    activeQuickViewProdId = productId;
    qvImage.src = prod.image;
    qvCategory.textContent = prod.category;
    qvId.textContent = `ID: #${prod.id}`;
    qvTitle.textContent = prod.title;
    qvPrice.textContent = formatPYG(prod.price);

    const availableSizes = prod.sizes && prod.sizes.length ? prod.sizes : ['Único'];
    if (!selectedSizesMap[prod.id]) selectedSizesMap[prod.id] = availableSizes[0];

    qvSizesContainer.innerHTML = availableSizes.map(s => {
        const isSelected = s === selectedSizesMap[prod.id];
        return `
            <button type="button" onclick="selectSize('${prod.id}', '${s}'); openQuickView('${prod.id}');" 
                class="size-badge text-xs px-3 py-1.5 rounded-xl border border-[#242432] ${isSelected ? 'selected' : 'bg-[#07070a] text-slate-300 hover:text-white'}">
                ${s}
            </button>
        `;
    }).join('');

    quickViewModal.classList.remove('hidden');
    playSound('click');
}

function renderProducts() {
    const filtered = getFilteredProducts();

    if (filtered.length === 0) {
        productsGrid.innerHTML = '';
        emptyState.classList.remove('hidden');
        emptyState.classList.add('flex');
        return;
    }

    emptyState.classList.add('hidden');
    emptyState.classList.remove('flex');

    productsGrid.innerHTML = filtered.map(product => {
        const isLowStock = product.stock > 0 && product.stock <= 3;
        const isOutOfStock = product.stock === 0;
        const isFav = wishlist.includes(product.id);

        const availableSizes = product.sizes && product.sizes.length ? product.sizes : ['Único'];
        if (!selectedSizesMap[product.id]) {
            selectedSizesMap[product.id] = availableSizes[0];
        }
        const activeSize = selectedSizesMap[product.id];

        const sizeButtonsHTML = availableSizes.map(size => {
            const isSelected = size === activeSize;
            return `
                <button type="button" onclick="selectSize('${product.id}', '${size}')" 
                    class="size-badge text-[11px] px-2.5 py-1 rounded-lg border border-[#242432] ${isSelected ? 'selected' : 'bg-[#07070a] text-slate-300 hover:text-white hover:border-amber-400'}">
                    ${size}
                </button>
            `;
        }).join('');

        return `
            <div class="product-card bg-[#111118] border border-[#242432] rounded-2xl overflow-hidden flex flex-col relative group">
                <div class="absolute top-3 left-3 z-10 flex gap-2">
                    <span class="bg-[#07070a]/90 backdrop-blur-md border border-amber-500/30 text-amber-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg">
                        ${product.category}
                    </span>
                </div>

                <button onclick="toggleWishlist('${product.id}')" class="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/70 border border-[#242432] flex items-center justify-center transition-all hover:scale-110">
                    <i class="fa-solid fa-heart ${isFav ? 'text-red-500' : 'text-slate-400'} text-sm"></i>
                </button>

                <div class="relative h-48 w-full overflow-hidden bg-[#07070a] cursor-pointer" onclick="openQuickView('${product.id}')">
                    <img src="${product.image}" alt="${product.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onerror="this.src='https://via.placeholder.com/400x300/111118/d4af37?text=Lokore+Shop'">
                    <div class="absolute inset-0 bg-gradient-to-t from-[#111118] via-transparent to-transparent"></div>
                    <span class="absolute bottom-2 right-2 bg-black/70 text-amber-400 text-[10px] px-2 py-0.5 rounded-lg border border-amber-500/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 font-bold">
                        <i class="fa-solid fa-eye"></i> Vista previa
                    </span>
                </div>

                <div class="p-4 flex-grow flex flex-col justify-between gap-3">
                    <div>
                        <h4 onclick="openQuickView('${product.id}')" class="font-extrabold text-slate-100 text-sm line-clamp-1 mb-1 tracking-wide hover:text-amber-400 cursor-pointer transition-colors">${product.title}</h4>
                        <div class="text-[11px] text-slate-400 flex items-center justify-between font-semibold">
                            <span>ID: #${product.id}</span>
                            <span class="${product.stock > 0 ? 'text-slate-300' : 'text-red-400'}">Stock: ${product.stock} u.</span>
                        </div>
                    </div>

                    ${isLowStock ? `
                        <div class="p-2 rounded-xl bg-red-950/30 border border-red-500/40 flex items-center gap-2 animate-pulse">
                            <span class="w-2 h-2 rounded-full bg-red-500"></span>
                            <span class="text-[10px] font-extrabold text-red-400 uppercase tracking-wider">🔥 ¡Solo quedan ${product.stock} disponibles!</span>
                        </div>
                    ` : ''}

                    <div>
                        <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Seleccionar Talle:</span>
                        <div class="flex flex-wrap gap-1.5">
                            ${sizeButtonsHTML}
                        </div>
                    </div>

                    <div class="pt-3 border-t border-[#242432] flex items-center justify-between gap-2 mt-1">
                        <div>
                            <span class="text-[10px] font-bold uppercase text-slate-400 block -mb-1">Precio</span>
                            <span class="font-extrabold text-xl text-amber-400 tracking-tight">${formatPYG(product.price)}</span>
                        </div>
                        
                        <div class="flex items-center gap-1.5">
                            <button onclick="addToCart('${product.id}')" ${isOutOfStock ? 'disabled' : ''} 
                                class="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-extrabold flex items-center gap-1.5 transition-all disabled:opacity-30 disabled:pointer-events-none shadow-[0_0_10px_rgba(212,175,55,0.1)]">
                                <i class="fa-solid fa-cart-plus"></i>
                                <span>Agregar</span>
                            </button>
                            
                            ${isAdminLoggedIn ? `
                                <button onclick="openEditModal('${product.id}')" class="w-8 h-8 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center transition-all" title="Editar">
                                    <i class="fa-solid fa-pen-to-square text-xs"></i>
                                </button>
                                <button onclick="deleteProduct('${product.id}')" class="w-8 h-8 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 flex items-center justify-center transition-all" title="Eliminar">
                                    <i class="fa-solid fa-trash-can text-xs"></i>
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderCart() {
    const totalCount = cart.reduce((acc, item) => acc + item.qty, 0);
    cartBadge.textContent = totalCount;
    cartBadge.classList.toggle('hidden', totalCount === 0);

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full text-center py-12">
                <i class="fa-solid fa-basket-shopping text-4xl text-slate-600 mb-3"></i>
                <p class="text-slate-400 text-xs">Tu carrito está vacío</p>
            </div>
        `;
        cartTotal.textContent = '₲ 0';
        discountRow.classList.add('hidden');
        return;
    }

    let rawTotal = 0;

    cartItemsContainer.innerHTML = cart.map(item => {
        const prod = products.find(p => p.id === item.id);
        if (!prod) return '';
        const itemTotal = prod.price * item.qty;
        rawTotal += itemTotal;

        return `
            <div class="py-3 flex items-center gap-3">
                <img src="${prod.image}" class="w-12 h-12 rounded-xl object-cover border border-[#242432] bg-[#07070a]">
                <div class="flex-grow">
                    <h5 class="text-xs font-bold text-slate-200 line-clamp-1">${prod.title}</h5>
                    <div class="flex items-center gap-2 mt-0.5">
                        <span class="text-[11px] text-amber-400 font-bold">${formatPYG(prod.price)}</span>
                        <span class="text-[10px] bg-amber-950/80 text-amber-300 font-bold px-1.5 py-0.2 rounded border border-amber-500/40">Talle: ${item.selectedSize}</span>
                    </div>
                    <div class="flex items-center gap-2 mt-1.5">
                        <button onclick="updateCartQty('${item.cartItemId}', -1)" class="w-5 h-5 rounded bg-[#242432] text-slate-300 text-xs flex items-center justify-center font-bold">-</button>
                        <span class="text-xs font-bold w-4 text-center">${item.qty}</span>
                        <button onclick="updateCartQty('${item.cartItemId}', 1)" class="w-5 h-5 rounded bg-[#242432] text-slate-300 text-xs flex items-center justify-center font-bold">+</button>
                    </div>
                </div>
                <div class="text-right flex flex-col items-end gap-1">
                    <span class="text-xs font-bold text-emerald-400">${formatPYG(itemTotal)}</span>
                    <button onclick="removeFromCart('${item.cartItemId}')" class="text-slate-500 hover:text-red-400 text-xs p-1">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');

    const discountValue = rawTotal * appliedDiscountRate;
    const finalTotal = Math.max(0, rawTotal - discountValue);

    if (appliedDiscountRate > 0) {
        discountRow.classList.remove('hidden');
        discountAmountText.textContent = `- ${formatPYG(discountValue)}`;
    } else {
        discountRow.classList.add('hidden');
    }

    cartTotal.textContent = formatPYG(finalTotal);
}

function setupEventListeners() {
    // FAQ Modal
    openFaqModalBtn.addEventListener('click', () => {
        faqModal.classList.remove('hidden');
        playSound('click');
    });
    closeFaqModalBtn.addEventListener('click', () => faqModal.classList.add('hidden'));

    // EFECTO PARALLAX 3D EN HERO IMAGE
    if (heroCard && heroImage3D) {
        heroCard.addEventListener('mousemove', (e) => {
            const rect = heroCard.getBoundingClientRect();
            const x = e.clientX - rect.left - (rect.width / 2);
            const y = e.clientY - rect.top - (rect.height / 2);
            
            const rotateX = (-y / rect.height) * 15;
            const rotateY = (x / rect.width) * 15;

            heroImage3D.style.transform = `scale(1.08) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        heroCard.addEventListener('mouseleave', () => {
            heroImage3D.style.transform = 'scale(1) rotateX(0deg) rotateY(0deg)';
        });
    }

    // Favoritos / Wishlist Modal
    wishlistModalBtn.addEventListener('click', () => {
        renderWishlistModal();
        wishlistModal.classList.remove('hidden');
        playSound('click');
    });
    closeWishlistModalBtn.addEventListener('click', () => wishlistModal.classList.add('hidden'));

    // Guía de Cuidado
    openCareGuideBtn.addEventListener('click', () => {
        careGuideModal.classList.remove('hidden');
        playSound('click');
    });
    closeCareGuideModalBtn.addEventListener('click', () => careGuideModal.classList.add('hidden'));

    // Modal Cupones Admin
    openCouponsModalBtn.addEventListener('click', () => {
        if (!isAdminLoggedIn) return;
        renderCouponsList();
        couponsModal.classList.remove('hidden');
        playSound('click');
    });

    closeCouponsModalBtn.addEventListener('click', () => couponsModal.classList.add('hidden'));

    addCouponForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const code = newCouponCode.value.trim().toUpperCase();
        const rate = parseFloat(newCouponRate.value) / 100;

        if (code && rate > 0) {
            validCoupons[code] = rate;
            saveCoupons();
            renderCouponsList();
            addCouponForm.reset();
            playSound('success');
        }
    });

    // Modal Calculadora
    openSizeCalcHeroBtn.addEventListener('click', () => {
        sizeCalcModal.classList.remove('hidden');
        playSound('click');
    });

    qvOpenSizeCalcBtn.addEventListener('click', () => {
        quickViewModal.classList.add('hidden');
        sizeCalcModal.classList.remove('hidden');
        playSound('click');
    });

    closeSizeCalcModalBtn.addEventListener('click', () => sizeCalcModal.classList.add('hidden'));

    calculateSizeBtn.addEventListener('click', () => {
        const h = parseFloat(calcHeight.value);
        const w = parseFloat(calcWeight.value);
        const resSize = calculateSize(h, w);

        recommendedSizeText.textContent = resSize;
        sizeResultContainer.classList.remove('hidden');
        playSound('success');
    });

    // Aplicar Cupones en Carrito
    applyCouponBtn.addEventListener('click', () => {
        const code = couponCodeInput.value.trim().toUpperCase();

        if (validCoupons[code]) {
            appliedDiscountRate = validCoupons[code];
            appliedCouponCode = code;
            couponMsg.textContent = `¡Cupón ${code} aplicado (${appliedDiscountRate * 100}% de descuento)!`;
            couponMsg.className = 'text-[11px] font-bold text-emerald-400';
            couponMsg.classList.remove('hidden');
            playSound('success');
            renderCart();
        } else {
            couponMsg.textContent = 'Cupón no válido o expirado';
            couponMsg.className = 'text-[11px] font-bold text-red-400';
            couponMsg.classList.remove('hidden');
            playSound('delete');
        }
    });

    closeQuickViewBtn.addEventListener('click', () => quickViewModal.classList.add('hidden'));
    
    qvAddToCartBtn.addEventListener('click', () => {
        if (activeQuickViewProdId) {
            addToCart(activeQuickViewProdId);
            quickViewModal.classList.add('hidden');
        }
    });

    openLoginModalBtn.addEventListener('click', () => {
        if (isAdminLoggedIn) return;
        loginModal.classList.remove('hidden');
    });

    closeLoginModalBtn.addEventListener('click', () => loginModal.classList.add('hidden'));

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('loginUser').value;
        const pass = document.getElementById('loginPass').value;

        if (user === ADMIN_CREDENTIALS.user && pass === ADMIN_CREDENTIALS.pass) {
            isAdminLoggedIn = true;
            sessionStorage.setItem('lokore_admin_logged', JSON.stringify(true));
            loginModal.classList.add('hidden');
            loginForm.reset();
            loginErrorMsg.classList.add('hidden');
            playSound('success');
            renderApp();
        } else {
            loginErrorMsg.classList.remove('hidden');
        }
    });

    logoutBtn.addEventListener('click', () => {
        isAdminLoggedIn = false;
        sessionStorage.removeItem('lokore_admin_logged');
        playSound('click');
        renderApp();
    });

    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value;
        renderProducts();
    });

    sortBy.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderProducts();
    });

    categoryTabs.addEventListener('click', (e) => {
        const btn = e.target.closest('.category-tab');
        if (!btn) return;

        playSound('click');
        document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');

        activeCategory = btn.dataset.category;
        renderProducts();
    });

    prodFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(evt) {
                currentBase64Image = evt.target.result;
                imagePreview.src = currentBase64Image;
                imagePreview.classList.remove('hidden');
                prodImage.value = '';
            };
            reader.readAsDataURL(file);
        }
    });

    prodImage.addEventListener('input', (e) => {
        if (e.target.value) {
            currentBase64Image = e.target.value;
            imagePreview.src = e.target.value;
            imagePreview.classList.remove('hidden');
        }
    });

    openAddModalBtn.addEventListener('click', () => {
        if (!isAdminLoggedIn) return;
        playSound('click');
        openAddModal();
    });

    closeModalBtn.addEventListener('click', () => closeModal());
    cancelModalBtn.addEventListener('click', () => closeModal());

    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveProductForm();
    });

    cartBtn.addEventListener('click', () => {
        playSound('click');
        cartDrawer.classList.remove('hidden');
    });
    closeCartBtn.addEventListener('click', () => cartDrawer.classList.add('hidden'));

    checkoutWhatsAppBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('El carrito está vacío');
            return;
        }

        const clientName = clientNameInput.value.trim() || 'Cliente';
        let message = `¡Hola LOKORE SHOP! 👋 Mi nombre es *${clientName}* y quiero realizar el siguiente pedido:\n\n`;

        let rawTotal = 0;
        cart.forEach(item => {
            const prod = products.find(p => p.id === item.id);
            if (prod) {
                const subtotal = prod.price * item.qty;
                rawTotal += subtotal;
                message += `• *${prod.title}* (x${item.qty})\n  - Talle: *${item.selectedSize}*\n  - Subtotal: ${formatPYG(subtotal)}\n\n`;
            }
        });

        if (appliedDiscountRate > 0) {
            const discValue = rawTotal * appliedDiscountRate;
            const finalTot = rawTotal - discValue;
            message += `🎟️ *Cupón Aplicado:* ${appliedCouponCode} (-${appliedDiscountRate * 100}%)\n`;
            message += `💰 *Total Final:* ${formatPYG(finalTot)} (Ahorraste ${formatPYG(discValue)})\n`;
        } else {
            message += `💰 *Total a pagar:* ${formatPYG(rawTotal)}\n`;
        }

        message += `\n¿Me podrías indicar los datos para la transferencia / entrega? ¡Muchas gracias!`;

        const encodedMsg = encodeURIComponent(message);
        const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMsg}`;

        playSound('success');
        window.open(waUrl, '_blank');
    });
}

function openAddModal() {
    modalTitle.innerHTML = '<i class="fa-solid fa-plus-circle"></i> Nuevo Producto LOKORE';
    productForm.reset();
    document.getElementById('prodId').value = '';
    currentBase64Image = '';
    imagePreview.classList.add('hidden');
    productModal.classList.remove('hidden');
}

function openEditModal(id) {
    if (!isAdminLoggedIn) return;
    playSound('click');
    const prod = products.find(p => p.id === id);
    if (!prod) return;

    modalTitle.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Editar Producto';
    document.getElementById('prodId').value = prod.id;
    document.getElementById('prodTitle').value = prod.title;
    document.getElementById('prodCategory').value = prod.category;
    document.getElementById('prodSizesInput').value = (prod.sizes || []).join(', ');
    document.getElementById('prodPrice').value = prod.price;
    document.getElementById('prodStock').value = prod.stock;
    
    currentBase64Image = prod.image;
    imagePreview.src = prod.image;
    imagePreview.classList.remove('hidden');
    prodImage.value = prod.image.startsWith('http') ? prod.image : '';

    productModal.classList.remove('hidden');
}

function closeModal() {
    productModal.classList.add('hidden');
}

function saveProductForm() {
    if (!isAdminLoggedIn) return;

    const id = document.getElementById('prodId').value;
    const title = document.getElementById('prodTitle').value;
    const category = document.getElementById('prodCategory').value;
    const rawSizes = document.getElementById('prodSizesInput').value;
    const sizes = rawSizes.split(',').map(s => s.trim()).filter(s => s.length > 0);
    const price = parseFloat(document.getElementById('prodPrice').value);
    const stock = parseInt(document.getElementById('prodStock').value, 10);
    const finalImage = currentBase64Image || prodImage.value || 'https://via.placeholder.com/400x300/111118/d4af37?text=Lokore+Shop';

    if (id) {
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = { id, title, category, sizes, price, stock, image: finalImage };
        }
    } else {
        const newProduct = {
            id: Date.now().toString(),
            title,
            category,
            sizes,
            price,
            stock,
            image: finalImage
        };
        products.unshift(newProduct);
    }

    saveProducts();
    renderApp();
    closeModal();
    playSound('success');
}

function deleteProduct(id) {
    if (!isAdminLoggedIn) return;

    if (confirm('¿Estás seguro de eliminar este producto del stock de Lokore Shop?')) {
        products = products.filter(p => p.id !== id);
        cart = cart.filter(item => item.id !== id);
        wishlist = wishlist.filter(favId => favId !== id);
        saveProducts();
        saveCart();
        saveWishlist();
        renderApp();
        playSound('delete');
    }
}

function addToCart(id) {
    const prod = products.find(p => p.id === id);
    if (!prod || prod.stock <= 0) return;

    const availableSizes = prod.sizes && prod.sizes.length ? prod.sizes : ['Único'];
    const selectedSize = selectedSizesMap[id] || availableSizes[0];
    const cartItemId = `${id}-${selectedSize}`;

    const cartItem = cart.find(item => item.cartItemId === cartItemId);
    if (cartItem) {
        if (cartItem.qty < prod.stock) {
            cartItem.qty++;
        } else {
            alert('Límite de stock alcanzado');
            return;
        }
    } else {
        cart.push({ cartItemId, id, selectedSize, qty: 1 });
    }

    saveCart();
    renderCart();
    playSound('success');
}

function updateCartQty(cartItemId, change) {
    const cartItem = cart.find(item => item.cartItemId === cartItemId);
    if (!cartItem) return;

    const prod = products.find(p => p.id === cartItem.id);
    if (!prod) return;

    cartItem.qty += change;

    if (cartItem.qty > prod.stock) {
        cartItem.qty = prod.stock;
        alert('Stock máximo alcanzado');
    }

    if (cartItem.qty <= 0) {
        cart = cart.filter(item => item.cartItemId !== cartItemId);
    }

    saveCart();
    renderCart();
    playSound('click');
}

function removeFromCart(cartItemId) {
    cart = cart.filter(item => item.cartItemId !== cartItemId);
    saveCart();
    renderCart();
    playSound('delete');
}