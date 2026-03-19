// utils/dataFormat.ts

import type { BlockPolicy, DayKey, RepeatBlockResponse } from "@/types/block";

// Byte → GB 변환 (1GB = 1e9 Bytes)
export const bytesToGb = (bytes: number): number => {
  return Math.round((bytes / 1e9) * 100) / 100;
};

// Byte → MB 변환
export const bytesToMb = (bytes: number): number => {
  return Math.round((bytes / 1e6) * 100) / 100;
};

// GB/MB 자동 선택해서 포맷 (예: "1.5GB", "500MB")
export const formatData = (bytes: number): number => {
  return Math.round((bytes / 1e9) * 10) / 10;
};

export const formatDataLabel = (bytes: number): string => {
  const gb = Math.round((bytes / 1e9) * 100) / 100;
  if (gb >= 1) return `${gb}GB`;
  const mb = Math.round(bytes / 1e6);
  return `${mb}MB`;
};

export const DAY_MAP: Record<string, DayKey> = {
  MON: "월",
  TUE: "화",
  WED: "수",
  THU: "목",
  FRI: "금",
  SAT: "토",
  SUN: "일",
};

export const DAY_REVERSE_MAP: Record<DayKey, string> = {
  월: "MON",
  화: "TUE",
  수: "WED",
  목: "THU",
  금: "FRI",
  토: "SAT",
  일: "SUN",
};

export function formatTime(h: number, m: number) {
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function formatDays(days: DayKey[]) {
  if (days.length === 0) return "요일 미설정";
  return days.join(", ") + " 적용됨";
}

export function clampEndTime(
  startH: number,
  startM: number,
  endH: number,
  endM: number,
) {
  const startTotal = startH * 60 + startM;
  const endTotal = endH * 60 + endM;
  const diff =
    endTotal >= startTotal
      ? endTotal - startTotal
      : endTotal + 1440 - startTotal;
  if (diff > 24 * 60) {
    const maxTotal = (startTotal + 24 * 60) % (24 * 60);
    return { endHour: Math.floor(maxTotal / 60), endMin: maxTotal % 60 };
  }
  return { endHour: endH, endMin: endM };
}

// API → 내부 타입 변환
export function toBlockPolicy(res: RepeatBlockResponse): BlockPolicy {
  // days 배열에서 첫 번째 기준으로 시간 파싱 (모든 요일이 같은 시간 가정)
  const firstDay = res.days[0];
  const [startHour, startMin] = firstDay
    ? firstDay.startAt.split(":").map(Number)
    : [0, 0];
  const [endHour, endMin] = firstDay
    ? firstDay.endAt.split(":").map(Number)
    : [0, 0];

  return {
    id: res.repeatBlockId ?? 0,
    lineId: res.lineId,
    startHour,
    startMin,
    endHour,
    endMin,
    days: res.days.map((d) => DAY_MAP[d.dayOfWeek]),
    enabled: res.isActive,
  };
}

// 내부 타입 → API 요청 변환
export function toApiPayload(policy: BlockPolicy) {
  return {
    lineId: policy.lineId,
    repeatBlockId: policy.id,
    isActive: policy.enabled,
    days: policy.days.map((day) => ({
      dayOfWeek: DAY_REVERSE_MAP[day],
      startAt: formatTime(policy.startHour, policy.startMin) + ":00",
      endAt: formatTime(policy.endHour, policy.endMin) + ":00",
    })),
  };
}
