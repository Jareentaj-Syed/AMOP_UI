// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import axios from 'axios';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => void;
  logout: () => void;
  partner: string | null;
  setPartner: (partnerName: string | null) => void;
  selectedPartner: boolean;
  setSelectedPartner: (value: boolean) => void;
  username: string | null;
  setUsername: (username: string | null) => void;
  handleSelectedPartner: (partnerName: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [partner, setPartner] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  // console.log(selectedPartner)
  const login = async (username: string, password: string) => {

    console.log('Logging in with:', username, password);
    setUsername(username); 
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

  const logout = () => {
    setIsAuthenticated(false);
    setUsername(null); // Clear the username on logout
    setPartner(null); // Clear the partner on logout
    setSelectedPartner(false);
  };
  const handleSelectedPartner = async (partnerName: string) => {
    console.log('Selected Partner:', partnerName);
    setSelectedPartner(true);
    setPartner(partnerName);
  };
  console.log(partner)
  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      login,
      logout,
      partner,
      setPartner,
      selectedPartner,
      setSelectedPartner,
      username,
      setUsername,
      handleSelectedPartner,
    }}>
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
