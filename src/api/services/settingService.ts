import apiClient from '../client';

// 알림 설정 응답
export interface NotificationSettings {
  familyAlarm: boolean;
  userAlarm: boolean;
  policyChangeAlarm: boolean;
  policyLimitAlarm: boolean;
  permissionAlarm: boolean;
  questionAlarm: boolean;
}

// 알람 코드 타입
type AlarmCode = 'FAMILY' | 'USER' | 'POLICY_CHANGE' | 'POLICY_LIMIT' | 'PERMISSION' | 'QUESTION' | 'OTHERS';

export const settingService = {
  // 전체 알림 설정 조회
  getNotifications: async () => {
    const response = await apiClient.get<NotificationSettings>('/notifications/settings');
    return response.data;
  },

  // 알림 설정 변경 (공통)
  updateNotification: async (alarmCode: AlarmCode, enabled: boolean) => {
    const response = await apiClient.patch<NotificationSettings>(
      '/notifications/settings',
      { enabled },
      { params: { code: alarmCode } }
    );
    return response.data;
  },

  // 가족 데이터 알림 변경
  updateFamilyAlarm: async (enabled: boolean) => {
    return settingService.updateNotification('FAMILY', enabled);
  },

  // 개인 데이터 알림 변경
  updateUserAlarm: async (enabled: boolean) => {
    return settingService.updateNotification('USER', enabled);
  },

  // 정책 변경 알림 변경
  updatePolicyChangeAlarm: async (enabled: boolean) => {
    return settingService.updateNotification('POLICY_CHANGE', enabled);
  },

  // 정책 한도 알림 변경
  updatePolicyLimitAlarm: async (enabled: boolean) => {
    return settingService.updateNotification('POLICY_LIMIT', enabled);
  },

  // 권한 변경 알림 변경
  updatePermissionAlarm: async (enabled: boolean) => {
    return settingService.updateNotification('PERMISSION', enabled);
  },

  // 문의사항 알림 변경
  updateQuestionAlarm: async (enabled: boolean) => {
    return settingService.updateNotification('QUESTION', enabled);
  },
};
