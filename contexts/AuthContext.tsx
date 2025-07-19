import React, { createContext, useContext, useState, useEffect } from 'react';
import { router } from 'expo-router';

interface User {
  id: string;
  email: string;
  name: string;
  company: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isOnboarded: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, company: string) => Promise<void>;
  logout: () => void;
  completeOnboarding: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);

  useEffect(() => {
    // Simulate checking for existing session
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockUser: User = {
      id: '1',
      email,
      name: 'Sarah Johnson',
      company: 'TechSales Corp',
      role: 'Senior Sales Representative'
    };
    
    setUser(mockUser);
    setIsLoading(false);
    
    if (!isOnboarded) {
      router.replace('/(onboarding)');
    } else {
      router.replace('/(tabs)');
    }
  };

  const register = async (email: string, password: string, name: string, company: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockUser: User = {
      id: '1',
      email,
      name,
      company,
      role: 'Sales Representative'
    };
    
    setUser(mockUser);
    setIsLoading(false);
    router.replace('/(onboarding)');
  };

  const logout = () => {
    setUser(null);
    setIsOnboarded(false);
    router.replace('/splash');
  };

  const completeOnboarding = () => {
    setIsOnboarded(true);
    router.replace('/(tabs)');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isOnboarded,
      login,
      register,
      logout,
      completeOnboarding
    }}>
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