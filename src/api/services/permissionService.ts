// services/permissionService.ts
import { apiClient } from "../client";
import type {
  MemberPermissionsResponse,
  PatchPermissionRequest,
} from "@/types/permission";

export const permissionService = {
  getMemberPermissions: () =>
    apiClient.get<MemberPermissionsResponse>("/member-permissions/family"),
  
  // [어드민] lineId로 가족 구성원 권한 조회
  getMemberPermissionsByLine: (lineId: number) =>
    apiClient.get<MemberPermissionsResponse>("/member-permissions/family", {
      params: { lineId },
    }),
  
  patchMemberPermissions: (permissions: PatchPermissionRequest[]) =>
    apiClient.patch("/member-permissions", permissions),

  // [어드민] lineId를 포함한 권한 변경 (쿼리 파라미터로 전송)
  patchMemberPermissionsByLine: (lineId: number, permissions: PatchPermissionRequest[]) =>
    apiClient.patch("/member-permissions", permissions, {
      params: { lineId },
    }),
};
