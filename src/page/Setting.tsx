import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettingStore } from '../store/settingStore';
import Toggle from '../components/common/Toggle';
import { authService, settingService } from '../api';

/**
 * 정보 툴팁 컴포넌트
 * @param text - 툴팁에 표시할 텍스트
 * @returns 툴팁 JSX
 */
const InfoTooltip = ({ text }: { text: string }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        aria-label="정보"
        className="w-5 h-5 rounded-full bg-[#CCCCCC] flex items-center justify-center text-white cursor-help"
        style={{ fontSize: '0.75em' }}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
      >
        i
      </button>
      {isVisible && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-2 bg-[#333333] text-white rounded-lg shadow-lg z-10" style={{ fontSize: '0.75em' }}>
          {text}
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#333333]" />
        </div>
      )}
    </div>
  );
};

/**
 * 다크모드 토글 컴포넌트 (달 ↔ 해)
 * @param checked - 다크모드 활성화 여부
 * @param onChange - 상태 변경 핸들러
 * @returns 다크모드 토글 JSX
 */
const DarkModeToggle = ({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label="다크 모드"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-200 ${
        checked ? 'bg-[#4A5568]' : 'bg-[#E0E0E0]'
      }`}
    >
      <span
        className={`inline-flex h-7 w-7 transform items-center justify-center rounded-full bg-white shadow-lg transition-transform duration-200 ${
          checked ? 'translate-x-8' : 'translate-x-1'
        }`}
      >
        {checked ? (
          // 달 아이콘 (다크모드 ON)
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#4A5568" stroke="#4A5568" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          // 해 아이콘 (다크모드 OFF)
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="4" fill="#FDB813" stroke="#FDB813" strokeWidth="2"/>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="#FDB813" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )}
      </span>
    </button>
  );
};

/**
 * 큰글씨 모드 토글 컴포넌트 (a ↔ A)
 * @param checked - 큰글씨 모드 활성화 여부
 * @param onChange - 상태 변경 핸들러
 * @returns 큰글씨 모드 토글 JSX
 */
const LargeTextToggle = ({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label="큰글씨 모드"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-200 ${
        checked ? 'bg-[#7B9EFF]' : 'bg-[#E0E0E0]'
      }`}
    >
      <span
        className={`inline-flex h-7 w-7 transform items-center justify-center rounded-full bg-white shadow-lg transition-transform duration-200 ${
          checked ? 'translate-x-8' : 'translate-x-1'
        }`}
      >
        <span className={`font-bold ${checked ? 'text-[#7B9EFF]' : 'text-[#999999]'}`} style={{ fontSize: checked ? '1.25em' : '1em' }}>{checked ? 'A' : 'a'}</span>
      </span>
    </button>
  );
};

/**
 * 어린이 모드 토글 컴포넌트 (아기 얼굴)
 * @param checked - 어린이 모드 활성화 여부
 * @param onChange - 상태 변경 핸들러
 * @returns 어린이 모드 토글 JSX
 */
