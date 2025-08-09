// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

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

    // Testimonials slider
    const testimonials = document.querySelectorAll('.testimonial');
    let currentTestimonial = 0;

    function showNextTestimonial() {
        testimonials[currentTestimonial].classList.remove('active');
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        testimonials[currentTestimonial].classList.add('active');
    }

    // Auto-rotate testimonials every 5 seconds
    setInterval(showNextTestimonial, 5000);

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Simulate form submission
            alert('Thank you for your message! We will get back to you within 24 hours.');
            this.reset();
        });
    }

// Show/Hide Room Options Based on Service Type
document.querySelectorAll('input[name="serviceType"]').forEach(radio => {
    radio.addEventListener('change', function() {
        // Hide all room sections first
        document.querySelectorAll('.room-selection').forEach(section => {
            section.style.display = 'none';
        });
        
        // Show the selected room section
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
        
        // Reset all quantities when service type changes
        document.querySelectorAll('.qty-input').forEach(input => {
            input.value = 0;
        });
        
        calculateEstimate();
    });
});

// Quantity Controls Functionality
document.querySelectorAll('.qty-btn').forEach(button => {
    button.addEventListener('click', function() {
        const input = this.parentElement.querySelector('.qty-input');
        let value = parseInt(input.value);
        
        if (this.classList.contains('minus')) {
            value = isNaN(value) || value < 1 ? 0 : value - 1;
        } else {
            value = isNaN(value) ? 1 : value + 1;
        }
        
        // For regular cleaning, ensure only one property size can be selected
        if (input.name.includes('regular-') && value > 1) value = 1;
        
        input.value = value;
        calculateEstimate();
    });
});

// Input Change Handler
document.querySelectorAll('.qty-input').forEach(input => {
    input.addEventListener('change', function() {
        if (this.value < 0 || isNaN(this.value)) this.value = 0;
        
        // For regular cleaning, ensure only one property size can be selected
        if (this.name.includes('regular-') && this.value > 0) {
            document.querySelectorAll('.room-selection.active input[name^="regular-"]').forEach(otherInput => {
                if (otherInput !== this) otherInput.value = 0;
            });
        }
        
        calculateEstimate();
    });
});

// Calculate Estimate Function
function calculateEstimate() {
    let total = 0;
    const serviceType = document.querySelector('input[name="serviceType"]:checked')?.value;
    
    if (!serviceType) {
        document.getElementById('estimatedPrice').textContent = '0.00';
        return;
    }
    
    // Calculate based on selected service type
    if (serviceType === 'deep-cleaning') {
        document.querySelectorAll('#deepCleaningRooms .qty-input').forEach(input => {
            const quantity = parseInt(input.value) || 0;
            const price = parseFloat(input.dataset.price);
            total += quantity * price;
        });
    }
    else if (serviceType === 'regular-cleaning') {
        document.querySelectorAll('#regularCleaningRooms .qty-input').forEach(input => {
            const quantity = parseInt(input.value) || 0;
            const price = parseFloat(input.dataset.price);
            total += quantity * price;
        });
    }
    else if (serviceType === 'end-of-tenancy') {
        document.querySelectorAll('#endTenancyRooms .qty-input').forEach(input => {
            const quantity = parseInt(input.value) || 0;
            const price = parseFloat(input.dataset.price);
            total += quantity * price;
        });
    }
    else if (serviceType === 'after-builder') {
        document.querySelectorAll('#afterBuilderRooms .qty-input').forEach(input => {
            const quantity = parseInt(input.value) || 0;
            const price = parseFloat(input.dataset.price);
            total += quantity * price;
        });
    }
    
    // Update the displayed price with 2 decimal places
    document.getElementById('estimatedPrice').textContent = total.toFixed(2);
}

// Form Submission
document.getElementById('quoteForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // Calculate total price
    calculateEstimate();
    const totalPrice = parseFloat(document.getElementById('estimatedPrice').textContent);
    
    // Here you would typically send the data to your server
    // For this example, we'll just show a confirmation with the details
    let serviceDetails = '';
    const serviceType = data.serviceType;
    
    if (serviceType === 'deep-cleaning') {
        serviceDetails = 'Deep Cleaning Service\n';
        if (data['deep-main-rooms'] > 0) serviceDetails += `Main Rooms: ${data['deep-main-rooms']} x £23\n`;
        if (data['deep-bathrooms'] > 0) serviceDetails += `Bathrooms: ${data['deep-bathrooms']} x £33\n`;
        // Add all other room types...
    }
    // Add similar blocks for other service types...
    
    alert(`Thank you for your quote request!\n\nService: ${serviceType}\n${serviceDetails}\nTotal Estimate: £${totalPrice.toFixed(2)}\n\nWe'll contact you shortly to confirm your booking.`);
    
    // Reset form
    this.reset();
    document.getElementById('estimatedPrice').textContent = '0.00';
});

// Initialize by hiding all room sections except the first one
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.room-selection').forEach((section, index) => {
        if (index !== 0) section.style.display = 'none';
    });
});

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add loading animation for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
    });

    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .service-card, .gallery-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add click-to-call functionality
    const phoneNumbers = document.querySelectorAll('a[href^="tel:"]');
    phoneNumbers.forEach(phone => {
        phone.addEventListener('click', function() {
            // Analytics tracking could go here
            console.log('Phone number clicked:', this.href);
        });
    });

    // Add email click tracking
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(email => {
        email.addEventListener('click', function() {
            // Analytics tracking could go here
            console.log('Email clicked:', this.href);
        });
    });

    // Initialize the page
    showPage('home');
});

// Utility functions
function formatPhoneNumber(phoneNumber) {
    const cleaned = phoneNumber.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})£/);
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phoneNumber;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+£/;
    return re.test(email);
}

// Add form validation
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#416529';
            isValid = false;
        } else {
            field.style.borderColor = '#e2e8f0';
        }

        // Email validation
        if (field.type === 'email' && field.value && !validateEmail(field.value)) {
            field.style.borderColor = '#416529';
            isValid = false;
        }
    });

    return isValid;
}

// Add real-time form validation
document.addEventListener('input', function(e) {
    if (e.target.hasAttribute('required')) {
        if (e.target.value.trim()) {
            e.target.style.borderColor = '#10b981';
        } else {
            e.target.style.borderColor = '#416529';
        }
    }

    if (e.target.type === 'email') {
        if (validateEmail(e.target.value)) {
            e.target.style.borderColor = '#10b981';
        } else if (e.target.value) {
            e.target.style.borderColor = '#416529';
        }
    }
});