// pages/password_reset.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import { Input, Button } from 'antd';
import Link from 'next/link';
import { Footer } from './footer-nested';
import Login from './login_page';
import axios from 'axios';
import { useAuth } from './auth_context';


const PasswordReset: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false);
  const { setShowPassword } = useAuth();
  const [email, setEmail] = useState(''); // State variable for input value

  const handleBackClick = () => {
    setShowLogin(true);
  };
  const handleReset = async () => {
    setShowPassword(true)
    setShowLogin(true)
    try {
      const response = await axios.post('/api/password-reset', {
        username: email // Send the email as username
      });
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {showLogin ? (
        <Login />
      ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="w-[320px] h-[55px] mb-6">
            <Image
              src="/amop_logo_header.png"
              alt="AMOP Core Logo"
              width={300}
              height={55}
            />
          </div>
          <div className="flex flex-col items-start w-[320px] pr-2 mb-6">
            <label className="text-[20px] text-left text-[#00C1F1] font-[700] mb-1">
              Reset Password
            </label>
            <Input
              placeholder="Email"
              style={{
                width: '320px',
                height: '35px',
                backgroundColor: '#F7F9FA',
                padding: '6px 12px',
                borderRadius: '1px',
                borderColor: '#ccc',
              }}
              value={email} // Bind the input value
              onChange={(e) => setEmail(e.target.value)} // Update state on change
            />
            <div className="flex justify-end w-full mt-4">
              <Button
                type="primary"
                className="rounded-full"
                style={{
                  borderColor: '#00C1F1',
                  color: '#00C1F1',
                  backgroundColor: 'transparent',
                }}
                onClick={handleReset}
              >
                Reset
              </Button>
            </div>
            <div className="flex justify-end w-full">
              <a
                href="#"
                onClick={handleBackClick}
                className="hover:underline cursor-pointer text-[#337AB7]"
              >
                Back to login
              </a>
            </div>
          </div>
          <Footer />
        </div>
      )}
    </div>
  );
};

export default PasswordReset;
