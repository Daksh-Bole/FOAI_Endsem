import { useState, useEffect, useCallback } from 'react';
import { fetchSpaceNews, getCachedNews, setCachedNews } from '../services/newsService';

export const useNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date' or 'source'

  const loadNews = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    try {
      if (!forceRefresh) {
        const cached = getCachedNews();
        if (cached) {
          setNews(cached);
          setLoading(false);
          return;
        }
      }

      const articles = await fetchSpaceNews();
      setNews(articles);
      setCachedNews(articles);
    } catch (err) {
      setError('Failed to fetch news. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  const filteredNews = news
    .filter(article => 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.description && article.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.pubDate) - new Date(a.pubDate);
      } else {
        return a.source_id.localeCompare(b.source_id);
      }
    });

  return {
    news: filteredNews,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    refresh: () => loadNews(true)
  };
};
