"use client";
import React, { useEffect, useState,lazy, Suspense } from 'react';
// import dynamic from 'next/dynamic';
import { useSidebarStore } from '@/app/stores/navBarStore';
import { useAuth } from '@/app/components/auth_context';
import axios from 'axios';
import { useLogoStore } from "@/app/stores/logoStore";
import { Spin } from 'antd';


const CarrierInfo = lazy(() => import('./carrier_info'));
const APIInfo = lazy(() => import('./api_info'));



const PartnerInfoForm: React.FC = () => {
  const title = useLogoStore((state) => state.title);
  const setTitle = useLogoStore((state) => state.setTitle);

 
 
  useEffect(() => {
    setTitle("Super Admin")
    if(title!="Super Admin"){
        setLoading(true)
    }
},[title])
    const [activeTab, setActiveTab] = useState('carrierInfo');
    const isExpanded = useSidebarStore((state:any) => state.isExpanded);

    const [loading, setLoading] = useState(false); // State to manage loading




   
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }
    return (
      <Suspense fallback={<div className="flex justify-center items-center h-screen"><Spin size="large" /></div>}>
      
      <div className="">
        <div className={`bg-white shadow-md mb-4 gap-4  tabs ${isExpanded ? 'left-[17%]' : 'left-[112px]'}`}>

         
          <button 
            className={`tab-headings ${activeTab === 'carrierInfo' ? 'active-tab-heading' : ''}`}
            onClick={() => setActiveTab('carrierInfo')}
          >
            Carrier API's
          </button>
          <button 
            className={`tab-headings ${activeTab === 'apiInfo' ? 'active-tab-heading' : ''}`}
            onClick={() => setActiveTab('apiInfo')}
          >
            Amop API's
          </button>
         
        </div>
        <div className="h-[calc(100vh-150px)] pt-[70px] container">
          {activeTab === 'carrierInfo' && <CarrierInfo />}
          {activeTab === 'apiInfo' && <APIInfo />}
          
        </div>
      </div>
      </Suspense>
    );
  };
  
  export default PartnerInfoForm;
