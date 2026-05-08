import React from 'react';
import { ExternalLink, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';

const NewsCard = ({ article }) => {
  const { title, link, description, pubDate, image_url, source_id, creator } = article;

  return (
    <div className="glass-card flex flex-col overflow-hidden group hover:neon-border-blue transition-all duration-500">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image_url || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop'} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop';
          }}
        />
        <div className="absolute top-3 left-3 bg-space-900/80 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-neon-blue uppercase border border-neon-blue/30">
          {source_id}
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-4 mb-3 text-[10px] text-slate-500 font-medium uppercase tracking-widest">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {pubDate ? format(new Date(pubDate), 'MMM dd, yyyy') : 'Unknown Date'}
          </div>
          {creator && (
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {creator[0]}
            </div>
          )}
        </div>
        
        <h3 className="text-lg font-bold text-slate-200 line-clamp-2 mb-2 group-hover:text-neon-blue transition-colors">
          {title}
        </h3>
        
        <p className="text-sm text-slate-400 line-clamp-3 mb-6 flex-1">
          {description || 'No description available for this space mission update.'}
        </p>
        
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2 bg-slate-800/50 hover:bg-neon-blue text-slate-300 hover:text-white rounded-lg transition-all font-medium text-sm"
        >
          Read More <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

export default NewsCard;
