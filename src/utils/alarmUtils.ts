import {
  ALARM_CODE_TO_CATEGORY,
  ALARM_MESSAGE_MAP,
} from "@/constants/alarmMessages";
import type { AlarmCategory, AlarmCode, Notification } from "@/types/alarm";

// utils/alarmUtils.ts
export const getAlarmMessage = (notification: Notification): string => {
  const type = notification.value?.type;
  return ALARM_MESSAGE_MAP[type] ?? "새로운 알림이 있습니다.";
};

export const getAlarmCategory = (alarmCode: AlarmCode): AlarmCategory => {
  return ALARM_CODE_TO_CATEGORY[alarmCode] ?? "etc";
};
