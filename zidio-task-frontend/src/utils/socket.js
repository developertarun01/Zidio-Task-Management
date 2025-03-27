import { io } from 'socket.io-client';

export const initSocket = (token) => {
  const socket = io('https://zidio-task-management-api.vercel.app', {
    path: '/api/socket.io',
    transports: ['websocket'],
    auth: { token },
    withCredentials: true
  });

  socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err);
  });

  return socket;
};