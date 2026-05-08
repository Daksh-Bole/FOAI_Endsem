import axios from 'axios';

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = 'https://newsdata.io/api/1/news';

export const fetchSpaceNews = async (query = 'space OR nasa OR spacex OR astronomy') => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        apikey: API_KEY,
        q: query,
        language: 'en',
      }
    });
    return response.data.results.slice(0, 10);
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

export const getCachedNews = () => {
  const cached = localStorage.getItem('space_news_cache');
  if (!cached) return null;
  
  const { data, timestamp } = JSON.parse(cached);
  const fifteenMinutes = 15 * 60 * 1000;
  
  if (Date.now() - timestamp > fifteenMinutes) {
    localStorage.removeItem('space_news_cache');
    return null;
  }
  
  return data;
};

export const setCachedNews = (data) => {
  localStorage.setItem('space_news_cache', JSON.stringify({
    data,
    timestamp: Date.now()
  }));
};
