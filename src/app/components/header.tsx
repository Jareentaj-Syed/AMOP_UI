"use client";
import React, { useState } from 'react';
import { EnvelopeIcon, QuestionMarkCircleIcon, Bars3Icon, UserIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useSidebarStore } from '../stores/navBarStore';
import { useLogoStore } from '../stores/logoStore';
import { useAuth } from './auth_context';
import { useRouter } from 'next/navigation';
const Header: React.FC = () => {
  const { username, partner } = useAuth();
  const { toggleSidebar } = useSidebarStore();
  const { logoUrl } = useLogoStore();
  const router = useRouter();
  const [showLogout, setShowLogout] = useState(false);

  const handleClick = () => {
    setShowLogout(!showLogout);
  };


  const handleLogout = () => {
    router.push('/components/login');
  };

  return (
    <div className="p-2 flex justify-between items-center shadow-md header">
      <div className="flex items-center space-x-2">
        {/* <button
          className="p-2 rounded-full hover:bg-gray-200 hover:text-gray-800"
          onClick={toggleSidebar}
        >
          <Bars3Icon className="w-6 h-6" />
        </button> */}
        {logoUrl ? (
          <img src={logoUrl} alt="Uploaded Logo" width={150} height={40} className="logo" />
        ) : (
          <Image src="/amop-core.png" alt="AMOP Core Logo" width={150} height={40} className="logo" />
        )}
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative">
          <div
            className="flex items-center cursor-pointer"
            onClick={handleClick}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white">
              <UserIcon className="w-6 h-6" />
            </div>
            <div className="ml-3">
              <p className="text-base font-medium">{username}</p>
              <p className="text-xs text-gray-500">{partner}</p>
            </div>
          </div>

          {showLogout && (
          <button
          onClick={handleLogout}
          className="absolute top-full mt-2 px-2 py-4 bg-white text-red-500 rounded shadow-md whitespace-normal text-sm"
        >
          Logout ({username})
        </button>
        
          )}
        </div>

        {/* Envelope Icon */}
        <button className="p-2 rounded-full hover:bg-gray-200 hover:text-gray-800">
          <EnvelopeIcon className="w-6 h-6" />
        </button>
        {/* QuestionMarkCircle Icon */}
        <button className="p-2 rounded-full hover:bg-gray-200 hover:text-gray-800">
          <QuestionMarkCircleIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default Header;
