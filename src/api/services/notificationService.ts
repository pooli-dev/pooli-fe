import type { AlarmCode, NotificationResponse } from "@/types/alarm";
import apiClient from "../client";

export type NotificationTargetType = "DIRECT" | "ALL" | "OWNER" | "MEMBER";

export interface SendNotificationRequest {
  targetType: NotificationTargetType;
  lineId?: number[]; // DIRECT일 때만 필수
  value: Record<string, unknown>;
}

export const notificationService = {
  send: async (data: SendNotificationRequest) => {
    // 대량 알림 전송은 시간이 오래 걸릴 수 있으므로 타임아웃 없음
    const response = await apiClient.post("/notifications", data, {
      timeout: 0, // 타임아웃 없음
    });
    return response.data;
  },
  getNotifications: (params: {
    pageNumber: number;
    pageSize: number;
    isRead?: boolean;
    code?: AlarmCode;
  }) => apiClient.get<NotificationResponse>("/notifications", { params }),

  markAsRead: (alarmHistoryId: number) =>
    apiClient.patch<Notification>("/notifications", { alarmHistoryId }),

  markAllAsRead: () =>
    apiClient.patch<{ lineId: number; unreadCount: number; readCount: number }>(
      "/notifications/read-all",
    ),
  getUnreadCount: () =>
    apiClient.get<{ lineId: number; unreadCount: number; readCount: number }>(
      "/notifications/unread-counts",
    ),
};
