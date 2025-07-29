"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { getProfile } from "../utils/superadminApi";

const SuperAdminProfileContext = createContext();

export function SuperAdminProfileProvider({ children }) {
  const [profile, setProfile] = useState({
    name: "SuperAdmin",
    role: "Super Admin",
    avatar: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const res = await getProfile();
        setProfile({
          name: res?.data?.name || "SuperAdmin",
          role: "Super Admin",
          avatar: res?.data?.avatar || "",
        });
      } catch (err) {
        // fallback to default
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  return (
    <SuperAdminProfileContext.Provider value={{ profile, setProfile, loading }}>
      {children}
    </SuperAdminProfileContext.Provider>
  );
}

export function useSuperAdminProfile() {
  return useContext(SuperAdminProfileContext);
} 