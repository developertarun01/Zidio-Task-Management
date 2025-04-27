import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://zidio-task-management-tanmoy9088.onrender.com/',
  withCredentials: true,
});

// Optional interceptor for debugging
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('🔴 Axios Error:', err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export default axiosInstance;
