import { create } from "zustand";

export interface ArchivalConfirmationState {
  processImmediately: boolean;
  overrideValidation: boolean;

  setProcessImmediately: (value: boolean) => void;
  setOverrideValidation: (value: boolean) => void;

  reset: () => void;
}

export const useArchivalConfirmationStore = create<ArchivalConfirmationState>(
  (set) => ({
    processImmediately: true,
    overrideValidation: false,

    setProcessImmediately: (value: boolean) =>
      set({ processImmediately: value }),
    setOverrideValidation: (value: boolean) =>
      set({ overrideValidation: value }),
    reset: () =>
      set({
        processImmediately: true,
        overrideValidation: false,
      }),
  }),
);
