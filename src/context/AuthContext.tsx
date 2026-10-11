import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  quickDemoLogin: (role: 'student' | 'teacher') => Promise<void>;
  updateUserPreferences: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('learnlens_token');
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .getMe()
      .then((res) => {
        setUser(res.user);
      })
      .catch(() => {
        localStorage.removeItem('learnlens_token');
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.login(email, password);
      localStorage.setItem('learnlens_token', res.token);
      setUser(res.user);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: any) => {
    setLoading(true);
    try {
      const res = await api.register(data);
      localStorage.setItem('learnlens_token', res.token);
      setUser(res.user);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('learnlens_token');
    setUser(null);
  };

  const quickDemoLogin = async (role: 'student' | 'teacher') => {
    const email = role === 'student' ? 'priya@example.com' : 'teacher@example.com';
    const password = 'demo123';
    await login(email, password);
  };

  const updateUserPreferences = async (updates: Partial<User>) => {
    const res = await api.updateProfile(updates);
    setUser(res.user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        quickDemoLogin,
        updateUserPreferences,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
