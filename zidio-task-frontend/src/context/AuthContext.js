import { createContext, useState, useEffect } from "react";
import apiClient from "../api/client"; // We'll create this file next
import { useNavigate } from "react-router-dom";

// Create Context
export const AuthContext = createContext();

// AuthProvider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check authentication when the app loads
  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          // Verify token with backend
          const response = await apiClient.get("/auth/verify");
          setUser(response.data.user);
        } catch (error) {
          console.error("Session verification failed:", error);
          clearAuth();
        }
      }
      setIsLoading(false);
    };
    verifyAuth();
  }, []);

  const setAuth = (token, userData) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    // Set default auth header for axios
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const clearAuth = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
    delete apiClient.defaults.headers.common["Authorization"];
  };

  const login = async (credentials) => {
    try {
      const response = await apiClient.post("/auth/login", credentials);
      setAuth(response.data.token, response.data.user);
      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      return { 
        success: false, 
        error: error.response?.data?.message || "Login failed" 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await apiClient.post("/auth/register", userData);
      setAuth(response.data.token, response.data.user);
      return { success: true };
    } catch (error) {
      console.error("Registration failed:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed"
      };
    }
  };

  const logout = () => {
    clearAuth();
    navigate("/login");
  };

  // Add function to refresh token if needed
  const refreshToken = async () => {
    try {
      const response = await apiClient.post("/auth/refresh");
      localStorage.setItem("authToken", response.data.token);
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
      return true;
    } catch (error) {
      clearAuth();
      return false;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading,
        login, 
        register, 
        logout,
        refreshToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};