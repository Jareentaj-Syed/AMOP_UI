import { PartnerData } from "../partnerStore"
const customers_drp = Object.values(PartnerData.data["Customer groups"]["Customer_names"]).map(
  (customer) => customer.customer_name
);

const customerrateplan_drp = Object.values(PartnerData.data["Customer groups"]["customerrateplan"]).map(
  (plan) => plan.rateplanname 
);

const billingaccountnumber_drp = Object.values(PartnerData.data["Customer groups"]["BAN"]).map(
  (ban) => ban.billingaccountnumber 
);

export const createModalData= [
  {
    "label": "name",
    "type": "text",
    "value":"",
    "mandatory": "true"
  },
  {
    "label": "Include Child Accounts?",
    "type": "checkbox",
    "value": "",
    "mandatory": "false"
  },
  {
    "label": "Customers",
    "type": "dropdown",
    "value":customers_drp,
    "mandatory": "true"
  },
  {
    "label": "BAN",
    "type": "dropdown",
    "value": billingaccountnumber_drp,
    "mandatory": "false"
  },
  {
    "label": "Customer Rate Plan",
    "type": "dropdown",
    "value": customerrateplan_drp,
    "mandatory": "false"
  },
  {
    "label": "Feature Codes",
    "type": "dropdown",
    "value": [
      "$3 Pooling Fee",
      "$5 Pooling Fee",
      "100GB Hotspot",
      "100GB Hotspot"
    ],
    "mandatory": "false"
  }
]
export const customer_table:any[]=PartnerData.data["Customer groups"]["customergroups"]
export const headers=["name","tenantname","modifiedby","modifieddate"]
