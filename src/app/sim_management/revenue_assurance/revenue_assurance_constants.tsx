interface Item {
    title: string;
    total_devices: number;
    charged_devices: number;
    service_products: {
      active: number;
      total: number;
    };
    url: string;
  }
export const RevenueAssuranceList: Item[] = [
    {
      title: 'Unassigned',
      total_devices: 13082,
      charged_devices: 0,
      service_products: {
        active: 0,
        total: 13082,
      },
      url: '/unassigned.xlsx',
    },
    {
      title: 'Alabama Benefit Counselors (300008621)',
      total_devices: 8,
      charged_devices: 8,
      service_products: {
        active: 7,
        total: 7,
      },
      url: '/alabama_benefit_counselors.xlsx',
    },
    {
      title: 'Endeavors - SSVF-ETX (300008191)',
      total_devices: 6,
      charged_devices: 3,
      service_products: {
        active: 1,
        total: 1,
      },
      url: '/alabama_benefit_counselors.xlsx',
    },
    {
      title: "Johnny's Propeller Shop (300007037)",
      total_devices: 1,
      charged_devices: 1,
      service_products: {
        active: 1,
        total: 1,
      },
      url: '/alabama_benefit_counselors.xlsx',
    },
  ];
  