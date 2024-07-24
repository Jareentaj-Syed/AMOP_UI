import { PartnerData } from "../partnerStore"
export const createModalData= [
  {
    "label": "Name",
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
    "value": [
      "KeySys",
      "KQA",
      "QA Customer",
      "Belcom Inc",
      "Mitzi Gilchrist"
    ],
    "mandatory": "true"
  },
  {
    "label": "BAN",
    "type": "dropdown",
    "value": [
      "287342370228",
      "287277612222",
      "287256845357",
      "287294130093",
      "287260128567"
    ],
    "mandatory": "false"
  },
  {
    "label": "Customer Rate Plan",
    "type": "dropdown",
    "value": [
      "!aasrte",
      "100 GB 10W Pooled Data",
      "10005",
      "PORT -1714"
    ],
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
