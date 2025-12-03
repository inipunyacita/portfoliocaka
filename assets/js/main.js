// Basic interactivity and layout loader for the Jobster landing page
// -----------------------------------------------------------------
// This file has two main responsibilities:
// 1) Dynamically load HTML partials into the main index.html using [data-include].
// 2) Attach interactive behaviors (hover effects, heart toggling) once everything is in the DOM.

// Load HTML partials into elements with [data-include] attributes
function loadPartials() {
    const includeTargets = document.querySelectorAll('[data-include]');

    const promises = Array.from(includeTargets).map(target => {
        const url = target.getAttribute('data-include');
        if (!url) return Promise.resolve();

        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${url}`);
                }
                return response.text();
            })
            .then(html => {
                target.innerHTML = html;
            })
            .catch(err => {
                // Fallback: show simple error text in the target
                target.innerHTML = `<div class="text-red-600 text-sm">Error loading ${url}</div>`;
                console.error(err);
            });
    });

    return Promise.all(promises);
}

// Attach all interactive behaviors after the DOM (including partials) is ready
function initInteractions() {
    // Add animation classes to hero section elements
    setupHeroAnimations();
    
    // Setup scroll-triggered animations
    setupScrollAnimations();
    
    // Setup mobile menu toggle
    setupMobileMenu();
    
    // Add hover effects to category and job cards (for older browsers or when CSS hover is not enough)
    const categoryCards = document.querySelectorAll('.category-card');
    const jobCards = document.querySelectorAll('.job-card');

    categoryCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.backgroundColor = '#e0f0ff';
        });

        card.addEventListener('mouseleave', () => {
            card.style.backgroundColor = '#f0f9ff';
        });
    });

    jobCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.borderColor = '#3b82f6';
            card.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.05)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.borderColor = '#f3f4f6';
            card.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
        });
    });

    // Toggle heart icons (favorite job offers)
    const hearts = document.querySelectorAll('.fa-heart');
    hearts.forEach(heart => {
        heart.addEventListener('click', () => {
            if (heart.classList.contains('far')) {
                heart.classList.remove('far');
                heart.classList.add('fas');
                heart.style.color = '#dc2626';
            } else {
                heart.classList.remove('fas');
                heart.classList.add('far');
                heart.style.color = '';
            }
        });
    });

    // Handle contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            // Create WhatsApp message
            const whatsappMessage = `Hello! I'm ${formData.name}.\n\nSubject: ${formData.subject}\n\n${formData.message}\n\nEmail: ${formData.email}`;
            const whatsappUrl = `https://wa.me/61468494431?text=${encodeURIComponent(whatsappMessage)}`;
            
            // Open WhatsApp
            window.open(whatsappUrl, '_blank');
            
            // Optional: Show success message
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Message Sent!';
            submitButton.classList.add('bg-green-600');
            submitButton.classList.remove('bg-blue-600');
            
            // Reset form
            contactForm.reset();
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.classList.remove('bg-green-600');
                submitButton.classList.add('bg-blue-600');
            }, 3000);
        });
    }
}

// Setup mobile menu toggle functionality
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        
        // Close mobile menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }
}

// Add animation classes to hero section elements
function setupHeroAnimations() {
    const heroSection = document.querySelector('section.relative.gradient-bg');
    if (!heroSection) return;

    // Find and add classes to hero elements
    const heroTitle = heroSection.querySelector('h1');
    if (heroTitle) heroTitle.classList.add('hero-title');

    const heroSubtitle = heroSection.querySelector('.text-black-600');
    if (heroSubtitle) heroSubtitle.classList.add('hero-subtitle');

    const heroDescription = heroSection.querySelector('p.text-lg');
    if (heroDescription) heroDescription.classList.add('hero-description');

    const heroCTA = heroSection.querySelector('.pt-4');
    if (heroCTA) heroCTA.classList.add('hero-cta');

    const heroTech = heroSection.querySelector('.pt-6');
    if (heroTech) heroTech.classList.add('hero-tech');

    const heroImage = heroSection.querySelector('img.rounded-full');
    if (heroImage) heroImage.classList.add('hero-image');

    const heroNameCard = heroSection.querySelector('.bg-blue-100');
    if (heroNameCard) heroNameCard.classList.add('hero-name-card');
}

