import { useState } from 'react';
import { useSettingStore } from '../store/settingStore';
import Toggle from '../components/common/Toggle';

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
  const [personalDataThresholdEnabled, setPersonalDataThresholdEnabled] = useState(true);
  const [personalDataThreshold, setPersonalDataThreshold] = useState(500); // MB 단위
  const [policyChangeNotification, setPolicyChangeNotification] = useState(true);
  const [policyActivityNotification, setPolicyActivityNotification] = useState(true);
  const [permissionChangeNotification, setPermissionChangeNotification] = useState(false);
  const [inquiryNotification, setInquiryNotification] = useState(false);

  const handleThresholdChange = (value: number) => {
    setPersonalDataThreshold(Math.max(0, Math.min(10000, value))); // 0-10000 MB 범위
  };

  return (
    <div className="relative h-[calc(100vh-106px-100px)] overflow-y-auto mt-[106px] mb-[100px]">
      <div className="px-5 py-5">
      {/* 모드 설정 */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="2" width="7" height="7" rx="1" stroke="#333333" strokeWidth="1.5" />
            <rect x="11" y="2" width="7" height="7" rx="1" stroke="#333333" strokeWidth="1.5" />
            <rect x="2" y="11" width="7" height="7" rx="1" stroke="#333333" strokeWidth="1.5" />
            <rect x="11" y="11" width="7" height="7" rx="1" stroke="#333333" strokeWidth="1.5" />
          </svg>
          <h2 className="font-semibold text-[#333333]" style={{ fontSize: '1.125em' }}>모드 설정</h2>
        </div>

        <div className="bg-white rounded-2xl p-5 space-y-4 shadow-sm">
          {/* 다크 모드 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[#333333] font-medium" style={{ fontSize: '0.875em' }}>다크 모드</span>
              <InfoTooltip text="화면 밝기 다크 모드를 바꿀 수 있습니다." />
            </div>
            <DarkModeToggle checked={darkMode} onChange={setDarkMode} />
          </div>

          {/* 큰글씨 모드 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[#333333] font-medium" style={{ fontSize: '0.875em' }}>큰글씨 모드</span>
              <InfoTooltip text="글자 크기가 커지며 좀 더 글자가 잘 보이도록 합니다." />
            </div>
            <LargeTextToggle checked={largeTextMode} onChange={setLargeTextMode} />
          </div>

          {/* 어린이 모드 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[#333333] font-medium" style={{ fontSize: '0.875em' }}>어린이 모드</span>
              <InfoTooltip text="이해가 어려운 데이터 관련 용어들을 쉬운 언어로 번역합니다." />
            </div>
            <ChildModeToggle checked={childMode} onChange={setChildMode} />
          </div>
        </div>
      </div>

      {/* 알림 설정 */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2a6 6 0 0 1 6 6c0 3.5 1 5 2 6H2c1-1 2-2.5 2-6a6 6 0 0 1 6-6z" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 17a2 2 0 1 0 4 0" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h2 className="font-semibold text-[#333333]" style={{ fontSize: '1.125em' }}>알림 설정</h2>
        </div>

        <div className="bg-white rounded-2xl p-5 space-y-5 shadow-sm">
          {/* 데이터 */}
          <div>
            <div className="mb-3">
              <span className="text-[#0088FF] font-semibold" style={{ fontSize: '0.875em' }}>데이터</span>
            </div>
            <div className="pl-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[#666666]" style={{ fontSize: '0.875em' }}>가족 데이터 알림</span>
                <div className="scale-90">
                  <Toggle checked={familyDataNotification} onChange={setFamilyDataNotification} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#666666]" style={{ fontSize: '0.875em' }}>개인 데이터 알림</span>
                <div className="scale-90">
                  <Toggle checked={personalDataNotification} onChange={setPersonalDataNotification} />
                </div>
              </div>
              
              {/* 개인 데이터 임계치 */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[#666666]" style={{ fontSize: '0.875em' }}>개인 데이터 임계치 알림</span>
                  <div className="scale-90">
                    <Toggle checked={personalDataThresholdEnabled} onChange={setPersonalDataThresholdEnabled} />
                  </div>
                </div>
                
                {personalDataThresholdEnabled && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 relative">
                        <input
                          type="range"
                          min="0"
                          max="10000"
                          step="50"
                          value={personalDataThreshold}
                          onChange={(e) => handleThresholdChange(Number(e.target.value))}
                          className="w-full h-2 rounded-lg appearance-none cursor-pointer slider-custom"
                          style={{
                            background: `linear-gradient(to right, #678BF7 0%, #9A9CEA ${(personalDataThreshold / 10000) * 100}%, #E0E0E0 ${(personalDataThreshold / 10000) * 100}%, #E0E0E0 100%)`
                          }}
                        />
                      </div>
                      <div className="flex items-center ml-3">
                        <input
                          type="number"
                          value={personalDataThreshold}
                          onChange={(e) => handleThresholdChange(Number(e.target.value))}
                          className="w-16 px-2 py-1.5 border border-[#678BF7] rounded-l-lg text-center text-[#678BF7] font-medium border-r-0 number-input-small"
                          style={{ 
                            fontSize: '0.875em',
                            backgroundColor: 'rgba(103, 139, 247, 0.1)'
                          }}
                          min="0"
                          max="10000"
                        />
                        <div className="py-1.5 pl-1 pr-2 border border-[#678BF7] rounded-r-lg text-[#818181] border-l-0 whitespace-nowrap flex items-center justify-start" style={{ 
                          fontSize: '0.875em',
                          backgroundColor: 'rgba(103, 139, 247, 0.1)'
                        }}>
                          MB
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 정책 */}
          <div>
            <div className="mb-3">
              <span className="text-[#0088FF] font-semibold" style={{ fontSize: '0.875em' }}>정책</span>
            </div>
            <div className="pl-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[#666666]" style={{ fontSize: '0.875em' }}>정책 변경 알림</span>
                <div className="scale-90">
                  <Toggle checked={policyChangeNotification} onChange={setPolicyChangeNotification} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#666666]" style={{ fontSize: '0.875em' }}>정책 활동 알림</span>
                <div className="scale-90">
                  <Toggle checked={policyActivityNotification} onChange={setPolicyActivityNotification} />
                </div>
              </div>
            </div>
          </div>

          {/* 기타 */}
          <div>
            <div className="mb-3">
              <span className="text-[#0088FF] font-semibold" style={{ fontSize: '0.875em' }}>기타</span>
            </div>
            <div className="pl-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[#666666]" style={{ fontSize: '0.875em' }}>권한 변경 알림</span>
                <div className="scale-90">
                  <Toggle checked={permissionChangeNotification} onChange={setPermissionChangeNotification} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#666666]" style={{ fontSize: '0.875em' }}>문의사항 알림</span>
                <div className="scale-90">
                  <Toggle checked={inquiryNotification} onChange={setInquiryNotification} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 로그아웃 버튼 */}
      <div className="flex justify-center mb-3">
        <button className={`px-12 py-3 text-[#FF6B6B] font-medium rounded-2xl bg-white shadow-sm ${darkMode ? 'invert' : ''}`}>
          로그아웃
        </button>
      </div>
      </div>
    </div>
  );
}
