// app/page.tsx
"use client"
import React from 'react';
import Users from './users/page'
import { useRouter } from 'next/navigation';


const Page: React.FC = () => {
  return (
      <Users/>
  );
};

export default Page;
