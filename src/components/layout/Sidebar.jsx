import React from 'react';
import { LayoutDashboard, Globe, Newspaper, MessageSquare, Moon, Sun, Settings } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'tracking', icon: Globe, label: 'ISS Tracker' },
    { id: 'news', icon: Newspaper, label: 'Space News' },
    { id: 'chat', icon: MessageSquare, label: 'AI Assistant' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 lg:w-64 glass-card rounded-none border-r border-slate-700/50 flex flex-col z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-neon-blue rounded-lg flex items-center justify-center shadow-neon-blue animate-pulse-slow">
          <Globe className="text-white w-6 h-6" />
        </div>
        <h1 className="hidden lg:block font-bold text-xl neon-text-blue tracking-tighter">SpacePulse</h1>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${
              activeTab === item.id 
                ? 'bg-neon-blue/20 text-neon-blue neon-border-blue' 
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <item.icon className="w-6 h-6" />
            <span className="hidden lg:block font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700/50 space-y-2">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-4 p-3 rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition-all"
        >
          {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          <span className="hidden lg:block font-medium">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <button className="w-full flex items-center gap-4 p-3 rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition-all">
          <Settings className="w-6 h-6" />
          <span className="hidden lg:block font-medium">Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
