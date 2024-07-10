// app/page.tsx
"use client"
import React from 'react';
import ListView from './listView/page';
import ChartsPage from './charts/page';
import { useRouter } from 'next/navigation';
import { PlusIcon, ArrowDownTrayIcon, MagnifyingGlassIcon, FunnelIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

const Page: React.FC = () => {
  const router = useRouter();
  const handleCreateClick = () => {
    router.push('users/createUser');
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 flex flex-col">
        <main className="p-2 flex-1">
          {/* <ChartsPage /> */}
        
        
          <ListView />
        </main>
      </div>
    </div>
  );
};

export default Page;
