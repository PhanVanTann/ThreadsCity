'use client';
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";

import {authService} from "../api/auth";

type User = {
  id: string | number;
  email?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const safeGet = (k: string) =>
  typeof window === "undefined" ? null : localStorage.getItem(k);
const safeSet = (k: string, v: string) =>
  typeof window !== "undefined" && localStorage.setItem(k, v);
const safeDel = (k: string) =>
  typeof window !== "undefined" && localStorage.removeItem(k);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!safeGet("access_token"));
  const navigate = useNavigate();

  // Load user khi có access
  // useEffect(() => {
  //   const access = safeGet("access_token");
  //   if (!access) return;
  //   meApi(access)
  //     .then((u) => {
  //       setUser(u);
  //       setIsAuthenticated(true);
  //     })
  //     .catch(() => {
  //       setUser(null);
  //       setIsAuthenticated(false);
  //     });
  // }, []);

  async function login(email: string, password: string) {
    const tokens = await authService.SignIn({ email, password });

    setIsAuthenticated(true);
    console.log( tokens.data)
    // navigate("/");
  }

  function logout() {
    safeDel("access_token");
    safeDel("refresh_token");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
  }

  // Nếu interceptor refresh thất bại → 401 → bạn có thể bắt ở nơi gọi api và gọi logout()

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
