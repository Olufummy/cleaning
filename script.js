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

    // Quote calculator
    const quoteForm = document.getElementById('quoteForm');
    const estimatedPriceElement = document.getElementById('estimatedPrice');

    function calculateQuote() {
        const serviceType = document.querySelector('input[name="serviceType"]:checked')?.value;
        const propertySize = document.querySelector('select[name="propertySize"]').value;
        const frequency = document.querySelector('select[name="frequency"]').value;
        const extras = document.querySelectorAll('input[name="extras"]:checked');

        let basePrice = 0;

        // Base pricing
        if (serviceType === 'residential') {
            switch (propertySize) {
                case 'small': basePrice = 80; break;
                case 'medium': basePrice = 120; break;
                case 'large': basePrice = 180; break;
            }
        } else if (serviceType === 'commercial') {
            switch (propertySize) {
                case 'small': basePrice = 150; break;
                case 'medium': basePrice = 250; break;
                case 'large': basePrice = 400; break;
            }
        }

        // Frequency discounts
        switch (frequency) {
            case 'weekly': basePrice *= 0.9; break;
            case 'biweekly': basePrice *= 0.95; break;
            case 'monthly': basePrice *= 1; break;
            case 'onetime': basePrice *= 1.2; break;
        }

        // Add extras
        let extrasCost = 0;
        extras.forEach(extra => {
            switch (extra.value) {
                case 'windows': extrasCost += 30; break;
                case 'carpet': extrasCost += 50; break;
                case 'deep': extrasCost += 40; break;
            }
        });

        const totalPrice = Math.round(basePrice + extrasCost);
        if (estimatedPriceElement) {
            estimatedPriceElement.textContent = totalPrice;
        }
    }

    // Add event listeners for quote calculation
    if (quoteForm) {
        const quoteInputs = quoteForm.querySelectorAll('input, select');
        quoteInputs.forEach(input => {
            input.addEventListener('change', calculateQuote);
        });

        // Quote form submission
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Simulate quote request
            alert(`Thank you for your quote request! Your estimated cost is $${estimatedPriceElement.textContent}. We will send you an official quote within 2 hours.`);
        });
    }

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
            field.style.borderColor = '#ef4444';
            isValid = false;
        } else {
            field.style.borderColor = '#e2e8f0';
        }

        // Email validation
        if (field.type === 'email' && field.value && !validateEmail(field.value)) {
            field.style.borderColor = '#ef4444';
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
            e.target.style.borderColor = '#ef4444';
        }
    }

    if (e.target.type === 'email') {
        if (validateEmail(e.target.value)) {
            e.target.style.borderColor = '#10b981';
        } else if (e.target.value) {
            e.target.style.borderColor = '#ef4444';
        }
    }
});