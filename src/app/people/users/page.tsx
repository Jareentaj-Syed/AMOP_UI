// app/page.tsx
"use client"
import React from 'react';
import ListView from './listView/page';
import ChartsPage from './charts/page';
import { useRouter } from 'next/navigation';

const Page: React.FC = () => {
  const router = useRouter();
 
  return (
    <div className="flex container">
      <div className="flex-1 flex flex-col">
        <main className="p-2 flex">
          {/* <ChartsPage /> */}
        
        
          <ListView />
        </main>
      </div>
    </div>
  );
};

export default Page;
