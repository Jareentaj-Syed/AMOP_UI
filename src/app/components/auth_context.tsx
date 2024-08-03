import React, { createContext, useState, useContext, ReactNode } from 'react';
import axios from 'axios';
import { AUTHENTICATION_ROUTES } from '../components/routes/route_constants';
import { Modal } from 'antd';
import { getCurrentDateTime } from './header_constants';

interface AuthContextType {
  isAuthenticated: boolean;
  isReset: boolean;

  login: (username: string, password: string) => void;
  logout: () => void;
  LogoutChooseTenant: () => void;
  partner: string | null;
  setPartner: (partnerName: string | null) => void;
  selectedPartner: boolean;
  setSelectedPartner: (value: boolean) => void;
  username: string | null;
  setUsername: (username: string | null) => void;
  selectedPartnerModule: string | null;
  setSelectedPartnerModule: (partner: string | null) => void;
  Environment: string | null;
  setSelectedEnvironment: (Environment: string | null) => void;
  handleSelectedPartner: (partnerName: string) => void;
  showPasswordUpdate: boolean;
  setShowPasswordUpdate: (value: boolean) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  tenantNames: string[];
  setTenantNames: (tenantNames: string[]) => void;
  role: string | null;
  setRole: (role: string | null) => void;
  modules: any[]; // Add modules to context
  setModules: (modules: any[]) => void; 
  loading: boolean;
   setLoading: (value: boolean) => void;
   tabledata: any[];
   settabledata: (data: any[]) => void;// Method to set modules
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [partner, setPartner] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isReset, setReset] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [selectedPartnerModule, setSelectedPartnerModule] = useState<string | null>(null);
  const [Environment, setSelectedEnvironment] = useState<string | null>(null);
  const [tabledata, settabledata] = useState<any[]>([]);
  const [showPasswordUpdate, setShowPasswordUpdate] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [tenantNames, setTenantNames] = useState<string[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(false); // State to manage loading
  const login = async (username: string, password: string) => {
    setUsername(username);
    const data = {
        path: "/login_using_database",
        user_name: username,
        password: password,
        request_received_at: getCurrentDateTime(),
    };
    setLoading(true);
    
    try {
        const url = "https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/user_auth";
        const response = await axios.post(url, { data: data }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 200) {
            const resp = JSON.parse(response.data.body);
            if (resp.flag === false) {
                Modal.error({
                    title: 'Login Error',
                    content: resp.message || 'An error occurred during login. Please try again.',
                    centered: true,
                });
                setIsAuthenticated(false);
            } else {
                if (resp.message === "Token is Valid.") {
                    setShowPasswordUpdate(true);
                    const role = resp["role"];
                    setRole(role);
                    setIsAuthenticated(true);
                    setReset(true);
                }
                if (resp["tenant_names"]) {
                    const tenant_names = resp["tenant_names"];
                    setTenantNames(tenant_names);
                    setIsAuthenticated(true);
                    setReset(false);
                    const role = resp["role"];
                    setRole(role);
                }
            }
        } else {
            console.log('Login failed:', response.data);
            Modal.error({
                title: 'Login Error',
                content: response.data.message || 'Login failed. Please check your credentials and try again.',
                centered: true,
            });
            setIsAuthenticated(false);
        }
    } catch (error) {
        console.error('Error during login:', error);
        if (error instanceof Error) {
            Modal.error({
                title: 'Login Error',
                content: error.message || 'An unexpected error occurred during login. Please try again.',
                centered: true,
            });
        } else {
            Modal.error({
                title: 'Login Error',
                content: 'An unexpected error occurred during login. Please try again.',
                centered: true,
            });
        }
        setIsAuthenticated(false);
    } finally {
        setLoading(false); // Always stop the loader in the finally block
    }
};

  const LogoutChooseTenant = () => {
    setPartner(null);
    setSelectedPartner(false);
    setShowPassword(false);
    setReset(false)
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsername(null);
    setPartner(null);
    setSelectedPartner(false);
    setShowPassword(false);
    setTenantNames([]);
  };

  const handleSelectedPartner = async (partnerName: string) => {
    console.log('Selected Partner:', partnerName);
    setSelectedPartner(true);
    setPartner(partnerName);
    
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        setLoading,
        tabledata,settabledata,
        selectedPartnerModule,
        setSelectedPartnerModule,
        Environment,
        setSelectedEnvironment,
        isAuthenticated,
        isReset,
        login,
        logout,
        LogoutChooseTenant,
        partner,
        setPartner,
        selectedPartner,
        setSelectedPartner,
        username,
        setUsername,
        handleSelectedPartner,
        showPasswordUpdate,
        setShowPasswordUpdate,
        showPassword,
        setShowPassword,
        tenantNames,
        setTenantNames,
        role,
        setRole,
        modules,
        setModules,
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
