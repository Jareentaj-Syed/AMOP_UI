import create from 'zustand';

interface UserState {
    tenant: string;
    role_name: string;
    sub_tenant: string[];
    setTenant: (partner: string) => void;
    setRoleName: (role: string) => void;
    setSubTenant: (subPartners: string[]) => void;
}

export const useUserStore = create<UserState>((set) => ({
    tenant: '',
    role_name: '',
    sub_tenant: [],
    setTenant: (tenant) => set({ tenant }),
    setRoleName: (role_name) => set({ role_name }),
    setSubTenant: (sub_tenant) => set({ sub_tenant }),
}));
