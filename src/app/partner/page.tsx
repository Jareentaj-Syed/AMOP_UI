"use client";
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useSidebarStore } from '../stores/navBarStore';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '../components/auth_context';
import { Spin } from 'antd'; // Import Ant Design Spin component

const PartnerInfo = dynamic(() => import('./partner_info/page'));
const PartnerAuthentication = dynamic(() => import('./partner_authentication/page'));
const PartnerModuleAccess = dynamic(() => import('./partner_module_access/page'));
const CustomerGroups = dynamic(() => import('./customer_groups/page'));
const PartnerUsers = dynamic(() => import('./users/page'));
const Notification = dynamic(() => import('./notification/page'));

const Partner: React.FC = () => {
    const router = useRouter(); 
    const { partner } = useAuth();

    const [loading, setLoading] = useState(false); // State to manage loading
    const [activeTab, setActiveTab] = useState('partnerInfo');
    const isExpanded = useSidebarStore((state:any) => state.isExpanded);

    // useEffect(() => {
    //     const data = {
    //         tenant_name: partner || "default_value",
    //         module_list: [
    //             "Partner info",
    //             "Partner authentication",
    //             "Partner module access",
    //             "Customer groups",
    //             "Partner users",
    //             "Notifications"
    //         ],
    //         pages: {
    //             "Customer groups": { start: 0, end: 10 },
    //             "Partner users": { start: 0, end: 10 }
    //         }
    //     };


    //     axios.post('https://zff5caoge3.execute-api.ap-south-1.amazonaws.com/dev/get_partner_info', data)
    //         .then(response => {
    //           setLoading(true);
    //             console.log('Response:', response.data);
    //         })
    //         .catch(error => {
    //             console.error('Error:', error);
    //         })
    //         .finally(() => {
    //             setLoading(false); // Set loading to false after API call completes
    //         });

    // }, [router, partner]);

    const switchToCarrierInfoTab = () => {
        setActiveTab('carrierInfo');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="">
            <div className={`bg-white shadow-md tabs ${isExpanded ? 'left-[17%]' : 'left-[112px]'}`}>
                <button 
                    className={`tab-headings ${activeTab === 'partnerInfo' ? 'active-tab-heading' : ''}`}
                    onClick={() => setActiveTab('partnerInfo')}
                >
                    Partner info
                </button>
                <button 
                    className={`tab-headings ${activeTab === 'partnerRegistration' ? 'active-tab-heading' : ''}`}
                    onClick={() => setActiveTab('partnerRegistration')}
                >
                    Partner authentication
                </button>
                <button 
                    className={`tab-headings ${activeTab === 'partnermoduleaccess' ? 'active-tab-heading' : ''}`}
                    onClick={() => setActiveTab('partnermoduleaccess')}
                >
                    Partner module access
                </button>
                <button 
                    className={`tab-headings ${activeTab === 'customergroups' ? 'active-tab-heading' : ''}`}
                    onClick={() => setActiveTab('customergroups')}
                >
                    Customer groups
                </button>
                <button 
                    className={`tab-headings ${activeTab === 'partnerusers' ? 'active-tab-heading' : ''}`}
                    onClick={() => setActiveTab('partnerusers')}
                >
                    Partner users
                </button>
                <button 
                    className={`tab-headings ${activeTab === 'notification' ? 'active-tab-heading' : ''}`}
                    onClick={() => setActiveTab('notification')}
                >
                    Notifications
                </button>
            </div>
            <div className="container pt-[70px]">
                {activeTab === 'partnerInfo' && <PartnerInfo onSubmit={switchToCarrierInfoTab} />}
                {activeTab === 'partnerRegistration' && <PartnerAuthentication onSubmit={switchToCarrierInfoTab} />}
                {activeTab === 'partnermoduleaccess' && <PartnerModuleAccess />}
                {activeTab === 'customergroups' && <CustomerGroups />}
                {activeTab === 'partnerusers' && <PartnerUsers />}
                {activeTab === 'notification' && <Notification />}
            </div>
        </div>
    );
};

export default Partner;
