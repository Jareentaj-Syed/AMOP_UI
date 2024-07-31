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
    "display_name": "name",
    "unique_name":"",
    "type": "text",
    "default": "",
    "mandatory": "true"
  },
  {
      "display_name":"child_account",
      "unique_name":"",
    "type": "checkbox",
    "default": "",
    "mandatory": "false"
  },
  {
    "display_name": "Customers",
    "unique_name":"",
    "type": "dropdown",
    "default": "",
    "mandatory": "true"
  },
  {
   "display_name":"billing_account_number",
   "unique_name":"",
    "type": "dropdown",
    "default": "",
    "mandatory": "false"
  },
  {
   "display_name":"customer_rate_plan",
   "unique_name":"",
    "type": "dropdown",
    "default": "",
    "mandatory": "false"
  },
  {
    "display_name": "feature_codes",
    "unique_name":"",
    "type": "dropdown",
    "default": "",
    "mandatory": "false"
  }
];

// Extract customer table data and headers
export const customer_table: any[] = partnerData.data["Customer groups"]["customergroups"];
export const headers = ["name", "tenant_name", "modified_by", "modified_date"];
export const headerMap={
  "name":"Name",
  "tenant_name":"Partner",
  "modified_by":"Last Modified By",
  "modified_date":"Last Modified Date & Time"
}
