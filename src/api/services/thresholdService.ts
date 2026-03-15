import { apiClient } from "../client";
import type { SharedPoolThreshold, LineThreshold } from "@/types/threshold";

export const thresholdService = {
  getSharedPoolThreshold: () =>
    apiClient.get<SharedPoolThreshold>("/shared-pools/limit"),
  getLineThreshold: () => apiClient.get<LineThreshold>("/lines/thresholds"),
  patchSharedPoolThreshold: (newFamilyThreshold: number) =>
    apiClient.patch("/shared-pools/limit", { newFamilyThreshold }),
  patchLineThreshold: (
    individualThreshold: number,
    isThresholdActive: boolean,
  ) =>
    apiClient.patch("/lines/thresholds", {
      individualThreshold,
      isThresholdActive,
    }),
  
  // 하루 총 사용량 제한 토글
  toggleDailyLimit: (lineId: number) =>
    apiClient.patch("/policies/lines/days/limits/enable-toggles", null, {
      params: { lineId },
    }),
  
  // 하루 총 사용량 제한값 수정 (byte 단위)
  updateDailyLimit: (lineId: number, value: number) =>
    apiClient.patch("/policies/lines/days/limits", { lineId, value }),
  
  // 공유풀 제한 토글
  toggleSharedLimit: (lineId: number) =>
    apiClient.patch("/policies/lines/shares/limits/enable-toggles", null, {
      params: { lineId },
    }),
  
  // 공유풀 제한값 수정 (byte 단위)
  updateSharedLimit: (lineId: number, value: number) =>
    apiClient.patch("/policies/lines/shares/limits", { lineId, value }),
};
