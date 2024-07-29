import create from 'zustand';

interface netSapiensState {
  customers_table: any[]; 
  setTable: (data: any[]) => void;
}

export const useNetSapiensStore = create<netSapiensState>((set) => ({
  customers_table: [], 
  setTable: (data) => set({ customers_table: data }),
}));

export const headers=["billingaccountnumber","customer_name","tenantname","customerbillperiodendday","customerbillperiodendhour","modifiedby","modifieddate"]
export const headerMap={
  "billingaccountnumber":"Account No",
  "customer_id":"Agent",
  "customer_name":"Customer Name",
  "tenantname":"Partner",
  "customerbillperiodendday":"Bill Period End Day",
  "customerbillperiodendhour":"Bill Period End Hour",
  "modifiedby":"Last Modified By",
  "modifieddate":"Last Modified Date & Time"
}

export const createModalData= [
  {
    "label": "Partner",
    "type": "dropdown",
    "value": [
      "Agent",
      "Agent Partner Admin",
      "Notification Only User",
      "Partner Admin",
      "Super Admin",
      "User"
    ],
    "mandatory": "true"
  },
  {
    "label": "Description",
    "type": "text",
    "value":"",
    "mandatory": "false"
  },
  {
    "label": "Name",
    "type": "text",
    "value":"",
    "mandatory": "true"
  },
  {
    "label": "Inactivity Start",
    "type": "date",
    "value": "",
    "mandatory": "false"
  },
  {
    "label": "Inactivity End",
    "type": "date",
    "value": "",
    "mandatory": "false"
  },
  {
    "label": "Address Line 1",
    "type": "text",
    "value": "",
    "mandatory": "false"
  },
  {
    "label": "Address Line 2",
    "type": "text",
    "value": "",
    "mandatory": "false"
  },
  {
    "label": "Apt or Suite",
    "type": "text",
    "value": "",
    "mandatory": "false"
  },
  {
    "label": "City",
    "type": "text",
    "value": "",
    "mandatory": "false"
  },
  {
    "label": "State",
    "type": "text",
    "value": "",
    "mandatory": "false"
  },
  {
    "label": "Zip Code",
    "type": "text",
    "value": "",
    "mandatory": "false"
  },
  {
    "label": "Country",
    "type": "text",
    "value": "",
    "mandatory": "false"
  },
  {
    "label": "Bill Period Day(1-28)",
    "type": "text",
    "value": "",
    "mandatory": "false"
  },
  {
    "label": "Bill Period Day(0-23)",
    "type": "text",
    "value": "",
    "mandatory": "false"
  }
]