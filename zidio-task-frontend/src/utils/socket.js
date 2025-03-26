import { io } from 'socket.io-client';

const socket = io('https://zidio-task-management-api.vercel.app', {
  path: '/api/socket.io',
  transports: ['websocket'], // Force WebSocket only
  autoConnect: false, // Manually connect after auth
  withCredentials: true
});

// Connect only when authenticated
export const initSocket = (token) => {
  socket.auth = { token };
  socket.connect();
  return socket;
};