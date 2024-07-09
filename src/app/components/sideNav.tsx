// components/SideNav.tsx

"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import { HomeIcon, WifiIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useSidebarStore } from '../stores/navBarStore';

const SideNav: React.FC = () => {
  const currentPath = usePathname();
  const { isExpanded } = useSidebarStore();

  const navItems = [
    { href: '/', label: 'Users', icon: <HomeIcon className="w-6 h-6" /> },
    { href: '/partner-onboarding-form', label: 'Partner Onboarding form', icon: <WifiIcon className="w-6 h-6" /> },
  ];

  return (
    <div className='navbar p-4 '>
      {isExpanded ? (
        <div className=''>
         <ul className="space-y-4">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`flex items-center space-x-2 pt-2 pb-2 pl-2 rounded-md nav-link ${
                currentPath === item.href || (item.href === '/' && (currentPath === '/' || currentPath === '/users/createUser'))
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
      ) : (
        <div className='w-[80px]'>
        <ul className="space-y-4">
          {navItems.map((item) => (
            <li key={item.href}>
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
            </li>
          ))}
        </ul>
        </div>
      )}
    </div>
  );
};

export default SideNav;
