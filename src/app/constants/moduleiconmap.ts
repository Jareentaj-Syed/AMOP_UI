import { ClipboardDocumentCheckIcon, WifiIcon, DevicePhoneMobileIcon, ChartBarIcon, UserGroupIcon, CogIcon, UserCircleIcon, HomeIcon,GlobeAltIcon} from '@heroicons/react/24/outline';
import {
  GlobalOutlined,
  DollarOutlined,
  WifiOutlined,
  HomeOutlined,
  SettingOutlined,
  TeamOutlined,
  PhoneOutlined,
  NodeExpandOutlined,
  Loading3QuartersOutlined,
  FilterOutlined,
} from "@ant-design/icons";

export const moduleIconMap = {
  'Sim Management': WifiOutlined,
  'Device Management': NodeExpandOutlined,
  'Dashboard': HomeOutlined,
  'Optimization': FilterOutlined,
  'People': TeamOutlined,
  'Settings': SettingOutlined,
  'LNP': PhoneOutlined,
  'Customer Charges': DollarOutlined,
  'Automation': Loading3QuartersOutlined,
  'Net Sapiens': GlobalOutlined,
  'Partner': ClipboardDocumentCheckIcon,
'Super Admin': UserCircleIcon
};

// 
 // {
  //   parent_module_name: 'Home',
  //   queue_order: 1,
  //   children: [],
  // },
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
      {
        child_module_name: 'Carrier Rate Plans/SOCs', queue_order: 4, sub_children: [
          { sub_child_module_name: 'Rate Plans/SOCs', queue_order: 5, sub_children: [] },
          { sub_child_module_name: 'Optimization Type/Groups', queue_order: 6, sub_children: [] },
          { sub_child_module_name: 'Comm Plans', queue_order: 7, sub_children: [] },
          { sub_child_module_name: 'IMEI Master Table', queue_order: 8, sub_children: [] },
        ]
      },
      { child_module_name: 'Revenue Assurance', queue_order: 4, sub_children: [] },
    ],
  },
  // {
  //   parent_module_name: 'Device Management',
  //   queue_order: 3,
  //   children: [],
  // },
  // {
  //   parent_module_name: 'Optimization',
  //   queue_order: 4,
  //   children: [],
  // },
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
  // {
  //   parent_module_name: 'Settings',
  //   queue_order: 6,
  //   children: [],
  // },
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

