// Import the zustand store hook
import { usePartnerStore } from "../partnerStore";

// Function to get partnerData from the store
export const getPartnerData = () => {
  const { partnerData } = usePartnerStore.getState();
  return partnerData;
};

// Usage example to get data dynamically from the Zustand store
const partnerData = getPartnerData();
const partner = partnerData.data["Partner info"]["partner"];
const sub_partner = partnerData.data["Partner info"]["sub_partner"];

console.log(partner, sub_partner);

// Accessing specific data for tables and dropdowns
export const users_table: any[] = partnerData.data["Partner users"]["users"];
export const headers = ["username", "role", "email", "tenant_name", "subtenant_name", "lastlogin", "modifiedby", "modifieddate"];
export const customergroups_drp = Object.values(partnerData.data["Partner users"]["customergroups"]).map(
  (group: any) => group.name
);
export const roles_drp = Object.values(partnerData.data["Partner users"]["Roles"]).map(
  (role: any) => role.rolename
);
export const service_provider_drp = Object.values(partnerData.data["Partner users"]["serviceprovider"]).map(
  (service_provider: any) => service_provider.name
);
export const customers_drp = Object.values(partnerData.data["Partner users"]["Customers"]).map(
  (customer: any) => customer.customer_name
);
export const partners = Object.keys(partnerData.data["Partner users"]["tenant"]);
export const subPartnersData: any = partnerData.data["Partner users"]["tenant"];
