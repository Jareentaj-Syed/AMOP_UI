// app/layout.tsx
"use client"
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
  const isExpanded = useSidebarStore((state:any) => state.isExpanded);

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen grid`}>
        <div className="fixed top-0 left-0 right-0 bg-white" style={{ zIndex: 999}}>
          <Header />
        </div>
        <div className="flex mt-[70px]  bg-gray-50 overflow-hidden">
          <div className={`fixed top-[70px] bottom-0 bg-gray-800 text-white ${isExpanded ? 'w-[17%]' : 'w-[110px]'}`}>
            <SideNav />
          </div>
          <div className={`flex-1 overflow-auto children ${isExpanded ? 'ml-[17%]' : 'ml-[110px]'}`}>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
