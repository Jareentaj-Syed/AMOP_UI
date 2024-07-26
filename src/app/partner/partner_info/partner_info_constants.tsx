// Import the zustand store hook
import { usePartnerStore } from "../partnerStore";

// Function to get partnerData from the store
export const getPartnerData = () => {
  const { partnerData } = usePartnerStore.getState();
  return partnerData;
};

// Usage example
const partnerData = getPartnerData();
export const partner = partnerData.data["Partner info"]["partner"];
export const sub_partner = partnerData.data["Partner info"]["sub_partner"];

console.log(partner, sub_partner);
