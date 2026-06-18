import React from 'react';

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <nav className="bg-slate-900 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🏠</span>
          <h1 className="text-xl font-bold tracking-tight">NestControl</h1>
        </div>
        <div className="flex space-x-1 bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('devices')}
            className={`px-4 py-2 rounded-md font-medium transition-all ${
              activeTab === 'devices' 
                ? 'bg-blue-600 text-white shadow' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Control Center
          </button>
          <button
            onClick={() => setActiveTab('energy')}
            className={`px-4 py-2 rounded-md font-medium transition-all ${
              activeTab === 'energy' 
                ? 'bg-blue-600 text-white shadow' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Energy Analytics
          </button>
        </div>
      </div>
    </nav>
  );
}
