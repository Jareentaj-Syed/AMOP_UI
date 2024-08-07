"use client"
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../components/auth_context';
import { useLogoStore } from '../stores/logoStore';
const HomePage: React.FC = () => {
  // Mock data
  const router = useRouter(); // Use the router hook to handle navigation
  const { username, partner , role} = useAuth();
  const setTitle = useLogoStore((state) => state.setTitle);
  useEffect(() => {
      // Ensure the URL is set to /login when the component mounts
      router.push('/dashboard');
  }, [router]);
  useEffect(() => {
    setTitle("Dashboard")
})
  const userImage = "https://www.w3schools.com/w3images/avatar2.png";
  // <Image src="/amop-core.png" alt="AMOP Core Logo" width={150} height={40} className="logo" />
 

  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen mb-10 bg-white">
{/* 
    <div className="border border-gray-300 p-4 mb-4 rounded-md flex space-x-2">
     
      <button 
       className="text-black font-semibold py-2 px-4 rounded-lg"
      style={{
        backgroundColor: '#e1eafc',
        color: '#013cfe',
       
      }}
    >
      Overview
    </button>
    <button 
       className="text-black font-semibold py-2 px-4 rounded-lg"
      style={{
        backgroundColor: '#e1eafc',
        color: ' #7da0fd',
       
      }}
    >
      Overview
    </button>
    <button 
       className="text-black font-semibold py-2 px-4 rounded-lg"
      style={{
        backgroundColor: '#cad6ef',
        color: ' #7da0fd',
       
      }}
    >
      Overview
    </button>
    <button 
       className="text-black font-semibold py-2 px-4 rounded-lg"
      style={{
        backgroundColor: '#cad6ef',
        color: '#1b4ffe',
       
      }}
    >
      Overview
    </button>

    
   
 
    </div>
  
 
    <div className="border border-gray-300 p-4 mb-4 rounded-md flex space-x-2">
      <button
        style={{ backgroundColor: '#f3f3f2', color: '#242424' }}
        className="font-semibold py-2 px-4 rounded"
      >
        Button 1
      </button>
    
    </div> */}
 
 <div className="p-6 w-[400px] bg-white rounded-xl shadow-md space-y-4 border ">
  <div className="flex-shrink-0">
    <img className="h-30 w-60 object-cover rounded-lg mx-auto" src="/amop-core.png" alt='user' />
  </div>
  <div className="flex flex-col items-center space-y-2">
    <div className="text-gray-500">
      <span className="text-gray-400">Username: </span>
      {username}
    </div>
    <p className="text-gray-500">
      <span className="text-gray-400">Partner: </span>
      {partner}
    </p>
    <p className="text-gray-500">
      <span className="text-gray-400">Role: </span>
      {role}
    </p>
  </div>
</div>

  </div>
  
  
  
  );
};

export default HomePage;
