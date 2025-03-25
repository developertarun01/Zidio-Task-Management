import { createContext, useState, useEffect, useContext } from "react";
import apiClient from "../api/client";

// Create Context
export const AuthContext = createContext();

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  const initializeAuth = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user data:", error);
        clearAuth();
      }
    }
  };

  // Check authentication when the app loads
  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const response = await apiClient.get("/auth/verify");
          setUser(response.data.user);
          localStorage.setItem("user", JSON.stringify(response.data.user));
        } catch (error) {
          console.error("Session verification failed:", error);
          clearAuth();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
    verifyAuth();
  }, []);

  // Set authentication state
  const setAuth = (token, userData) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  // Clear authentication state
  const clearAuth = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
    delete apiClient.defaults.headers.common["Authorization"];
  };

  // Login function
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

  // Register function
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

  // Logout function (now router-agnostic)
  const logout = () => {
    clearAuth();
    // Redirect is now handled by components using useNavigate
    window.location.href = '/login'; // Fallback redirect
  };

  // Refresh token function
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

  // Context value
  const contextValue = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshToken,
    setAuth,
    clearAuth
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access to auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};