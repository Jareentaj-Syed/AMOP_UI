// pages/password_reset.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import { Input, Button } from 'antd';
import Link from 'next/link';
import { Footer } from './footer-nested';
import Login from './login_page';

const PasswordReset: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false);

  const handleBackClick = () => {
    setShowLogin(true);
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen">
     {showLogin ? (
  <Login />
) : (
  <div className="flex flex-col items-center justify-center h-screen">
    <div className="w-[300px] h-[55px] mb-6">
      <Image
        src="/amop_logo_header.png"
        alt="AMOP Core Logo"
        layout="responsive"
        width={300}
        height={55}
      />
    </div>
    <div className="flex flex-col items-start w-[300px] px-2 mb-6">
      <label className="text-[20px] text-left text-[#00C1F1] font-[700] mb-1">
        Reset Password
      </label>
      <Input
        placeholder="Email"
        style={{
          width: '300px',
          height: '35px',
          backgroundColor: '#F7F9FA',
          padding: '6px 12px',
          borderRadius: '1px',
          borderColor: '#ccc',
        }}
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
