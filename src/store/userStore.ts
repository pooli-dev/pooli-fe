// store/userStore.ts
import { create } from "zustand";

type UserInfo = {
  lineId: number;
  role: "OWNER" | "MEMBER";
  planName: string;
  sharedDataRemaining: number;
  personalDataRemaining: number;
};

type UserStore = {
  userInfo: UserInfo | null;
  setUserInfo: (info: UserInfo) => void;
  clear: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  userInfo: null,
  setUserInfo: (info) => set({ userInfo: info }),
  clear: () => set({ userInfo: null }),
}));
