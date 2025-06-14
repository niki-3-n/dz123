// Ваш API-ключ от GIPHY
const apiKey = 'oVksrQHmlOXmIXI4qBy6XHsUExbE8ci4';

// Получаем ссылки на элементы DOM
const searchTermInput = document.getElementById('searchTerm');
const searchButton = document.getElementById('searchButton');
const gifGrid = document.getElementById('gifGrid');
const errorMessage = document.getElementById('errorMessage');
const loadingSpinner = document.getElementById('loadingSpinner');

// Функция для поиска гифок
const searchGifs = async () => {
    // Очищаем старые результаты и ошибки
    gifGrid.innerHTML = '';
    errorMessage.style.display = 'none';
    errorMessage.textContent = '';
    
    const searchTerm = searchTermInput.value.trim();

    // Проверяем, ввел ли пользователь что-нибудь
    if (!searchTerm) {
        errorMessage.textContent = 'Пожалуйста, введите что-нибудь для поиска.';
        errorMessage.style.display = 'block';
        return;
    }
    
    // Включаем индикатор загрузки
    loadingSpinner.style.display = 'flex';
    searchButton.disabled = true;
    searchButton.textContent = 'Ищем...';
    
    try {
        // Создаем URL для запроса к API GIPHY
        const url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(searchTerm)}&limit=24&lang=ru`;
        
        // Отправляем запрос
        const response = await fetch(url);
        const data = await response.json();
        
        // Проверяем, успешен ли был запрос
        if (!response.ok) {
            throw new Error('Не удалось получить данные от GIPHY.');
        }
        
        // Проверяем, нашлись ли гифки
        if (data.data.length === 0) {
            errorMessage.textContent = 'Ничего не найдено. Попробуйте другой запрос.';
            errorMessage.style.display = 'block';
        } else {
            // Отображаем найденные гифки
            data.data.forEach(gif => {
                const gifCard = document.createElement('div');
                gifCard.classList.add('gif-card');

                const gifImage = document.createElement('img');
                gifImage.src = gif.images.fixed_height.url;
                gifImage.alt = gif.title || 'Гифка';
                gifImage.classList.add('gif-image');

                gifCard.appendChild(gifImage);
                gifGrid.appendChild(gifCard);
            });
            gifGrid.classList.add('animate-fade-in');
        }
        
    } catch (err) {
        // Если произошла ошибка, показываем ее
        errorMessage.textContent = 'Произошла ошибка при загрузке. Попробуйте позже.';
        errorMessage.style.display = 'block';
        console.error(err);
    } finally {
        // Выключаем индикатор загрузки в любом случае
        loadingSpinner.style.display = 'none';
        searchButton.disabled = false;
        searchButton.textContent = 'Найти';
    }
};

// Функция для обработки нажатия Enter в поле ввода
const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
        searchGifs();
    }
};

// Добавляем слушатели событий
searchButton.addEventListener('click', searchGifs);
searchTermInput.addEventListener('keypress', handleKeyPress); 