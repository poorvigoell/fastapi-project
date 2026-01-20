import React, { createContext, useContext, useState, ReactNode } from "react";
import { User } from "@/types";
import { useEffect } from "react";
import api from "@/lib/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = user !== null;
  const isAdmin = user?.role === "admin";

  const login = async (username: string, password: string) => {
    try {
      // 1️⃣ Call backend login (JSON version)
      const res = await api.post("/auth/login", {
        username,
        password,
      });

      const token = res.data.access_token;

      localStorage.setItem("token", token);

      const userRes = await api.get("/user");

      setUser(userRes.data);
    } catch (err) {
      throw new Error("Login failed");
    }
  };

  useEffect(() => {
    const restoreUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/user");
        setUser(res.data);
      } catch (err) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreUser();
  }, []);

  const refreshUser = async () => {
    const res = await api.get("/user");
    setUser(res.data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, isAdmin, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
