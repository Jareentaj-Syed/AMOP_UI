"use client";
import React, { useState } from 'react';
import { EnvelopeIcon, QuestionMarkCircleIcon, Bars3Icon, UserIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { LogoutOutlined, SwitcherOutlined , UserOutlined, TeamOutlined, SettingOutlined} from '@ant-design/icons';
import { useSidebarStore } from '../stores/navBarStore';
import { useLogoStore } from '../stores/logoStore';
import { useAuth } from './auth_context';
import { usePathname, useRouter } from 'next/navigation';
const Header: React.FC = () => {
  const { username, partner } = useAuth();
  const { toggleSidebar } = useSidebarStore();
  const { logoUrl } = useLogoStore();
  const title = useLogoStore((state) => state.title);
  const [showChooseTenant, setShowChooseTenant] = useState(false);
  console.log(title)
  const pathname=usePathname()
  const router = useRouter();
  const [showLogout, setShowLogout] = useState(false);
  const { logout , LogoutChooseTenant} = useAuth(); 
  const handleClick = () => {
    setShowLogout(!showLogout);
  };
 
  const handleLogout = () => {
    logout()
    const pathname = window.location.pathname;
      const url = `/auth/logout?redirect=${pathname}&action=logout`;
      window.location.href = url;
    // router.push('/components/login_page');
  };

  const handleChoosePartner = () => {
    LogoutChooseTenant() 
    // const pathname = window.location.pathname;
    // const url = `/Choose_tenant`;
    // window.location.href = url;
  }
  return (
    <div className="p-2 flex justify-between items-left shadow-md header">
      {/* <div className="flex items-center space-x-2 w-[17%]">
        {logoUrl ? (
          <img src={logoUrl} alt="Uploaded Logo" width={150} height={40} className="logo" />
        ) : (
          <Image src="/amop-core.png" alt="AMOP Core Logo" width={150} height={40} className="logo" />
        )}
      </div > */}
      <div className='absolute left-[5px] p-2 '>
      <span className=" p-4 font-[100] text-[24px]">{title}</span>
      </div>
      <div className="flex items-center space-x-2 absolute right-[20px]">
        <div className="relative">
          <div
            className="flex items-center cursor-pointer ml-5 mt-2"
            onClick={handleClick}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white">
              <UserIcon className="w-5 h-5" />
            </div>
            <div className="ml-2">
              <p className="text-base font-medium">{username}</p>
              <p className="text-xs text-gray-500">{partner}</p>
            </div>
          </div>
          
          {showLogout && (
      <div className="absolute top-full mt-2 bg-white text-red-500 rounded shadow-md whitespace-normal text-sm w-[200px] flex flex-col ">
      <button
        onClick={handleLogout}
        className="text-black rounded hover:bg-[#E5E7EB] whitespace-nowrap p-2  flex items-center "
      >
        <UserOutlined className="mr-3" />
        Logout ({username})
      </button>
      <button
        onClick={handleChoosePartner}
        className="text-black rounded  hover:bg-[#E5E7EB] p-2 whitespace-nowrap flex items-center"
      >
        <SettingOutlined className="mr-3" />
        Change Partner
      </button>
    </div>
    
    
        
          )}
        </div>

        {/* Envelope Icon */}
        <button className="p-2 rounded-full hover:bg-gray-200 hover:text-gray-800">
          <EnvelopeIcon className="w-6 h-6" />
        </button>
        {/* QuestionMarkCircle Icon */}
        <button className="p-2 rounded-full hover:bg-gray-200 hover:text-gray-800">
          <QuestionMarkCircleIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default Header;
