"use client";
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Hardcoded for now to ensure production URL is used
  const API_URL = 'https://farm-ferry-backend-new.vercel.app';

  // Real login function for superadmin
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/superadmin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Response structure: { success: true, token, data: { check user data ... } }
      const userData = data.data; // Backend sends user data in 'data' field
      const accessToken = data.token; // Backend sends token at root level
      
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

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/superadmin/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      // Automatically login after register
      const newUserData = data.data;
      const accessToken = data.token;
      
      setUser(newUserData);
      setToken(accessToken);
      setIsAuthenticated(true);
      
      if (newUserData) localStorage.setItem('superadmin_user', JSON.stringify(newUserData));
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
    fetch(`${API_URL}/api/v1/superadmin/logout`, {
      method: 'POST',
      credentials: 'include'
    }).catch(err => {
      console.log('Logout request failed:', err);
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 
