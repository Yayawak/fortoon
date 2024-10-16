'use client'
import React, { createContext, useState, useContext, useEffect } from 'react';
import type { User } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  loginSuccess: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState(false);

//   useEffect(() => {
    // Check if there's a stored user in localStorage
    // const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//       setLoginSuccess(true);
//     }
//   }, []);

  const signIn = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      console.log(response)
      if (response.ok) {
        const userData = await response.json();
        setUser({
            uId: "5555",
            username: "esus yone"
        });
        console.log("gu ja set yone really")

        setLoginSuccess(true);
        // localStorage.setItem('user', JSON.stringify(userData.user));
      } else {
        const data = await response.json();
        setError(data.error || 'Login failed');
        setLoginSuccess(false);
      }
    } catch (error) {
      console.error('Sign in failed:', error);
      setError('An error occurred during sign in');
      setLoginSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setLoginSuccess(false);
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Sign out failed:', error);
      setError('An error occurred during sign out');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    loginSuccess,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}