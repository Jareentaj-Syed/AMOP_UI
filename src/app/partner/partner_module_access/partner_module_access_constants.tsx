import { usePartnerStore } from "../partnerStore";
export const getPartnerData = () => {
  const { partnerData } = usePartnerStore.getState();
  return partnerData;
};
const partnerData = getPartnerData();

export const partnerModuleData=partnerData["Partner module access"]

type Feature = {
    [module: string]: string[];
  };
  
  type ModuleData = {
    Module: string[];
    Feature: Feature;
  };
  
  type CategoryData = {
    [category: string]: ModuleData;
  };
  
  type Data = {
    [role: string]: CategoryData;
  };
export const mockRoleData : Data= {
    "Agent": {
      "Sim Management": {
        "Module": ["Inventory"],
        "Feature": {
          "Inventory": ["Update Customer Rate Plan", "Export inventory"]
        }
      },
      "Optimization": {
        "Module": ["Optimization"],
        "Feature": {
          "Optimization": ["Optimize"]
        }
      },
      "Customer Charges": {
        "Module": ["Customer Charges"],
        "Feature": {
          "Customer Charges": ["Export"]
        }
      },
      "NetSapiens": {
        "Module": ["Inventory List"],
        "Feature": {
          "Inventory List": ["Export"]
        }
      },
      "LNP": {
        "Module": ["Phone Numbers"],
        "Feature": {
          "Phone Numbers": ["Export"]
        }
      },
      "Automation": {
        "Module": ["Automation rule"],
        "Feature": {
          "Automation rule": ["Export"]
        }
      },
      "People": {
        "Module": ["Rev.IO Customers"],
        "Feature": {
          "Rev.IO Customers": ["Export"]
        }
      },
      "Settings": {
        "Module": ["Provider Charge Mapping"],
        "Feature": {
          "Provider Charge Mapping": ["Charge Mapping"]
        }
      }
    },
    "Agent Partner Admin": {
      "Sim Management": {
        "Module": ["Bulk Change", "SIM Order Form"],
        "Feature": {
          "Bulk Change": ["Activate New Service (POD, Jasper and VZN)", "Change Carrier Rate Plan"],
          "SIM Order Form": ["SIM Order Form"]
        }
      },
      "Optimization": {
        "Module": ["Optimization"],
        "Feature": {
          "Optimization": ["Optimize", "Export"]
        }
      },
      "Customer Charges": {
        "Module": ["Customer Charges"],
        "Feature": {
          "Customer Charges": ["Export"]
        }
      },
      "NetSapiens": {
        "Module": ["NetSapiens Rev Assurance"],
        "Feature": {
          "NetSapiens Rev Assurance": ["Export", "Ignore"]
        }
      },
      "LNP": {
        "Module": ["Number Orders"],
        "Feature": {
          "Number Orders": ["Order Phone Number", "Edit"]
        }
      },
      "Automation": {
        "Module": ["Notifications"],
        "Feature": {
          "Notifications": ["Add M2M Device Notifications"]
        }
      },
      "People": {
        "Module": ["Customer Groups"],
        "Feature": {
          "Customer Groups": ["Add Customer Groups"]
        }
      },
      "Settings": {
        "Module": ["Roles"],
        "Feature": {
          "Roles": ["Add roles"]
        }
      }
    },
    "Notification Only User": {
      "Sim Management": {
        "Module": ["Reports"],
        "Feature": {
          "Reports": ["Zero Usage Report"]
        }
      },
      "Optimization": {
        "Module": ["Optimization"],
        "Feature": {
          "Optimization": ["Export"]
        }
      },
      "Customer Charges": {
        "Module": ["Customer Charges"],
        "Feature": {
          "Customer Charges": ["Export"]
        }
      },
      "NetSapiens": {
        "Module": ["Rev.IO Product Links"],
        "Feature": {
          "Rev.IO Product Links": ["Export"]
        }
      },
      "LNP": {
        "Module": ["Phone Numbers"],
        "Feature": {
          "Phone Numbers": ["Export"]
        }
      },
      "Automation": {
        "Module": ["Notifications"],
        "Feature": {
          "Notifications": ["Add Mobility Device Notifications"]
        }
      },
      "People": {
        "Module": ["Users"],
        "Feature": {
          "Users": ["Impersonate"]
        }
      },
      "Settings": {
        "Module": ["Application Settings"],
        "Feature": {
          "Application Settings": ["Edit"]
        }
      }
    },
    "Partner Admin": {
      "Sim Management": {
        "Module": ["Carrier Rate Plans"],
        "Feature": {
          "Carrier Rate Plans": ["Edit", "Export"]
        }
      },
      "Optimization": {
        "Module": ["Optimization"],
        "Feature": {
          "Optimization": ["Optimize"]
        }
      },
      "Customer Charges": {
        "Module": ["Customer Charges"],
        "Feature": {
          "Customer Charges": ["Export"]
        }
      },
      "NetSapiens": {
        "Module": ["Rev.IO Product Links"],
        "Feature": {
          "Rev.IO Product Links": ["Edit", "Delete"]
        }
      },
      "LNP": {
        "Module": ["Revenue Assurance"],
        "Feature": {
          "Revenue Assurance": ["Export"]
        }
      },
      "Automation": {
        "Module": ["Automation rule"],
        "Feature": {
          "Automation rule": ["Delete"]
        }
      },
      "People": {
        "Module": ["E911 Customers"],
        "Feature": {
          "E911 Customers": ["Create E911 Customer", "Edit"]
        }
      },
      "Settings": {
        "Module": ["Partners"],
        "Feature": {
          "Partners": ["Add Partner", "Edit"]
        }
      }
    },
    "Super Admin": {
      "Sim Management": {
        "Module": ["Customer Rate Plans"],
        "Feature": {
          "Customer Rate Plans": ["Create", "Edit", "Export"]
        }
      },
      "Optimization": {
        "Module": ["Optimization"],
        "Feature": {
          "Optimization": ["Optimize"]
        }
      },
      "Customer Charges": {
        "Module": ["Customer Charges"],
        "Feature": {
          "Customer Charges": ["Export"]
        }
      },
      "NetSapiens": {
        "Module": ["NetSapiens Rev Assurance"],
        "Feature": {
          "NetSapiens Rev Assurance": ["Export", "Chain and Unchain"]
        }
      },
      "LNP": {
        "Module": ["Locations"],
        "Feature": {
          "Locations": ["Update CNAM"]
        }
      },
      "Automation": {
        "Module": ["Automation rule"],
        "Feature": {
          "Automation rule": ["Edit"]
        }
      },
      "People": {
        "Module": ["NetSapiens Customers"],
        "Feature": {
          "NetSapiens Customers": ["Export", "Add Customers"]
        }
      },
      "Settings": {
        "Module": ["Roles"],
        "Feature": {
          "Roles": ["Add roles", "Edit"]
        }
      }
    },
    "User": {
      "Sim Management": {
        "Module": ["Inventory"],
        "Feature": {
          "Inventory": ["Advanced filter"]
        }
      },
      "Optimization": {
        "Module": ["Optimization"],
        "Feature": {
          "Optimization": ["Export"]
        }
      },
      "Customer Charges": {
        "Module": ["Customer Charges"],
        "Feature": {
          "Customer Charges": ["Export"]
        }
      },
      "NetSapiens": {
        "Module": ["Inventory List"],
        "Feature": {
          "Inventory List": ["Export"]
        }
      },
      "LNP": {
        "Module": ["Number Orders"],
        "Feature": {
          "Number Orders": ["Check Status"]
        }
      },
      "Automation": {
        "Module": ["Notifications"],
        "Feature": {
          "Notifications": ["Add Mobility Device Notifications"]
        }
      },
      "People": {
        "Module": ["BandwithCustomers"],
        "Feature": {
          "BandwithCustomers": ["Export", "Add Customers"]
        }
      },
      "Settings": {
        "Module": ["Modules"],
        "Feature": {
          "Modules": ["Edit"]
        }
      }
    }
  };
  