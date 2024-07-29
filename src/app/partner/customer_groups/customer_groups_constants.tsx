// Import the zustand store hook
import { usePartnerStore } from "../partnerStore";

// Function to get partnerData from the store
const getPartnerData = () => {
  const { partnerData } = usePartnerStore.getState();
  return partnerData;
};

// Fetch partnerData from the Zustand store
const partnerData = getPartnerData();

// Extract data for dropdowns
const customers_drp = Object.values(partnerData.data["Customer groups"]["Customer_names"]).map(
  (customer: any) => customer.customer_name
);

const customerrateplan_drp = Object.values(partnerData.data["Customer groups"]["customerrateplan"]).map(
  (plan: any) => plan.rateplanname 
);

const billingaccountnumber_drp = Object.values(partnerData.data["Customer groups"]["BAN"]).map(
  (ban: any) => ban.billingaccountnumber 
);

// Define modal data
export const createModalData = [
  {
    "label": "name",
    "type": "text",
    "value": "",
    "mandatory": "true"
  },
  {
    "label": "childaccount",
    "type": "checkbox",
    "value": "",
    "mandatory": "false"
  },
  {
    "label": "Customers",
    "type": "dropdown",
    "value": customers_drp,
    "mandatory": "true"
  },
  {
    "label": "billingaccountnumber",
    "type": "dropdown",
    "value": billingaccountnumber_drp,
    "mandatory": "false"
  },
  {
    "label": "customerrateplan",
    "type": "dropdown",
    "value": customerrateplan_drp,
    "mandatory": "false"
  },
  {
    "label": "featurecodes",
    "type": "dropdown",
    "value": [],
    "mandatory": "false"
  }
];

// Extract customer table data and headers
export const customer_table: any[] = partnerData.data["Customer groups"]["customergroups"];
export const headers = ["name", "tenantname", "modifiedby", "modifieddate"];
export const headerMap={
  "name":"Name",
  "tenantname":"Partner",
  "modifiedby":"Last Modified By",
  "modifieddate":"Last Modified Date & Time"
}
