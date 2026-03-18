// api/services/main/familyService.ts
import { apiClient } from "@/api/client";
import type { FamilyApiResponse, SimpleMember } from "@/types/FamilyMember";

interface Permission {
  familyId: number;
  lineId: number;
  permissionId: number;
  permissionTitle: string;
  createdAt: string;
}

interface MemberPermissionsResponse {
  memberPermissions: Permission[];
}

interface UpdateVisibilityRequest {
  lineId: number;
  isPublic: boolean;
}

export interface FamilyMember {
  lineId: number;
  userId: number;
  userName: string;
  phone: string;
  role: string;
}

export interface FamilyMembersByLineResponse {
  familyId: number;
  members: FamilyMember[];
}

export const familyService = {
  getMembers: () => apiClient.get<FamilyApiResponse>("/families/members"),

  // 내 권한 조회
  getMyPermissions: () =>
    apiClient.get<MemberPermissionsResponse>("/member-permissions/me"),

  // 앱 사용량 공개 설정 변경
  updateVisibility: (data: UpdateVisibilityRequest) =>
    apiClient.patch("/families/visibility", data),

  // [어드민] lineId로 가족 구성원 조회
  getMembersByLine: (lineId: number) =>
    apiClient.get<FamilyMembersByLineResponse>("/families/members/by-line", {
      params: { lineId },
    }),
  getMembersSimple: () =>
    apiClient.get<SimpleMember[]>("/families/members-simple"),

  transferOwner: (changeLineId: number) =>
    apiClient.patch("/roles/representative", null, {
      params: { changeLineId },
    }),

  // [어드민] currentLineId와 changeLineId를 포함한 대표자 양도
  transferOwnerAdmin: (currentLineId: number, changeLineId: number) =>
    apiClient.patch("/roles/representative", null, {
      params: { currentLineId, changeLineId },
    }),
};
