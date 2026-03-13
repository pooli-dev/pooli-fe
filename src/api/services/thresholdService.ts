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
};
