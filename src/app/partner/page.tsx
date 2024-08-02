"use client";
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useSidebarStore } from '../stores/navBarStore';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '../components/auth_context';
import { Modal, Spin } from 'antd'; // Import Ant Design Spin component
import { usePartnerStore, PartnerData } from './partnerStore';
import { useLogoStore } from '../stores/logoStore';

const PartnerInfo = dynamic(() => import('./partner_info/page'));
const PartnerAuthentication = dynamic(() => import('./partner_authentication/page'));
const PartnerModuleAccess = dynamic(() => import('./partner_module_access/page'));
const CustomerGroups = dynamic(() => import('./customer_groups/page'));
const PartnerUsers = dynamic(() => import('./users/page'));
const Notification = dynamic(() => import('./notification/page'));


const Partner: React.FC = () => {
    const router = useRouter();
    const { username, partner, role } = useAuth();
    const [loading, setLoading] = useState(true); // State to manage loading
    const [activeTab, setActiveTab] = useState('partnerInfo');
    const [partnerInfoLoaded, setPartnerInfoLoaded] = useState(false);
    const [partnerAuthenticationLoaded, setPartnerAuthenticationLoaded] = useState(false);
    const [partnerModuleAccessLoaded, setPartnerModuleAccessLoaded] = useState(false);
    const [customerGroupsLoaded, setCustomerGroupsLoaded] = useState(false);
    const [partnerUsersLoaded, setPartnerUsersLoaded] = useState(false);
    const [notificationsLoaded, setNotificationsLoaded] = useState(false);
    const title = useLogoStore((state) => state.title);


    const isExpanded = useSidebarStore((state: any) => state.isExpanded);
    const setPartnerInfo = usePartnerStore((state) => state.setPartnerInfo);
    const setPartnerAuthentication = usePartnerStore((state) => state.setPartnerAuthentication);
    const setPartnerModuleAccess = usePartnerStore((state) => state.setPartnerModuleAccess);
    const setCustomerGroups = usePartnerStore((state) => state.setCustomerGroups);
    const setPartnerUsers = usePartnerStore((state) => state.setPartnerUsers);
    const setNotifications = usePartnerStore((state) => state.setNotifications);
    useEffect(() => {
        if (title != "Partner") {
            setLoading(true)
        }
    }, [title])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tabs = [
                    { module: "Partner info", setter: setPartnerInfo, setLoaded: setPartnerInfoLoaded },
                    { module: "Partner authentication", setter: setPartnerAuthentication, setLoaded: setPartnerAuthenticationLoaded },
                    { module: "Partner module access", setter: setPartnerModuleAccess, setLoaded: setPartnerModuleAccessLoaded },
                    { module: "Customer groups", setter: setCustomerGroups, setLoaded: setCustomerGroupsLoaded },
                    { module: "Partner users", setter: setPartnerUsers, setLoaded: setPartnerUsersLoaded },
                    { module: "Notifications", setter: setNotifications, setLoaded: setNotificationsLoaded }
                ];

                const promises = tabs.map(async (tab) => {
                    const data = {
                        tenant_name: partner || "default_value",
                        username: username,
                        path: "/get_partner_info",
                        role_name: role,
                        modules_list: [tab.module],
                        pages: {
                            "Customer groups": { start: 0, end: 500 },
                            "Partner users": { start: 0, end: 500 }
                        }
                    };

                    try {
                        const response = await axios.post('https://v1djztyfcg.execute-api.us-east-1.amazonaws.com/dev/module_management', { data });
                        if (response &&response.status&&response.status===200) {
                            console.log(response.status)
                            const parseddata = JSON.parse(response.data.body)
                            if(parseddata.flag){
                                tab.setter(parseddata);
                                tab.setLoaded(true);
                            }
                            else{
                                console.log("false")
                            // Modal.error({
                            //     title: 'Login Error',
                            //     content: 'An error occurred during fetching data.',
                            //     centered: true,
                            // });
                            }
                            console.log("tab.module",parseddata)
                           
                        }
                        else {
                            console.log("false")
                            Modal.error({
                                title: 'Login Error',
                                content: 'An error occurred during fetching data.',
                                centered: true,
                            });
                        }

                    } catch (error) {
                        console.error('Error fetching', tab.module, ':', error);
                    }
                });

                await Promise.all(promises); // Wait until all requests are complete
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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
