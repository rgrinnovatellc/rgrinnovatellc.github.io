// Theme switcher and navbar functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const html = document.documentElement;
    const navbar = document.querySelector('.navbar');

    function updateThemeUI(theme) {
        if (!themeToggle) {
            return;
        }

        const isDark = theme === 'dark';
        themeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
        themeToggle.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');

        if (themeIcon) {
            themeIcon.className = isDark ? 'fa fa-sun-o' : 'fa fa-moon-o';
        }
    }
    
    // Check for saved theme preference or default to 'light'
    const currentTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', currentTheme);
    
    updateThemeUI(currentTheme);
    
    // Theme toggle click handler
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeUI(newTheme);
        });
    }

    // Improve LCP/TTI by deferring non-critical media work for content assets.
    const contentImages = document.querySelectorAll('main img');
    contentImages.forEach(function (img, index) {
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', index === 0 ? 'eager' : 'lazy');
        }
        if (!img.hasAttribute('decoding')) {
            img.setAttribute('decoding', 'async');
        }
    });

    const frames = document.querySelectorAll('main iframe');
    frames.forEach(function (frame) {
        if (!frame.hasAttribute('loading')) {
            frame.setAttribute('loading', 'lazy');
        }
        if (!frame.hasAttribute('referrerpolicy')) {
            frame.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
        }
    });
    
    // Navbar scroll effect
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        });
        
        // Initialize scroll state
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        }
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = target.offsetTop - navbarHeight - 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}); 