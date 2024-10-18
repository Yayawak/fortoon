'use client';
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // For redirection
import { getCookie, setCookie, deleteCookie } from 'cookies-next'; // npm install cookies-next
import { jwtVerify, JWTPayload } from 'jose'; // npm install jose
import type { User } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  loginSuccess: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-key');

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function isUser(payload: any): payload is User {
  return payload && typeof payload.uId === 'string' && typeof payload.username === 'string';
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const router = useRouter(); // For navigation

  // Auto-login: Check for token in cookies and verify on mount
  useEffect(() => {
    const autoLogin = async () => {
      const token = getCookie('token') as string;
      console.log(token)
      if (token) {
        try {
          const { payload } = await jwtVerify(token, JWT_SECRET); // Verify the token
          console.log('Token verified successfully:', payload);

          if (isUser(payload)) {
            setUser(payload); // Set the user state
            setLoginSuccess(true); // Mark as logged in
            router.push('/'); // Redirect to home
          } else {
            console.error('Invalid token payload');
            setUser(null); // Clear user state on failure
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          setUser(null); // Clear user state on error
        }
      }
    };

    autoLogin(); // Run on component mount
  }, [router]);

  const signIn = async (username: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user); // Set user state

        // Store the JWT token in a cookie
        setCookie('token', userData.token, { maxAge: 24 * 60 * 60, path: '/' });

        setLoginSuccess(true);
        router.push('/'); // Redirect to home
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

      // Remove the JWT token from cookies
      deleteCookie('token', { path: '/' });
      router.push('/login'); // Redirect to login
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
