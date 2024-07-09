// store/sidebarStore.ts
import { create } from 'zustand';

interface SidebarState {
  isExpanded: boolean;
  toggleSidebar: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isExpanded: true,
  toggleSidebar: () =>
    set((state) => ({
      isExpanded: !state.isExpanded,
    })),
}));
