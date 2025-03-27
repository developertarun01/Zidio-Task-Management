import { io } from 'socket.io-client';

// Create and export socket instance directly
export const socket = io('https://zidio-task-management-api.vercel.app', {
  path: '/api/socket.io',
  transports: ['websocket'],
  autoConnect: false,
  withCredentials: true
});

// Export initialization function separately
export const initSocket = (token) => {
  socket.auth = { token };
  socket.connect();
  return socket;
};