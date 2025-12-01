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
}

document.addEventListener('DOMContentLoaded', function() {
    // First load all partial HTML fragments, then wire up events
    loadPartials().then(() => {
        initInteractions();
    });
});

