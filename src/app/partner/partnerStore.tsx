import create from 'zustand';

type PartnerStoreType = {
  partnerData: {
      "Partner info": any;
      "Partner authentication": any;
      "Partner module access": any;
      "Customer groups": any;
      "Partner users": any;
      "Notifications": any;
  };
  setPartnerInfo: (data: any) => void;
  setPartnerAuthentication: (data: any) => void;
  setPartnerModuleAccess: (data: any) => void;
  setCustomerGroups: (data: any) => void;
  setPartnerUsers: (data: any) => void;
  setNotifications: (data: any) => void;
};

export const usePartnerStore = create<PartnerStoreType>((set) => ({
  partnerData: {
      "Partner info": {},
      "Partner authentication": {},
      "Partner module access": {},
      "Customer groups": {},
      "Partner users": {},
      "Notifications": {}
  },
  setPartnerInfo: (data) => set((state) => ({
    partnerData: {
      ...state.partnerData,
      data: {
        ...state.partnerData,
        "Partner info": data
      }
    }
  })),
  setPartnerAuthentication: (data) => set((state) => ({
    partnerData: {
      ...state.partnerData,
      data: {
        ...state.partnerData,
        "Partner authentication": data
      }
    }
  })),
  setPartnerModuleAccess: (data) => set((state) => ({
    partnerData: {
      ...state.partnerData,
      data: {
        ...state.partnerData,
        "Partner module access": data
      }
    }
  })),
  setCustomerGroups: (data) => set((state) => ({
    partnerData: {
      ...state.partnerData,
      data: {
        ...state.partnerData,
        "Customer groups": data
      }
    }
  })),
  setPartnerUsers: (data) => set((state) => ({
    partnerData: {
      ...state.partnerData,
      data: {
        ...state.partnerData,
        "Partner users": data
      }
    }
  })),
  setNotifications: (data) => set((state) => ({
    partnerData: {
      ...state.partnerData,
      data: {
        ...state.partnerData,
        "Notifications": data
      }
    }
  }))
}));
export const getPartnerData = () => {
  const { partnerData } = usePartnerStore.getState();
  return partnerData;
};

export const PartnerData = (state: PartnerStoreType) => state.partnerData;
