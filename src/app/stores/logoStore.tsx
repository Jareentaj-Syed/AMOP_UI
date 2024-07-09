// stores/logoStore.ts
import { create } from 'zustand';

interface LogoState {
  logoUrl: string | null;
  setLogoUrl: (url: string) => void;
}

export const useLogoStore = create<LogoState>((set) => ({
  logoUrl: null,
  setLogoUrl: (url: string) => set({ logoUrl: url }),
}));
