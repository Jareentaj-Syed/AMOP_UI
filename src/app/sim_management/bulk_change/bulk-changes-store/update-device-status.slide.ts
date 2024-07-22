import { StateCreator } from "zustand";

type State = {
  updateDeviceStatus: {
    targetStatus: string;
    targetStatusId: number;

    // TODO: Add more properties here
  } | null;
};
type Actions = {
  setTargetStatus: (targetStatus: string, targetStatusId: number) => void;
  // TODO: Add more actions here

  resetUpdateDeviceStatus: () => void;
};

const initialState: State = {
  updateDeviceStatus: null,
};

export type BulkChangeUpdateDeviceStatusStore = State & Actions;

export const BulkChangeUpdateDeviceStatusSlice: StateCreator<
  BulkChangeUpdateDeviceStatusStore
> = (set, get) => ({
  ...initialState,
  setTargetStatus: (targetStatus, targetStatusId) =>
    set((prevState) => ({
      updateDeviceStatus: {
        ...prevState.updateDeviceStatus,
        targetStatus,
        targetStatusId,
      },
    })),

  resetUpdateDeviceStatus: () => set(initialState),
});
