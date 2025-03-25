import axios from 'axios';
import { logout } from '../context/AuthContext'; // Adjust path as needed

// 1. Create Axios instance
const apiClient = axios.create({
    baseURL: process.env.VITE_API_BASE_URL || 'https://zidio-task-management-api.vercel.app/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// 2. Add request interceptor for auth token
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

// 3. Add response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
            logout(); // Clear token and redirect
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;