"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import { HomeIcon, DevicePhoneMobileIcon, ChartBarIcon, DocumentTextIcon, WifiIcon, CurrencyDollarIcon, PhoneIcon, GlobeAltIcon, BriefcaseIcon, UserGroupIcon, CogIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';

const SideNav: React.FC = () => {
  const currentPath = usePathname();

  const navItems = [
    { href: '/', label: 'Users', icon: <HomeIcon className="w-4 h-4" /> },
    { href: '/partner-onboarding-form', label: 'Partner Onboarding form', icon: <WifiIcon className="w-4 h-4" /> },
    // { href: '/device-management', label: 'Device Management', icon: <DevicePhoneMobileIcon className="w-4 h-4" /> },
    // { href: '/optimization', label: 'Optimization', icon: <ChartBarIcon className="w-4 h-4" /> },
    // { href: '/reports', label: 'Reports', icon: <DocumentTextIcon className="w-4 h-4" /> },
    // { href: '/customer-charges', label: 'Customer Charges', icon: <CurrencyDollarIcon className="w-4 h-4" /> },
    // { href: '/net-sapiens', label: 'Net Sapiens', icon: <GlobeAltIcon className="w-4 h-4" /> },
    // { href: '/alerts', label: 'LNP', icon: <PhoneIcon className="w-4 h-4" /> },
    // { href: '/automation', label: 'Automation', icon: <BriefcaseIcon className="w-4 h-4" /> },
    // { href: '/people', label: 'People', icon: <UserGroupIcon className="w-4 h-4" /> },
    // { href: '/settings', label: 'Settings', icon: <CogIcon className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed top-0 left-0 w-64 h-screen p-4 flex flex-col z-99 navbar">
      <div className="mb-6">
        <Image src="/amop-core.png" alt="AMOP Core Logo" width={150} height={50} className="object-contain" />
      </div>
      <ul className="space-y-4">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`flex items-center space-x-2 p-2 rounded-md nav-link ${
                currentPath === item.href || (item.href === '/' && (currentPath === '/' || currentPath === '/createUser'))
                  ? 'nav-active-link'
                  : ''
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideNav;
