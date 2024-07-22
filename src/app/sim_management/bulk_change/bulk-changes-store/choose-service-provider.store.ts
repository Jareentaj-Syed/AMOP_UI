import { create } from "zustand";
import { ServiceProviderType } from "./bulk-change-modal.store";

interface ChooseServiceProviderState {
  selectedServiceProvider: ServiceProviderType | null;
  selectedAction: string | null;
  setSelectedServiceProvider: (
    selectedServiceProvider: ServiceProviderType | null,
  ) => void;
  setSelectedAction: (selectedAction: string | null) => void;
  reset: () => void;
}

export const useBulkChangeChooseServiceProvider =
  create<ChooseServiceProviderState>((set, get) => ({
    selectedServiceProvider: null,
    selectedAction: null,
    setSelectedServiceProvider: (selectedServiceProvider) =>
      set({ selectedServiceProvider }),
    setSelectedAction: (selectedAction) => set({ selectedAction }),
    reset: () => set({ selectedServiceProvider: null, selectedAction: null }),
  }));
