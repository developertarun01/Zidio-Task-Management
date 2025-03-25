import axios from 'axios';
import { clearAuth } from '../utils/auth'; // Import from utils

const apiClient = axios.create({
    baseURL: process.env.VITE_API_BASE_URL || 'https://zidio-task-management-api.vercel.app/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            clearAuth(); // Use the utility function
        }
        return Promise.reject(error);
    }
);

export default apiClient;