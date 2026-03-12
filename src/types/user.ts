export type UserInfo = {
  lineId: number;
  userName: string;
  role: "OWNER" | "MEMBER";
  planName: string;
  sharedDataRemaining: number;
  personalDataRemaining: number;
};
