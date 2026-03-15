// api/services/main/familyService.ts
import { apiClient } from "@/api/client";
import type { FamilyApiResponse, SimpleMember } from "@/types/FamilyMember";

export const familyService = {
  getMembers: () => apiClient.get<FamilyApiResponse>("/families/members"),
  getMembersSimple: () =>
    apiClient.get<SimpleMember[]>("/families/members-simple"),

  transferOwner: (changeLineId: number) =>
    apiClient.patch("/roles/representative", null, {
      params: { changeLineId },
    }),
};
