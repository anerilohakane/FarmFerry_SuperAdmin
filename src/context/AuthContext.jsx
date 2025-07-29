"use client";
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Real login function for superadmin
  const login = async (email, password) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/superadmin/login`, {
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
    
    // Store in localStorage
    if (userData) localStorage.setItem('superadmin_user', JSON.stringify(userData));
    if (accessToken) localStorage.setItem('superadmin_token', accessToken);
    
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    
    // Clear localStorage
    localStorage.removeItem('superadmin_user');
    localStorage.removeItem('superadmin_token');
    localStorage.removeItem('adminSidebarActive');
    
    // Optionally call backend logout
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/superadmin/logout`, {
      method: 'POST',
      credentials: 'include'
    }).catch(err => {
      console.log('Logout request failed:', err);
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 