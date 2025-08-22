/**
 * ConectaENEM - Main JavaScript file
 * Handles navigation, smooth scrolling, and interactive elements
 */

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeSmoothScrolling();
    initializeSubjectCards();
    initializePerformanceOptimizations();
    initializeAccessibility();
});

/**
 * Initialize navigation functionality
 */
function initializeNavigation() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Update aria-expanded attribute for accessibility
            const isExpanded = navMenu.classList.contains('active');
            mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
            
            // Change icon
            const icon = mobileMenuToggle.querySelector('i');
            if (icon) {
                icon.className = isExpanded ? 'fas fa-times' : 'fas fa-bars';
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                const icon = mobileMenuToggle.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-bars';
                }
            }
        });
    }

    // Active navigation highlighting
    if (navLinks.length > 0) {
        // Highlight current page navigation
        const currentPage = window.location.pathname;
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage || 
                (currentPage === '/' && link.getAttribute('href') === '#inicio')) {
                link.classList.add('active');
            }
        });

        // Handle hash-based navigation for single page sections
        window.addEventListener('hashchange', updateActiveNavLink);
        updateActiveNavLink(); // Call on load
    }
}

/**
 * Update active navigation link based on current hash or scroll position
 */
function updateActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentHash = window.location.hash;
    
    if (currentHash) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentHash) {
                link.classList.add('active');
            }
        });
    } else {
        // If no hash, highlight the first link (home)
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#inicio') {
                link.classList.add('active');
            }
        });
    }
}

/**
 * Initialize smooth scrolling for internal links
 */
function initializeSmoothScrolling() {
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                event.preventDefault();
                
                // Close mobile menu if open
                const navMenu = document.querySelector('.nav-menu');
                const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    if (mobileMenuToggle) {
                        mobileMenuToggle.setAttribute('aria-expanded', 'false');
                        const icon = mobileMenuToggle.querySelector('i');
                        if (icon) {
                            icon.className = 'fas fa-bars';
                        }
                    }
                }
                
                // Calculate offset for fixed header
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL hash
                history.pushState(null, null, `#${targetId}`);
                
                // Update active navigation
                updateActiveNavLink();
            }
        });
    });
}

/**
 * Initialize subject card interactions
 */
function initializeSubjectCards() {
    const subjectCards = document.querySelectorAll('.subject-card');
    
    subjectCards.forEach(card => {
        // Add keyboard navigation support
        card.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                const link = card.querySelector('.subject-link');
                if (link) {
                    window.location.href = link.getAttribute('href');
                }
            }
        });
        
        // Add hover effects with performance optimization
        let hoverTimeout;
        
        card.addEventListener('mouseenter', function() {
            clearTimeout(hoverTimeout);
            this.style.willChange = 'transform';
        });
        
        card.addEventListener('mouseleave', function() {
            hoverTimeout = setTimeout(() => {
                this.style.willChange = 'auto';
            }, 300);
        });
        
        // Track card interactions for analytics (if needed)
        card.addEventListener('click', function() {
            const subject = this.getAttribute('data-subject');
            if (subject) {
                // This is where you could add analytics tracking
                console.log(`Subject card clicked: ${subject}`);
            }
        });
    });
}

/**
 * Initialize performance optimizations
 */
function initializePerformanceOptimizations() {
    // Lazy load images when they come into view
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Optimize scroll performance
    let ticking = false;
    
    function updateScrollPosition() {
        // Add scroll-based animations or effects here
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateScrollPosition);
            ticking = true;
        }
    });
    
    // Preload critical pages
    const criticalLinks = document.querySelectorAll('a[href^="pages/"]');
    criticalLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            const href = this.getAttribute('href');
            if (href && !document.querySelector(`link[rel="prefetch"][href="${href}"]`)) {
                const prefetchLink = document.createElement('link');
                prefetchLink.rel = 'prefetch';
                prefetchLink.href = href;
                document.head.appendChild(prefetchLink);
            }
        });
    });
}

/**
 * Initialize accessibility features
 */
function initializeAccessibility() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Pular para o conteúdo principal';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-color);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1001;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main landmark if not present
    if (!document.querySelector('main')) {
        const mainContent = document.querySelector('.hero')?.parentElement;
        if (mainContent && mainContent.tagName !== 'MAIN') {
            const main = document.createElement('main');
            main.id = 'main';
            mainContent.parentNode.insertBefore(main, mainContent);
            main.appendChild(mainContent);
        }
    }
    
    // Enhance focus management
    document.addEventListener('keydown', function(event) {
        // Escape key closes mobile menu
        if (event.key === 'Escape') {
            const navMenu = document.querySelector('.nav-menu.active');
            if (navMenu) {
                navMenu.classList.remove('active');
                const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
                if (mobileMenuToggle) {
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                    mobileMenuToggle.focus();
                }
            }
        }
    });
    
    // Announce page changes for screen readers
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    `;
    document.body.appendChild(announcer);
    
    // Function to announce messages
    window.announceToScreenReader = function(message) {
        announcer.textContent = message;
        setTimeout(() => {
            announcer.textContent = '';
        }, 1000);
    };
}

/**
 * Utility functions
 */

// Debounce function for performance optimization
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export functions for potential use in other scripts
window.ConectaENEM = {
    updateActiveNavLink,
    announceToScreenReader,
    debounce,
    throttle
};
