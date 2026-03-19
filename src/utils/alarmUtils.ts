import {
  ALARM_CODE_TO_CATEGORY,
  ALARM_MESSAGE_MAP,
} from "@/constants/alarmMessages";
import type { AlarmCategory, AlarmCode, Notification } from "@/types/alarm";

// utils/alarmUtils.ts
export function getAlarmMessage(notification: Notification): string {
  const { value } = notification;

  // value.message가 있으면 우선 사용
  if (value.message) return value.message;

  // 없으면 value.type → ALARM_MESSAGE_MAP 조회
  return ALARM_MESSAGE_MAP[value.type] ?? "알림이 도착했습니다.";
}

export const getAlarmCategory = (alarmCode: AlarmCode): AlarmCategory => {
  return ALARM_CODE_TO_CATEGORY[alarmCode] ?? "etc";
};
