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
    "label": "tenantname",
    "type": "dropdown",
    "value": [],
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
    "label": "address1",
    "type": "text",
    "value": "",
    "mandatory": "false"
  },
  {
    "label": "address2",
    "type": "text",
    "value": "",
    "mandatory": "false"
  },
  {
    "label": "apt_suite",
    "type": "text",
    "value": "",
    "mandatory": "false"
  },
  {
    "label": "city",
    "type": "text",
    "value": "",
    "mandatory": "false"
  },
  {
    "label": "state",
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
    "label": "country",
    "type": "text",
    "value": "",
    "mandatory": "false"
  },
  {
    "label": "customerbillperiodendday",
    "type": "text",
    "value": "",
    "mandatory": "false"
  },
  {
    "label": "customerbillperiodendhour",
    "type": "text",
    "value": "",
    "mandatory": "false"
  }
]