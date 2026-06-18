import React, { useState } from 'react';
import Navbar from './components/Navbar';
import DeviceDashboard from './components/DeviceDashboard';
import EnergyMonitor from './components/EnergyMonitor';

export default function App() {
  const [activeTab, setActiveTab] = useState('devices');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'devices' ? (
          <DeviceDashboard />
        ) : (
          <EnergyMonitor />
        )}
      </main>
    </div>
  );
}