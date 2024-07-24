import { PartnerData } from "../partnerStore";

export const users_table:any[]=PartnerData.data["Partner users"]["users"]
export const headers=["username","role","email","tenant_name","subtenant_name","lastlogin","modifiedby","modifieddate"]
export const customergroups_drp= Object.values(PartnerData.data["Partner users"]["customergroups"]).map(
    (plan) => plan.name 
  );
  export const roles_drp= Object.values(PartnerData.data["Partner users"]["Roles"]).map(
    (plan) => plan.rolename 
  );
  export const partners=Object.keys(PartnerData.data["Partner users"]["tenant"])
  export const subPartnersData:any=PartnerData.data["Partner users"]["tenant"]

