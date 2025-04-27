// Прелоадер
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    loader.style.opacity = '0';
    setTimeout(() => {
        loader.style.display = 'none';
    }, 500);
    
    // Инициализация анимаций после загрузки
    animateOnScroll();
});

// Система оценок
document.querySelectorAll('.star').forEach(star => {
    star.addEventListener('click', function() {
        const rating = this.dataset.rating;
        const service = this.closest('.rating-stars').dataset.service;
        
        // Сохраняем оценку
        localStorage.setItem(`rating_${service}`, rating);
        
        // Обновляем отображение звезд
        updateStars(this.parentElement, rating);
        
        // Анимация выбранной звезды
        this.animate([
            { transform: 'scale(1)' },
            { transform: 'scale(1.5)' },
            { transform: 'scale(1.2)' }
        ], {
            duration: 300
        });
    });
});

// Функция обновления звезд
function updateStars(container, rating) {
    container.querySelectorAll('.star').forEach((star, index) => {
        star.classList.toggle('active', index < rating);
    });
}

// Загрузка сохраненных оценок
document.querySelectorAll('.rating-stars').forEach(container => {
    const service = container.dataset.service;
    const savedRating = localStorage.getItem(`rating_${service}`);
    
    if(savedRating) {
        updateStars(container, savedRating);
    }
});

// Анимация при скролле
function animateOnScroll() {
    const cards = document.querySelectorAll('.service-card');
    const windowHeight = window.innerHeight;
    
    cards.forEach((card, index) => {
        // Устанавливаем задержку для последовательной анимации
        card.style.setProperty('--index', index);
        
        const rect = card.getBoundingClientRect();
        const cardTop = rect.top;
        
        // Если карточка в зоне видимости
        if(cardTop < windowHeight * 0.8) {
            card.style.animationPlayState = 'running';
        }
    });
}

// Обработчик скролла
let isScrolling;
window.addEventListener('scroll', () => {
    // Отменяем предыдущий таймер
    window.clearTimeout(isScrolling);
    
    // Устанавливаем новый таймер
    isScrolling = setTimeout(() => {
        animateOnScroll();
    }, 50);
}, { passive: true });

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    // Добавляем индексы для анимации
    document.querySelectorAll('.service-card').forEach((card, index) => {
        card.style.setProperty('--index', index);
    });
});
