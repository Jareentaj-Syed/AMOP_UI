import { ICCIDIMEI } from "./bulk-change-types";
import { create } from "zustand";

export interface IccidImeiStepState {
  iccidImeiList: ICCIDIMEI[];
  setIccidImeiList: (value: ICCIDIMEI[]) => void;
  reset: () => void;
}

export const useIccidImeiStepStore = create<IccidImeiStepState>((set) => ({
  iccidImeiList: [
    {
      ICCID: "",
      IMEI: "",
    },
  ],

  setIccidImeiList: (value: ICCIDIMEI[]) => set({ iccidImeiList: value }),
  reset: () =>
    set({
      iccidImeiList: [
        {
          ICCID: "",
          IMEI: "",
        },
      ],
    }),
}));
