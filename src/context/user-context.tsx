"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
  savedProperties: { propertyId: number }[];
  siteVisits?: any[];
  callbackRequests?: any[];
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  
  // Local states for Compare and Recently Viewed
  compareList: number[];
  addToCompare: (id: number) => void;
  removeFromCompare: (id: number) => void;
  
  recentlyViewed: number[];
  addRecentlyViewed: (id: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [compareList, setCompareList] = useState<number[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<number[]>([]);
  const router = useRouter();

  const refreshUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
    
    // Load local storage items
    const savedCompare = localStorage.getItem("compareList");
    if (savedCompare) setCompareList(JSON.parse(savedCompare));
    
    const savedViewed = localStorage.getItem("recentlyViewed");
    if (savedViewed) setRecentlyViewed(JSON.parse(savedViewed));
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
  };

  const addToCompare = (id: number) => {
    setCompareList(prev => {
      if (prev.includes(id)) return prev;
      const newList = [...prev, id].slice(-3); // Max 3 items
      localStorage.setItem("compareList", JSON.stringify(newList));
      return newList;
    });
  };

  const removeFromCompare = (id: number) => {
    setCompareList(prev => {
      const newList = prev.filter(p => p !== id);
      localStorage.setItem("compareList", JSON.stringify(newList));
      return newList;
    });
  };

  const addRecentlyViewed = (id: number) => {
    setRecentlyViewed(prev => {
      const newList = [id, ...prev.filter(p => p !== id)].slice(0, 10);
      localStorage.setItem("recentlyViewed", JSON.stringify(newList));
      return newList;
    });
  };

  return (
    <UserContext.Provider value={{ 
      user, loading, refreshUser, logout,
      compareList, addToCompare, removeFromCompare,
      recentlyViewed, addRecentlyViewed
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
