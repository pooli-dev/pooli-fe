// api/services/main/familyService.ts
import { apiClient } from "@/api/client";
import type { FamilyApiResponse } from "@/types/FamilyMember";

export const familyService = {
  getMembers: () => apiClient.get<FamilyApiResponse>("/families/members"),
};
