import type { LineLimitResponse } from "@/types/limit";
import apiClient from "../client";

export const limitService = {
  // blockService or policyService에 추가
  getLimits: (lineId: number) =>
    apiClient.get<LineLimitResponse>("/policies/lines/limits", {
      params: { lineId },
    }),

  // 공유 데이터 제한
  patchSharedLimitToggle: (lineId: number) =>
    apiClient.patch("/policies/lines/shares/limits/enable-toggles", null, {
      params: { lineId },
    }),

  patchSharedLimit: (limitPolicyId: number, policyValue: number) =>
    apiClient.patch("/policies/lines/shares/limits", {
      limitPolicyId,
      policyValue,
    }),

  // 하루 데이터 제한
  patchDailyLimitToggle: (lineId: number) =>
    apiClient.patch("/policies/lines/days/limits/enable-toggles", null, {
      params: { lineId },
    }),

  patchDailyLimit: (limitPolicyId: number, policyValue: number) =>
    apiClient.patch("/policies/lines/days/limits", {
      limitPolicyId,
      policyValue,
    }),
};
