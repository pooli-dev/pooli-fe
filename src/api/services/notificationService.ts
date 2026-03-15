import type { AlarmCode, NotificationResponse } from "@/types/alarm";
import apiClient from "../client";

export const notificationService = {
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