// Setup scroll-triggered animations using Intersection Observer
function setupScrollAnimations() {
    // Options for Intersection Observer - trigger when element is 15% visible
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };

    // Create observer for individual elements
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animated class when element comes into view
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, 50);
            } else {
                // Remove animated class when element leaves view
                entry.target.classList.remove('animated');
            }
        });
    }, observerOptions);

    // Helper function to observe elements with delay
    function observeWithDelay(elements, delay = 0) {
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('animate-on-scroll');
                observer.observe(el);
            }, delay + (index * 50));
        });
    }

    // Animate section headers first, then their content
    const sections = document.querySelectorAll('section');
    sections.forEach((section) => {
        // Get section header container
        const headerContainer = section.querySelector('.mb-8, .flex.flex-col.items-center');
        
        // Get section header
        const header = section.querySelector('h2');
        if (header) {
            header.classList.add('animate-on-scroll');
            observer.observe(header);
        }

        // Get section description/subtitle (p tag after h2 or in header container)
        const description = headerContainer ? 
            headerContainer.querySelector('p.text-gray-600, p.mt-1') : 
            section.querySelector('h2 + p, .mb-8 p');
        if (description && description !== header) {
            description.classList.add('animate-on-scroll');
            // Observe description after a short delay
            setTimeout(() => {
                observer.observe(description);
            }, 200);
        }

        // Get section link/button in header
        const headerLink = headerContainer ? headerContainer.querySelector('a.text-blue-600') : null;
        if (headerLink) {
            headerLink.classList.add('animate-on-scroll');
            setTimeout(() => {
                observer.observe(headerLink);
            }, 400);
        }

        // Animate category cards one by one with stagger
        const categoryCards = section.querySelectorAll('.category-card');
        if (categoryCards.length > 0) {
            categoryCards.forEach((card, index) => {
                card.classList.add('animate-on-scroll');
                // Add stagger delay based on index
                card.style.animationDelay = `${index * 0.12}s`;
                observer.observe(card);
            });
        }

        // Animate project cards one by one with stagger
        const projectCards = section.querySelectorAll('.project-card');
        if (projectCards.length > 0) {
            projectCards.forEach((card, index) => {
                card.classList.add('animate-on-scroll');
                // Add stagger delay based on index
                card.style.animationDelay = `${index * 0.12}s`;
                observer.observe(card);
            });
        }

        // Animate product cards one by one with stagger
        const productCards = section.querySelectorAll('.product-card');
        if (productCards.length > 0) {
            productCards.forEach((card, index) => {
                card.classList.add('animate-on-scroll');
                // Add stagger delay based on index
                card.style.animationDelay = `${index * 0.15}s`;
                observer.observe(card);
            });
        }

        // Animate client stats one by one with stagger
        const clientStats = section.querySelectorAll('#clients .grid > div');
        if (clientStats.length > 0) {
            clientStats.forEach((stat, index) => {
                stat.classList.add('animate-on-scroll');
                // Add stagger delay based on index
                stat.style.animationDelay = `${index * 0.15}s`;
                observer.observe(stat);
            });
        }

        // Animate "View All" or action buttons at the bottom of section
        const actionButtons = section.querySelectorAll('.mt-8 button, .text-center button');
        actionButtons.forEach((button, index) => {
            button.classList.add('animate-on-scroll');
            const totalCards = categoryCards.length + projectCards.length;
            button.style.animationDelay = `${totalCards * 0.12 + (index * 0.1)}s`;
            observer.observe(button);
        });

        // Animate pagination dots
        const paginationContainer = section.querySelector('.flex.justify-center.mt-8');
        if (paginationContainer) {
            const paginationDots = paginationContainer.querySelectorAll('.dot-indicator');
            paginationDots.forEach((dot, index) => {
                dot.classList.add('animate-on-scroll');
                const totalCards = categoryCards.length + projectCards.length;
                dot.style.animationDelay = `${totalCards * 0.12 + (index * 0.1)}s`;
                observer.observe(dot);
            });
        }

        // Animate enquiries section contact card
        const enquiriesCard = section.querySelector('.bg-white.rounded-2xl.shadow-xl');
        if (enquiriesCard) {
            enquiriesCard.classList.add('animate-on-scroll');
            enquiriesCard.style.animationDelay = '0.2s';
            observer.observe(enquiriesCard);

            // Animate contact info column
            const contactInfo = enquiriesCard.querySelector('.bg-blue-600');
            if (contactInfo) {
                contactInfo.classList.add('animate-on-scroll');
                contactInfo.style.animationDelay = '0.3s';
                observer.observe(contactInfo);
            }

            // Animate form fields
            const formFields = enquiriesCard.querySelectorAll('input, textarea');
            formFields.forEach((field, index) => {
                field.classList.add('animate-on-scroll');
                field.style.animationDelay = `${0.4 + (index * 0.1)}s`;
                observer.observe(field);
            });

            // Animate submit button
            const submitButton = enquiriesCard.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.classList.add('animate-on-scroll');
                submitButton.style.animationDelay = `${0.4 + formFields.length * 0.1}s`;
                observer.observe(submitButton);
            }
        }
    });

    // Animate footer elements
    const footer = document.querySelector('footer');
    if (footer) {
        const footerGrid = footer.querySelector('.grid');
        if (footerGrid) {
            const footerColumns = footerGrid.querySelectorAll('div > div');
            footerColumns.forEach((column, index) => {
                column.classList.add('animate-on-scroll');
                column.style.animationDelay = `${index * 0.1}s`;
                observer.observe(column);
            });
        }

        // Animate footer copyright
        const copyright = footer.querySelector('.border-t');
        if (copyright) {
            copyright.classList.add('animate-on-scroll');
            const footerColumns = footer.querySelectorAll('.grid > div > div');
            copyright.style.animationDelay = `${footerColumns.length * 0.1 + 0.2}s`;
            observer.observe(copyright);
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // First load all partial HTML fragments, then wire up events
    loadPartials().then(() => {
        initInteractions();
    });
});

