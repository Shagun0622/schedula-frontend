"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(undefined);

const MOCK_USERS = [
  {
    id: "1",
    name: "Priya Sharma",
    email: "priya@example.com",
    password: "password123",
    phone: "+91 9876543210",
    location: "Dombivali, Mumbai",
    avatar: "",
    role: "patient",
  },
  {
    id: "2",
    name: "Dr. Kumar Das",
    email: "doctor@example.com",
    password: "doctor123",
    phone: "+91 9123456789",
    location: "Chennai, Tamil Nadu",
    avatar: "",
    role: "doctor",
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("schedula_user");
    if (stored) setUser(JSON.parse(stored));
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const found = MOCK_USERS.find((u) => u.email === email && u.password === password);
    if (found) {
      const { password: _, ...userWithoutPassword } = found;
      setUser(userWithoutPassword);
      localStorage.setItem("schedula_user", JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  };

  const signup = async (data) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const newUser = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      location: "India",
      role: data.role ?? "patient",
    };
    setUser(newUser);
    localStorage.setItem("schedula_user", JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("schedula_user");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
