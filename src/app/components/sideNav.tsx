// components/sideNav.tsx

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ChartBarIcon, ChevronDownIcon, ChevronRightIcon, CogIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { moduleIconMap } from '../constants/moduleiconmap';
import { useAuth } from './auth_context';
import { getHeaderTitleByPathName } from './header_constants';
import { useLogoStore } from '../stores/logoStore';
import Image from 'next/image';


interface NavItem {
  label: string;
  icon?: React.ReactNode;
  href?: string;
  subNav?: NavItem[];
}

type IconKey = keyof typeof moduleIconMap;

const generateNavItems = (modules: any[]): NavItem[] => {
  return modules.map((module) => {
    const { parent_module_name, children } = module;
    const IconComponent = moduleIconMap[parent_module_name as IconKey] || null;

    const subNav = children.length > 0
      ? children.map((child: any) => ({
          href: `/${parent_module_name.toLowerCase().replace(/[\s/.]/g, '_')}/${child.child_module_name.toLowerCase().replace(/[\s/.]/g, '_')}`,
          label: child.child_module_name,
          subNav: child.sub_children?.map((subChild: any) => ({
            href: `/${parent_module_name.toLowerCase().replace(/[\s/.]/g, '_')}/${child.child_module_name.toLowerCase().replace(/[\s/.]/g, '_')}/${subChild.sub_child_module_name.toLowerCase().replace(/[\s/.]/g, '_')}`,
            label: subChild.sub_child_module_name,
          })),
        }))
      : [];

    const href = children.length === 0 ? `/${parent_module_name.toLowerCase().replace(/[\s/.]/g, '_')}` : undefined;

    return {
      label: parent_module_name,
      icon: IconComponent ? <IconComponent className="w-4 h-4" /> : null,
      href,
      subNav,
    };
  });
};

const SideNav: React.FC = () => {
  const currentPath = usePathname();
  const { modules } = useAuth(); // Access modules from context
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const setTitle = useLogoStore((state) => state.setTitle);
 
  const { logoUrl } = useLogoStore();

  useEffect(() => {
    setNavItems(generateNavItems(modules));
    const title = getHeaderTitleByPathName(currentPath);
    // setTitle(title);
  }, [modules, currentPath, setTitle]);

  const handleDropdownClick = (label: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
    // setTitle(label)
  };

  const isActive = (href?: string) => (href ? currentPath.startsWith(href) : false);
const getTitle =(title:string)=>{
  setTitle(title)
}
  return (
    <div className="navbar p-2 shadow-lg">
       <div className="flex items-center space-x-2">
        {logoUrl ? (
          <img src={logoUrl} alt="Uploaded Logo" width={150} height={40} className="logo" />
        ) : (
          <Image src="/amop-core.png" alt="AMOP Core Logo" width={150} height={40} className="logo" />
        )}
      </div >
      <ul className="space-y-4 mt-4">
        {navItems.map((item) => (
          <li key={item.label}>
            {item.subNav && item.subNav.length > 0 ? (
              <>
                <button
                  onClick={() => handleDropdownClick(item.label)}
                  className={`flex items-center space-x-2 p-2 nav-link w-[100%] ${
                    isActive(item.href) || openDropdowns[item.label] ? 'nav-active-link' : ''
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {openDropdowns[item.label] ? (
                    <ChevronDownIcon className="w-4 h-4 absolute" style={{ right: '20px' }} />
                  ) : (
                    <ChevronRightIcon className="w-4 h-4 absolute" style={{ right: '20px' }} />
                  )}
                </button>
                {(openDropdowns[item.label] || isActive(item.href)) && (
                  <ul className="pl-6 space-y-2 mt-2">
                    {item.subNav.map((subItem) => (
                      <li key={subItem.label}>
                        {subItem.subNav && subItem.subNav.length > 0 ? (
                          <>
                            <button
                              onClick={() => handleDropdownClick(subItem.label)}
                              className={`flex items-center space-x-2 p-2 nav-link w-[100%] ${
                                isActive(subItem.href) || openDropdowns[subItem.label] ? 'nav-active-link' : ''
                              }`}
                            >
                              <span>{subItem.label}</span>
                              {openDropdowns[subItem.label] ? (
                                <ChevronDownIcon className="w-4 h-4 absolute" style={{ right: '20px' }} />
                              ) : (
                                <ChevronRightIcon className="w-4 h-4 absolute" style={{ right: '20px' }} />
                              )}
                            </button>
                            {(openDropdowns[subItem.label] || isActive(subItem.href)) && (
                              <ul className="pl-6 space-y-2 mt-2">
                                {subItem.subNav.map((subSubItem) => (
                                  <li key={subSubItem.label}>
                                    <Link
                                      href={subSubItem.href || '/'}
                                      className={`flex items-center space-x-2 p-2 nav-link ${
                                        currentPath === subSubItem.href ? 'nav-active-link' : ''
                                      }`}
                  onClick={() => getTitle(item.label)}

                                    >
                                      <span>{subSubItem.label}</span>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </>
                        ) : (
                          <Link
                            href={subItem.href || '/'}
                            className={`flex items-center space-x-2 p-2 nav-link ${
                              isActive(subItem.href) ? 'nav-active-link' : ''
                            }`}
                  onClick={() => getTitle(item.label)}

                          >
                            <span>{subItem.label}</span>
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <Link
                href={item.href || '/'}
                passHref
                className={`flex items-center space-x-2 p-2 nav-link ${isActive(item.href) ? 'nav-active-link' : ''}`} 
                onClick={() => getTitle(item.label)}
                >
                {item.icon}
                
                <span>{item.label}</span>
              </Link>
            )}
          </li>
        ))}
        {/* <li>
          <Link
            target="_blank"
            href="https://sandbox-device.amop.services/en/device-management/dashboard"
            className="flex items-center space-x-2 p-2 nav-link w-[100%]"
          >
            <DevicePhoneMobileIcon className="w-4 h-4" />
            <span>Device Management</span>
          </Link>
        </li>
        <li>
          <Link
            target="_blank"
            href="https://sandbox.amop.services/Optimization/OptimizationGroup"
            className="flex items-center space-x-2 p-2 nav-link w-[100%]"
          >
            <ChartBarIcon className="w-4 h-4" />
            <span>Optimization</span>
          </Link>
        </li>
        <li>
          <Link
            target="_blank"
            href="https://sandbox.amop.services/Settings/ServiceProviderTenantConfiguration"
            className="flex items-center space-x-2 p-2 nav-link w-[100%]"
          >
            <CogIcon className="w-4 h-4" />
            <span>Settings</span>
          </Link>
        </li> */}
      </ul>
    </div>
  );
};

export default SideNav;
