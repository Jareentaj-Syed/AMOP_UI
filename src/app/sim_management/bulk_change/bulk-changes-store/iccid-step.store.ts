import { create } from "zustand";

export interface IccidStepState {
  integrationId: number;
  simList: string[];
  setIntegrationId: (value: number) => void;
  setSimList: (value: string[]) => void;
  reset: () => void;
}

export const useIccidStepStore = create<IccidStepState>((set) => ({
  simList: [""],
  integrationId: 0,

  setIntegrationId: (value: number) => set({ integrationId: value }),
  setSimList: (value: string[]) => set({ simList: value }),
  reset: () => set({ simList: [""], integrationId: 0 }),
}));
