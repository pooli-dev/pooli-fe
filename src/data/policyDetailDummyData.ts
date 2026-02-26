// 가족 구성원 더미 데이터
export interface FamilyMember {
  lineId: number;
  userId: number;
  userName: string;
  phone: string;
  avatar?: string;
}

export const familyMembers: FamilyMember[] = [
  {
    lineId: 10,
    userId: 1,
    userName: "박은아",
    phone: "01012345678"
  },
  {
    lineId: 11,
    userId: 2,
    userName: "김아나",
    phone: "01023456789"
  },
  {
    lineId: 12,
    userId: 3,
    userName: "박아름",
    phone: "01034567890"
  },
  {
    lineId: 13,
    userId: 4,
    userName: "박봄",
    phone: "01045678901"
  }
];

// 적용중인 정책 더미 데이터
export interface AppliedPolicy {
  policyId: number;
  policyName: string;
  policyType: "BLOCK" | "LIMIT" | "SCHEDULE";
  appliedTarget: "LINE" | "APP";
  targetId: number;
  appliedAt: string;
}

export const appliedPolicies: AppliedPolicy[] = [
  {
    policyId: 1001,
    policyName: "야간 사용 차단",
    policyType: "BLOCK",
    appliedTarget: "LINE",
    targetId: 101,
    appliedAt: "2026-02-20T10:10:00"
  },
  {
    policyId: 1002,
    policyName: "공유 데이터 한도 16GB 제한",
    policyType: "LIMIT",
    appliedTarget: "LINE",
    targetId: 101,
    appliedAt: "2026-02-18T14:30:00"
  },
  {
    policyId: 1003,
    policyName: "10:00 - 12:00 데이터 차단",
    policyType: "SCHEDULE",
    appliedTarget: "LINE",
    targetId: 101,
    appliedAt: "2026-02-15T09:00:00"
  }
];

// 앱별 정책 더미 데이터
export interface AppPolicy {
  appPolicyId: number;
  appId: number;
  appName: string;
  category: "SNS" | "ENTERTAINMENT" | "WEB" | "EDUCATION" | "SHOPPING" | "OTHER";
  enabled: boolean;
  dailyLimitMb: number;
  currentUsageMb?: number;
  maxSpeedMbps?: number;
  currentSpeedMbps?: number;
  blockAds?: boolean;
}

