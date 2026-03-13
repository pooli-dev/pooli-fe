// types/permission.ts
export type FamilyMember = {
  lineId: number;
  userId: number;
  userName: string;
  phone: string;
  role: string;
};

export type FamilyMembersResponse = {
  familyId: number;
  members: FamilyMember[];
};

export type MemberPermission = {
  familyId: number;
  lineId: number;
  permissionId: number;
  permissionTitle: string;
  createdAt: string;
  is_enable: boolean;
};

export type MemberPermissionsResponse = {
  memberPermissions: MemberPermission[];
};

export type PatchPermissionRequest = {
  lineId: number;
  permissionId: number;
  is_enable: boolean;
};
