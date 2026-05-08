import React from 'react';
import NewsCard from './NewsCard';
import { Search, SortAsc, RefreshCw, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SkeletonCard = () => (
  <div className="glass-card h-96 animate-pulse">
    <div className="h-48 bg-slate-800/50"></div>
    <div className="p-5 space-y-4">
      <div className="h-4 bg-slate-800/50 w-1/4 rounded"></div>
      <div className="h-6 bg-slate-800/50 w-3/4 rounded"></div>
      <div className="h-4 bg-slate-800/50 w-full rounded"></div>
      <div className="h-4 bg-slate-800/50 w-full rounded"></div>
      <div className="h-10 bg-slate-800/50 w-full rounded-lg"></div>
    </div>
  </div>
);

const NewsGrid = ({ news, loading, error, searchQuery, setSearchQuery, sortBy, setSortBy, onRefresh }) => {
  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search space news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-neon-blue/50 text-slate-200"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700 px-3 py-2 rounded-xl">
            <SortAsc className="w-4 h-4 text-slate-500" />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-sm text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="date" className="bg-space-800">Newest First</option>
              <option value="source" className="bg-space-800">By Source</option>
            </select>
          </div>
          
          <button 
            onClick={onRefresh}
            className="flex items-center gap-2 bg-neon-blue/10 hover:bg-neon-blue/20 text-neon-blue px-4 py-2 rounded-xl border border-neon-blue/20 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline font-medium text-sm">Refresh</span>
          </button>
        </div>
      </div>

      {error ? (
        <div className="glass-card p-12 flex flex-col items-center justify-center text-center space-y-4">
          <div className="p-4 bg-red-500/10 text-red-500 rounded-full">
            <AlertCircle className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Launch Failed</h3>
            <p className="text-slate-400 max-w-md mt-2">{error}</p>
          </div>
          <button 
            onClick={onRefresh}
            className="px-6 py-2 bg-red-500/20 text-red-500 border border-red-500/30 rounded-xl hover:bg-red-500/30 transition-all font-bold"
          >
            Retry Connection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            ) : (
              news.map((article, idx) => (
                <motion.div
                  key={article.article_id || idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05 }}
                  layout
                >
                  <NewsCard article={article} />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      )}
      
      {!loading && !error && news.length === 0 && (
        <div className="text-center py-20 text-slate-500">
          No articles found matching your search.
        </div>
      )}
    </section>
  );
};

export default NewsGrid;
