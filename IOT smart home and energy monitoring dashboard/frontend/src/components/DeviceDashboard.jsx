import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Lightbulb, Wind, Camera, Cpu } from 'lucide-react';

// Connect to the real-time server backend
const socket = io('http://localhost:5001');

export default function DeviceDashboard() {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    console.log('DeviceDashboard mounted, socket connected?', socket && socket.connected);
    // Listen for the initial list of devices when loading the app
    socket.on('initial-devices', (data) => {
      console.log('received initial-devices:', data);
      setDevices(data);
    });

    // Listen for real-time broadcasts when ANY user toggles a switch
    socket.on('device-state-updated', (updatedDevices) => {
      console.log('received device-state-updated:', updatedDevices);
      setDevices(updatedDevices);
    });

    // Clean up connections when component unmounts
    return () => {
      socket.off('initial-devices');
      socket.off('device-state-updated');
    };
  }, []);

  const handleToggle = (id) => {
    // Emit event to server. No fetch/await required! 
    socket.emit('toggle-device', id);
  };

  const getIcon = (type, isActive) => {
    const props = { className: `w-6 h-6 ${isActive ? 'text-blue-500' : 'text-slate-400'}` };
    switch (type) {
      case 'light': return <Lightbulb {...props} />;
      case 'ac': return <Wind {...props} />;
      case 'camera': return <Camera {...props} />;
      default: return <Cpu {...props} />;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Live Control Center</h2>
        <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium animate-pulse">
          • Real-time Connected
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {devices.map((device) => (
          <div key={device.id} className="p-5 rounded-2xl border bg-white border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${device.status ? 'bg-blue-50' : 'bg-slate-50'}`}>
                {getIcon(device.type, device.status)}
              </div>

              <button
                onClick={() => handleToggle(device.id)}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${device.status ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${device.status ? 'translate-x-5' : 'translate-x-0'
                  }`} />
              </button>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase">{device.room}</p>
              <h3 className="font-semibold text-slate-800 text-lg">{device.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
