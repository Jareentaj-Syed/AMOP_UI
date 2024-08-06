import create from 'zustand';

interface UserState {
    tenant: string;
    role_name: string;
    sub_tenant: string[];
    user_name:string;
    setTenant: (partner: string) => void;
    setRoleName: (role_name: string) => void;
    setSubTenant: (subPartners: string[]) => void;
    setUser_Name:(user_name: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
    user_name:'',
    tenant: '',
    role_name: '',
    sub_tenant: [],
    setTenant: (tenant) => set({ tenant }),
    setRoleName: (role_name) => set({ role_name }),
    setSubTenant: (sub_tenant) => set({ sub_tenant }),
    setUser_Name: (user_name) => set({ user_name }),
}));
