
"use client"
import React from 'react';
import ListView from './listView/page';

import { useRouter } from 'next/navigation';

const Page: React.FC = () => {
  const router = useRouter();
 
  return (
    <div className="container mx-auto">
      <div className="flex-1 flex flex-col">
        <main className="flex">
         
        
        
          <ListView />
        </main>
      </div>
    </div>
  );
};

export default Page;
