import { ClipboardDocumentCheckIcon, WifiIcon, DevicePhoneMobileIcon, ChartBarIcon, UserGroupIcon, CogIcon, UserCircleIcon } from '@heroicons/react/24/outline'; 

export const moduleIconMap = {
  'Partner': ClipboardDocumentCheckIcon,
  'SIM Management': WifiIcon,
  'Device Management': DevicePhoneMobileIcon,
  'Optimization': ChartBarIcon,
  'People': UserGroupIcon,
  'Settings': CogIcon,
  'Super Admin': UserCircleIcon
};

export const moduleData = [
    {
      parent_module_name: 'Partner',
      queue_order: 1,
      children: [],
    },
    {
      parent_module_name: 'SIM Management',
      queue_order: 2,
      children: [
        { child_module_name: 'Inventory', queue_order: 1, sub_children: [] },
        { child_module_name: 'Bulk Change', queue_order: 2, sub_children: [] },
        { child_module_name: 'SIM Order Form', queue_order: 3, sub_children: [] },
        { child_module_name: 'Revenue Assurance', queue_order: 4, sub_children: [] },
      ],
    },
    {
      parent_module_name: 'Device Management',
      queue_order: 3,
      children: [],
    },
    {
      parent_module_name: 'Optimization',
      queue_order: 4,
      children: [],
    },
    {
      parent_module_name: 'People',
      queue_order: 5,
      children: [
        { child_module_name: 'Rev.Io Customers', queue_order: 1, sub_children: [] },
        { child_module_name: 'Bandwidth Customers', queue_order: 2, sub_children: [] },
        { child_module_name: 'NetSapiens Customers', queue_order: 3, sub_children: [] },
        { child_module_name: 'E911 Customers', queue_order: 4, sub_children: [] },
      ],
    },
    {
      parent_module_name: 'Settings',
      queue_order: 6,
      children: [],
    },
    {
      parent_module_name: 'Super Admin',
      queue_order: 7,
      children: [
        { child_module_name: 'Partner Creation', queue_order: 1, sub_children: [] },
        { child_module_name: 'Partner API', queue_order: 2, sub_children: [] },
        { child_module_name: 'Partner Modules', queue_order: 3, sub_children: [] },
      ],
    },
  ];