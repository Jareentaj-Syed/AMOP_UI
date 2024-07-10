"use client";
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { HomeIcon, WifiIcon, DevicePhoneMobileIcon, ChartBarIcon, DocumentTextIcon, CurrencyDollarIcon, GlobeAltIcon, PhoneIcon, BriefcaseIcon, UserGroupIcon, CogIcon, ClipboardDocumentCheckIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useSidebarStore } from '../stores/navBarStore';

const SideNav: React.FC = () => {
  console.log("navbar")
  const currentPath = usePathname();
  const { isExpanded } = useSidebarStore();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const navItems = [
    { href: '/', label: 'Users', icon: <HomeIcon className="w-4 h-4" /> },
    { href: '/partner-onboarding-form', label: 'Partner Onboarding form', icon: <ClipboardDocumentCheckIcon className="w-4 h-4" /> },
    { 
      label: 'SIM Management', 
      icon: <WifiIcon className="w-4 h-4" />,
      subNav: [
        { href: '/sim-management/inventory', label: 'Inventory' },
        { href: '/sim-management/bulk-change', label: 'Bulk Change' },
        { href: '/sim-management/sim-order-form', label: 'SIM Order Form' },
        { href: '/sim-management/revenue-assurance', label: 'Revenue Assurance' },
        

      ]
    },
    { href: '/device-management', label: 'Device Management', icon: <DevicePhoneMobileIcon className="w-4 h-4" /> },
    { href: '/optimization', label: 'Optimization', icon: <ChartBarIcon className="w-4 h-4" /> },
    { 
      label: 'People', 
      icon: <UserGroupIcon className="w-4 h-4" />,
      subNav: [
        { href: '/people/rev_io_customers', label: 'Rev.Io Customers' },
        { href: '/people/bandwidth_customers', label: 'Bandwidth Customers' },
        { href: '/people/netsapiens_customers', label: 'NetSapiens Customers' },
        { href: '/people/e911_customers', label: 'E911 Customers' },
        { href: '/people/customer_groups', label: 'Customer Groups' },
        { href: '/people/users', label: 'Users' },
      ]
    },
    { href: '/settings', label: 'Settings', icon: <CogIcon className="w-4 h-4" /> },
  ];

  const handleDropdownClick = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <div className='navbar p-2 shadow-lg'>
      {isExpanded ? (
        <div>
          <ul className="space-y-4">
            {navItems.map((item) => (
              <li key={item.href || item.label}>
                {item.subNav ? (
                  <>
                    <button
                      onClick={() => handleDropdownClick(item.label)}
                      className={`flex items-center space-x-2 p-2 nav-link w-[100%] ${
                        currentPath.startsWith(item.subNav[0].href.split('/')[1]) || openDropdown === item.label ? 'nav-active-link' : ''
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                      {openDropdown === item.label ? <ChevronDownIcon className="w-4 h-4 absolute "style={{ right: '20px' }}  /> : <ChevronRightIcon className="w-4 h-4 absolute"style={{ right: '20px' }}  />}
                    </button>
                    {(openDropdown === item.label || currentPath.startsWith(item.subNav[0].href.split('/')[1])) && (
                      <ul className="pl-6 space-y-2 mt-2">
                        {item.subNav.map((subItem) => (
                          <li key={subItem.href}>
                            <Link
                              href={subItem.href}
                              className={`flex items-center space-x-2 p-2 nav-link ${
                                currentPath === subItem.href ? 'nav-active-link' : ''
                              }`}
                            >
                              <span>{subItem.label}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-2 p-2 nav-link ${
                      currentPath === item.href || (item.href === '/' && (currentPath === '/' || currentPath === '/users/createUser'))
                        ? 'nav-active-link'
                        : ''
                    }`}
                    onClick={() => handleDropdownClick(item.label)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className='w-[80px]'>
          <ul className="space-y-4">
            {navItems.map((item) => (
              <li key={item.href || item.label}>
                {item.subNav ? (
                  <>
                    <button
                      onClick={() => handleDropdownClick(item.label)}
                      className={`flex items-center justify-center pt-2 pb-2 rounded-md nav-link ${
                        currentPath.startsWith(item.subNav[0].href.split('/')[1]) || openDropdown === item.label ? 'nav-active-link' : ''
                      }`}
                    >
                      {item.icon}
                      {openDropdown === item.label ? <ChevronDownIcon className="w-4 h-4" /> : <ChevronRightIcon className="w-4 h-4" />}
                    </button>
                    {(openDropdown === item.label || currentPath.startsWith(item.subNav[0].href.split('/')[1])) && (
                      <ul className="pl-4 space-y-2">
                        {item.subNav.map((subItem) => (
                          <li key={subItem.href}>
                            <Link
                              href={subItem.href}
                              className={`flex items-center justify-center pt-2 pb-2 rounded-md nav-link ${
                                currentPath === subItem.href ? 'nav-active-link' : ''
                              }`}
                            >
                              <span>{subItem.label}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center justify-center pt-2 pb-2 rounded-md nav-link ${
                      currentPath === item.href || (item.href === '/' && (currentPath === '/' || currentPath === '/users/createUser'))
                        ? 'nav-active-link'
                        : ''
                    }`}
                  >
                    {item.icon}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SideNav;
