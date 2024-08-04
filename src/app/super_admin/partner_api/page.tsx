"use client";
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useSidebarStore } from '@/app/stores/navBarStore';
import { useAuth } from '@/app/components/auth_context';
import axios from 'axios';
import { useLogoStore } from "@/app/stores/logoStore";
import { Spin } from 'antd';


const CarrierInfo = dynamic(() => import('./carrier_info'));
const APIInfo = dynamic(() => import('./api_info'));



const PartnerInfoForm: React.FC = () => {

    const [activeTab, setActiveTab] = useState('carrierInfo');
    const isExpanded = useSidebarStore((state:any) => state.isExpanded);
    const title = useLogoStore((state) => state.title);
    const [loading, setLoading] = useState(false); // State to manage loading


    useEffect(() => {
      if(title!="Super Admin"){
          setLoading(true)
      }
  },[title])
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

    return (
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
    );
  };
  
  export default PartnerInfoForm;