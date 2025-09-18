document.addEventListener('DOMContentLoaded', function() {
    // Скрываем прелоадер
    setTimeout(function() {
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(function() {
                loader.style.display = 'none';
            }, 500);
        }
    }, 1000);
    
    // Обработка FAQ
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Закрываем все открытые FAQ
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Переключаем текущий FAQ
            item.classList.toggle('active');
        });
    });
    
    // Анимация появления элементов при скролле
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.service-card, .review-card, .extra-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.classList.add('visible');
            }
        });
    };
    
    // Запускаем проверку при загрузке и скролле
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
    
    // Обработка клика по номеру телефона
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log('Телефонный звонок инициирован: ' + this.getAttribute('href'));
        });
    });
    
    // Улучшение для пользователей iOS
    const isIos = () => {
        return [
            'iPad Simulator',
            'iPhone Simulator',
            'iPod Simulator',
            'iPad',
            'iPhone',
            'iPod'
        ].includes(navigator.platform) || 
        (navigator.userAgent.includes("Mac") && "ontouchend" in document);
    };
    
    if (isIos()) {
        document.body.classList.add('ios-device');
    }
});

// Обработка инструкций для приложений
document.addEventListener('DOMContentLoaded', function() {
    const androidInstructionLink = document.getElementById('showAndroidInstruction');
    const iosInstructionLink = document.getElementById('showIosInstruction');
    const androidModal = document.getElementById('androidInstructionModal');
    const iosModal = document.getElementById('iosInstructionModal');
    const closeModals = document.querySelectorAll('.close-modal');
    
    // Открытие модального окна для Android
    if (androidInstructionLink && androidModal) {
        androidInstructionLink.addEventListener('click', function(e) {
            e.preventDefault();
            androidModal.style.display = 'block';
            
            // Автоматическое закрытие через 6 секунд
            setTimeout(function() {
                androidModal.style.display = 'none';
            }, 6000);
        });
    }
    
    // Открытие модального окна для iOS
    if (iosInstructionLink && iosModal) {
        iosInstructionLink.addEventListener('click', function(e) {
            e.preventDefault();
            iosModal.style.display = 'block';
            
            // Автоматическое закрытие через 6 секунд
            setTimeout(function() {
                iosModal.style.display = 'none';
            }, 6000);
        });
    }
    
    // Закрытие модальных окон
    closeModals.forEach(function(closeBtn) {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.instruction-modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Закрытие модальных окон по клику вне их области
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('instruction-modal')) {
            e.target.style.display = 'none';
        }
    });
});
