import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <ThemeProvider>
      <Router>
        <div className="flex min-h-screen bg-space-900 text-slate-200">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <main className="flex-1 overflow-x-hidden">
            <Routes>
              <Route path="/" element={<Dashboard activeTab={activeTab} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: '#1e293b',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(8px)',
              },
            }}
          />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
