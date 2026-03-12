// api/services/userService.ts
import type { UserInfo } from "@/types/user";
import { apiClient } from "../client";

export const userService = {
  getMyInfo: () => apiClient.get<UserInfo>("/data/usages/balances"),
};
