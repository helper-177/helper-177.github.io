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
            // Можно добавить отправку события в аналитику
            if (typeof gtag !== 'undefined') {
                gtag('event', 'phone_call', {
                  'event_category': 'Contact',
                  'event_label': this.getAttribute('href')
                });
            }
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
        // Добавляем специальные стили для iOS если нужно
        const style = document.createElement('style');
        style.textContent = `
            .ios-device .contact-link {
                padding: 12px 18px;
            }
        `;
        document.head.appendChild(style);
    }

    // Обработка инструкций для приложений
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
            document.body.style.overflow = 'hidden'; // Блокируем прокрутку фона
            
            // Автоматическое закрытие через 30 секунд
            setTimeout(function() {
                if (androidModal.style.display === 'block') {
                    androidModal.style.display = 'none';
                    document.body.style.overflow = ''; // Восстанавливаем прокрутку
                }
            }, 30000);
        });
    }
    
    // Открытие модального окна для iOS
    if (iosInstructionLink && iosModal) {
        iosInstructionLink.addEventListener('click', function(e) {
            e.preventDefault();
            iosModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Блокируем прокрутку фона
            
            // Автоматическое закрытие через 15 секунд
            setTimeout(function() {
                if (iosModal.style.display === 'block') {
                    iosModal.style.display = 'none';
                    document.body.style.overflow = ''; // Восстанавливаем прокрутку
                }
            }, 15000);
        });
    }
    
    // Закрытие модальных окон
    closeModals.forEach(function(closeBtn) {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.instruction-modal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = ''; // Восстанавливаем прокрутку
            }
        });
    });
    
    // Закрытие модальных окон по клику вне их области
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('instruction-modal')) {
            e.target.style.display = 'none';
            document.body.style.overflow = ''; // Восстанавливаем прокрутку
        }
    });

    // Закрытие модальных окон по клавише Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.instruction-modal');
            modals.forEach(modal => {
                if (modal.style.display === 'block') {
                    modal.style.display = 'none';
                    document.body.style.overflow = ''; // Восстанавливаем прокрутку
                }
            });
        }
    });

    // Обработка формы заявки
    const openOrderFormBtn = document.getElementById('openOrderForm');
    const orderModal = document.getElementById('orderModal');
    const orderForm = document.getElementById('orderForm');
    
    // Открытие модального окна формы
    if (openOrderFormBtn && orderModal) {
        openOrderFormBtn.addEventListener('click', function() {
            orderModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Блокируем прокрутку фона
            
            // Инициализация обработки мобильной клавиатуры
            setTimeout(handleMobileKeyboard, 100);
        });
    }
    
    // Отправка формы в Telegram
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const serviceType = document.getElementById('serviceType').value;
            const userName = document.getElementById('userName').value;
            const userPhone = document.getElementById('userPhone').value;
            const userLocation = document.getElementById('userLocation').value;
            const userMessage = document.getElementById('userMessage').value;
            
            // Валидация формы
            if (!serviceType || !userName || !userPhone || !userLocation) {
                alert('Пожалуйста, заполните все обязательные поля!');
                return;
            }
            
            // Валидация телефона
            if (!isValidPhone(userPhone)) {
                alert('Пожалуйста, введите корректный номер телефона');
                return;
            }
            
            // Показываем индикатор загрузки
            const submitBtn = orderForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
            submitBtn.disabled = true;
            
            // Формируем сообщение
            const message = `📋 Новая заявка на услугу:\n\n` +
                           `🚗 Услуга: ${serviceType}\n` +
                           `👤 Имя: ${userName}\n` +
                           `📞 Телефон: ${userPhone}\n` +
                           `📍 Местоположение: ${userLocation}\n` +
                           `📝 Доп. информация: ${userMessage || 'Не указано'}\n\n` +
                           `⏰ Время заявки: ${new Date().toLocaleString('ru-RU')}`;
            
            // Отправляем в Telegram
            sendToTelegram(message)
                .then(() => {
                    // Успешная отправка
                    showFormSuccess();
                    orderForm.reset();
                    
                    // Отправка события в аналитику
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'form_submit', {
                            'event_category': 'Order',
                            'event_label': serviceType
                        });
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('❌ Ошибка при отправке заявки. Пожалуйста, позвоните нам напрямую.');
                })
                .finally(() => {
                    // Восстанавливаем кнопку
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                });
        });
    }

    // Закрытие модального окна формы
    if (orderModal) {
        const closeOrderModal = orderModal.querySelector('.close-modal');
        if (closeOrderModal) {
            closeOrderModal.addEventListener('click', function() {
                orderModal.style.display = 'none';
                document.body.style.overflow = ''; // Восстанавливаем прокрутку
            });
        }
        
        // Закрытие по клику вне области
        orderModal.addEventListener('click', function(e) {
            if (e.target === orderModal) {
                orderModal.style.display = 'none';
                document.body.style.overflow = ''; // Восстанавливаем прокрутку
            }
        });
    }

    // Плавная прокрутка для якорей
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Анимация для кнопок при наведении
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Инициализация карты (заглушка, можно подключить реальную карту)
    const initMap = function() {
        console.log('Карта инициализирована');
        // Здесь можно добавить код для инициализации Яндекс.Карт или Google Maps
    };

    // Загрузка карты при необходимости
    if (document.querySelector('#map')) {
        // Динамическая загрузка API карт
        const mapScript = document.createElement('script');
        mapScript.src = 'https://api-maps.yandex.ru/2.1/?apikey=ваш_api_ключ&lang=ru_RU';
        mapScript.onload = initMap;
        document.head.appendChild(mapScript);
    }
    
    // Инициализация обработки мобильной клавиатуры
    handleMobileKeyboard();
});

