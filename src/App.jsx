import React, { useState, useEffect } from 'react';

// Главный компонент приложения
export default function App() {
  // --- Состояния компонента ---
  // Состояние для хранения поискового запроса
  const [searchTerm, setSearchTerm] = useState('');
  // Состояние для хранения найденных гифок
  const [gifs, setGifs] = useState([]);
  // Состояние для отслеживания загрузки
  const [isLoading, setIsLoading] = useState(false);
  // Состояние для хранения сообщений об ошибках
  const [error, setError] = useState('');
  
  // Ваш API-ключ от GIPHY
  const apiKey = 'oVksrQHmlOXmIXI4qBy6XHsUExbE8ci4';

  // Добавляем стили при монтировании компонента
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fade-in {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in {
        animation: fade-in 0.5s ease-out forwards;
      }
      body {
        margin: 0;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      }
      .gif-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
        padding: 1rem;
      }
      .gif-card {
        position: relative;
        overflow: hidden;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        transition: transform 0.3s ease;
      }
      .gif-card:hover {
        transform: scale(1.05);
      }
      .gif-image {
        width: 100%;
        height: 200px;
        object-fit: cover;
      }
      .search-container {
        position: sticky;
        top: 1rem;
        z-index: 10;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(8px);
        padding: 1rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }
      .search-input {
        width: 100%;
        padding: 0.75rem;
        border: 2px solid #e2e8f0;
        border-radius: 0.5rem;
        font-size: 1rem;
        transition: all 0.3s ease;
      }
      .search-input:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }
      .search-button {
        background-color: #3b82f6;
        color: white;
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 0.5rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      .search-button:hover {
        background-color: #2563eb;
        transform: translateY(-1px);
      }
      .search-button:disabled {
        background-color: #94a3b8;
        cursor: not-allowed;
        transform: none;
      }
      .loading-spinner {
        width: 3rem;
        height: 3rem;
        border: 4px solid #e2e8f0;
        border-top-color: #3b82f6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      .error-message {
        background-color: #fee2e2;
        color: #dc2626;
        padding: 1rem;
        border-radius: 0.5rem;
        margin: 1rem 0;
        text-align: center;
      }
      .title {
        font-size: 2.5rem;
        font-weight: 700;
        text-align: center;
        margin: 2rem 0;
        background: linear-gradient(to right, #3b82f6, #2dd4bf);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .search-form {
        display: flex;
        gap: 1rem;
        flex-direction: column;
      }
      @media (min-width: 640px) {
        .search-form {
          flex-direction: row;
        }
      }
    `;
    document.head.appendChild(style);

    // Очищаем стили при размонтировании компонента
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // --- Функции ---
  
  // Функция для поиска гифок
  const searchGifs = async () => {
    // Очищаем старые результаты и ошибки
    setGifs([]);
    setError('');
    
    // Проверяем, ввел ли пользователь что-нибудь
    if (!searchTerm.trim()) {
      setError('Пожалуйста, введите что-нибудь для поиска.');
      return;
    }
    
    // Включаем индикатор загрузки
    setIsLoading(true);
    
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
        setError('Ничего не найдено. Попробуйте другой запрос.');
      } else {
        // Сохраняем найденные гифки в состояние
        setGifs(data.data);
      }
      
    } catch (err) {
      // Если произошла ошибка, показываем ее
      setError('Произошла ошибка при загрузке. Попробуйте позже.');
      console.error(err);
    } finally {
      // Выключаем индикатор загрузки в любом случае
      setIsLoading(false);
    }
  };
  
  // Функция для обработки нажатия Enter в поле ввода
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchGifs();
    }
  };

  // --- Рендеринг компонента (то, что мы видим на странице) ---
  return (
    <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '1rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Заголовок */}
        <h1 className="title">Гифки</h1>

        {/* Форма поиска */}
        <div className="search-container">
          <div className="search-form">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Что будем искать?"
              className="search-input"
            />
            <button
              onClick={searchGifs}
              disabled={isLoading}
              className="search-button"
            >
              {isLoading ? 'Ищем...' : 'Найти'}
            </button>
          </div>
        </div>

        {/* Область отображения */}
        <main>
          {/* Показываем ошибку, если она есть */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Показываем индикатор загрузки */}
          {isLoading && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
              <div className="loading-spinner"></div>
            </div>
          )}
          
          {/* Показываем найденные гифки */}
          {!isLoading && gifs.length > 0 && (
            <div className="gif-grid animate-fade-in">
              {gifs.map((gif) => (
                <div key={gif.id} className="gif-card">
                  <img
                    src={gif.images.fixed_height.url}
                    alt={gif.title || 'Гифка'}
                    className="gif-image"
                  />
                </div>
              ))}
            </div>
          )}
        </main>
        
      </div>
    </div>
  );
}
