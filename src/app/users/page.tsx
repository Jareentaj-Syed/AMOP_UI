// app/page.tsx
"use client"
import React from 'react';
import ListView from './listView/page';
import ChartsPage from './charts/page';
import { useRouter } from 'next/navigation';
import { PlusIcon } from '@heroicons/react/24/outline';

const Page: React.FC = () => {
  const router = useRouter();
  const handleCreateClick = () => {
    router.push('users/createUser');
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 flex flex-col">
          <main className="p-4 flex-1">
            <ChartsPage />
            <div className="flex mb-4">
    <button
      className="flex items-center p-2 rounded-lg shadow ml-4 button border border-gray-300"
      onClick={handleCreateClick}
    >
      <PlusIcon className="h-5 w-5 text-black-500 mr-2" />
      Create
    </button>
    <button
      className="flex items-center justify-center p-2 rounded-lg shadow ml-4 button border border-gray-300"
      onClick={handleCreateClick}
    >
      Export
    </button>
  </div>
            <ListView />
          </main>
      </div>
    </div>
  );
};

export default Page;