// Функция отправки в Telegram
function sendToTelegram(message) {
    const botToken = 'bot7973323851:AAHq5QHx6j8yEkqCOerWCxAFgT0hRGLL6zY';
    const chatId = '5414933430';
    
    return fetch(`https://api.telegram.org/${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML'
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Ошибка сети');
        }
        return response.json();
    })
    .then(data => {
        if (!data.ok) {
            throw new Error('Ошибка Telegram API');
        }
        return data;
    });
}

// Функция для проверки поддержки WebP
function checkWebPSupport() {
    return new Promise(resolve => {
        const webP = new Image();
        webP.onload = webP.onerror = function() {
            resolve(webP.height === 2);
        };
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
}

// Оптимизация загрузки изображений
if ('loading' in HTMLImageElement.prototype) {
    // Браузер поддерживает lazy loading
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Динамическая загрузка полифилла для lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/loading-attribute-polyfill/2.0.1/loading-attribute-polyfill.min.js';
    document.body.appendChild(script);
}

// Проверка WebP и добавление соответствующего класса
checkWebPSupport().then(hasWebP => {
    if (hasWebP) {
        document.documentElement.classList.add('webp');
    } else {
        document.documentElement.classList.add('no-webp');
    }
});

// Обработка изменения ориентации устройства
window.addEventListener('orientationchange', function() {
    // Добавляем задержку для стабилизации размера экрана
    setTimeout(() => {
        // Перезапускаем анимации появления элементов
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
        
        animateOnScroll();
    }, 300);
});

// Функция для обработки мобильной клавиатуры
function handleMobileKeyboard() {
    if (!window.matchMedia('(max-width: 768px)').matches) return;
    
    const formElements = document.querySelectorAll('#orderForm input, #orderForm textarea, #orderForm select');
    const modal = document.getElementById('orderModal');
    const submitButton = document.querySelector('#orderForm button[type="submit"]');
    
    if (!modal || !submitButton) return;
    
    formElements.forEach(element => {
        // При фокусе прокручиваем к элементу
        element.addEventListener('focus', function() {
            setTimeout(() => {
                this.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Дополнительная прокрутка для текстовых полей
                if (this.tagName === 'TEXTAREA') {
                    window.scrollBy(0, 100);
                }
            }, 300);
        });
        
        // Для текстовых полей добавляем кнопку "Готово"
        if (element.tagName === 'INPUT' && element.type !== 'select') {
            element.setAttribute('enterkeyhint', 'done');
        }
    });
    
    // Отслеживаем изменение размера окна (появление клавиатуры)
    let initialHeight = window.innerHeight;
    
    window.addEventListener('resize', () => {
        const modal = document.getElementById('orderModal');
        if (!modal || modal.style.display !== 'block') return;
        
        const newHeight = window.innerHeight;
        const heightDifference = initialHeight - newHeight;
        
        if (heightDifference > 100) { // Клавиатура открылась
            // Прокручиваем к активному элементу
            const activeElement = document.activeElement;
            if (activeElement && activeElement.form === document.getElementById('orderForm')) {
                setTimeout(() => {
                    activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    window.scrollBy(0, 50);
                }, 300);
            }
        }
        
        initialHeight = newHeight;
    });
}

// Функция валидации телефона
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[78][-(]?\d{3}\)?-?\d{3}-?\d{2}-?\d{2}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Функция показа успешной отправки формы
function showFormSuccess() {
    const orderForm = document.getElementById('orderForm');
    if (!orderForm) return;
    
    // Сохраняем оригинальное содержимое
    const originalContent = orderForm.innerHTML;
    
    // Заменяем на сообщение об успехе
    orderForm.innerHTML = `
        <div class="form-success">
            <i class="fas fa-check-circle"></i>
            <h3>Заявка отправлена!</h3>
            <p>Мы свяжемся с вами в ближайшее время</p>
        </div>
    `;
    
    // Автоматическое закрытие через 3 секунды
    setTimeout(() => {
        const orderModal = document.getElementById('orderModal');
        if (orderModal) {
            orderModal.style.display = 'none';
            document.body.style.overflow = '';
            
            // Восстанавливаем оригинальную форму
            setTimeout(() => {
                orderForm.innerHTML = originalContent;
            }, 300);
        }
    }, 3000);
}

// Обработчик для кнопки "Закрыть" в сообщении об успехе
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('close-success')) {
        const successMessage = document.querySelector('.form-success');
        if (successMessage) {
            successMessage.remove();
        }
    }
});
