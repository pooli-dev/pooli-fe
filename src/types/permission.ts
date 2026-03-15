export type MemberPermission = {
  familyId: number;
  lineId: number;
  userName: string;
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
