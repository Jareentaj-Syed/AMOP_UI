"use client"
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../components/auth_context';
const HomePage: React.FC = () => {
  // Mock data
  const router = useRouter(); // Use the router hook to handle navigation
  const { username, partner } = useAuth();
  useEffect(() => {
      // Ensure the URL is set to /login when the component mounts
      router.push('/home');
  }, [router]);
  const userImage = "https://www.w3schools.com/w3images/avatar2.png";
 

  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md space-y-4">
        <div className="flex-shrink-0">
          <img className="h-40 w-40 object-cover rounded-lg mx-auto" src={userImage} alt='user' />
        </div>
        <div className="text-center">
          <div className="text-xl font-medium text-black">{username}</div>
          <p className="text-gray-500">{partner}</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
