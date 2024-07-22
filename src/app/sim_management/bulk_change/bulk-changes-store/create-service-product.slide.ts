import { StateCreator } from "zustand";

type State = {
  createServiceProduct: {
    package?: {
      id: number;
      name: string;
      products: {
        id: number;
        name: string;
        rate: number;
      }[];
    } | null;
    provider?: {
      id: number;
      name: string;
    } | null;
    serviceType?: {
      id: number;
      name: string;
    } | null;
    products?:
      | {
          id: number;
          name: string;
          rate: number;
        }[]
      | null;

    // undefined if choose `Use Carrier Effective Date`
    carrierEffectiveDate?: string | null;
  } | null;
};
type Actions = {
  setProvider: (provider: { id: number; name: string }) => void;
  setServiceType: (serviceType: { id: number; name: string }) => void;
  setPackage: (revPackage: {
    id: number;
    name: string;
    products: { id: number; name: string; rate: number }[];
  }) => void;
  setProducts: (products: { id: number; name: string; rate: number }[]) => void;
  setCarrierEffectiveDate: (carrierEffectiveDate: string | null) => void;
  resetCreateServiceProduct: () => void;
};

const initialState: State = {
  createServiceProduct: null,
};
export type CreateServiceProductSlideState = State & Actions;

export const CreateServiceProductSlide: StateCreator<
  CreateServiceProductSlideState
> = (set, get) => ({
  ...initialState,
  setProvider: (provider) =>
    set((state) => ({
      createServiceProduct: {
        ...state.createServiceProduct,
        provider,
        package: null,
        products: [],
      },
    })),
  setServiceType: (serviceType) =>
    set((state) => ({
      createServiceProduct: {
        ...state.createServiceProduct,
        serviceType,
      },
    })),
  setPackage: (revPackage) =>
    set((state) => ({
      createServiceProduct: {
        ...state.createServiceProduct,
        package: revPackage,
        products: revPackage.products,
      },
    })),
  setProducts: (products) =>
    set((state) => ({
      createServiceProduct: {
        ...state.createServiceProduct,
        products,
        revPackage: null,
      },
    })),
  setCarrierEffectiveDate: (carrierEffectiveDate) => {
    set((state) => ({
      createServiceProduct: {
        ...state.createServiceProduct,
        carrierEffectiveDate,
      },
    }));
  },
  resetCreateServiceProduct: () => {
    set(initialState);
  },
});
