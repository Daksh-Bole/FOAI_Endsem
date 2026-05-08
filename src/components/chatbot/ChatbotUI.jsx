import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Trash2, Bot, User, Loader2, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatbotUI = ({ messages, loading, onSend, onClear }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() && !loading) {
      onSend(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="glass-card mb-4 w-[350px] sm:w-[400px] h-[500px] flex flex-col shadow-2xl overflow-hidden border-cyan-400/30"
          >
            {/* Header */}
            <div className="p-4 bg-cyan-400/10 border-b border-cyan-400/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-cyan-400 rounded-lg flex items-center justify-center">
                  <Bot className="text-white w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-200 text-sm tracking-tight uppercase">Mission AI</h3>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={onClear} 
                  className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-red-400 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Step 4 & 6 - Standardized Rendering */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 bg-space-900/50 scroll-smooth"
            >
              <div className="flex flex-col gap-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`max-w-[75%] px-4 py-3 rounded-2xl text-white text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-cyan-500 self-end rounded-tr-none"
                        : "bg-slate-700 self-start rounded-tl-none"
                    }`}
                  >
                    {/* Step 6 - Fix Empty Response Bug */}
                    {msg.content || "Empty response"}
                  </div>
                ))}
                
                {/* Step 5 - Loading State */}
                {loading && (
                  <div className="bg-slate-700 self-start px-4 py-3 rounded-2xl rounded-tl-none text-cyan-400 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Analyzing Telemetry...
                  </div>
                )}
              </div>
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 bg-slate-900/80 border-t border-slate-800">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ask Mission AI..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-4 pr-12 py-3 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || loading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-cyan-400 text-white rounded-lg hover:shadow-cyan-400/50 transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 ${
          isOpen ? 'bg-slate-800 rotate-90' : 'bg-cyan-400 hover:scale-110 shadow-cyan-400/40'
        }`}
      >
        {isOpen ? <X className="text-white w-6 h-6" /> : <MessageSquare className="text-white w-6 h-6" />}
      </button>
    </div>
  );
};

export default ChatbotUI;
