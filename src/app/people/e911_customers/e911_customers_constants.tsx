import create from 'zustand';

interface E911CustomersState {
  customers_table: any[]; 
  setTable: (data: any[]) => void;
}

export const useE911CustomersStore = create<E911CustomersState>((set) => ({
  customers_table: [], 
  setTable: (data) => set({ customers_table: data }),
}));

export const headers=["customer_name","e911_customerid","modifiedby","modifieddate"]
export const createModalData= [
    {
      "label":"Account Name",
      "type":"text",
      "value":"",
      "mandatory":"true"
    },
    {
      "label":"Account Id",
      "type":"text",
      "value":"",
      "mandatory":"true"
      
    }
  ]