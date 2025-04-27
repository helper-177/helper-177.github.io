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

// Управление темой
function initTheme() {
if (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme('dark');
}
    // Проверяем сохраненную тему
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.add(savedTheme + '-theme');
    } else {
        // Показываем модальное окно только при первом посещении
        setTimeout(() => {
            showThemeModal();
        }, 3000);
    }
}

// Показ модального окна
function showThemeModal() {
    const modal = document.getElementById('themeModal');
    if (!localStorage.getItem('themeShown')) {
        modal.classList.add('active');
        localStorage.setItem('themeShown', 'true');
    }
}

// Закрытие модального окна
document.getElementById('closeThemeModal')?.addEventListener('click', () => {
    document.getElementById('themeModal').classList.remove('active');
});

// Переключение темы
function setTheme(theme) {
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(theme + '-theme');
    localStorage.setItem('theme', theme);
    
    // Закрываем модалку после выбора
    document.getElementById('themeModal').classList.remove('active');
}

// Обработчики кнопок
document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const theme = this.classList.contains('light-btn') ? 'light' : 'dark';
        setTheme(theme);
    });
});

// Кнопка переключения темы в углу
function createThemeSwitcher() {
    const switcher = document.createElement('div');
    switcher.className = 'theme-switcher';
    switcher.innerHTML = '<i class="fas fa-moon"></i>';
    switcher.addEventListener('click', toggleTheme);
    document.body.appendChild(switcher);
}

function toggleTheme() {
    const isDark = document.body.classList.contains('dark-theme');
    setTheme(isDark ? 'light' : 'dark');
    updateThemeIcon();
}

function updateThemeIcon() {
    const icon = document.querySelector('.theme-switcher i');
    if (document.body.classList.contains('dark-theme')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    createThemeSwitcher();
    updateThemeIcon();
});
