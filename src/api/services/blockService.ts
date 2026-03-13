import { apiClient } from "../client";

export type BlockStatus = {
  blockEndsAt: string;
  blocked: boolean;
};

export type FamilyMemberSimple = {
  lineId: number;
  userId: number;
  userName: string;
  phone: string;
};

export type AppInfo = {
  appId: number;
  appName: string;
  createdAt: string;
  usageLimit: boolean;
  speedLimit: boolean;
  policyException: boolean;
};

export type AppPolicyResponse = {
  appPolicyId: number | null;
  lineId: number | null;
  appId: number;
  appName: string;
  isActive: boolean | null;
  dailyLimitData: number | null;
  dailyLimitSpeed: number | null;
  isWhiteList: boolean | null;
};

export type AppPolicyListResponse = {
  content: AppPolicyResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type GetLineAppsParams = {
  lineId: number;
  pageNumber?: number;
  pageSize?: number;
  keyword?: string;
  policyScope?: "ALL" | "APPLIED" | "NONE" | "WHITELIST";
  dataLimit?: boolean;
  speedLimit?: boolean;
  sortType?: "ACTIVE" | "NAME";
};

export type RepeatBlockDay = {
  dayOfWeek: "SUN" | "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT";
  startAt: string; // "HH:mm:ss" 형식
  endAt: string; // "HH:mm:ss" 형식
};

export type RepeatBlockPolicy = {
  repeatBlockId: number;
  lineId: number;
  isActive: boolean;
  days: RepeatBlockDay[];
};

export type RepeatBlockCreateRequest = {
  lineId: number;
  isActive: boolean;
  days: RepeatBlockDay[];
};

export type RepeatBlockUpdateRequest = {
  lineId: number;
  repeatBlockId: number;
  isActive: boolean;
  days: RepeatBlockDay[];
};

export type AppliedPoliciesResponse = {
  immediateBlock: {
    lineId: number;
    blockEndAt: string;
  } | null;
  repeatBlockPolicyList: RepeatBlockPolicy[];
  limitPolicy: {
    dailyLimitId: number;
    dailyDataLimit: number;
    isDailyDataLimitActive: boolean;
    sharedLimitId: number;
    sharedDataLimit: number;
    isSharedDataLimitActive: boolean;
  } | null;
  appPolicyList: {
    appPolicyId: number;
    appId: number;
    appName: string;
    enabled: boolean;
    dailyLimitData: number;
    dailyLimitSpeed: number;
  }[];
};

export const policyService = {
  getBlockStatus: (lineId: number) =>
    apiClient.get<BlockStatus>("/policies/lines/block-status", {
      params: { lineId },
    }),

  // 구성원 목록 조회
  getFamilyMembersSimple: () =>
    apiClient.get<FamilyMemberSimple[]>("/families/members-simple"),

  // 회선별 앱 정책 목록 조회 (필터/정렬/페이지네이션)
  getLineApps: (params: GetLineAppsParams) =>
    apiClient.get<AppPolicyListResponse>("/policies/lines/apps", { params }),

  // 앱 정책 활성화/비활성화 토글
  toggleAppPolicy: (lineId: number, applicationId: number) =>
    apiClient.patch<AppPolicyResponse>("/policies/lines/apps/enable-toggles", {
      lineId,
      applicationId,
    }),

  // 앱 속도 제한 설정 (Kbps 단위)
  updateAppSpeed: (appPolicyId: number, value: number) =>
    apiClient.patch<AppPolicyResponse>("/policies/lines/apps/speeds", {
      appPolicyId,
      value,
    }),

  // 앱 데이터 사용량 제한 설정 (byte 단위)
  updateAppLimit: (appPolicyId: number, value: number) =>
    apiClient.patch<AppPolicyResponse>("/policies/lines/apps/limits", {
      appPolicyId,
      value,
    }),

  // 정책 적용 여부 토글 (화이트리스트)
  toggleWhitelist: (appPolicyId: number) =>
    apiClient.patch<AppPolicyResponse>(
      "/policies/lines/apps/whitelist-toggles",
      null,
      {
        params: { appPolicyId },
      },
    ),

  // 반복 차단 정책 조회
  getRepeatBlockPolicies: (lineId: number) =>
    apiClient.get<RepeatBlockPolicy[]>("/policies/lines/repeat-block", {
      params: { lineId },
    }),

  // 반복 차단 정책 추가
  createRepeatBlockPolicy: (data: RepeatBlockCreateRequest) =>
    apiClient.post<RepeatBlockPolicy>("/policies/lines/repeat-block", data),

  // 반복 차단 정책 수정
  updateRepeatBlockPolicy: (
    repeatBlockId: number,
    data: RepeatBlockUpdateRequest,
  ) =>
    apiClient.put<RepeatBlockPolicy>("/policies/lines/repeat-block", data, {
      params: { repeatBlockId },
    }),

  // 반복 차단 정책 삭제
  deleteRepeatBlockPolicy: (repeatBlockId: number) =>
    apiClient.delete("/policies/lines/repeat-block", {
      params: { repeatBlockId },
    }),

  // 적용 중인 모든 정책 조회
  getAppliedPolicies: (lineId: number) =>
    apiClient.get<AppliedPoliciesResponse>("/policies/lines/applied", {
      params: { lineId },
    }),
};
