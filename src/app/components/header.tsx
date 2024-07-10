// app/components/header.tsx

"use client";
import React from 'react';
import { EnvelopeIcon, QuestionMarkCircleIcon, Bars3Icon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useSidebarStore } from '../stores/navBarStore';
import { useLogoStore } from '../stores/logoStore';

const Header: React.FC = () => {
  const { toggleSidebar } = useSidebarStore();
  const { logoUrl } = useLogoStore();

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
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-200 hover:text-gray-800">
          <EnvelopeIcon className="w-6 h-6" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-200 hover:text-gray-800">
          <QuestionMarkCircleIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default Header;
