import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
app.use(cors());
app.use(express.json());

// Create HTTP Server for Socket.io to hook into
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow all origins for development
    methods: ["GET", "POST"]
  }
});

let devices = [
  { id: '1', name: 'Living Room Light', type: 'light', status: false, room: 'Living Room' },
  { id: '2', name: 'Master Bedroom AC', type: 'ac', status: true, room: 'Bedroom' },
  { id: '3', name: 'Backyard Camera', type: 'camera', status: true, room: 'Outdoor' },
];

// Handle WebSocket Connections
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  // Send initial device states to the newly connected client
  socket.emit('initial-devices', devices);

  // Listen for a device toggle request from any client
  socket.on('toggle-device', (id) => {
    const device = devices.find(d => d.id === id);
    if (device) {
      device.status = !device.status;

      // Broadcast the updated device array to ALL connected clients instantly
      io.emit('device-state-updated', devices);
    }
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// Real-time Energy Simulation: Broadcast new energy numbers every 3 seconds
setInterval(() => {
  const mockLiveEnergy = [
    { date: 'Mon', consumption: 10 + Math.random() * 10 },
    { date: 'Tue', consumption: 12 + Math.random() * 10 },
    { date: 'Wed', consumption: 15 + Math.random() * 10 },
    { date: 'Thu', consumption: 11 + Math.random() * 10 },
    { date: 'Fri', consumption: 20 + Math.random() * 10 },
    { date: 'Sat', consumption: 22 + Math.random() * 10 },
    { date: 'Sun', consumption: 17 + Math.random() * 10 },
  ];
  // Broadcast live energy stream to everybody
  io.emit('live-energy-update', mockLiveEnergy);
}, 3000);

httpServer.listen(5001, () => {
  console.log(`⚡ Real-time Smart Home Server running on http://localhost:5001`);
});