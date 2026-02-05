"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { loginUser, registerUser } from '@/lib/authApi';
import { loadSession, saveSession, clearSession, type AuthSession } from '@/lib/authStorage';

interface AuthContextType {
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedSession = loadSession();
    setSession(savedSession);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const newSession = await loginUser({ email, password });
    saveSession(newSession);
    setSession(newSession);
  };

  const register = async (name: string, email: string, password: string) => {
    const newSession = await registerUser({ name, email, password });
    saveSession(newSession);
    setSession(newSession);
  };

  const logout = () => {
    clearSession();
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading,
        isAuthenticated: !!session,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
