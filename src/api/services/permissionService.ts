// services/permissionService.ts
import { apiClient } from "../client";
import type {
  MemberPermissionsResponse,
  PatchPermissionRequest,
} from "@/types/permission";

export const permissionService = {
  getMemberPermissions: () =>
    apiClient.get<MemberPermissionsResponse>("/member-permissions/family"),
  patchMemberPermissions: (permissions: PatchPermissionRequest[]) =>
    apiClient.patch("/member-permissions", permissions),
};
