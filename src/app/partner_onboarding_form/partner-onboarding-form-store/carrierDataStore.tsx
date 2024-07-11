import create from 'zustand';
import * as XLSX from 'xlsx';

interface ExcelData {
  [key: string]: any;
}

interface CarrierDataStore {
  carrierData: ExcelData[];
  apiState: { [key: number]: string };
  setCarrierData: (data: ExcelData[]) => void;
  setApiState: (index: number, state: string) => void;
  updateCarrierData: (index: number, key: string, value: string) => void;
  addEmptyRow: (index: number, columnNames: string[]) => void;
  fetchData: () => Promise<void>;
}

export const useCarrierStore = create<CarrierDataStore>((set) => ({
  carrierData: [],
  apiState: {},
  setCarrierData: (data) => set({ carrierData: data }),
  setApiState: (index, state) => set((state:any) => ({
    apiState: { ...state.apiState, [index]: state }
  })),
  updateCarrierData: (index, key, value) => set((state) => {
    const newData = [...state.carrierData];
    newData[index] = { ...newData[index], [key]: value };
    return { carrierData: newData };
  }),
  addEmptyRow: (index, columnNames) => set((state) => {
    const newRow = columnNames.reduce((acc, col) => {
      acc[col] = '';
      return acc;
    }, {} as ExcelData);
    const newData = [...state.carrierData];
    newData.splice(index + 1, 0, newRow);
    return { carrierData: newData };
  }),
  fetchData: async () => {
    const url = '/carrier_info.xlsx';
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const carrierData = XLSX.utils.sheet_to_json<ExcelData>(worksheet);
    set({ carrierData });

    // Update apiState with initial values
    const initialApiState: { [key: number]: string } = {};
    carrierData.forEach((row, index) => {
      initialApiState[index] = row.API_state;
    });

    // Correctly call setApiState with the index and state
    Object.entries(initialApiState).forEach(([index, state]) => {
      set((state:any) => ({
        apiState: { ...state.apiState, [Number(index)]: state }
      }));
    });
  },
}));
