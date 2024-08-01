// Import the zustand store hook
import { usePartnerStore } from "../partnerStore";

// Function to get partnerData from the store
const getPartnerData = () => {
  const { partnerData } = usePartnerStore.getState();
  return partnerData;
};

// Fetch partnerData from the Zustand store
const partnerData = getPartnerData();
export const createModalData =partnerData["Customer groups"]["headers_map"]?. partnerData["Customer groups"]["headers_map"]["Customer groups"]["pop_up"]
console.log("partnerData.dat",partnerData["Customer groups"]["headers_map"])
export const generalFields=partnerData["Customer groups"]["data"]["Customer groups"]
// Extract customer table data and headers
export const customer_table: any[] = partnerData["Customer groups"]["data"]["Customer groups"]["customergroups"];

const headerMapping=partnerData["Customer groups"]["headers_map"]["Customer groups"]["header_map"]
export const headers = Object.keys(headerMapping)
export const headerMap=partnerData["Customer groups"]["headers_map"]["Customer groups"]["header_map"]
export const pagination=partnerData["Customer groups"]["data"]["pages"]["Customer groups"]
