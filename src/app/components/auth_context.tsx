// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import axios from 'axios';
interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  const login = async (username: string, password: string) => {
    console.log('Logging in with:', username, password);
    setIsAuthenticated(true);
    // try {
    //   console.log('Logging in with:', username, password);
    //   const url = 'https://example.com/api/login';
    //   const response = await axios.post(url, {
    //     username,
    //     password
    //   });

    //   // Handle the response
    //   if (response.status === 200) {
    //     console.log('Login successful:', response.data);
    //     setIsAuthenticated(true);
    //   } else {
    //     console.log('Login failed:', response.data);
    //     setIsAuthenticated(false);
    //   }
    // } catch (error) {
    //   console.error('Error during login:', error);
    //   setIsAuthenticated(false);
    // }
  };


  const logout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
