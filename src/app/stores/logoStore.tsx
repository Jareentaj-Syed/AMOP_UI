// stores/logoStore.ts
import { create } from 'zustand';

interface LogoState {
  logoUrl: string | null;
  title: string;
  setLogoUrl: (url: string) => void;
  setTitle: (title: string) => void;
}

export const useLogoStore = create<LogoState>((set) => ({
  logoUrl: null,
  title: '',
  setLogoUrl: (url: string) => set({ logoUrl: url }),
  setTitle: (title: string) => set({ title }),
}));
