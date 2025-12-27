"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthService, type User } from "@/app/lib/services/auth";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: Omit<User, "password"> | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    username: string;
    role: "user" | "professional";
  }) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<Omit<User, "id" | "email" | "password" | "role">>) => Promise<void>;
  isAuthenticated: boolean;
  isProfessional: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Omit<User, "password"> | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing session on mount
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const session = await AuthService.login(email, password);
      setUser(session.user);
      
      // Redirect based on role
      if (session.user.role === "professional") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/user");
      }
    } catch (error) {
      throw error;
    }
  };

  const signup = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    username: string;
    role: "user" | "professional";
  }) => {
    try {
      const session = await AuthService.signup(data);
      setUser(session.user);
      
      // Redirect based on role
      if (session.user.role === "professional") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/user");
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    router.push("/login");
  };

  const updateProfile = async (updates: Partial<Omit<User, "id" | "email" | "password" | "role">>) => {
    try {
      const updatedUser = await AuthService.updateProfile(updates);
      setUser(updatedUser);
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isProfessional: user?.role === "professional",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
