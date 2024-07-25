import React, { createContext, useState, useContext, ReactNode } from 'react';
import axios from 'axios';
import { AUTHENTICATION_ROUTES } from '../components/routes/route_constants';

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
  tenantNames: string[];
  setTenantNames: (tenantNames: string[]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [partner, setPartner] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [tenantNames, setTenantNames] = useState<string[]>([]); // Add tenantNames state

  const login = async (username: string, password: string) => {
    setUsername(username);
    const data = {
      path: "/login_using_database",
      user_name: username,
      password: password,
    };
    try {
      console.log('Logging in with:', username, password);
      const url = `${BASE_URL}/${AUTHENTICATION_ROUTES.AMOP_LOGIN}`;
      console.log("url", url);
      const response = await axios.post(url, { data: data }, {
        headers: {
          'Content-Type': 'application/json'
        }}
      );
      if (response.status === 200) {
        const resp = JSON.parse(response.data.body);
        console.log('Login successful:', resp["tenant_names"]);
        const tenant_names = resp["tenant_names"];
        setTenantNames(tenant_names); // Set tenant names
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
    setShowPassword(false);
    setTenantNames([]); // Reset tenant names on logout
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
        tenantNames,
        setTenantNames,
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
