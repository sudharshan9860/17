import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage with fallback
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem("accessToken");
    return !!token;
  });

  const [username, setUsername] = useState(() => {
    return localStorage.getItem("username") || "";
  });

  // Effect to sync localStorage with state
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "accessToken") {
        setIsAuthenticated(!!e.newValue);
      } else if (e.key === "username") {
        setUsername(e.newValue || "");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = (user, token) => {
    try {
      // Store both username and token
      localStorage.setItem("username", user);
      localStorage.setItem("accessToken", token);

      // Update state
      setIsAuthenticated(true);
      setUsername(user);
    } catch (error) {
      console.error("Error during login:", error);
      // Handle storage errors (e.g., quota exceeded)
      throw new Error("Failed to store authentication data");
    }
  };

  const logout = () => {
    try {
      // Clear all auth-related data
      localStorage.removeItem("accessToken");
      localStorage.removeItem("username");
      localStorage.removeItem("streakData");
      localStorage.removeItem("rewardData");
      localStorage.removeItem("completedChapters");

      // Update state
      setIsAuthenticated(false);
      setUsername("");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
