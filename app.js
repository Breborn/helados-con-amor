document.addEventListener('DOMContentLoaded', () => {
    // 1. Multi-tag Category & Dietary Filtering (Vegan, Sin Gluten, Cremas, Paletas)
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            productCards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' ');
                if (filterValue === 'todos' || categories.includes(filterValue)) {
                    card.style.display = 'flex';
                    card.animate([
                        { transform: 'scale(0.88)', opacity: 0 },
                        { transform: 'scale(1)', opacity: 1 }
                    ], { duration: 300, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' });
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 2. Lightbox Photo Viewer (Works on product cards, 3-pillars, and moving vitrina)
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const zoomElements = document.querySelectorAll('[data-lightbox]');

    zoomElements.forEach(el => {
        el.addEventListener('click', () => {
            const imgSrc = el.getAttribute('data-lightbox');
            const title = el.getAttribute('data-title');
            lightboxImg.src = imgSrc;
            lightboxImg.alt = title;
            lightboxCaption.textContent = title;
            lightboxModal.classList.add('open');
        });
    });

    const closeLightbox = () => {
        lightboxModal.classList.remove('open');
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) closeLightbox();
    });

    // 3. Playful Heart & Leaf Confetti Burst
    const spawnHearts = (btnElement) => {
        const rect = btnElement.getBoundingClientRect();
        const emojis = ['🍓', '💖', '🌱', '🍦', '✨'];
        for (let i = 0; i < 6; i++) {
            const span = document.createElement('span');
            span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            span.style.position = 'fixed';
            span.style.left = `${rect.left + rect.width / 2}px`;
            span.style.top = `${rect.top}px`;
            span.style.fontSize = '1.3rem';
            span.style.pointerEvents = 'none';
            span.style.zIndex = '500';
            document.body.appendChild(span);

            const dx = (Math.random() - 0.5) * 120;
            const dy = -40 - Math.random() * 70;

            span.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${dx}px, ${dy}px) scale(1.4)`, opacity: 0 }
            ], { duration: 750, easing: 'ease-out' }).onfinish = () => span.remove();
        }
    };

    // 4. Interactive Custom 1-Liter Compostable Pint Builder
    const flavorChips = document.querySelectorAll('.flavor-chip');
    const selectedPillsContainer = document.getElementById('selectedPills');
    const selectedCountText = document.getElementById('selectedCountText');
    const addCustomPintBtn = document.getElementById('addCustomPintBtn');
    let selectedFlavors = [];
    const MAX_FLAVORS = 4;

    const renderSelectedFlavors = () => {
        selectedCountText.textContent = `${selectedFlavors.length} / ${MAX_FLAVORS} gustos`;
        addCustomPintBtn.disabled = selectedFlavors.length === 0;

        if (selectedFlavors.length === 0) {
            selectedPillsContainer.innerHTML = `<span class="empty-pill-hint">👆 ¡Tocá los sabores de la derecha para llenar tu pote!</span>`;
            return;
        }

        selectedPillsContainer.innerHTML = selectedFlavors
            .map(flavor => `<span class="selected-pill">🍨 ${flavor}</span>`)
            .join('');
    };

    flavorChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const flavorName = chip.getAttribute('data-flavor');
            const existsIndex = selectedFlavors.indexOf(flavorName);

            if (existsIndex > -1) {
                selectedFlavors.splice(existsIndex, 1);
                chip.classList.remove('selected');
            } else {
                if (selectedFlavors.length >= MAX_FLAVORS) {
                    showToast('¡Podés elegir hasta 4 sabores por Pote de Litro! 🌱💖');
                    return;
                }
                selectedFlavors.push(flavorName);
                chip.classList.add('selected');
                spawnHearts(chip);
            }
            renderSelectedFlavors();
        });
    });

    // 5. Shopping Cart & Order Drawer
    const cartTrigger = document.getElementById('cartTrigger');
    const cartDrawer = document.getElementById('cartDrawer');
    const drawerClose = document.getElementById('drawerClose');
    const backdrop = document.getElementById('backdrop');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartCount = document.getElementById('cartCount');
    const cartTotalValue = document.getElementById('cartTotalValue');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const addBtns = document.querySelectorAll('.btn-order-pop');
    const toast = document.getElementById('toast');

    let cart = [];

    const showToast = (msg) => {
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2600);
    };

    const formatPrice = (num) => {
        return '$' + num.toLocaleString('es-AR');
    };

    const updateCartUI = () => {
        cartCount.textContent = cart.length;
        const total = cart.reduce((acc, item) => acc + item.price, 0);
        cartTotalValue.textContent = formatPrice(total);

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `<p class="empty-cart-msg">¡Todavía no elegiste tu sabor de hoy! Sumá tus favoritos de la carta 🍦🍓</p>`;
            return;
        }

        cartItemsContainer.innerHTML = cart.map((item, idx) => `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${formatPrice(item.price)}</div>
                </div>
                <button class="cart-item-remove" data-index="${idx}" aria-label="Quitar">✕</button>
            </div>
        `).join('');

        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-index'), 10);
                cart.splice(idx, 1);
                updateCartUI();
            });
        });
    };

    addBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.getAttribute('data-name');
            const price = parseInt(btn.getAttribute('data-price'), 10);
            const img = btn.getAttribute('data-img');

            cart.push({ name, price, img });
            spawnHearts(btn);
            updateCartUI();
            showToast(`¡Sumamos "${name}" a tu pedido! 🌱🍓`);
        });
    });

    addCustomPintBtn.addEventListener('click', () => {
        if (selectedFlavors.length === 0) return;
        const customName = `Pote 1L Compostable (${selectedFlavors.join(' + ')})`;
        cart.push({
            name: customName,
            price: 11900,
            img: 'assets/img/potes.jpg'
        });
        spawnHearts(addCustomPintBtn);
        selectedFlavors = [];
        flavorChips.forEach(c => c.classList.remove('selected'));
        renderSelectedFlavors();
        updateCartUI();
        openCartDrawer();
        showToast('¡Tu pote consciente de 1 Litro fue sumado! ♻️💖');
    });

    const openCartDrawer = () => {
        cartDrawer.classList.add('open');
        backdrop.classList.add('open');
    };

    const closeCartDrawer = () => {
        cartDrawer.classList.remove('open');
        backdrop.classList.remove('open');
    };

    cartTrigger.addEventListener('click', openCartDrawer);
    drawerClose.addEventListener('click', closeCartDrawer);
    backdrop.addEventListener('click', closeCartDrawer);

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showToast('¡Elegí al menos un helado primero! 🍦');
            return;
        }
        const summaryLines = cart.map(i => `🌱 ${i.name} (${formatPrice(i.price)})`).join('\n');
        const total = formatPrice(cart.reduce((acc, i) => acc + i.price, 0));
        alert(`💖🌱 ¡Gracias por elegir Helados con Amor (Heladería Consciente)! 🌱💖\n\nTu pedido de hoy:\n${summaryLines}\n\nTotal: ${total}\n\n¡Ya estamos preparando tus potes compostables!`);
        cart = [];
        updateCartUI();
        closeCartDrawer();
    });
});
