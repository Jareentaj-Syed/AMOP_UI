import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useSidebarStore } from '../stores/navBarStore';
import { moduleIconMap } from '../constants/moduleiconmap';
import { moduleData } from '../constants/moduleiconmap';

// Define the type for moduleIconMap
type IconKey = keyof typeof moduleIconMap;

// Utility function to generate nav items
const generateNavItems = (modules: any[]) => {
  return modules.map((module) => {
    const { parent_module_name, children } = module;
    const IconComponent = moduleIconMap[parent_module_name as IconKey];
    const subNav = children.length > 0 ? children.map((child: any) => ({
      href: `/${parent_module_name.toLowerCase().replace(/[\s.]/g, '_')}/${child.child_module_name.toLowerCase().replace(/[\s.]/g, '_')}`,
      label: child.child_module_name,
      subNav: child.sub_children?.map((subChild: any) => ({
        href: `/${parent_module_name.toLowerCase().replace(/[\s.]/g, '_')}/${child.child_module_name.toLowerCase().replace(/[\s.]/g, '_')}/${subChild.sub_child_module_name.toLowerCase().replace(/[\s.]/g, '_')}`,
        label: subChild.sub_child_module_name,
      })),
    })) : null;

    return {
      label: parent_module_name,
      icon: IconComponent ? <IconComponent className="w-4 h-4" /> : null,
      subNav,
    };
  });
};

const SideNav: React.FC = () => {
  const currentPath = usePathname();
  const { isExpanded } = useSidebarStore();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [navItems, setNavItems] = useState<any[]>([]);

  useEffect(() => {
    setNavItems(generateNavItems(moduleData));
  }, []);

  const handleDropdownClick = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <div className='navbar p-2 shadow-lg'>
      {isExpanded ? (
        <div>
          <ul className="space-y-4 mt-4">
            {navItems.map((item) => (
              <li key={item.label}>
                {item.subNav !== null ? (
                  <>
                    <button
                      onClick={() => handleDropdownClick(item.label)}
                      className={`flex items-center space-x-2 p-2 nav-link w-[100%] ${currentPath.startsWith(item.label.toLowerCase().replace(/[\s.]/g, '_')) || openDropdown === item.label ? 'nav-active-link' : ''
                        }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                      {openDropdown === item.label ? <ChevronDownIcon className="w-4 h-4 absolute " style={{ right: '20px' }} /> : <ChevronRightIcon className="w-4 h-4 absolute" style={{ right: '20px' }} />}
                    </button>
                    {(openDropdown === item.label || currentPath.startsWith(item.label.toLowerCase().replace(/[\s.]/g, '_'))) && (
                      <ul className="pl-6 space-y-2 mt-2">
                        {item.subNav.map((subItem: any) => (
                          <li key={subItem.href}>
                            <Link href={subItem.href} className={`flex items-center space-x-2 p-2 nav-link ${currentPath === subItem.href ? 'nav-active-link' : ''
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
                    href={`/${item.label.toLowerCase().replace(/[\s.]/g, '_')}`}
                    passHref
                    className={`flex items-center space-x-2 p-2 nav-link ${currentPath === `/${item.label.toLowerCase().replace(/[\s.]/g, '_')}`
                      ? 'nav-active-link'
                      : ''
                      }`}
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
              <li key={item.label}>
                {item.subNav !== null ? (
                  <>
                    <button
                      onClick={() => handleDropdownClick(item.label)}
                      className={`flex items-center justify-center pt-2 pb-2 rounded-md nav-link ${currentPath.startsWith(item.label.toLowerCase().replace(/[\s.]/g, '_')) || openDropdown === item.label ? 'nav-active-link' : ''
                        }`}
                    >
                      {item.icon}
                      {openDropdown === item.label ? <ChevronDownIcon className="w-4 h-4" /> : <ChevronRightIcon className="w-4 h-4" />}
                    </button>
                    {(openDropdown === item.label || currentPath.startsWith(item.label.toLowerCase().replace(/[\s.]/g, '_'))) && (
                      <ul className="pl-4 space-y-2">
                        {item.subNav.map((subItem: any) => (
                          <li key={subItem.href}>
                            <Link href={subItem.href} className={`flex items-center justify-center pt-2 pb-2 rounded-md nav-link ${currentPath === subItem.href ? 'nav-active-link' : ''
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
                    href={`/${item.label.toLowerCase().replace(/[\s.]/g, '_')}`}
                    passHref
                    className={`flex items-center justify-center pt-2 pb-2 rounded-md nav-link ${currentPath === `/${item.label.toLowerCase().replace(/[\s.]/g, '_')}`
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
