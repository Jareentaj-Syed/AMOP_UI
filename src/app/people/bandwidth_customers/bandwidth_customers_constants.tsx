import create from 'zustand';

interface BandwidthState {
  customers_table: any[]; 
  setTable: (data: any[]) => void;
}

export const useBandWidthStore = create<BandwidthState>((set) => ({
  customers_table: [], 
  setTable: (data) => set({ customers_table: data }),
}));

export const headers=["billingaccountnumber","customer_name","tenantname","customerbillperiodendday","customerbillperiodendhour","modifiedby","modifieddate"]


export const createModalData= [
  {
    "label": "Partner",
    "type": "dropdown",
    "value": [
      "AWX",
      "Altawork-GT",
      "AWX-AWX",
      "AWX Test",
      "CSV RS AG",
      "Go-Tech-AWX-Test",
      "GT"
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