import create from 'zustand';

interface RevIOState {
  customers_table: any[]; 
  setTable: (data: any[]) => void;
  bill_profile_drp:string[]
  setBillProfile:(data: string[]) => void;
}

export const useRevIOStore = create<RevIOState>((set) => ({
  customers_table: [], 
  setTable: (data) => set({ customers_table: data }),
  bill_profile_drp:[],
  setBillProfile: (data) => set({ bill_profile_drp: data }),
}));

export const headers=["billingaccountnumber","agentname","customer_name","tenantname","customerbillperiodendday","customerbillperiodendhour","modifiedby","modifieddate"]

export const headerMap={
  "billingaccountnumber":"Account No",
  "customer_id":"Agent",
  "customer_name":"Customer Name",
  "tenantname":"Partner",
  "customerbillperiodendday":"Bill Period End Day",
  "customerbillperiodendhour":"Bill Period End Hour",
  "modifiedby":"Last Modified By",
  "modifieddate":"Last Modified Date & Time",
  "agentname":"Agent"
}
export const createModalData= (billProfiles: string[])=>[
    {
      "label":"Status",
      "type":"text",
      "value":"",
      "mandatory":"true"
    },
    {
      "label":"Rev.IO Account",
      "type":"dropdown",
      "value":[],
      "mandatory":"true"
      
    },
    {
      "label":"Bill Profile",
      "type":"dropdown",
      "value":billProfiles,
      "mandatory":"true"
    },
    {
      "label":"First Name",
      "type":"text",
      "value":"",
      "mandatory":"true"
    },
    {
      "label":"Middle Initial",
      "type":"text",
      "value":"",
      "mandatory":"false"
    },
    {
      "label":"Last Name",
      "type":"text",
      "value":"",
      "mandatory":"true"
    },
    {
      "label":"Company Name",
      "type":"text",
      "value":"",
      "mandatory":"true"
    },
    {
      "label":"address1",
      "type":"text",
      "value":"",
      "mandatory":"true"
    },
    {
      "label":"address2",
      "type":"text",
      "value":"",
      "mandatory":"false"
    },
    {
      "label":"city",
      "type":"text",
      "value":"",
      "mandatory":"true"
    },
    {
      "label":"state",
      "type":"text",
      "value":"",
      "mandatory":"true"
    },
    {
      "label":"postalcode",
      "type":"text",
      "value":"",
      "mandatory":"true"
    },
    {
      "label":"postalcode_extension",
      "type":"text",
      "value":"",
      "mandatory":"true"
    },
  
    {
      "label":"Use Service Adress as Billing Adress?",
      "type":"checkbox",
      "value":"",
      "mandatory":"true"
    },
    {
      "label":"Use Service Adress as Listing Adress?",
      "type":"checkbox",
      "value":"",
      "mandatory":"true"
    }
  ]