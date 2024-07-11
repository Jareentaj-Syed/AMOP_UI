// src/data/partnerCarrierData.ts

export const partnerCarrierData: Record<string, string[]>={
    Altaworx: [
      "AT&T - Cisco Jasper",
      "AT&T - POD19",
      "AT&T - Telegence",
      "POND Mobile",
      "Teal",
      "Verizon - HDP",
      "Verizon - ThingSpace IoT",
      "Verizon - ThingSpace PN"
    ],
    "Go Tech": [
      "AT&T - Cisco Jasper",
      "AT&T - POD1"
    ],
    "Go Tech Mobility": [
      "AT&T - Telegence"
    ],
    Titanium: [
      "AT&T - Telegence"
    ],
    "Live U": [
      "AT&T - Cisco Jasper",
      "T-Mobile Jasper"
    ],
    Spectrotcl: [
      "AT&T - Telegence",
      "Verizon - ThingSpace"
    ],
    Vast: [
      "POND Mobile",
      "Teal",
      "T-Mobile Jasper"
    ],
    Dynalink: [
      "AT&T - Telegence",
      "Verizon - ThingSpace 4G",
      "Verizon - ThingSpace 5G"
    ],
    For2Fi: [
      "AT&T - Telegence",
      "Verizon - ThingSpace IoT",
      "Verizon - ThingSpace PN"
    ],
    "Fuse Cloud": [
      "AT&T - Telegence"
    ]
  };
  
  export const subPartnersData: Record<string, string[]> = {
    Altaworx: [
      "Atlantech - AWX",
      "Castle Point - AWX",
      "CSV - AWX",
      "Eight Five Orange - AWX",
      "Frontier US",
      "GoTech - AWX",
      "Local IT - AWX",
      "Peace Communications-AWX",
      "Titanium - AWX"
    ]
  };

  export const serviceProviders: string[] = [
    "AT&T - Cisco Jasper",
    "AT&T - POD19",
    "AT&T - Telegence",
    "POND Mobile",
    "Teal",
    "Verizon - HDP",
    "Verizon - ThingSpace IoT",
    "Verizon - ThingSpace PN"
  ];

  export const Customeroptions = [
    { value: 'ABB', label: 'ABB' },
    { value: 'AMOP Demo', label: 'AMOP Demo' },
    { value: 'Atlantic Broadband', label: 'Atlantic Broadband' },
    { value: 'Brazos Test', label: 'Brazos Test' },
    { value: "Charles' Customer Group", label: "Charles' Customer Group" },
    { value: 'CS Vizion', label: 'CS Vizion' },
    { value: 'CS Vizion NS Test', label: 'CS Vizion NS Test' },
    { value: 'CS Vizion Test', label: 'CS Vizion Test' },
    { value: 'Nexus ITG', label: 'Nexus ITG' },
    { value: 'Notification Test Group 2', label: 'Notification Test Group 2' },
    { value: 'Notification Test Group 3', label: 'Notification Test Group 3' },
    { value: 'Notification TestCustomer', label: 'Notification TestCustomer' },
    { value: 'Revio Demo Group', label: 'Revio Demo Group' },
    { value: 'Titanium Wireless', label: 'Titanium Wireless' },
    { value: 'Tricom Technology Solutions', label: 'Tricom Technology Solutions' },
    { value: 'Your Company Name', label: 'Your Company Name' },
    { value: '#HDTEST', label: '#HDTEST' },
    { value: '#HDTEST2', label: '#HDTEST2' },
    { value: 'AWX Test Group', label: 'AWX Test Group' },
    { value: 'DJ - Test Auto', label: 'DJ - Test Auto' },
    { value: 'DJ Test', label: 'DJ Test' },
    { value: 'DJ Test 2 Auto Add', label: 'DJ Test 2 Auto Add' },
    { value: 'group-port-921', label: 'group-port-921' },
    { value: 'MobileManagerTest', label: 'MobileManagerTest' },
    { value: 'NOTR Test', label: 'NOTR Test' },
    { value: 'Reseller Activation Testing', label: 'Reseller Activation Testing' },
    { value: 'Test 070923', label: 'Test 070923' },
    { value: 'Test 731', label: 'Test 731' },
    { value: 'Test Group Athse', label: 'Test Group Athse' },
  ];
  export const CustomerGroup2Options = [
    { value: 'Alabama Benefit Counselors (300008621) - Rev.IO', label: 'Alabama Benefit Counselors (300008621) - Rev.IO' },
    { value: 'Endeavors - SSVF-ETX (300008191) - Rev.IO', label: 'Endeavors - SSVF-ETX (300008191) - Rev.IO' },
    { value: 'Industrial Cooling Tower (300006938) - Rev.IO', label: 'Industrial Cooling Tower (300006938) - Rev.IO' },
    { value: 'Johnny\'s Propeller Shop (300007037) - Rev.IO', label: 'Johnny\'s Propeller Shop (300007037) - Rev.IO' },
    { value: 'Pinnacle Security - Intelecom (300008640) - Rev.IO', label: 'Pinnacle Security - Intelecom (300008640) - Rev.IO' },
    { value: 'Southern View Media (300008156) - Rev.IO', label: 'Southern View Media (300008156) - Rev.IO' },
    { value: 'Barton Law Firm (300007910) - Rev.IO', label: 'Barton Law Firm (300007910) - Rev.IO' },
    { value: 'Baton Rouge Vascular Specialty Clinic (300006959) - Rev.IO', label: 'Baton Rouge Vascular Specialty Clinic (300006959) - Rev.IO' },
    { value: 'Baybreeze Guest House (300005533) - Rev.IO', label: 'Baybreeze Guest House (300005533) - Rev.IO' },
    { value: 'Bayou Cane Fire Protection District (300006579) - Rev.IO', label: 'Bayou Cane Fire Protection District (300006579) - Rev.IO' },
    { value: 'Bayside Properties (300005907) - Rev.IO', label: 'Bayside Properties (300005907) - Rev.IO' },
    { value: 'Bayside Regenerative Medicine (300008225) - Rev.IO', label: 'Bayside Regenerative Medicine (300008225) - Rev.IO' }
];

  

  interface ExcelData {
    [key: string]: {
        Module: string[];
        Feature: {
            [key: string]: string[];
        };
    };
}

