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
export const createModalData = partnerData.data["Customer groups"]["headers_map"]["Customer groups"]["pop_up"]
export const generalFields=partnerData.data["Customer groups"]["Customer groups"]
// Extract customer table data and headers
export const customer_table: any[] = partnerData.data["Customer groups"]["Customer groups"]["customergroups"];

const headerMapping=partnerData.data["Customer groups"]["headers_map"]["Customer groups"]["header_map"]
export const headers = Object.keys(headerMapping)
export const headerMap=partnerData.data["Customer groups"]["headers_map"]["Customer groups"]["header_map"]
export const pagination=partnerData.data["Customer groups"]["pages"]
