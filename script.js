// Sample product data
        const products = [
            {
                id: 1,
                name: "Nourishing Olive Face Cream",
                price: 24.99,
                image: "assets/img/olive.jpg",
                description: "Our signature face cream is enriched with organic olive oil and natural antioxidants to deeply nourish and hydrate your skin. Suitable for all skin types, this cream will leave your skin feeling soft, supple, and radiant.",
                features: [
                    "100% natural ingredients",
                    "Deeply hydrates and nourishes",
                    "Suitable for all skin types",
                    "Cruelty-free and vegan"
                ]
            },
            {
                id: 2,
                name: "Calming Aromatherapy Set",
                price: 32.99,
                image: "assets/img/olive1.jpg",
                description: "This curated set of essential oils is designed to help you relax, unwind, and find your center. Includes lavender, eucalyptus, and chamomile essential oils with a premium diffuser.",
                features: [
                    "100% pure essential oils",
                    "Includes premium diffuser",
                    "Promotes relaxation and stress relief",
                    "Elegant gift packaging"
                ]
            },
            {
                id: 3,
                name: "Olive Body Scrub",
                price: 18.99,
                image: "assets/img/olive2.jpg",
                description: "Exfoliate and rejuvenate your skin with our olive-based body scrub. Made with natural exfoliants and enriched with olive oil, this scrub will leave your skin feeling smooth and refreshed.",
                features: [
                    "Natural exfoliants",
                    "Enriched with olive oil",
                    "Leaves skin soft and smooth",
                    "Eco-friendly packaging"
                ]
            },
            {
                id: 4,
                name: "Olive Lip Care Kit",
                price: 14.99,
                image: "assets/img/olive3.jpg",
                description: "Pamper your lips with our nourishing lip care kit. Includes a lip scrub, lip balm, and overnight lip mask—all made with natural olive oil and butter to keep your lips soft and hydrated.",
                features: [
                    "Three-piece lip care set",
                    "Natural moisturizers",
                    "Gentle exfoliation",
                    "Perfect for daily use"
                ]
            },
            {
                id: 5,
                name: "Olive Hand Cream",
                price: 12.99,
                image: "assets/img/olive4.jpg",
                description: "Our rich hand cream is formulated with olive oil and shea butter to deeply moisturize and protect your hands. Non-greasy formula absorbs quickly for soft, nourished hands.",
                features: [
                    "Deeply moisturizing",
                    "Non-greasy formula",
                    "Quick absorption",
                    "Protects against dryness"
                ]
            },
            {
                id: 6,
                name: "Olive Hair Serum",
                price: 19.99,
                image: "assets/img/olive5.jpg",
                description: "Transform your hair with our nourishing olive hair serum. Reduces frizz, adds shine, and protects hair from heat damage. Suitable for all hair types.",
                features: [
                    "Reduces frizz",
                    "Adds shine",
                    "Heat protection",
                    "For all hair types"
                ]
            }
        ];

        // Cart functionality
        let cart = [];
        
        // DOM elements
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        const cartCount = document.querySelector('.cart-count');
        
        // Initialize the shop
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize hamburger menu
            hamburger.addEventListener('click', function() {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
            
            // Initialize shop page
            renderShopPage();
            
            // Close mobile menu when clicking on a link
            document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }));
            
            // Add to cart buttons
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', function() {
                    const productCard = this.closest('.product-card');
                    const productId = parseInt(productCard.dataset.id);
                    addToCart(productId);
                });
            });
            
            // Load cart from localStorage if available
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                cart = JSON.parse(savedCart);
                updateCartCount();
            }
        });
        
        // Page navigation
        function showPage(pageId) {
            // Hide all pages
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            
            // Show the selected page
            document.getElementById(pageId).classList.add('active');
            
            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            
            // If it's not the cart page, find and activate the corresponding nav link
            if (pageId !== 'cart') {
                const activeLink = document.querySelector(`.nav-link[onclick="showPage('${pageId}')"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
            
            // Scroll to top
            window.scrollTo(0, 0);
            
            // Special handling for specific pages
            if (pageId === 'shop') {
                renderShopPage();
            } else if (pageId === 'cart') {
                renderCartPage();
            }
        }
        
        // Render shop page with products
        function renderShopPage() {
            const productsGrid = document.querySelector('#shop .products-grid');
            productsGrid.innerHTML = '';
            
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.dataset.id = product.id;
                
                productCard.innerHTML = `
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${product.name}</h3>
                        <div class="product-price">£${product.price.toFixed(2)}</div>
                        <div class="product-rating">★★★★★</div>
                        <div class="product-actions">
                            <button class="btn btn-primary add-to-cart">Add to Cart</button>
                            <button class="view-details" onclick="showProductDetail(${product.id})"><i class="fas fa-eye"></i></button>
                        </div>
                    </div>
                `;
                
                productsGrid.appendChild(productCard);
            });
            
            // Reattach event listeners to Add to Cart buttons
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', function() {
                    const productCard = this.closest('.product-card');
                    const productId = parseInt(productCard.dataset.id);
                    addToCart(productId);
                });
            });
        }
        
        // Show product detail page
        function showProductDetail(productId) {
            const product = products.find(p => p.id === productId);
            if (!product) return;
            
            // Update product detail page
            document.getElementById('detail-image').src = product.image;
            document.getElementById('detail-title').textContent = product.name;
            document.getElementById('detail-price').textContent = `£${product.price.toFixed(2)}`;
            document.getElementById('detail-description').textContent = product.description;
            
            // Update features list
            const featuresList = document.getElementById('detail-features');
            featuresList.innerHTML = '';
            product.features.forEach(feature => {
                const li = document.createElement('li');
                li.textContent = feature;
                featuresList.appendChild(li);
            });
            
            // Set current product for adding to cart
            document.getElementById('product-detail').dataset.currentProduct = productId;
            
            // Show the product detail page
            showPage('product-detail');
        }
        
        // Quantity controls
        function increaseQuantity() {
            const quantityInput = document.getElementById('quantity');
            quantityInput.value = parseInt(quantityInput.value) + 1;
        }
        
        function decreaseQuantity() {
            const quantityInput = document.getElementById('quantity');
            if (parseInt(quantityInput.value) > 1) {
                quantityInput.value = parseInt(quantityInput.value) - 1;
            }
        }
        
        // Add to cart from detail page
        function addToCartFromDetail() {
            const productId = parseInt(document.getElementById('product-detail').dataset.currentProduct);
            const quantity = parseInt(document.getElementById('quantity').value);
            
            addToCart(productId, quantity);
        }
        
        // Add product to cart
        function addToCart(productId, quantity = 1) {
            const product = products.find(p => p.id === productId);
            if (!product) return;
            
            // Check if product is already in cart
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: quantity
                });
            }
            
            // Save to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update cart count
            updateCartCount();
            
            // Show confirmation
            alert(`${quantity} ${product.name} added to cart!`);
        }
        
        // Update cart count badge
        function updateCartCount() {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
        
        // Render cart page
        function renderCartPage() {
            const cartItemsContainer = document.querySelector('.cart-items');
            const emptyCartMessage = document.querySelector('.empty-cart-message');
            const summaryItems = document.querySelectorAll('.summary-item span:last-child');
            
            if (cart.length === 0) {
                emptyCartMessage.style.display = 'block';
                cartItemsContainer.innerHTML = '';
                cartItemsContainer.appendChild(emptyCartMessage);
                
                // Update summary
                summaryItems[0].textContent = '£0.00';
                summaryItems[1].textContent = '£0.00';
                summaryItems[2].textContent = '£0.00';
                return;
            }
            
            emptyCartMessage.style.display = 'none';
            
            // Clear cart items
            cartItemsContainer.innerHTML = '';
            
            let subtotal = 0;
            
            // Add each item to cart
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;
                
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.dataset.id = item.id;
                
                cartItem.innerHTML = `
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h3 class="cart-item-title">${item.name}</h3>
                        <div class="cart-item-price">£${item.price.toFixed(2)}</div>
                        <div class="cart-item-actions">
                            <div class="quantity-selector">
                                <button class="quantity-btn" onclick="decreaseCartQuantity(${item.id})">-</button>
                                <input type="number" class="quantity-input" value="${item.quantity}" min="1" readonly>
                                <button class="quantity-btn" onclick="increaseCartQuantity(${item.id})">+</button>
                            </div>
                            <button class="remove-item" onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                `;
                
                cartItemsContainer.appendChild(cartItem);
            });
            
            // Calculate shipping (free over £50, otherwise £4.99)
            const shipping = subtotal >= 50 ? 0 : 4.99;
            const total = subtotal + shipping;
            
            // Update summary
            summaryItems[0].textContent = `£${subtotal.toFixed(2)}`;
            summaryItems[1].textContent = shipping === 0 ? 'Free' : `£${shipping.toFixed(2)}`;
            summaryItems[2].textContent = `£${total.toFixed(2)}`;
        }
        
        // Increase quantity in cart
        function increaseCartQuantity(productId) {
            const item = cart.find(item => item.id === productId);
            if (item) {
                item.quantity += 1;
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartCount();
                renderCartPage();
            }
        }
        
        // Decrease quantity in cart
        function decreaseCartQuantity(productId) {
            const item = cart.find(item => item.id === productId);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartCount();
                renderCartPage();
            }
        }
        
        // Remove item from cart
        function removeFromCart(productId) {
            cart = cart.filter(item => item.id !== productId);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            renderCartPage();
        }