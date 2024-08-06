import create from 'zustand';

interface UserState {
    tenant: any;
    role_name: any;
    sub_tenant: any[];
    user_name:any;
    emailsList:any[];
    setTenant: (tenant: any) => void;
    setRoleName: (role_name: any) => void;
    setSubTenant: (subPartners: any[]) => void;
    setUser_Name:(user_name: any) => void;
    setEmailsList: (emailsList: any[]) => void;

}

export const useUserStore = create<UserState>((set) => ({
    user_name:'',
    tenant: '',
    role_name: '',
    sub_tenant: [],
    emailsList:[],
    setEmailsList: (emailsList) => set({ emailsList }),
    setTenant: (tenant) => set({ tenant }),
    setRoleName: (role_name) => set({ role_name }),
    setSubTenant: (sub_tenant) => set({ sub_tenant }),
    setUser_Name: (user_name) => set({ user_name }),
}));
