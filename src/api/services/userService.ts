// api/services/userService.ts
import type { UserInfo } from "@/types/user";
import { apiClient } from "../client";

interface MonthlyUsage {
  yearMonth: string;
  usedAmount: number;
}

interface MonthlyUsageResponse {
  usages: MonthlyUsage[];
  averageAmount: number;
}

interface DataUsageResponse {
  isCurrentMonth: boolean;
  personalUsedAmount: number;
  sharedPoolUsedAmount: number;
  personalTotalAmount: number;
  sharedPoolTotalAmount: number;
}

interface AppUsageResponse {
  isPublic: boolean;
  totalUsedAmount: number;
  apps: Array<{
    appName: string;
    usedAmount: number;
  }>;
}

export const userService = {
  getMyInfo: () => apiClient.get<UserInfo>("/data/usages/balances"),
  
  getMonthlyUsage: (lineId: number, yearMonth: string) => 
    apiClient.get<MonthlyUsageResponse>("/data/usages/monthly", {
      params: { lineId, yearMonth }
    }),
  
  getDataUsage: (lineId: number, yearMonth: string) =>
    apiClient.get<DataUsageResponse>("/data/usages/data", {
      params: { lineId, yearMonth }
    }),
  
  getAppUsage: (lineId: number, yearMonth: string) =>
    apiClient.get<AppUsageResponse>("/data/usages/apps", {
      params: { lineId, yearMonth: parseInt(yearMonth, 10) }
    }),
};
