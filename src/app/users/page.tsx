// app/page.tsx
"use client"
import React from 'react';
import ListView from './listView/page';
import ChartsPage from './charts/page';
import { useRouter } from 'next/navigation';


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
            <div className="mb-4">
              <button
                className="p-2 rounded shadow ml-4 button"
                onClick={handleCreateClick}
              >
                Create
              </button>
              <button
                className="p-2 rounded shadow ml-4 button"
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
