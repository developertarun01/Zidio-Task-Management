// context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const data  = await axios.get("http://localhost:4004/api/auth/users", { withCredentials: true });
      setUser(data.user);
      console.log(data.user);
    } catch (err) {
      console.log("Not logged in");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (username, password) => {
    try {
      await api.post(
        "/auth/login",
        { username, password },
        { withCredentials: true }
      );
      await fetchUser();
      return true;
    } catch (err) {
      console.error("Login failed", err);
      return false;
    }
  };

  const logout = async () => {
    await api.post("/auth/logout", {}, { withCredentials: true });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
