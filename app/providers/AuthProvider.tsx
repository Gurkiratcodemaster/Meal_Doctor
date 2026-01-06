"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthService, type User } from "@/app/lib/services/auth";
import { useRouter } from "next/navigation";

type AuthContextType = {
  user: Omit<User, "password"> | null;
  loading: boolean;
  signup: (data: Omit<User, "id">) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Omit<User, "password"> | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const signup = async (data: Omit<User, "id">) => {
    const session = AuthService.signup(data);
    setUser(session.user);
    router.push("/feed");
  };

  const login = async (email: string, password: string) => {
    const session = AuthService.login(email, password);
    setUser(session.user);
    router.push("/feed");
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signup,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
