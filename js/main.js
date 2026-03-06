/**
 * Main JavaScript for Joey's Beats Collective
 */

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Don't prevent default for non-anchor links
        if (href === '#' || href === '') return;
        
        e.preventDefault();
        
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all grid items
document.querySelectorAll('.grid-item').forEach(item => {
    observer.observe(item);
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-section');
    
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Console easter egg
console.log('%c🎵 Joey\'s Beats Collective 🎵', 'color: #D5B336; font-size: 24px; font-weight: bold;');
console.log('%cLooking for collaborations? Hit me up!', 'color: #fff; font-size: 14px;');
console.log('%cEmail: joeyflavourcollabs@gmail.com', 'color: #D5B336; font-size: 12px;');
console.log('%cInstagram: @joeyflavour', 'color: #D5B336; font-size: 12px;');
