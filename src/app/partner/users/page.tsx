// app/page.tsx
"use client"
import React from 'react';
import ListView from './listView/page';
import ChartsPage from './charts/page';
import { useRouter } from 'next/navigation';

const Page: React.FC = () => {
  const router = useRouter();
 
  return (
    <div className="container mx-auto p-4">
        <div className="flex items-center ml-4">
    <a href="/partner" className="flex items-center text-lg font-light text-black-300 hover:underline">
    Partner
</a>
<span className="mx-2 text-gray-500">/</span>
<span className="text-lg font-light text-black">Partner Users</span>

</div>
      <div className="flex-1 flex flex-col">
        <main className="flex">
          {/* <ChartsPage /> */}
        
        
          <ListView />
        </main>
      </div>
    </div>
  );
};

export default Page;
