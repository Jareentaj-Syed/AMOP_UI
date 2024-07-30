import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAuth } from '../components/auth_context';
import { Footer } from './footer-nested';
import { useRouter } from 'next/navigation';
import PasswordReset from './password_reset';

const Login: React.FC = () => {
  const router = useRouter();

  // useEffect(() => {
  //     router.push('/login');
  // }, [router]);

  const { login } = useAuth(); // Assuming useAuth provides a login function
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // const {isAuthenticated}=useAuth();
  const {showPassword}=useAuth();
 const isAuthenticated=true

 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(username, password);
  };

  const [showPasswordReset, setShowPasswordReset] = useState(false);

  const handleForgotPasswordClick = () => {
    setShowPasswordReset(true);
  };
  // console.log("password:", showPassword)
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {showPasswordReset ? (
        <PasswordReset />
      ) : (
        <div className="w-80 text-left">
          <div className="w-[300px] h-[55px] mb-4">
            <Image
              src="/amop_logo_header.png"
              alt="AMOP Core Logo"
              width={300}
              height={55}
            />
          </div>
          {showPassword && (
            <div className='bg-[#DFF0D8] p-4 mb-2 border border-green-600 rounded text-center'>
              <h3 className='text-[#3C763D] font-[13px]'>Password Reset. Please Check your email.</h3>
            </div>)}
          {!isAuthenticated && (
            <div className='bg-[#F2DEDE] p-4 mb-2 border border-red-600 rounded text-center'>
              <h3 className='text-[#A94442] font-[13px]'>Invalid Login</h3>
            </div>)}
          <h1 className="text-2xl font-bold mb-4" style={{ color: '#00C1F1' }}>
            Login
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border w-[320px] h-[39px] w-full py-2 px-3 text-gray-700 bg-[#F7F9FA] focus:border-[#00C1F1] focus:outline-none"
                placeholder="Username"
                required
              />
            </div>
            <div className="mb-4 mt-4">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border w-[320px] h-[39px] w-full py-2 px-3 text-gray-700 bg-[#F7F9FA] focus:border-[#00C1F1] focus:outline-none"
                placeholder="Password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#00C1F1] text-white font-bold py-2 px-4 rounded-3xl mb-2"
            >
              Go
            </button>
            <div className="text-right text-red-500 mb-4">
              <a
                href="#"
                onClick={handleForgotPasswordClick}
                className="hover:underline cursor-pointer"
              >
                Forgot Password?
              </a>
            </div>
          </form>
          {/* <div className="mx-auto">
            <Footer />
          </div> */}
        </div>
      )}
    </div>
  );
};

export default Login;