const ChildModeToggle = ({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label="어린이 모드"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-200 ${
        checked ? 'bg-[#7B9EFF]' : 'bg-[#E0E0E0]'
      }`}
    >
      <span
        className={`inline-flex h-7 w-7 transform items-center justify-center rounded-full bg-white shadow-lg transition-transform duration-200 ${
          checked ? 'translate-x-8' : 'translate-x-1'
        }`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          {/* 아기 얼굴 */}
          <circle cx="12" cy="11" r="8" stroke={checked ? '#7B9EFF' : '#999999'} strokeWidth="2" fill="none"/>
          {/* 눈 */}
          <circle cx="9" cy="10" r="1.2" fill={checked ? '#7B9EFF' : '#999999'}/>
          <circle cx="15" cy="10" r="1.2" fill={checked ? '#7B9EFF' : '#999999'}/>
          {/* 볼 */}
          <circle cx="7" cy="12" r="1.5" fill={checked ? '#FFB3BA' : '#E0E0E0'} opacity="0.6"/>
          <circle cx="17" cy="12" r="1.5" fill={checked ? '#FFB3BA' : '#E0E0E0'} opacity="0.6"/>
          {/* 입 (작은 동그라미) */}
          <circle cx="12" cy="14" r="1" fill={checked ? '#7B9EFF' : '#999999'}/>
          {/* 머리카락 */}
          <path d="M8 5c0-1 1-2 2-2M12 3c0-1 0-1.5 0-1.5M16 5c0-1-1-2-2-2" stroke={checked ? '#7B9EFF' : '#999999'} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </span>
    </button>
  );
};

/**
 * 설정 페이지 컴포넌트
 * 모드 설정(다크/큰글씨/어린이)과 알림 설정을 제공합니다.
 * @returns 설정 페이지 JSX
 */
export default function Setting() {
  const navigate = useNavigate();
  
  // 전역 상태에서 모드 가져오기
  const darkMode = useSettingStore(state => state.darkMode);
  const largeTextMode = useSettingStore(state => state.largeTextMode);
  const childMode = useSettingStore(state => state.childMode);
  const setDarkMode = useSettingStore(state => state.setDarkMode);
  const setLargeTextMode = useSettingStore(state => state.setLargeTextMode);
  const setChildMode = useSettingStore(state => state.setChildMode);

  // 알림 설정
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
        console.log('알림 설정 조회 시작...');
        const data = await settingService.getNotifications();
        console.log('알림 설정 조회 성공:', data);
        setFamilyDataNotification(data.familyAlarm);
        setPersonalDataNotification(data.userAlarm);
        setPolicyChangeNotification(data.policyChangeAlarm);
        setPolicyLimitNotification(data.policyLimitAlarm);
        setPermissionChangeNotification(data.permissionAlarm);
        setInquiryNotification(data.questionAlarm);
      } catch (error) {
        console.error('알림 설정 조회 실패:', error);
        // 백엔드 에러 시 기본값 유지
      }
    };
    void fetchNotifications();
  }, []);

  // 알림 변경 핸들러
  const handleFamilyDataChange = async (enabled: boolean) => {
    const prevValue = familyDataNotification;
    setFamilyDataNotification(enabled);
    try {
      console.log('가족 데이터 알림 변경 요청:', { enabled });
      await settingService.updateFamilyAlarm(enabled);
      console.log('가족 데이터 알림 변경 성공');
    } catch (error) {
      console.error('가족 데이터 알림 변경 실패:', error);
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

  const handleLogout = async () => {
    try {
      await authService.logout();
      // 로컬 스토리지 정리
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      // 로그인 페이지로 이동
      navigate('/login');
    } catch (error) {
      console.error('로그아웃 에러:', error);
      // 에러가 나도 로그인 페이지로 이동
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  return (
    <div className="relative h-[calc(100vh-106px-100px)] overflow-y-auto mt-[106px] mb-[100px]">
      <div className="py-5">
      {/* 모드 설정 */}
      <div className="mb-8 px-[34.5px]">
        <div className="flex items-center gap-2 mb-4">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="2" width="7" height="7" rx="1" stroke="#333333" strokeWidth="1.5" />
            <rect x="11" y="2" width="7" height="7" rx="1" stroke="#333333" strokeWidth="1.5" />
            <rect x="2" y="11" width="7" height="7" rx="1" stroke="#333333" strokeWidth="1.5" />
            <rect x="11" y="11" width="7" height="7" rx="1" stroke="#333333" strokeWidth="1.5" />
          </svg>
          <h2 className="font-semibold text-[#333333] text-[16px]">모드 설정</h2>
        </div>

        <div className="bg-white rounded-2xl p-5 space-y-4 shadow-sm">
          {/* 다크 모드 */}
          <div className="flex items-center justify-between px-5">
            <div className="flex items-center gap-2">
              <span className="text-[#333333] font-medium text-[14px]">다크 모드</span>
              <InfoTooltip text="화면 밝기 다크 모드를 바꿀 수 있습니다." />
            </div>
            <DarkModeToggle checked={darkMode} onChange={setDarkMode} />
          </div>

          {/* 큰글씨 모드 */}
          <div className="flex items-center justify-between px-5">
            <div className="flex items-center gap-2">
              <span className="text-[#333333] font-medium text-[14px]">큰글씨 모드</span>
              <InfoTooltip text="글자 크기가 커지며 좀 더 글자가 잘 보이도록 합니다." />
            </div>
            <LargeTextToggle checked={largeTextMode} onChange={setLargeTextMode} />
          </div>

          {/* 어린이 모드 */}
          <div className="flex items-center justify-between px-5">
            <div className="flex items-center gap-2">
              <span className="text-[#333333] font-medium text-[14px]">어린이 모드</span>
              <InfoTooltip text="이해가 어려운 데이터 관련 용어들을 쉬운 언어로 번역합니다." />
            </div>
            <ChildModeToggle checked={childMode} onChange={setChildMode} />
          </div>
        </div>
      </div>

      {/* 알림 설정 */}
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

      {/* 로그아웃 버튼 */}
      <div className="flex justify-center mb-3">
        <button 
          onClick={handleLogout}
          className={`px-12 py-3 text-[#FF6B6B] font-medium rounded-2xl bg-white shadow-sm hover:bg-red-50 transition-colors ${darkMode ? 'invert' : ''}`}
        >
          로그아웃
        </button>
      </div>
      </div>
    </div>
  );
}
