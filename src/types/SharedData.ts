export type SharedData = {
  sharedPoolBaseData: number;
  sharedPoolAdditionalData: number;
  sharedPoolRemainingData: number;
  sharedPoolTotalData: number;
};

export type MemberUsage = {
  userName: string;
  phoneNumber: string;
  monthlySharedPoolUsage: number;
};

export type UsageData = {
  sharedPoolTotalData: number;
  membersUsageList: MemberUsage[];
};

export type HistoryEntry = {
  eventType: string;
  title: string;
  userName: string;
  occurredAt: string;
  amount: number; // bytes
  precision: string;
};
