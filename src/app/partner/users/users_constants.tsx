// Import the zustand store hook
import { usePartnerStore } from "../partnerStore";

// Function to get partnerData from the store
// export const getPartnerData = () => {
//   const { partnerData } = usePartnerStore.getState();
//   return partnerData;
// };

// // Usage example to get data dynamically from the Zustand store
// const partnerData = getPartnerData();
// const partner = partnerData.data["Partner info"]["Partner info"]["partner"];
// const sub_partner = partnerData.data["Partner info"]["Partner info"]["sub_partner"];

// console.log("Partner called")

// // Accessing specific data for tables and dropdowns
// export const users_table: any[] = partnerData.data["Partner users"]["Partner users"]["users"];
// export const headers = ["username", "role", "email", "tenant_name", "subtenant_name", "lastlogin","isactive", "modifiedby", "modifieddate"];
// export const headerMap={
//   "username":"Username",
//   "role":"Role",
//   "email":"Email Id",
//   "tenant_name":"Partner",
//   "subtenant_name":"Sub Partner",
//   "lastlogin":"Last Login",
//   "modifiedby":"Last Modified By",
//   "modifieddate":"Last Modified Date & Time",
//   "isactive":"User status"
// }
// console.log("partnerData.data",partnerData.data)
// console.log("partnerData.data[Partner users]",partnerData.data["Partner users"])
// console.log("partnerData.data[Partner users][customergroups]",partnerData.data["Partner users"]["customergroups"])


// export const customergroups_drp = Array.isArray(partnerData.data["Partner users"]["Partner users"]["customergroups"])
//   ? partnerData.data["Partner users"]["customergroups"].map((group: any) => group.name)
//   : []; 

// export const roles_drp = Array.isArray(partnerData.data["Partner users"]["Partner users"]["Roles"])
//   ? partnerData.data["Partner users"]["Partner users"]["Roles"].map((role: any) => role.rolename)
//   : []; 
// // Ensure partnerData.data["Partner users"]["serviceprovider"] is an array
// export const service_provider_drp = Array.isArray(partnerData.data["Partner users"]["Partner users"]["serviceprovider"])
//   ? partnerData.data["Partner users"]["Partner users"]["serviceprovider"].map((provider: any) => provider.name)
//   : []; // Provide a fallback empty array if not an array

// // Ensure partnerData.data["Partner users"]["Customers"] is an array
// export const customers_drp = Array.isArray(partnerData.data["Partner users"]["Partner users"]["Customers"])
//   ? partnerData.data["Partner users"]["Customers"].map((customer: any) => customer.customer_name)
//   : []; // Provide a fallback empty array if not an array

// export const partners =Object.keys(partnerData.data["Partner users"]["Partner users"]["tenant"]);
// export const subPartnersData: any =partnerData.data["Partner users"]["Partner users"]["tenant"];
// export const total_users:any=partnerData.data["Partner users"]["Partner users"]["total_count"]
// export const active_users:any=partnerData.data["Partner users"]["Partner users"]["active_user_count"]
// export const migrated_users:any=partnerData.data["Partner users"]["Partner users"]["migrated_count"]
// export const pagination=partnerData.data["Partner users"]["Partner users"]["pages"]

