import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { moduleIconMap } from '../constants/moduleiconmap';
import { moduleData } from '../constants/moduleiconmap';

// Define types for the module data
interface NavItem {
  label: string;
  icon?: React.ReactNode;
  href?: string; // Optional href
  subNav?: NavItem[];
}

type IconKey = keyof typeof moduleIconMap;

const generateNavItems = (modules: any[]): NavItem[] => {
  return modules.map((module) => {
    const { parent_module_name, children } = module;
    const IconComponent = moduleIconMap[parent_module_name as IconKey] || null;

    const subNav = children.length > 0 ? children.map((child: any) => ({
      href: `/${parent_module_name.toLowerCase().replace(/[\s/.]/g, '_')}/${child.child_module_name.toLowerCase().replace(/[\s/.]/g, '_')}`,
      label: child.child_module_name,
      subNav: child.sub_children?.map((subChild: any) => ({
        href: `/${parent_module_name.toLowerCase().replace(/[\s/.]/g, '_')}/${child.child_module_name.toLowerCase().replace(/[\s/.]/g, '_')}/${subChild.sub_child_module_name.toLowerCase().replace(/[\s/.]/g, '_')}`,
        label: subChild.sub_child_module_name,
      })),
    })) : [];

    return {
      label: parent_module_name,
      icon: IconComponent ? <IconComponent className="w-4 h-4" /> : null,
      subNav,
    };
  });
};

const SideNav: React.FC = () => {
  const currentPath = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openSubDropdown, setOpenSubDropdown] = useState<string | null>(null);
  const [navItems, setNavItems] = useState<NavItem[]>([]);

  useEffect(() => {
    setNavItems(generateNavItems(moduleData));
  }, []);

  const handleDropdownClick = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const handleSubDropdownClick = (label: string) => {
    setOpenSubDropdown(openSubDropdown === label ? null : label);
  };

  const isActive = (href?: string) => href ? currentPath.startsWith(href) : false;

  return (
    <div className='navbar p-2 shadow-lg'>
      <ul className="space-y-4 mt-4">
        {navItems.map((item) => (
          <li key={item.label}>
            {item.subNav && item.subNav.length > 0 ? ( // Check if item has subNav
              <>
                <button
                  onClick={() => handleDropdownClick(item.label)}
                  className={`flex items-center space-x-2 p-2 nav-link w-[100%] ${isActive(item.href) || openDropdown === item.label ? 'nav-active-link' : ''}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {openDropdown === item.label ? <ChevronDownIcon className="w-4 h-4 absolute " style={{ right: '20px' }} /> : <ChevronRightIcon className="w-4 h-4 absolute" style={{ right: '20px' }} />}
                </button>
                {(openDropdown === item.label || isActive(item.href)) && (
                  <ul className="pl-6 space-y-2 mt-2">
                    {item.subNav.map((subItem) => (
                      <li key={subItem.label}>
                        {subItem.subNav && subItem.subNav.length > 0 ? ( // Check if subItem has subNav
                          <>
                            <button
                              onClick={() => handleSubDropdownClick(subItem.label)}
                              className={`flex items-center space-x-2 p-2 nav-link ${isActive(subItem.href) || openSubDropdown === subItem.label ? 'nav-active-link' : ''}`}
                            >
                              <span>{subItem.label}</span>
                              {openSubDropdown === subItem.label ? <ChevronDownIcon className="w-4 h-4 absolute " style={{ right: '20px' }} /> : <ChevronRightIcon className="w-4 h-4 absolute" style={{ right: '20px' }} />}
                            </button>
                            {(openSubDropdown === subItem.label || isActive(subItem.href)) && (
                              <ul className="pl-6 space-y-2 mt-2">
                                {subItem.subNav.map((subSubItem) => (
                                  <li key={subSubItem.label}>
                                    <Link
                                      href={subSubItem.href || '/'} // Provide a fallback value
                                      className={`flex items-center space-x-2 p-2 nav-link ${currentPath === subSubItem.href ? 'nav-active-link' : ''}`}
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
                            href={subItem.href || '/'} // Provide a fallback value
                            className={`flex items-center space-x-2 p-2 nav-link ${currentPath === subItem.href ? 'nav-active-link' : ''}`}
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
                href={item.href || '/'} // Provide a fallback value
                passHref
                className={`flex items-center space-x-2 p-2 nav-link ${currentPath === item.href ? 'nav-active-link' : ''}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideNav;