export const appPolicies: AppPolicy[] = [
  {
    appPolicyId: 7301,
    appId: 301,
    appName: "인스타그램",
    category: "SNS",
    enabled: true,
    dailyLimitMb: 500,
    currentUsageMb: 230,
    maxSpeedMbps: 3,
    currentSpeedMbps: 2,
    blockAds: false
  },
  {
    appPolicyId: 7302,
    appId: 302,
    appName: "카카오톡",
    category: "SNS",
    enabled: true,
    dailyLimitMb: 5000,
    currentUsageMb: 150,
    maxSpeedMbps: 50,
    currentSpeedMbps: 5,
    blockAds: false
  },
  {
    appPolicyId: 7303,
    appId: 303,
    appName: "틱톡",
    category: "SNS",
    enabled: false,
    dailyLimitMb: 800,
    currentUsageMb: 0,
    maxSpeedMbps: 5,
    currentSpeedMbps: 0,
    blockAds: true
  },
  {
    appPolicyId: 7304,
    appId: 304,
    appName: "멜론",
    category: "ENTERTAINMENT",
    enabled: false,
    dailyLimitMb: 500,
    currentUsageMb: 0,
    maxSpeedMbps: 5,
    currentSpeedMbps: 0,
    blockAds: false
  },
  {
    appPolicyId: 7305,
    appId: 305,
    appName: "유튜브",
    category: "ENTERTAINMENT",
    enabled: true,
    dailyLimitMb: 1024,
    currentUsageMb: 512,
    maxSpeedMbps: 5,
    currentSpeedMbps: 3,
    blockAds: false
  },
  {
    appPolicyId: 7306,
    appId: 306,
    appName: "넷플릭스",
    category: "ENTERTAINMENT",
    enabled: true,
    dailyLimitMb: 2048,
    currentUsageMb: 1500,
    maxSpeedMbps: 10,
    currentSpeedMbps: 8,
    blockAds: false
  },
  {
    appPolicyId: 7307,
    appId: 307,
    appName: "사파리",
    category: "WEB",
    enabled: true,
    dailyLimitMb: 1000,
    currentUsageMb: 400,
    maxSpeedMbps: 20,
    currentSpeedMbps: 15,
    blockAds: false
  },
  {
    appPolicyId: 7308,
    appId: 308,
    appName: "크롬",
    category: "WEB",
    enabled: false,
    dailyLimitMb: 1000,
    currentUsageMb: 0,
    maxSpeedMbps: 20,
    currentSpeedMbps: 0,
    blockAds: false
  },
  {
    appPolicyId: 7309,
    appId: 309,
    appName: "네이버",
    category: "WEB",
    enabled: true,
    dailyLimitMb: 800,
    currentUsageMb: 300,
    maxSpeedMbps: 15,
    currentSpeedMbps: 10,
    blockAds: false
  },
  {
    appPolicyId: 7310,
    appId: 310,
    appName: "LMS",
    category: "EDUCATION",
    enabled: true,
    dailyLimitMb: 5000,
    currentUsageMb: 200,
    maxSpeedMbps: 50,
    currentSpeedMbps: 20,
    blockAds: false
  },
  {
    appPolicyId: 7311,
    appId: 311,
    appName: "열품타",
    category: "EDUCATION",
    enabled: false,
    dailyLimitMb: 400,
    currentUsageMb: 0,
    maxSpeedMbps: 10,
    currentSpeedMbps: 0,
    blockAds: false
  },
  {
    appPolicyId: 7312,
    appId: 312,
    appName: "산타",
    category: "EDUCATION",
    enabled: false,
    dailyLimitMb: 400,
    currentUsageMb: 0,
    maxSpeedMbps: 10,
    currentSpeedMbps: 0,
    blockAds: false
  },
  {
    appPolicyId: 7313,
    appId: 313,
    appName: "무신사",
    category: "SHOPPING",
    enabled: true,
    dailyLimitMb: 600,
    currentUsageMb: 250,
    maxSpeedMbps: 10,
    currentSpeedMbps: 8,
    blockAds: false
  },
  {
    appPolicyId: 7314,
    appId: 314,
    appName: "쿠팡",
    category: "SHOPPING",
    enabled: false,
    dailyLimitMb: 700,
    currentUsageMb: 0,
    maxSpeedMbps: 10,
    currentSpeedMbps: 0,
    blockAds: false
  },
  {
    appPolicyId: 7315,
    appId: 315,
    appName: "배민",
    category: "SHOPPING",
    enabled: true,
    dailyLimitMb: 400,
    currentUsageMb: 180,
    maxSpeedMbps: 8,
    currentSpeedMbps: 6,
    blockAds: false
  },
  {
    appPolicyId: 7316,
    appId: 316,
    appName: "당근",
    category: "OTHER",
    enabled: false,
    dailyLimitMb: 300,
    currentUsageMb: 0,
    maxSpeedMbps: 5,
    currentSpeedMbps: 0,
    blockAds: false
  },
  {
    appPolicyId: 7317,
    appId: 317,
    appName: "토스",
    category: "OTHER",
    enabled: true,
    dailyLimitMb: 5000,
    currentUsageMb: 50,
    maxSpeedMbps: 50,
    currentSpeedMbps: 10,
    blockAds: false
  },
  {
    appPolicyId: 7318,
    appId: 318,
    appName: "Pooli",
    category: "OTHER",
    enabled: true,
    dailyLimitMb: 5000,
    currentUsageMb: 80,
    maxSpeedMbps: 50,
    currentSpeedMbps: 15,
    blockAds: false
  }
];
