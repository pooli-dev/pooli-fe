import { useState, useEffect } from 'react';
import Toggle from '../../../components/common/Toggle';
import { settingService } from '../../../api';

export default function NotificationSettings() {
  const [familyDataNotification, setFamilyDataNotification] = useState(false);
  const [personalDataNotification, setPersonalDataNotification] = useState(false);
  const [policyChangeNotification, setPolicyChangeNotification] = useState(true);
  const [policyLimitNotification, setPolicyLimitNotification] = useState(true);
  const [permissionChangeNotification, setPermissionChangeNotification] = useState(false);
  const [inquiryNotification, setInquiryNotification] = useState(false);

  // 알림 설정 조회
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        console.log('=== 알림 설정 조회 시작 ===');
        const data = await settingService.getNotifications();
        console.log('✅ 알림 설정 조회 성공:', {
          familyAlarm: data.familyAlarm,
          userAlarm: data.userAlarm,
          policyChangeAlarm: data.policyChangeAlarm,
          policyLimitAlarm: data.policyLimitAlarm,
          permissionAlarm: data.permissionAlarm,
          questionAlarm: data.questionAlarm,
        });
        setFamilyDataNotification(data.familyAlarm);
        setPersonalDataNotification(data.userAlarm);
        setPolicyChangeNotification(data.policyChangeAlarm);
        setPolicyLimitNotification(data.policyLimitAlarm);
        setPermissionChangeNotification(data.permissionAlarm);
        setInquiryNotification(data.questionAlarm);
      } catch (error) {
        console.error('❌ 알림 설정 조회 실패:', error);
      }
    };
    void fetchNotifications();
  }, []);

  // 알림 변경 핸들러
  const handleFamilyDataChange = async (enabled: boolean) => {
    const prevValue = familyDataNotification;
    setFamilyDataNotification(enabled);
    try {
      console.log(`=== 가족 데이터 알림 변경 시작 ===`);
      console.log(`요청: PATCH /notifications/settings?code=FAMILY`);
      console.log(`Body:`, { enabled });
      await settingService.updateFamilyAlarm(enabled);
      console.log(`✅ 가족 데이터 알림 변경 성공`);
    } catch (error: unknown) {
      console.error('❌ 가족 데이터 알림 변경 실패:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; statusText?: string; data?: unknown; headers?: unknown } };
        console.error('에러 상세:', {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
          headers: axiosError.response?.headers,
        });
      }
      setFamilyDataNotification(prevValue);
      alert('알림 설정 변경에 실패했습니다.');
    }
  };

  const handlePersonalDataChange = async (enabled: boolean) => {
    const prevValue = personalDataNotification;
    setPersonalDataNotification(enabled);
    try {
      await settingService.updateUserAlarm(enabled);
    } catch (error) {
      console.error('개인 데이터 알림 변경 실패:', error);
      setPersonalDataNotification(prevValue);
      alert('알림 설정 변경에 실패했습니다.');
    }
  };

  const handlePolicyChangeChange = async (enabled: boolean) => {
    const prevValue = policyChangeNotification;
    setPolicyChangeNotification(enabled);
    try {
      await settingService.updatePolicyChangeAlarm(enabled);
    } catch (error) {
      console.error('정책 변경 알림 변경 실패:', error);
      setPolicyChangeNotification(prevValue);
      alert('알림 설정 변경에 실패했습니다.');
    }
  };

  const handlePolicyLimitChange = async (enabled: boolean) => {
    const prevValue = policyLimitNotification;
    setPolicyLimitNotification(enabled);
    try {
      await settingService.updatePolicyLimitAlarm(enabled);
    } catch (error) {
      console.error('정책 한도 알림 변경 실패:', error);
      setPolicyLimitNotification(prevValue);
      alert('알림 설정 변경에 실패했습니다.');
    }
  };

  const handlePermissionChange = async (enabled: boolean) => {
    const prevValue = permissionChangeNotification;
    setPermissionChangeNotification(enabled);
    try {
      await settingService.updatePermissionAlarm(enabled);
    } catch (error) {
      console.error('권한 변경 알림 변경 실패:', error);
      setPermissionChangeNotification(prevValue);
      alert('알림 설정 변경에 실패했습니다.');
    }
  };

  const handleInquiryChange = async (enabled: boolean) => {
    const prevValue = inquiryNotification;
    setInquiryNotification(enabled);
    try {
      await settingService.updateQuestionAlarm(enabled);
    } catch (error) {
      console.error('문의사항 알림 변경 실패:', error);
      setInquiryNotification(prevValue);
      alert('알림 설정 변경에 실패했습니다.');
    }
  };

  return (
    <div className="mb-8 px-[34.5px]">
      <div className="flex items-center gap-2 mb-4">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
          <path d="M10 2a6 6 0 0 1 6 6c0 3.5 1 5 2 6H2c1-1 2-2.5 2-6a6 6 0 0 1 6-6z" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 17a2 2 0 1 0 4 0" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h2 className="font-semibold text-[#333333] text-[16px]">알림 설정</h2>
      </div>

      <div className="bg-white rounded-2xl p-5 space-y-5 shadow-sm">
        {/* 데이터 */}
        <div className="pr-[18px] pt-[2px]">
          <div className="mb-3 pl-4">
            <span className="text-[#0E8EFF] font-semibold text-[14px]">데이터</span>
          </div>
          <div className="space-y-3 pl-5">
            <div className="flex items-center justify-between">
              <span className="text-[#333333] text-[14px]">가족 데이터 알림</span>
              <div className="scale-90">
                <Toggle checked={familyDataNotification} onChange={handleFamilyDataChange} aria-label="가족 데이터 알림" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#333333] text-[14px]">개인 데이터 알림</span>
              <div className="scale-90">
                <Toggle checked={personalDataNotification} onChange={handlePersonalDataChange} aria-label="개인 데이터 알림" />
              </div>
            </div>
          </div>
        </div>

        {/* 정책 */}
        <div className="pr-[18px] pt-[2px]">
          <div className="mb-3 pl-4">
            <span className="text-[#0E8EFF] font-semibold text-[14px]">정책</span>
          </div>
          <div className="space-y-3 pl-5">
            <div className="flex items-center justify-between">
              <span className="text-[#333333] text-[14px]">정책 변경 알림</span>
              <div className="scale-90">
                <Toggle checked={policyChangeNotification} onChange={handlePolicyChangeChange} aria-label="정책 변경 알림" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#333333] text-[14px]">정책 한도 알림</span>
              <div className="scale-90">
                <Toggle checked={policyLimitNotification} onChange={handlePolicyLimitChange} aria-label="정책 한도 알림" />
              </div>
            </div>
          </div>
        </div>

        {/* 기타 */}
        <div className="pr-[18px] pt-[2px]">
          <div className="mb-3 pl-4">
            <span className="text-[#0E8EFF] font-semibold text-[14px]">기타</span>
          </div>
          <div className="space-y-3 pl-5">
            <div className="flex items-center justify-between">
              <span className="text-[#333333] text-[14px]">권한 변경 알림</span>
              <div className="scale-90">
                <Toggle checked={permissionChangeNotification} onChange={handlePermissionChange} aria-label="권한 변경 알림" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#333333] text-[14px]">문의사항 알림</span>
              <div className="scale-90">
                <Toggle checked={inquiryNotification} onChange={handleInquiryChange} aria-label="문의사항 알림" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
