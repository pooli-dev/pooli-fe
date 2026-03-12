// api/services/userService.ts
import { apiClient } from "../client";

export type UserBalance = {
  lineId: number;
  role: "OWNER" | "MEMBER";
  sharedDataRemaining: number;
  personalDataRemaining: number;
  planName: string;
};

export const userService = {
  getMyInfo: () => apiClient.get<UserBalance>("/data/usages/balances"),
};
