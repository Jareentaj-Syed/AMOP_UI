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
 

  
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">

    <div className="border border-gray-300 p-4 mb-4 rounded-md flex space-x-2">
      <button
        style={{ backgroundColor: '#094bf2' }}
        className="text-black font-semibold py-2 px-4 rounded"
      >
        Button 1
      </button>
      <button
        style={{ backgroundColor: '#4480ec' }}
        className="text-black font-semibold py-2 px-4 rounded"
      >
        Button 2
      </button>
      <button
        className="text-black font-semibold py-2 px-4 rounded save-btn"
       
      >
        Button 3
      </button>
    </div>
  
 
    <div className="border border-gray-300 p-4 mb-4 rounded-md flex space-x-2">
      <button
        style={{ backgroundColor: '#f3f3f2', color: '#3c4656' }}
        className="font-semibold py-2 px-4 rounded"
      >
        Button 1
      </button>
      <button
        style={{ backgroundColor: '#4f4f4e' }}
        className="font-semibold py-2 px-4 rounded"
      >
        Button 2
      </button>
      <button
        style={{ backgroundColor: '#f6f6f6', color: '#aeaeae' }}
        className="font-semibold py-2 px-4 rounded"
      >
        Button 3
      </button>
      <button
      
        className="font-semibold py-2 px-4 rounded cancel-btn"
      >
        Button 3
      </button>
    </div>
 
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md space-y-4">
      <div className="flex-shrink-0">
        <img className="h-40 w-40 object-cover rounded-lg mx-auto" src={userImage} alt='user' />
      </div>
      <div className="flex flex-col items-center space-y-2">
        <div className="">
          <span className="text-gray-400">Username: </span>
          {username}
        </div>
        <p className="text-gray-500">
          <span className="text-sm text-gray-400">Partner: </span>
          {partner}
        </p>
        <p className="text-gray-500">
          <span className="text-sm text-gray-400">Role: </span>
          {role}
        </p>
      </div>
    </div>
  </div>
  
  
  
  );
};

export default HomePage;
