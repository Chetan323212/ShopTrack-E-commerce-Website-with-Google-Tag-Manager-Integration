import React, { createContext, useContext, useState, useEffect } from "react";
import { apiLogin, apiRegister } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("aura_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem("aura_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("aura_user");
    }
  }, [user]);

  const login = async (email, password) => {
    const data = await apiLogin(email, password);
    setUser(data);
    return data;
  };

  const register = async (name, email, password) => {
    const data = await apiRegister(name, email, password);
    setUser(data);
    return data;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isAdmin: Boolean(user?.isAdmin),
        login,
        register,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isAdminModalOpen,
        setIsAdminModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
