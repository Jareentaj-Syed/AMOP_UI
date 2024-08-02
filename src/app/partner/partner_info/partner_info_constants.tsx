// Import the zustand store hook
import { usePartnerStore } from "../partnerStore";

// Function to get partnerData from the store
export const getPartnerData = () => {
  const { partnerData } = usePartnerStore.getState();
  return partnerData;
};

// Usage example
const partnerData = getPartnerData();
export const partner_name = partnerData["Partner info"]["partner"];
export const sub_partner = partnerData["Partner info"]["sub_partner"];
console.log(partner_name, sub_partner);
