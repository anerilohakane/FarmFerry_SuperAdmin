"use client";
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Real login function for superadmin
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'}/api/v1/superadmin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Store user info in localStorage and state
      const userData = data.data?.superadmin || null;
      const accessToken = data.data?.accessToken || null;
      
      setUser(userData);
      setToken(accessToken);
      setIsAuthenticated(true);
      
      // Store in localStorage
      if (userData) localStorage.setItem('superadmin_user', JSON.stringify(userData));
      if (accessToken) localStorage.setItem('superadmin_token', accessToken);
      
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    
    // Clear localStorage
    localStorage.removeItem('superadmin_user');
    localStorage.removeItem('superadmin_token');
    localStorage.removeItem('adminSidebarActive');
    
    // Optionally call backend logout
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9000'}/api/v1/superadmin/logout`, {
      method: 'POST',
      credentials: 'include'
    }).catch(err => {
      console.log('Logout request failed:', err);
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 
