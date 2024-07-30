import create from 'zustand';

interface E911CustomersState {
  customers_table: any[]; 
  setTable: (data: any[]) => void;
}

export const useE911CustomersStore = create<E911CustomersState>((set) => ({
  customers_table: [], 
  setTable: (data) => set({ customers_table: data }),
}));

export const headers=["accountname","accountid","modifiedby","modifieddate"]
export const headerMap={
  "accountname":"Account Name",
  "accountid":"Account Id",
  "modifiedby":"Last Modified By",
  "modifieddate":"Last Modified Date & Time"
}
export const createModalData= [
    {
      "label":"accountname",
      "type":"text",
      "value":"",
      "mandatory":"true"
    },
    {
      "label":"accountid",
      "type":"text",
      "value":"",
      "mandatory":"true"
      
    }
  ]