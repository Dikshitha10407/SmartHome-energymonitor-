const { io } = require('socket.io-client');

const socket = io('http://localhost:5001');

socket.on('connect', () => {
  console.log('test-client connected, id=', socket.id);
});

socket.on('initial-devices', (data) => {
  console.log('initial-devices received by test-client:', data);
  // keep process alive a short while to receive further updates
  setTimeout(() => process.exit(0), 1000);
});

socket.on('device-state-updated', (data) => {
  console.log('device-state-updated received by test-client:', data);
});

socket.on('connect_error', (err) => {
  console.error('connect_error', err.message);
  process.exit(1);
});
