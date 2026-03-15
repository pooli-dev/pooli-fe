// /api/families/members 데이터 구조
export type FamilyApiResponse = {
  isEnable: boolean;
  familyId: number;
  sharedPoolTotalData: number;
  members: FamilyMember[];
};

// 멤버 타입 - API 필드명 그대로, 안 쓰는 건 생략 가능
export type FamilyMember = {
  isMe: boolean;
  userId: number;
  lineId: number;
  userName: string;
  role: "OWNER" | "MEMBER";
  remainingData: number;
  basicDataAmount: number;
  sharedPoolRemainingAmount: number;
  sharedPoolTotalAmount: number;
};

export type SimpleMember = {
  lineId: number;
  userId: number;
  userName: string;
  phone: string;
};
