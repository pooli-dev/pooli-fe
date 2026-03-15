export type DayKey = "월" | "화" | "수" | "목" | "금" | "토" | "일";

export const DAYS: DayKey[] = ["월", "화", "수", "목", "금", "토", "일"];

export type BlockPolicy = {
  id: number; // repeatBlockId
  lineId: number;
  startHour: number;
  startMin: number;
  endHour: number;
  endMin: number;
  days: DayKey[];
  enabled: boolean; // isActive
};

// API 응답 타입
export type RepeatBlockDay = {
  dayOfWeek: string;
  startAt: string;
  endAt: string;
};

export type RepeatBlockResponse = {
  repeatBlockId: number;
  lineId: number;
  isActive: boolean;
  days: RepeatBlockDay[];
};
