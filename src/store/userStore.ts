// store/userStore.ts
import type { UserInfo } from "@/types/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserStore = {
  userInfo: UserInfo | null;
  setUserInfo: (info: UserInfo) => void;
  clear: () => void;
};

export const useUserStore = create(
  persist<UserStore>(
    (set) => ({
      userInfo: null,
      setUserInfo: (info) => set({ userInfo: info }),
      clear: () => set({ userInfo: null }),
    }),
    {
      name: "user-storage", // localStorage 키
    },
  ),
);
