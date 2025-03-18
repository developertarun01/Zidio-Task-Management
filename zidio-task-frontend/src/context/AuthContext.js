import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        console.log("User state updated:", user); // ✅ Debugging Log
    }, [user]);

    const login = (userData) => {
        if (userData.token) {
            localStorage.setItem("token", userData.token); // ✅ Store token properly
            localStorage.setItem("user", JSON.stringify(userData));
            setUser(userData);
        } else {
            console.error("❌ Token missing in login response");
        }
    };
    

    const logout = () => {
        localStorage.removeItem("token"); // ✅ Clear token on logout
        localStorage.removeItem("user"); // ✅ Clear user data
        setUser(null);
    };
    

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
