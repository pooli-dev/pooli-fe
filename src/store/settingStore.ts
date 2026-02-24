import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingStore {
  darkMode: boolean;
  largeTextMode: boolean;
  childMode: boolean;
  setDarkMode: (value: boolean) => void;
  setLargeTextMode: (value: boolean) => void;
  setChildMode: (value: boolean) => void;
}

export const useSettingStore = create<SettingStore>()(
  persist(
    (set) => ({
      darkMode: false,
      largeTextMode: false,
      childMode: false,
      setDarkMode: (value) => set({ darkMode: value }),
      setLargeTextMode: (value) => set({ largeTextMode: value }),
      setChildMode: (value) => set({ childMode: value }),
    }),
    {
      name: 'setting-storage',
    }
  )
);
