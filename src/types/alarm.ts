// types/alarm.ts
export type AlarmCode =
  | "FAMILY"
  | "USER"
  | "POLICY_CHANGE"
  | "POLICY_LIMIT"
  | "PERMISSION"
  | "QUESTION"
  | "OTHERS";

export type AlarmCategory = "all" | "data" | "policy" | "permission" | "etc";

export type Notification = {
  alarmHistoryId: number;
  lineId: number;
  alarmCode: AlarmCode;
  value: { type: string };
  isRead: boolean;
  createdAt: string;
};

export type NotificationResponse = {
  content: Notification[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};
