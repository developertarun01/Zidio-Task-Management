import { io } from 'socket.io-client';

const socket = io('https://zidio-task-management-api.vercel.app', {
    path: '/api/socket.io',
    transports: ['websocket', 'polling'],
    auth: (cb) => {
        cb({
            token: localStorage.getItem('authToken')
        });
    }
});

export default socket;