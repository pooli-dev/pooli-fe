import type { AlarmCode, NotificationResponse } from "@/types/alarm";
import { apiClient } from "../client";
export type NotificationTargetType = "DIRECT" | "ALL" | "OWNER" | "MEMBER";

export interface SendNotificationRequest {
  targetType: NotificationTargetType;
  lineId?: number[];
  alarmCode: string;
  value: Record<string, unknown>;
}

export const notificationService = {
  send: async (data: SendNotificationRequest): Promise<void> => {
    await apiClient.post("/notifications", data, {
      timeout: 0,
    });
  },
  getNotifications: (params: {
    pageNumber: number;
    pageSize: number;
    isRead?: boolean;
    code?: AlarmCode;
  }) => apiClient.get<NotificationResponse>("/notifications", { params }),

  markAsRead: (alarmHistoryId: number) =>
    apiClient.patch<Notification>("/notifications", null, {
      params: { alarmHistoryId },
    }),

  markAllAsRead: () =>
    apiClient.patch<{ lineId: number; unreadCount: number; readCount: number }>(
      "/notifications/read-all",
    ),
  getUnreadCount: () =>
    apiClient.get<{ lineId: number; unreadCount: number; readCount: number }>(
      "/notifications/unread-counts",
    ),
};
