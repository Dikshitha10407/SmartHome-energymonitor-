import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Zap } from 'lucide-react';

const socket = io('http://localhost:5001');

export default function EnergyMonitor() {
  const [energyData, setEnergyData] = useState([]);

  useEffect(() => {
    // Catch the real-time stream updates coming from the backend setInterval
    socket.on('live-energy-update', (data) => {
      setEnergyData(data);
    });

    return () => socket.off('live-energy-update');
  }, []);

  const totalConsumption = energyData.reduce((acc, curr) => acc + curr.consumption, 0).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4 max-w-xs">
        <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
          <Zap className="w-6 h-6 animate-bounce" />
        </div>
        <div>
          <p className="text-sm text-slate-400 font-medium">Live Consumption</p>
          <h4 className="text-2xl font-bold text-slate-800">{totalConsumption === "0.0" ? "Calculating..." : `${totalConsumption} kWh`}</h4>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="font-semibold text-slate-700 mb-4">Live Power Metrics (Updates every 3s)</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={energyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Area type="monotone" dataKey="consumption" stroke="#2563eb" fill="#dbeafe" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}