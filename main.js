// ===== NAVIGATION MENU TOGGLE =====
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
});

// ===== FORMAT NUMBER WITH COMMAS =====
function formatNumber(num) {
    if (!num && num !== 0) return '-';
    return new Intl.NumberFormat('ar-SA').format(Math.round(num));
}

// ===== FORMAT PERCENTAGE =====
function formatPercent(num) {
    if (!num && num !== 0) return '-';
    return num.toFixed(2) + '%';
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== AUTO CALCULATE ON INPUT =====
function setupAutoCalculate(calculateFunction) {
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', calculateFunction);
    });
}