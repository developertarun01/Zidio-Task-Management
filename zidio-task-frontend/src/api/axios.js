import axios from "axios";

const api = axios.create({
  baseURL: "https://zidio-task-management-tanmoy9088.vercel.app/",
});

// Optional: Add token automatically
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
