import React from 'react';
import ISSMap from '../components/iss/ISSMap';
import ISSStats from '../components/iss/ISSStats';
import NewsGrid from '../components/news/NewsGrid';
import ChatbotUI from '../components/chatbot/ChatbotUI';
import SpeedChart from '../components/charts/SpeedChart';
import NewsDistribution from '../components/charts/NewsDistribution';
import { useISSData } from '../hooks/useISSData';
import { useNews } from '../hooks/useNews';
import { useChatbot } from '../hooks/useChatbot';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, AlertTriangle, Radio } from 'lucide-react';

const Dashboard = ({ activeTab }) => {
  const issData = useISSData();
  const newsData = useNews();
  
  const aiContext = {
    iss: {
      lat: issData.lat,
      lng: issData.lng,
      speed: issData.speed,
      peopleCount: issData.peopleCount,
      peopleList: issData.peopleList,
      trackedPoints: issData.allPositions.length,
      timestamp: issData.timestamp,
      status: issData.isSimulated ? 'Simulated' : 'Live'
    },
    news: newsData.news.slice(0, 5)
  };
  
  const chatbot = useChatbot(aiContext);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="lg:ml-64 p-4 lg:p-8 min-h-screen pt-20 lg:pt-8 bg-space-900"
    >
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-white via-slate-300 to-slate-600 bg-clip-text text-transparent uppercase">
            {activeTab} Operations
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Satellite Intelligence Dashboard</p>
            {issData.isSimulated && (
              <span className="flex items-center gap-1 bg-amber-500/10 text-amber-500 text-[9px] font-black px-2 py-0.5 rounded border border-amber-500/20 uppercase tracking-widest">
                <Radio className="w-3 h-3 animate-pulse" /> Predictive Orbit Active
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-slate-800/40 px-6 py-2.5 rounded-2xl border border-slate-700/50 shadow-2xl">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full animate-pulse shadow-lg ${issData.isSimulated ? 'bg-amber-500 shadow-amber-500/50' : 'bg-neon-green shadow-neon-green/50'}`}></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Stream: {issData.isSimulated ? 'Predictive' : 'Live Telemetry'}
            </span>
          </div>
          <div className="h-4 w-px bg-slate-700"></div>
          <span className="text-xs font-mono text-neon-blue font-bold">{new Date().toISOString().split('T')[1].slice(0, 8)} UTC</span>
        </div>
      </header>

      <AnimatePresence>
        {issData.isSimulated && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mb-6 bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-center gap-4 text-amber-500"
          >
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="text-xs font-black uppercase tracking-widest">Orbital API Signal Blocked (429 Rate Limit)</p>
              <p className="text-[10px] opacity-80 font-bold">Automatic Orbital Simulator engaged. Telemetry is currently being predicted based on the last known trajectory vector.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {activeTab === 'dashboard' && (
          <>
            <ISSStats {...issData} onRefresh={issData.refresh} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ISSMap {...issData} />
              </div>
              <div className="space-y-6">
                <SpeedChart history={issData.speedHistory} />
                <NewsDistribution news={newsData.news} />
              </div>
            </div>
            <div className="pt-6 border-t border-slate-700/50">
              <NewsGrid {...newsData} />
            </div>
          </>
        )}

        {activeTab === 'tracking' && (
          <>
            <ISSStats {...issData} onRefresh={issData.refresh} />
            <ISSMap {...issData} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SpeedChart history={issData.speedHistory} />
              <div className="glass-card p-6 border-l-4 border-neon-blue">
                <h3 className="font-black uppercase tracking-tight text-sm mb-4">Tracking Insights</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  System state: {issData.isSimulated ? 'Predictive' : 'Synchronized'}. 
                  The ISS path is being tracked with {issData.allPositions.length} telemetry samples.
                </p>
              </div>
            </div>
          </>
        )}

        {activeTab === 'news' && <NewsGrid {...newsData} />}
        
        {activeTab === 'chat' && (
          <div className="h-[calc(100vh-180px)] glass-card flex flex-col overflow-hidden border-neon-blue/20">
            <div className="p-6 border-b border-slate-700/50 flex items-center justify-between bg-space-800/20">
              <div>
                <h2 className="text-xl font-black neon-text-blue uppercase tracking-tighter">Mission Control AI</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Orbital Data Analyst</p>
              </div>
              <button 
                onClick={chatbot.clearChat}
                className="px-4 py-2 text-xs font-black uppercase tracking-widest text-red-400 hover:bg-red-500/10 border border-red-500/20 rounded-xl transition-all"
              >
                Clear Mission Logs
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-space-900/30">
              {chatbot.messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === "user" ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] p-4 rounded-2xl shadow-xl ${
                    msg.role === "user" ? 'bg-neon-blue text-white rounded-tr-none' : 'bg-slate-800/90 text-slate-200 border border-slate-700 rounded-tl-none'
                  }`}>
                    <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
              {chatbot.loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800/90 p-4 rounded-2xl rounded-tl-none border border-slate-700 shadow-xl">
                    <div className="flex gap-1.5"><div className="w-1.5 h-1.5 bg-neon-blue rounded-full animate-bounce"></div><div className="w-1.5 h-1.5 bg-neon-blue rounded-full animate-bounce [animation-delay:0.2s]"></div><div className="w-1.5 h-1.5 bg-neon-blue rounded-full animate-bounce [animation-delay:0.4s]"></div></div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-slate-700/50 bg-space-800/20">
              <form onSubmit={(e) => { e.preventDefault(); chatbot.sendMessage(e.target.chatInput.value); e.target.chatInput.value = ''; }} className="flex gap-4">
                <input name="chatInput" placeholder="Analyze mission data..." className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-neon-blue transition-all" />
                <button className="bg-neon-blue hover:shadow-neon-blue px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all">Execute</button>
              </form>
            </div>
          </div>
        )}
      </div>

      <ChatbotUI messages={chatbot.messages} loading={chatbot.loading} onSend={chatbot.sendMessage} onClear={chatbot.clearChat} />
    </motion.div>
  );
};

export default Dashboard;
