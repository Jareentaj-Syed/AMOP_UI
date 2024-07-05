// app/components/Header.tsx

"use client";
import React from 'react';
import { EnvelopeIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

const Header: React.FC = () => {
  return (
    <div className="shadow-md p-4 flex justify-between items-center header">
      <h1 className="text-2xl font-bold">Users</h1>
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
