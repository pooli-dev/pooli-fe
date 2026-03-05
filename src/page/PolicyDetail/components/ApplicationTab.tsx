import { useState } from "react";
import Toggle from "../../../components/common/Toggle";
import RangeSlider from "../../../components/common/RangeSlider";
import micIcon from "../../../assets/icon/mic-icon.png";
import logo from "../../../assets/img/logo.svg";
import youtubeIcon from "../../../assets/img/youtube.png";
import instaIcon from "../../../assets/img/insta.svg";
import tiktokIcon from "../../../assets/img/tiktok.svg";
import netflixIcon from "../../../assets/img/netflix.jpg";
import kakaotalkIcon from "../../../assets/img/kakaotalk.png";
import melonIcon from "../../../assets/img/melon.png";
import safariIcon from "../../../assets/img/safari.png";
import chromeIcon from "../../../assets/img/chrome.jpeg";
import naverIcon from "../../../assets/img/naver.jpeg";
import lmsIcon from "../../../assets/img/lms.png";
import santaIcon from "../../../assets/img/santa.png";
import musinsaIcon from "../../../assets/img/musinsa.png";
import coupangIcon from "../../../assets/img/coupang.jpeg";
import baeminIcon from "../../../assets/img/배달의민족.jpeg";
import karrotIcon from "../../../assets/img/당근.png";
import tossIcon from "../../../assets/img/toss.jpeg";
import pooliIcon from "../../../assets/img/열품타.png";
import type { AppPolicy } from "../../../data/policyDetailDummyData";

// 상수 정의
const MAX_DATA_LIMIT_MB = 5000;
const MAX_SPEED_LIMIT_MBPS = 50;
const MIN_SPEED_LIMIT_MBPS = 1;
const DATA_LIMIT_STEP = 100;
const SPEED_LIMIT_STEP = 1;

// 앱 아이콘 매핑
const APP_ICONS: { [key: string]: string } = {
  "인스타그램": instaIcon,
  "카카오톡": kakaotalkIcon,
  "틱톡": tiktokIcon,
  "멜론": melonIcon,
  "유튜브": youtubeIcon,
  "넷플릭스": netflixIcon,
  "사파리": safariIcon,
  "크롬": chromeIcon,
  "네이버": naverIcon,
  "LMS": lmsIcon,
  "열품타": pooliIcon,
  "산타": santaIcon,
  "무신사": musinsaIcon,
  "쿠팡": coupangIcon,
  "배민": baeminIcon,
  "당근": karrotIcon,
  "토스": tossIcon,
  "Pooli": logo
};

interface ApplicationTabProps {
  appPolicyStates: AppPolicy[];
  setAppPolicyStates: React.Dispatch<React.SetStateAction<AppPolicy[]>>;
  expandedApps: Set<number>;
  setExpandedApps: React.Dispatch<React.SetStateAction<Set<number>>>;
  isListening: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleVoiceSearch: () => void;
  cancelVoiceSearch: () => void;
}

// 앱 정책 상태 확인 헬퍼 함수
const hasDataLimit = (app: AppPolicy) => app.enabled && app.dailyLimitMb < MAX_DATA_LIMIT_MB;
const hasSpeedLimit = (app: AppPolicy) => app.enabled && (app.maxSpeedMbps || 0) < MAX_SPEED_LIMIT_MBPS;
const hasException = (app: AppPolicy) => app.blockAds;

// 배지 표시 여부 확인
const shouldShowDataBadge = (app: AppPolicy) => hasDataLimit(app) && !hasException(app);
const shouldShowSpeedBadge = (app: AppPolicy) => hasSpeedLimit(app) && !hasException(app);

