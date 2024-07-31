// app/createUser/page.tsx

"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useSidebarStore } from '@/app/stores/navBarStore';
import Page from '../page';


// Dynamically import the UserInfo and TenantInfo components
const UserInfo = dynamic(() => import('./userInfo'));
const TenantInfo = dynamic(() => import('./tenantInfo'));
const UserRole = dynamic(() => import('./userrole'));


interface CreateUserProps {
  isPopup?: boolean;
  rowData?: any;
}

const CreateUser: React.FC<CreateUserProps> = ({ isPopup, rowData }) => {
  const [activeTab, setActiveTab] = useState('userInfo');
  const isExpanded = useSidebarStore((state: any) => state.isExpanded);
  const [hideCreateUser, setHideCreateUser] = useState(false);
  const handleCloseClick = () => {
    setHideCreateUser(true);
  };

  return (
    <div>
      {hideCreateUser ? (
        <Page />
      ) : (
        <div className="">

          <div className={`bg-white shadow-md ${isPopup ? '' : 'tabs'} ${isExpanded ? 'left-[17%]' : 'left-[112px]'}`} style={{ zIndex: '98' }}>
            <button
              className={`tab-headings ${activeTab === 'userInfo' ? 'active-tab-heading' : ''}`}
              onClick={() => setActiveTab('userInfo')}
            >
              User info
            </button>
            <button
              className={`tab-headings ${activeTab === 'userrole' ? 'active-tab-heading' : ''}`}
              onClick={() => setActiveTab('userrole')}
            >
              Edit User role
            </button>
            <button
              className={`tab-headings ${activeTab === 'tenantInfo' ? 'active-tab-heading' : ''}`}
              onClick={() => setActiveTab('tenantInfo')}
            >
              Customer info
            </button>
            {!isPopup&&(
              <button 
              className="text-red-500 absolute right-[5%] top-[30%] rounded-full w-[25px] text-[20px]"
              onClick={handleCloseClick}>X</button>
            )}
            

          </div>
          <div className={`shadow-md p-4 ${isPopup ? '' : 'mt-[-10px] pt-[70px]'}`}>
            {activeTab === 'userInfo' && <UserInfo rowData={rowData} />}
            {activeTab === 'tenantInfo' && <TenantInfo rowData={rowData} />}
            {activeTab === 'userrole' && <UserRole rowData={rowData} />}
          </div>
        </div>
      )}</div>

  );
};

export default CreateUser;
