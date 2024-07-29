import create from 'zustand';

interface RevIOState {
  customers_table: any[]; 
  setTable: (data: any[]) => void;
}

export const useRevIOStore = create<RevIOState>((set) => ({
  customers_table: [], 
  setTable: (data) => set({ customers_table: data }),
}));

export const headers=["billingaccountnumber","customer_name","tenantname","customerbillperiodendday","customerbillperiodendhour","modifiedby","modifieddate"]


export const createModalData= [
    {
      "label":"Status",
      "type":"text",
      "value":"",
      "mandatory":"true"
    },
    {
      "label":"Rev.IO Account",
      "type":"dropdown",
      "value":["AMOPToRevio@altaworx_sandbox","GoTech API@Catput"],
      "mandatory":"true"
      
    },
    {
      "label":"Bill Profile",
      "type":"dropdown",
      "value":["Annually","Bi-Annually","Catapult","Monthly","Prepay","Re-bill","Reseller","Saas Reseller","Tri-Annually"],
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
      "label":"Address Line 1",
      "type":"text",
      "value":"",
      "mandatory":"true"
    },
    {
      "label":"Address Line 2",
      "type":"text",
      "value":"",
      "mandatory":"false"
    },
    {
      "label":"City",
      "type":"text",
      "value":"",
      "mandatory":"true"
    },
    {
      "label":"State",
      "type":"text",
      "value":"",
      "mandatory":"true"
    },
    {
      "label":"Postal Code",
      "type":"text",
      "value":"",
      "mandatory":"true"
    },
    {
      "label":"Postal Code Extension",
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