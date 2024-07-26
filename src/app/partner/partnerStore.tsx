import create from 'zustand';

type PartnerStoreType = {
  partnerData: {
    flag: boolean;
    data: {
      "Partner info": any;
      "Partner authentication": any;
      "Partner module access": any;
      "pages": {
        "Customer groups": {
          start: number;
          end: number;
          total: number;
        };
        "Partner users": {
          start: number;
          end: number;
          total: number;
        };
        "Notifications": {
          start: number;
          end: number;
          total: number;
        };
      };
      "Customer groups": any;
      "Partner users": any;
      "Notifications": any;
    };
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
    flag: true,
    data: {
      "Partner info": {},
      "Partner authentication": {},
      "Partner module access": {},
      "pages": {
        "Customer groups": {
          start: 0,
          end: 10,
          total: 2
        },
        "Partner users": {
          start: 0,
          end: 10,
          total: 4
        },
        "Notifications": {
          start: 0,
          end: 10,
          total: 0
        }
      },
      "Customer groups": {},
      "Partner users": {},
      "Notifications": {}
    }
  },
  setPartnerInfo: (data) => set((state) => ({
    partnerData: {
      ...state.partnerData,
      data: {
        ...state.partnerData.data,
        "Partner info": data
      }
    }
  })),
  setPartnerAuthentication: (data) => set((state) => ({
    partnerData: {
      ...state.partnerData,
      data: {
        ...state.partnerData.data,
        "Partner authentication": data
      }
    }
  })),
  setPartnerModuleAccess: (data) => set((state) => ({
    partnerData: {
      ...state.partnerData,
      data: {
        ...state.partnerData.data,
        "Partner module access": data
      }
    }
  })),
  setCustomerGroups: (data) => set((state) => ({
    partnerData: {
      ...state.partnerData,
      data: {
        ...state.partnerData.data,
        "Customer groups": data
      }
    }
  })),
  setPartnerUsers: (data) => set((state) => ({
    partnerData: {
      ...state.partnerData,
      data: {
        ...state.partnerData.data,
        "Partner users": data
      }
    }
  })),
  setNotifications: (data) => set((state) => ({
    partnerData: {
      ...state.partnerData,
      data: {
        ...state.partnerData.data,
        "Notifications": data
      }
    }
  }))
}));

export const PartnerData = (state: PartnerStoreType) => state.partnerData;
