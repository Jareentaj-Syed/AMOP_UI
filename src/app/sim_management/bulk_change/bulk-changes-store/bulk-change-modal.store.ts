import { ICCIDIMEI } from "./bulk-change-types";
import { create } from "zustand";
import { AssignCustomerSlide, BulkChangeAssignCustomerStore } from "./assign-customer.slide";
import { CreateServiceProductSlide, CreateServiceProductSlideState } from "./create-service-product.slide";
import { BulkChangeUpdateDeviceStatusSlice, BulkChangeUpdateDeviceStatusStore } from "./update-device-status.slide";

export interface FormStepState {
  title: string;
  status: "wait" | "process" | "finish" | "error" | undefined;
}

type BulkChangeModalState = {
  visible: boolean;
  stepIndex: number;
  steps: FormStepState[];

  setVisible: (visible: boolean) => void;
  backStep: () => void;
  nextStep: () => void;
  setStepIndex: (setFn: (currentIndex: number) => number) => void;
  setSteps: (steps: FormStepState[]) => void;
  addStepAtIndex: (step: FormStepState, index: number) => void;
  removeStepAtIndex: (index: number) => void;

  setCurrentStepStatus: (status: FormStepState["status"]) => void;

  reset: () => void;
} & BulkChangeAssignCustomerStore &
  CreateServiceProductSlideState &
  BulkChangeUpdateDeviceStatusStore;

const initialState = {
  visible: false,
  stepIndex: 0,
  steps: [
    {
      title: "Choose Service Provider",
      status: "process",
    } as FormStepState,
  ],
};

export const useBulkChangeModalStore = create<BulkChangeModalState>(
  (set, get, store) => ({
    ...AssignCustomerSlide(set, get, store),
    ...CreateServiceProductSlide(set, get, store),
    ...BulkChangeUpdateDeviceStatusSlice(set, get, store),

    ...initialState,
    setVisible: (visible: boolean) => set({ visible }),
    setSteps: (steps: FormStepState[]) => {
      set({
        steps: [
          {
            title: "Choose Service Provider",
            status: "process",
          },
          ...steps,
        ],
        stepIndex: 0,
      });
    },
    addStepAtIndex: (step: FormStepState, index: number) => {
      set(({ steps }) => {
        steps.splice(index, 0, step);
        return { steps };
      });
    },
    removeStepAtIndex: (index: number) => {
      set(({ steps }) => {
        steps.splice(index, 1);
        return { steps };
      });
    },

    backStep: () =>
      set(({ stepIndex }) => {
        if (stepIndex <= 0) return {};
        return { stepIndex: stepIndex - 1 };
      }),
    nextStep: () =>
      set(({ stepIndex }) => {
        const { steps } = get();
        if (stepIndex >= steps.length - 1) return {};
        return { stepIndex: stepIndex + 1 };
      }),
    setStepIndex: (setFn) =>
      set(({ stepIndex }) => {
        const newIndex = setFn(stepIndex);
        if (newIndex < 0) return {};
        if (newIndex >= get().steps.length) return {};
        return { stepIndex: newIndex };
      }),
    setCurrentStepStatus: (status: FormStepState["status"]) => {
      set(({ steps, stepIndex }) => {
        if (stepIndex < 0) return {};
        steps[stepIndex].status = status;
        return { steps };
      });
    },

    reset: () => {
      set({ visible: false, stepIndex: 0 });
      get().resetAssignCustomer();
      get().resetCreateServiceProduct();
      get().resetUpdateDeviceStatus();
    },
  }),
);
//This hook combines multiple state slices into a single store and provides various functions to 
//manipulate the state, including setting visibility, managing steps, navigating between steps, 
//and resetting the state.


export type ServiceProviderType = {
  id: number;
  Name: string;
  DisplayName: string;
  IntegrationId: number;
  PortalTypeId: number;
};