const ApplicationTab = ({
  appPolicyStates,
  setAppPolicyStates,
  expandedApps,
  setExpandedApps,
  isListening,
  searchQuery,
  setSearchQuery,
  handleVoiceSearch,
  cancelVoiceSearch
}: ApplicationTabProps) => {
  const [policyFilter, setPolicyFilter] = useState<"전체" | "정책없음" | "정책적용" | "정책예외">("전체");
  const [conditionFilters, setConditionFilters] = useState<Set<"사용량 제한" | "속도 제한">>(new Set());
  const [showPolicyDropdown, setShowPolicyDropdown] = useState(false);
  const [sortOrder, setSortOrder] = useState<"이름순" | "활성화순">("이름순");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const handleToggleApp = (appPolicyId: number) => {
    setAppPolicyStates(prev =>
      prev.map(app =>
        app.appPolicyId === appPolicyId
          ? { ...app, enabled: !app.enabled }
          : app
      )
    );
    const app = appPolicyStates.find(a => a.appPolicyId === appPolicyId);
    if (app && !app.enabled) {
      setExpandedApps(prev => {
        const newSet = new Set(prev);
        newSet.add(appPolicyId);
        return newSet;
      });
    }
  };

  const toggleExpand = (appPolicyId: number) => {
    setExpandedApps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(appPolicyId)) {
        newSet.delete(appPolicyId);
      } else {
        newSet.add(appPolicyId);
      }
      return newSet;
    });
  };

  const handleDataLimitChange = (appPolicyId: number, value: number) => {
    setAppPolicyStates(prev =>
      prev.map(app =>
        app.appPolicyId === appPolicyId
          ? { ...app, dailyLimitMb: value }
          : app
      )
    );
  };

  const handleDataLimitInputChange = (appPolicyId: number, value: string) => {
    const numValue = parseInt(value) || 0;
    const clampedValue = Math.min(Math.max(numValue, 0), MAX_DATA_LIMIT_MB);
    handleDataLimitChange(appPolicyId, clampedValue);
  };

  const handleSpeedLimitChange = (appPolicyId: number, value: number) => {
    setAppPolicyStates(prev =>
      prev.map(app =>
        app.appPolicyId === appPolicyId
          ? { ...app, maxSpeedMbps: value }
          : app
      )
    );
  };

  const handleSpeedLimitInputChange = (appPolicyId: number, value: string) => {
    const numValue = parseInt(value) || 0;
    const clampedValue = Math.min(Math.max(numValue, MIN_SPEED_LIMIT_MBPS), MAX_SPEED_LIMIT_MBPS);
    handleSpeedLimitChange(appPolicyId, clampedValue);
  };

  const handleBlockAdsToggle = (appPolicyId: number) => {
    setAppPolicyStates(prev =>
      prev.map(app =>
        app.appPolicyId === appPolicyId
          ? { ...app, blockAds: !app.blockAds }
          : app
      )
    );
  };

  const toggleConditionFilter = (condition: "사용량 제한" | "속도 제한") => {
    setConditionFilters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(condition)) {
        newSet.delete(condition);
      } else {
        newSet.add(condition);
      }
      return newSet;
    });
  };

  const filteredApps = appPolicyStates.filter(app => {
    // 검색어 필터
    if (!app.appName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // 정책 필터
    if (policyFilter === "정책없음" && app.enabled) {
      return false;
    }
    if (policyFilter === "정책적용" && (!app.enabled || hasException(app))) {
      return false;
    }
    if (policyFilter === "정책예외" && (!app.enabled || !hasException(app))) {
      return false;
    }

    // 조건 필터
    if (conditionFilters.size > 0) {
      const showDataBadge = shouldShowDataBadge(app);
      const showSpeedBadge = shouldShowSpeedBadge(app);

      if (conditionFilters.size === 2) {
        return showDataBadge && showSpeedBadge;
      }

      const matchesDataLimit = conditionFilters.has("사용량 제한") && showDataBadge;
      const matchesSpeedLimit = conditionFilters.has("속도 제한") && showSpeedBadge;

      return matchesDataLimit || matchesSpeedLimit;
    }

    return true;
  });

  const sortedApps = [...filteredApps].sort((a, b) => {
    if (sortOrder === "활성화순") {
      if (a.enabled === b.enabled) {
        return a.appName.localeCompare(b.appName);
      }
      return a.enabled ? -1 : 1;
    }
    return a.appName.localeCompare(b.appName);
  });

  const getAppIcon = (name: string) => {
    return (
      <img 
        src={APP_ICONS[name]} 
        alt={name} 
        className="w-full h-full object-contain rounded-lg" 
      />
    );
  };

  return (
    <div 
      className="mx-[11px] rounded-3xl relative"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        padding: '1px'
      }}
    >
      <div 
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, rgba(196, 196, 196, 0.2) 0%, rgba(196, 196, 196, 1) 100%)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: '1px'
        }}
      />
      
      <div className="relative bg-white rounded-3xl overflow-hidden">
        <div className="pt-[11px] px-[15px] mb-4">
          {isListening && (
            <div className="mb-3 flex items-center justify-between px-4 py-3 rounded-full bg-gradient-to-r from-[#678BF7] to-[#9A9CEA] text-white">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">음성 인식 중...</span>
              </div>
              <button
                onClick={cancelVoiceSearch}
                className="text-white text-sm underline hover:opacity-80"
              >
                취소
              </button>
            </div>
          )}
          
          <div className="flex gap-2 mb-3">
            <div 
              className="flex-1 relative rounded-full overflow-hidden"
              style={{
                backgroundColor: 'rgba(128, 120, 126, 0.16)'
              }}
            >
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="7" stroke="#727272" strokeWidth="2"/>
                  <path d="M20 20L16 16" stroke="#727272" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <input
                type="text"
                placeholder="앱 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-transparent text-sm focus:outline-none"
                style={{ color: '#727272' }}
              />
              <button 
                onClick={handleVoiceSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <img 
                  src={micIcon} 
                  alt="음성 검색" 
                  className={`w-3.5 h-auto ${isListening ? 'animate-pulse' : ''}`}
                />
              </button>
            </div>
            <div className="relative">
              <button 
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="px-4 py-3 text-sm flex items-center gap-2"
                style={{
                  borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
                }}
              >
                {sortOrder}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              {showSortDropdown && (
                <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 min-w-[120px]">
                  {(["이름순", "활성화순"] as const).map((sort) => (
                    <button
                      key={sort}
                      onClick={() => {
                        setSortOrder(sort);
                        setShowSortDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                        sortOrder === sort ? "text-[#678BF7] font-medium" : "text-gray-700"
                      }`}
                    >
                      {sort}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-6 px-2 overflow-x-auto overflow-y-visible pb-2 flex-nowrap whitespace-nowrap" style={{ fontSize: '11px' }}>
            <div className="flex items-center gap-2 relative flex-shrink-0 whitespace-nowrap">
              <span className="text-gray-700 whitespace-nowrap">정책</span>
              <button
                onClick={() => setShowPolicyDropdown(!showPolicyDropdown)}
                className="px-3 py-1 rounded-full bg-white border border-gray-300 flex items-center gap-2 whitespace-nowrap flex-shrink-0"
                style={{ fontSize: '11px' }}
              >
                {policyFilter}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              {showPolicyDropdown && (
                <div className="absolute top-full left-12 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-[60] min-w-[120px]">
                  {(["전체", "정책없음", "정책적용", "정책예외"] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => {
                        setPolicyFilter(filter);
                        setShowPolicyDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 whitespace-nowrap ${
                        policyFilter === filter ? "text-[#678BF7] font-medium" : "text-gray-700"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 flex-shrink-0 whitespace-nowrap">
              <span className="text-gray-700 whitespace-nowrap">조건</span>
              <div className="flex gap-1 flex-nowrap whitespace-nowrap">
                {(["사용량 제한", "속도 제한"] as const).map((condition) => (
                  <button
                    key={condition}
                    onClick={() => toggleConditionFilter(condition)}
                    className={`relative px-2.5 py-1 rounded-full transition-colors whitespace-nowrap flex-shrink-0 ${
                      conditionFilters.has(condition)
                        ? "text-[#003458]"
                        : "text-gray-600"
                    }`}
                    style={{
                      fontSize: '11px',
                      backgroundColor: conditionFilters.has(condition) 
                        ? 'rgba(223, 248, 254, 0.6)' 
                        : 'transparent',
                      border: '0.5px solid transparent',
                      backgroundImage: conditionFilters.has(condition) 
                        ? 'linear-gradient(rgba(223, 248, 254, 0.6), rgba(223, 248, 254, 0.6)), linear-gradient(90deg, rgba(0, 52, 88, 0.2) 0%, rgba(0, 52, 88, 0.6) 100%)'
                        : 'linear-gradient(white, white), linear-gradient(90deg, rgba(0, 52, 88, 0.2) 0%, rgba(0, 52, 88, 0.6) 100%)',
                      backgroundOrigin: 'border-box',
                      backgroundClip: 'padding-box, border-box'
                    }}
                  >
                    {condition}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>


        <div className="space-y-4 px-[13px] pb-4">
          {sortedApps.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              일치하는 결과가 없습니다.
            </div>
          ) : (
            sortedApps.map((app) => {
            const isExpanded = expandedApps.has(app.appPolicyId);
            const showDataBadge = shouldShowDataBadge(app);
            const showSpeedBadge = shouldShowSpeedBadge(app);
            
            return (
              <div
                key={app.appPolicyId}
                className="relative rounded-2xl overflow-hidden"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  padding: '1px',
                  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div 
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    background: 'linear-gradient(90deg, rgba(103, 139, 247, 0.2) 0%, rgba(103, 139, 247, 1) 100%)',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    padding: '1px'
                  }}
                />
                
                <div className="relative bg-white rounded-2xl p-5">
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleExpand(app.appPolicyId)}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center bg-white">
                        {getAppIcon(app.appName)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{app.appName}</h4>
                        <div className="flex gap-2 mt-2">
                          {showDataBadge && (
                            <div 
                              className="flex items-center gap-1 px-3 py-1 rounded-full text-xs whitespace-nowrap"
                              style={{ backgroundColor: '#FDECE4', color: '#FF6520' }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <rect x="3" y="3" width="4" height="18" fill="#FF6520"/>
                                <rect x="10" y="8" width="4" height="13" fill="#FF6520"/>
                                <rect x="17" y="13" width="4" height="8" fill="#FF6520"/>
                              </svg>
                              사용량 제한
                            </div>
                          )}
                          {showSpeedBadge && (
                            <div 
                              className="flex items-center gap-1 px-3 py-1 rounded-full text-xs whitespace-nowrap"
                              style={{ backgroundColor: '#F3ECF6', color: '#B044E3' }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d="M12 4C7.58172 4 4 7.58172 4 12C4 14.5 5 16.5 6.5 18" stroke="#B044E3" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M12 8V12L15 15" stroke="#B044E3" strokeWidth="2" strokeLinecap="round"/>
                              </svg>
                              속도 제한
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div onClick={(e) => e.stopPropagation()}>
                      <Toggle
                        checked={app.enabled}
                        onChange={() => handleToggleApp(app.appPolicyId)}
                      />
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="mb-4">
                        <div className="flex justify-between items-center text-sm mb-2">
                          <span className="text-gray-700">데이터 사용량 제한 (MB)</span>
                          <input
                            type="number"
                            value={app.dailyLimitMb}
                            onChange={(e) => handleDataLimitInputChange(app.appPolicyId, e.target.value)}
                            disabled={!app.enabled}
                            className="w-24 px-2 py-1 text-right border border-gray-300 rounded text-sm font-medium disabled:bg-gray-100 disabled:text-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            min="0"
                            max="5000"
                          />
                        </div>
                        <RangeSlider
                          value={app.dailyLimitMb}
                          onChange={(value: number) => handleDataLimitChange(app.appPolicyId, value)}
                          min={0}
                          max={MAX_DATA_LIMIT_MB}
                          step={DATA_LIMIT_STEP}
                          disabled={!app.enabled}
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>0GB</span>
                          <span>{MAX_DATA_LIMIT_MB / 1000}GB</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between items-center text-sm mb-2">
                          <span className="text-gray-700">최대 데이터 속도 (Mbps)</span>
                          <input
                            type="number"
                            value={app.maxSpeedMbps}
                            onChange={(e) => handleSpeedLimitInputChange(app.appPolicyId, e.target.value)}
                            disabled={!app.enabled}
                            className="w-24 px-2 py-1 text-right border border-gray-300 rounded text-sm font-medium disabled:bg-gray-100 disabled:text-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            min={MIN_SPEED_LIMIT_MBPS}
                            max={MAX_SPEED_LIMIT_MBPS}
                          />
                        </div>
                        <RangeSlider
                          value={app.maxSpeedMbps || 0}
                          onChange={(value: number) => handleSpeedLimitChange(app.appPolicyId, value)}
                          min={MIN_SPEED_LIMIT_MBPS}
                          max={MAX_SPEED_LIMIT_MBPS}
                          step={SPEED_LIMIT_STEP}
                          disabled={!app.enabled}
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>{MIN_SPEED_LIMIT_MBPS}Mbps</span>
                          <span>{MAX_SPEED_LIMIT_MBPS}Mbps</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">정책 예외 허용</span>
                        <input
                          type="checkbox"
                          checked={app.blockAds}
                          onChange={() => handleBlockAdsToggle(app.appPolicyId)}
                          disabled={!app.enabled}
                          className="w-5 h-5"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationTab;
