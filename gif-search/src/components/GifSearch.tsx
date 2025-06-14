import React, { useState } from 'react';
import axios from 'axios';
import '../styles/GifSearch.css';

interface Gif {
  id: string;
  title: string;
  images: {
    fixed_height: {
      url: string;
    };
  };
}

const GifSearch: React.FC = () => {
  const [search, setSearch] = useState('');
  const [gifs, setGifs] = useState<Gif[]>([]);
  const [loading, setLoading] = useState(false);
  const API_KEY = 'oVksrQHmlOXmIXI4qBy6XHsUExbE8ci4';

  const searchGifs = async () => {
    if (!search.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.get('https://api.giphy.com/v1/gifs/search', {
        params: {
          api_key: API_KEY,
          q: search,
          limit: 20
        }
      });
      setGifs(response.data.data);
    } catch (error) {
      console.error('Error fetching GIFs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchGifs();
    }
  };

  return (
    <div className="gif-search">
      <h1>GIF Search</h1>
      <div className="search-container">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search for GIFs..."
        />
        <button onClick={searchGifs} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
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
};

export default GifSearch; 