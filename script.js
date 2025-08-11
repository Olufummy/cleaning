document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    // Page navigation
    function showPage(pageId) {
        pages.forEach(page => page.classList.remove('active'));
        navLinks.forEach(link => link.classList.remove('active'));

        const targetPage = document.getElementById(pageId);
        if (targetPage) targetPage.classList.add('active');

        const activeLink = document.querySelector(`[data-page="${pageId}"]`);
        if (activeLink) activeLink.classList.add('active');

        navMenu.classList.remove('active');
    }


        // Page navigation
    function showPage(pageId) {
        pages.forEach(page => {
            page.classList.remove('active');
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        const activeLink = document.querySelector(`[data-page="${pageId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Close mobile menu
        navMenu.classList.remove('active');
    }

    // Add click event listeners to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            if (pageId) {
                showPage(pageId);
            }
        });
    });

    // Add click event listeners to buttons with data-page attribute
    document.addEventListener('click', function(e) {
        if (e.target.hasAttribute('data-page')) {
            e.preventDefault();
            const pageId = e.target.getAttribute('data-page');
            showPage(pageId);
        }
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Navigation event listeners
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            if (pageId) showPage(pageId);
        });
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', () => navMenu.classList.toggle('active'));

    // Testimonials slider
    const testimonials = document.querySelectorAll('.testimonial');
    let currentTestimonial = 0;

    function showNextTestimonial() {
        testimonials[currentTestimonial].classList.remove('active');
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        testimonials[currentTestimonial].classList.add('active');
    }
    if (testimonials.length > 0) setInterval(showNextTestimonial, 5000);

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you within 24 hours.');
            this.reset();
        });
    }

    // Service selection functionality
    document.querySelectorAll('input[name="serviceType"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.querySelectorAll('.room-selection').forEach(section => {
                section.style.display = 'none';
            });
            
            const serviceType = this.value;
            if (serviceType === 'deep-cleaning') {
                document.getElementById('deepCleaningRooms').style.display = 'block';
            } 
            else if (serviceType === 'regular-cleaning') {
                document.getElementById('regularCleaningRooms').style.display = 'block';
            }
            else if (serviceType === 'end-of-tenancy') {
                document.getElementById('endTenancyRooms').style.display = 'block';
            }
            else if (serviceType === 'after-builder') {
                document.getElementById('afterBuilderRooms').style.display = 'block';
            }
            
            document.querySelectorAll('.qty-input').forEach(input => input.value = 0);
            calculateEstimate();
        });
    });

    // Quantity controls
    document.querySelectorAll('.qty-btn').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.qty-input');
            let value = parseInt(input.value) || 0;
            
            if (this.classList.contains('minus')) {
                value = Math.max(0, value - 1);
            } else {
                value++;
            }
            
            // For regular cleaning, ensure only one property size can be selected
            if (input.name.includes('regular-') && value > 1) value = 1;
            
            input.value = value;
            calculateEstimate();
        });
    });

    // Input change handler
    document.querySelectorAll('.qty-input').forEach(input => {
        input.addEventListener('change', function() {
            if (this.value < 0 || isNaN(this.value)) this.value = 0;
            
            if (this.name.includes('regular-') && this.value > 0) {
                document.querySelectorAll('.room-selection.active input[name^="regular-"]').forEach(otherInput => {
                    if (otherInput !== this) otherInput.value = 0;
                });
            }
            
            calculateEstimate();
        });
    });

    // Price calculation
    function calculateEstimate() {
        let total = 0;
        const serviceType = document.querySelector('input[name="serviceType"]:checked')?.value;
        
        if (!serviceType) {
            document.getElementById('estimatedPrice').textContent = '0.00';
            return;
        }
        
        if (serviceType === 'deep-cleaning') {
            document.querySelectorAll('#deepCleaningRooms .qty-input').forEach(input => {
                total += (parseInt(input.value) || 0) * parseFloat(input.dataset.price);
            });
        }
        else if (serviceType === 'regular-cleaning') {
            document.querySelectorAll('#regularCleaningRooms .qty-input').forEach(input => {
                total += (parseInt(input.value) || 0) * parseFloat(input.dataset.price);
            });
        }
        else if (serviceType === 'end-of-tenancy') {
            document.querySelectorAll('#endTenancyRooms .qty-input').forEach(input => {
                total += (parseInt(input.value) || 0) * parseFloat(input.dataset.price);
            });
        }
        else if (serviceType === 'after-builder') {
            document.querySelectorAll('#afterBuilderRooms .qty-input').forEach(input => {
                total += (parseInt(input.value) || 0) * parseFloat(input.dataset.price);
            });
        }
        
        document.getElementById('estimatedPrice').textContent = total.toFixed(2);
    }

    // Quote form submission
    const quoteForm = document.getElementById('quoteForm');
    if (quoteForm) {
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            const serviceType = data.serviceType;
            const totalPrice = parseFloat(document.getElementById('estimatedPrice').textContent) || 0;
            
            if (!serviceType) {
                alert('Please select a service type');
                return;
            }

            let serviceDetails = '';
            if (serviceType === 'deep-cleaning') {
                serviceDetails = buildServiceDetails(data, [
                    { field: 'deep-main-rooms', label: 'Main Rooms', price: 23 },
                    { field: 'deep-bathrooms', label: 'Bathrooms', price: 33 },
                    { field: 'deep-bedrooms', label: 'Bedrooms', price: 22 },
                    { field: 'deep-kitchen', label: 'Kitchen', price: 76 },
                    { field: 'deep-toilet', label: 'Toilet', price: 22 },
                    { field: 'deep-utility', label: 'Utility Rooms', price: 13 }
                ]);
            }
            else if (serviceType === 'regular-cleaning') {
                serviceDetails = buildServiceDetails(data, [
                    { field: 'regular-1bed', label: '1 Bedroom Home', price: 52 },
                    { field: 'regular-2bed', label: '2 Bedroom Home', price: 59 },
                    { field: 'regular-3bed', label: '3 Bedroom Home', price: 62 },
                    { field: 'regular-4bed', label: '4 Bedroom Home', price: 73 },
                    { field: 'regular-5bed', label: '5 Bedroom Home', price: 84 },
                    { field: 'regular-6bed', label: '6 Bedroom Home', price: 94 }
                ]);
            }
            else if (serviceType === 'end-of-tenancy') {
                serviceDetails = buildServiceDetails(data, [
                    { field: 'tenancy-main-rooms', label: 'Main Rooms', price: 18 },
                    { field: 'tenancy-bathrooms', label: 'Bathrooms', price: 27 },
                    { field: 'tenancy-bedrooms', label: 'Bedrooms', price: 15.5 },
                    { field: 'tenancy-kitchen', label: 'Kitchen', price: 67 },
                    { field: 'tenancy-toilet', label: 'Toilet', price: 16.5 },
                    { field: 'tenancy-utility', label: 'Utility Rooms', price: 12 }
                ]);
            }
            else if (serviceType === 'after-builder') {
                serviceDetails = buildServiceDetails(data, [
                    { field: 'builder-rooms', label: 'Rooms', price: 28 },
                    { field: 'builder-bathrooms', label: 'Bathrooms', price: 37 },
                    { field: 'builder-kitchen', label: 'Kitchen', price: 95 },
                    { field: 'builder-toilets', label: 'Toilets', price: 28 }
                ]);
            }


        let contactInfo = "\n=== Contact Information ===";
                        contactInfo += `\nName: ${data.name || 'Not provided'}`;
                        contactInfo += `\nEmail: ${data.email || 'Not provided'}`;
                        contactInfo += `\nPhone: ${data.phone || 'Not provided'}`;
                        contactInfo += `\nPreferred Date: ${data.preferredDate ? new Date(data.preferredDate).toLocaleDateString('en-GB', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        }) : 'Not provided'}`;
                        contactInfo += `\nAdditional Information: ${data.additionalInfo || 'Not provided'}`;

                        alert(
                            `Thank you for your quote request!` +
                            `\n\n=== Service Details ===\n${serviceDetails}` +
                            `${contactInfo}` +
                            `\n\nTotal Estimate: £${totalPrice.toFixed(2)}` +
                            `\n\nWe'll contact you shortly to confirm your booking.`
                        );

                        // Also log to console
                        console.log(
                            `=== Quote Request Details ===` +
                            `\n\n=== Service Details ===\n${serviceDetails}` +
                            `${contactInfo}` +
                            `\n\nTotal Estimate: £${totalPrice.toFixed(2)}`
                        );

             
            // Reset form
            this.reset();
            document.getElementById('estimatedPrice').textContent = '0.00';
            document.querySelectorAll('input[name="serviceType"]').forEach(radio => radio.checked = false);
            document.querySelectorAll('.room-selection').forEach(section => section.style.display = 'none');
            document.getElementById('deepCleaningRooms').style.display = 'block';
        });
    }

    function buildServiceDetails(data, items) {
        let details = '';
        items.forEach(item => {
            if (data[item.field] > 0) {
                details += `${item.label}: ${data[item.field]} x £${item.price}\n`;
            }
        });
        return details;
    }

    // Initialize
    document.querySelectorAll('.room-selection').forEach((section, index) => {
        section.style.display = index === 0 ? 'block' : 'none';
    });
    showPage('home');
});
// script.js
// This script handles the navigation, testimonials, contact form, service selection, and quote calculation functionalities