
export const pathNameWithHeaderTitle = [
    {
        pathname: "/partner",
        title: "Partner",
    },
    {
        pathname: "/people/bandwidth_customers",
        title: "Bandwidth Customers",
    },
    {
      pathname: "people/e911_customers",
      title: "E911 Customers",
    },
    {
        pathname: "people/net_sapiens_customers",
        title: "Net Sapiens Customers",
      },
      {
        pathname: "people/rev_io_customers",
        title: "REV IO Customers",
      },
      {
        pathname: "/super_admin/partner_api",
        title: "Partner Api",
      },
      {
        pathname: "/super_admin/partner_creation",
        title: "Partner Api",
      },
      {
        pathname: "/super_admin/partner_modules",
        title: "Partner Api",
      },
    {
      pathname: "/en/device-management/inventory",
      title: "Device Management Inventory",
    },
    {
      pathname: "/en/device-management/provisioning",
      title: "Device Provisioning Logs",
    },
    {
      pathname: "/error/forbidden",
      title: "Error 403",
    },
    {
      pathname: "/error/error",
      title: "Error Generic",
    },
    {
      pathname: "/en/sim-management/inventory",
      title: "SIM Management Inventory",
    },
    {
      pathname: "/en/sim-management/bulk-change",
      title: "Bulk Change",
    },
    {
      pathname: "/en/sim-management/sim-order-form",
      title: "SIM Order Form",
    },
    {
      pathname: "/en/sim-management/carrier-rate-plans/rate-plans-socs",
      title: "Rate Plans/SOCs",
    },
    {
      pathname: "/en/sim-management/carrier-rate-plans/optimization-type-groups",
      title: "Optimization Type/Groups",
    },
    {
      pathname: "/en/sim-management/carrier-rate-plans/comm-plans",
      title: "Comm Plans",
    },
    {
      pathname: "/en/sim-management/carrier-rate-plans/imei-master-table",
      title: "IMEI Master Table",
    },
    {
      pathname: "/en/sim-management/revenue-assurance",
      title: "Revenue Assurance",
    },
    {
      pathname: "/en/sim-management/reports/zero-usage-report",
      title: "Zero Usage Report",
    },
    {
      pathname: "/en/sim-management/reports/newly-activated-report",
      title: "Newly Activated Report",
    },
    {
      pathname: "/en/sim-management/reports/status-history-report",
      title: "Status History Report",
    },
    {
      pathname: "/en/sim-management/reports/pool-group-summary-report",
      title: "Pool Group Summary Report",
    },
    {
      pathname: "/en/sim-management/reports/customer-rate-pool-usage-report",
      title: "Customer Rate Pool Usage Report",
    },
  ];
  
  export const getHeaderTitleByPathName = (pathname: string) => {
    return (
      pathNameWithHeaderTitle.find((item) => item.pathname === pathname)?.title ??
      ""
    );
  };