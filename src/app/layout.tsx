// src/app/layout.tsx
"use client"
import { useEffect } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/header";
import SideNav from "./components/sideNav";
import { useSidebarStore } from './stores/navBarStore';
import { AuthProvider, useAuth } from '.././app/components/auth_context';
import Login from '../app/components/login_page';
import ChooseTenant from "./components/choose_tenant";
import { useRouter } from 'next/navigation';
import  PasswordUpdate  from './components/password_update';
const inter = Inter({ subsets: ["latin"] });

const LayoutContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isExpanded = useSidebarStore((state: any) => state.isExpanded);
  const { isAuthenticated, showPasswordUpdate , isReset  } = useAuth();
  const {selectedPartner}= useAuth();
  const router = useRouter();
  // console.log(selectedPartner)
  useEffect(() => {
    // Set Calibri as the default font for the entire application
    document.body.style.fontFamily = 'Calibri';
  }, []);

  if (!isAuthenticated) {
    return <Login />;
  }


  return (
    <div className="min-h-screen grid">
  {!selectedPartner && !isReset ? (
    <ChooseTenant />
  ) : (
    <>
      <div className="fixed top-0 left-[17%] right-0 bg-white" style={{ zIndex: 999 }}>
        <Header />
      </div>
      <div className="flex mt-[70px] bg-gray-50 overflow-hidden">
        <div className={`fixed bottom-0 top-0 bg-gray-800 text-white ${isExpanded ? 'w-[17%]' : 'w-[110px]'}`}>
          <SideNav />
        </div>
        <div className={`flex-1 overflow-y-auto overflow-x-hidden ${isExpanded ? 'ml-[17%]' : 'ml-[110px]'}`}>
          {showPasswordUpdate ? <PasswordUpdate /> : children}
        </div>
      </div>
    </>
  )}
</div>

  );
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={inter.className}>
          <LayoutContent>{children}</LayoutContent>
        </body>
      </html>
    </AuthProvider>
  );
}
