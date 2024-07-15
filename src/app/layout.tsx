// app/layout.tsx
"use client"
import { useEffect } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/header";
import SideNav from "./components/sideNav";
import { useSidebarStore } from './stores/navBarStore';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isExpanded = useSidebarStore((state: any) => state.isExpanded);
  useEffect(() => {
    // Set Calibri as the default font for the entire application
    document.body.style.fontFamily = 'Calibri';
  }, []);
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen grid`}>
        <div className="fixed top-0 left-0 right-0 bg-white" style={{ zIndex: 999 }}>
          <Header />
        </div>
        <div className="flex mt-[70px]  bg-gray-50 overflow-hidden">
          <div className={`fixed top-[70px] bottom-0 bg-gray-800 text-white ${isExpanded ? 'w-[17%]' : 'w-[110px]'}`}>
            <SideNav />
          </div>
          <div
            className={`flex-1 overflow-y-auto overflow-x-hidden children ${isExpanded ? 'ml-[17%]' : 'ml-[110px]'}`}
            style={{ maxHeight: '100vh' }}
          >
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
