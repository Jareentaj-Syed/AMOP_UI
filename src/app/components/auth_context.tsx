import React, { createContext, useState, useContext, ReactNode } from 'react';
import axios from 'axios';
import{AUTHENTICATION_ROUTES} from '../components/routes/route_constants'
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
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [partner, setPartner] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false); // Add showPassword state
  console.log("baseurl",BASE_URL);
  const login = async (username: string, password: string) => {
    setUsername(username);
    const data = {
      username: username,
      password: password,
    };
   

    try {
      console.log('Logging in with:', username, password);
      const url = `${BASE_URL}/${AUTHENTICATION_ROUTES.AMOP_LOGIN}`;
      console.log("url", url)
      const response = await axios.post(url, { data: data }, {
        headers: {
          'Content-Type': 'application/json'
        }}
      );
      if (response.status === 200) {
        console.log('Login successful:', response.data);
        setIsAuthenticated(true);
      } else {
        console.log('Login failed:', response.data);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setIsAuthenticated(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsername(null);
    setPartner(null);
    setSelectedPartner(false);
    setShowPassword(false); // Reset showPassword on logout
  };

  const handleSelectedPartner = async (partnerName: string) => {
    console.log('Selected Partner:', partnerName);
    setSelectedPartner(true);
    setPartner(partnerName);
  };

  return (
    <AuthContext.Provider
      value={{
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
        showPassword,
        setShowPassword,
      }}
    >
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
