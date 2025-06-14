import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [search, setSearch] = useState('');
  const [gifs, setGifs] = useState([]);
  const API_KEY = 'oVksrQHmlOXmIXI4qBy6XHsUExbE8ci4';

  const searchGifs = async () => {
    try {
      const response = await axios.get(`https://api.giphy.com/v1/gifs/search`, {
        params: {
          api_key: API_KEY,
          q: search,
          limit: 10
        }
      });
      setGifs(response.data.data);
    } catch (error) {
      console.error('Error fetching GIFs:', error);
    }
  };

  return (
    <div className="App">
      <h1>GIF Search</h1>
      <div className="search-container">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for GIFs..."
        />
        <button onClick={searchGifs}>Search</button>
      </div>
      <div className="gif-container">
        {gifs.map((gif) => (
          <div key={gif.id} className="gif-item">
            <img src={gif.images.fixed_height.url} alt={gif.title} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App; 