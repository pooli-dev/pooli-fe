import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { blockService } from '@/api';
import type { AppPolicyResponse } from '@/api/services/blockService';
import { getErrorMessage } from '@/api/client';
import Toggle from '@/components/common/Toggle';
import RangeSlider from '@/components/common/RangeSlider';
import { getAppIcon, getDisplayAppName, matchesSearchQuery } from '@/constants/appIcons';
import GlassCard from '@/components/common/GlassCard';
import AppFilterBar from './AppFilterBar';
import AppPolicyFilters from './AppPolicyFilters';

const MAX_DATA_LIMIT_MB = 10000;
const MAX_SPEED_LIMIT_MBPS = 100;

// 앱 카드 컴포넌트
const AppCard = memo(({ 
  app, 
  isExpanded, 
  onToggle, 
  onExpand, 
  onWhitelistToggle,
  onSpeedUpdate,
  onDataUpdate 
}: {
  app: AppPolicyResponse;
  isExpanded: boolean;
  onToggle: () => void;
  onExpand: () => void;
  onWhitelistToggle: () => void;
  onSpeedUpdate: (mbps: number) => void;
  onDataUpdate: (mb: number) => void;
}) => {
  const hasPolicy = !!app.appPolicyId;
  const speedMbps = Math.max(0, app.dailyLimitSpeed ? app.dailyLimitSpeed / 1024 : 0);
  const dataMB = Math.max(0, app.dailyLimitData ? app.dailyLimitData / (1024 * 1024) : 0);
  const appIcon = useMemo(() => getAppIcon(app.appName), [app.appName]);
  const displayName = useMemo(() => getDisplayAppName(app.appName), [app.appName]);
  
  const [tempSpeed, setTempSpeed] = useState(speedMbps);
  const [tempData, setTempData] = useState(dataMB);
  
  useEffect(() => {
    const newSpeed = Math.max(0, speedMbps);
    const newData = Math.max(0, dataMB);
    if (tempSpeed !== newSpeed) setTempSpeed(newSpeed);
    if (tempData !== newData) setTempData(newData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speedMbps, dataMB]);
  
  const showDataBadge = hasPolicy && app.isActive && !app.isWhiteList && dataMB < MAX_DATA_LIMIT_MB;
  const showSpeedBadge = hasPolicy && app.isActive && !app.isWhiteList && speedMbps < MAX_SPEED_LIMIT_MBPS;

  return (
    <div
      id={`app-${app.appPolicyId || app.appId}`}
      className="relative rounded-2xl overflow-hidden"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        padding: "1px",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="relative bg-white rounded-2xl p-4">
        <div
          className="flex items-start gap-3 cursor-pointer"
          onClick={() => app.isActive && onExpand()}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0 overflow-hidden">
            <div className="w-11 h-11 rounded-lg overflow-hidden flex items-center justify-center bg-white flex-shrink-0">
              <img
                src={appIcon}
                alt={app.appName}
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div className="flex-1 min-w-0 overflow-hidden">
              <h4 className="font-medium mb-1 truncate">{displayName}</h4>
              <div className="flex gap-2 items-center flex-wrap overflow-hidden">
                {app.isWhiteList ? (
                  <div
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6rem] whitespace-nowrap flex-shrink-0"
                    style={{ backgroundColor: "#E8F5E9", color: "#4CAF50" }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    정책 예외
                  </div>
                ) : (
                  <>
                    {showDataBadge && (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6rem] whitespace-nowrap flex-shrink-0"
                        style={{ backgroundColor: "#FDECE4", color: "#FF6520" }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                          <rect x="3" y="3" width="4" height="18" fill="#FF6520" />
                          <rect x="10" y="8" width="4" height="13" fill="#FF6520" />
                          <rect x="17" y="13" width="4" height="8" fill="#FF6520" />
                        </svg>
                        사용량 제한
                      </div>
                    )}
                    {showSpeedBadge && (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6rem] whitespace-nowrap flex-shrink-0"
                        style={{ backgroundColor: "#F3ECF6", color: "#B044E3" }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                          <path d="M12 4C7.58172 4 4 7.58172 4 12C4 14.5 5 16.5 6.5 18" stroke="#B044E3" strokeWidth="2" strokeLinecap="round" />
                          <path d="M12 8V12L15 15" stroke="#B044E3" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        속도 제한
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          <div onClick={(e) => e.stopPropagation()} className="flex-shrink-0 pt-1">
            <Toggle checked={app.isActive || false} onChange={onToggle} />
          </div>
        </div>

        {isExpanded && app.isActive && (
          <div className="mt-4 pt-4 border-t">
            <div className="mb-4">
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-gray-700">데이터 사용량 제한</span>
                <div className="flex flex-col items-end gap-1">
                  {tempData >= MAX_DATA_LIMIT_MB ? (
                    <span className="px-3 py-1 text-sm font-semibold text-blue-600">무제한</span>
                  ) : (
                    <div className="relative">
                      <input
                        type="number"
                        value={Math.max(0, tempData).toFixed(0)}
                        onChange={(e) => {
                          const val = Math.max(0, Math.min(MAX_DATA_LIMIT_MB, parseInt(e.target.value) || 0));
                          setTempData(val);
                        }}
                        onBlur={() => onDataUpdate(Math.max(0, tempData))}
                        className="w-28 px-2 py-1 pr-9 text-right border border-gray-300 rounded text-sm font-medium"
                        step="10"
                        min="0"
                        max={MAX_DATA_LIMIT_MB}
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">MB</span>
                    </div>
                  )}
                </div>
              </div>
              <RangeSlider
                value={Math.max(0, tempData)}
                onChange={(val) => setTempData(Math.max(0, val))}
                onChangeEnd={(val) => onDataUpdate(Math.max(0, val))}
                min={0}
                max={MAX_DATA_LIMIT_MB}
                step={10}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0MB</span>
                <span>무제한</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-gray-700">최대 데이터 속도</span>
                <div className="flex flex-col items-end gap-1">
                  {tempSpeed >= MAX_SPEED_LIMIT_MBPS ? (
                    <span className="px-3 py-1 text-sm font-semibold text-blue-600">무제한</span>
                  ) : (
                    <div className="relative">
                      <input
                        type="number"
                        value={Math.max(0, tempSpeed).toFixed(1)}
                        onChange={(e) => {
                          const val = Math.max(0, Math.min(MAX_SPEED_LIMIT_MBPS, parseFloat(e.target.value) || 0));
                          setTempSpeed(val);
                        }}
                        onBlur={() => onSpeedUpdate(Math.max(0, tempSpeed))}
                        className="w-28 px-2 py-1 pr-14 text-right border border-gray-300 rounded text-sm font-medium"
                        step="0.1"
                        min="0"
                        max={MAX_SPEED_LIMIT_MBPS}
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">Mbps</span>
                    </div>
                  )}
                </div>
              </div>
              <RangeSlider
                value={Math.max(0, tempSpeed)}
                onChange={(val) => setTempSpeed(Math.max(0, val))}
                onChangeEnd={(val) => onSpeedUpdate(Math.max(0, val))}
                min={0}
                max={MAX_SPEED_LIMIT_MBPS}
                step={0.1}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0Mbps</span>
                <span>무제한</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">정책 예외 허용</span>
              <input
                type="checkbox"
                checked={app.isWhiteList || false}
                onChange={onWhitelistToggle}
                className="w-5 h-5"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default function AppPolicyTab({ lineId, onPolicyChange }: { lineId: number; onPolicyChange?: () => void }) {
  const [loading, setLoading] = useState(true);
  const [apps, setApps] = useState<AppPolicyResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedApps, setExpandedApps] = useState<Set<number>>(new Set());
  const [policyFilter, setPolicyFilter] = useState<"전체" | "정책없음" | "정책적용" | "정책예외">("전체");
  const [conditionFilters, setConditionFilters] = useState<Set<"사용량 제한" | "속도 제한">>(new Set());
  const [showPolicyDropdown, setShowPolicyDropdown] = useState(false);
  const [sortOrder, setSortOrder] = useState<"이름순" | "활성화순">("이름순");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  useEffect(() => {
    loadApps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineId, sortOrder]);

  const loadApps = async () => {
    setLoading(true);
    try {
      const res = await blockService.getLineApps({
        lineId,
        pageNumber: 0,
        pageSize: 50, // 백엔드 제한에 맞춤
        sortType: sortOrder === "이름순" ? 'NAME' : 'ACTIVE',
      });
      setApps(res.data.content || []);
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const filteredApps = useMemo(() => {
    return apps.filter(app => {
      // 검색 필터
      if (searchQuery && !matchesSearchQuery(app.appName, searchQuery)) {
        return false;
      }

      // 정책 필터
      if (policyFilter === "정책없음" && app.appPolicyId) return false;
      if (policyFilter === "정책적용" && (!app.appPolicyId || !app.isActive)) return false;
      if (policyFilter === "정책예외" && !app.isWhiteList) return false;

      // 조건 필터
      if (conditionFilters.size > 0) {
        const hasDataLimit = app.dailyLimitData && app.dailyLimitData < MAX_DATA_LIMIT_MB * 1024 * 1024;
        const hasSpeedLimit = app.dailyLimitSpeed && app.dailyLimitSpeed < MAX_SPEED_LIMIT_MBPS * 1024;
        
        if (conditionFilters.has("사용량 제한") && !hasDataLimit) return false;
        if (conditionFilters.has("속도 제한") && !hasSpeedLimit) return false;
      }

      return true;
    });
  }, [apps, searchQuery, policyFilter, conditionFilters]);

  const handleToggle = useCallback(async (appId: number, currentActive: boolean) => {
    const newActive = !currentActive;
    
    // 낙관적 UI 업데이트
    setApps(prev => prev.map(a => {
      if (a.appId === appId) {
        return { ...a, isActive: newActive };
      }
      return a;
    }));

    // 활성화 시 바로 펼치기, 비활성화 시 접기
    if (newActive) {
      setExpandedApps(prev => new Set(prev).add(appId));
    } else {
      setExpandedApps(prev => {
        const newSet = new Set(prev);
        newSet.delete(appId);
        return newSet;
      });
    }

    try {
      const response = await blockService.toggleAppPolicy(lineId, appId);
      if (response.data) {
        setApps(prev => prev.map(a => 
          a.appId === appId ? { ...a, ...response.data } : a
        ));
        
        // 활성화 시 0/0 값을 명시적으로 서버에 전송하여 정책 등록 확정
        if (newActive && response.data.appPolicyId) {
          const policyId = response.data.appPolicyId;
          await Promise.all([
            blockService.updateAppLimit(policyId, 0),
            blockService.updateAppSpeed(policyId, 0),
          ]);
        }
      }
      onPolicyChange?.();
    } catch (err) {
      alert(getErrorMessage(err));
      setApps(prev => prev.map(a => 
        a.appId === appId ? { ...a, isActive: currentActive } : a
      ));
      // 실패 시 펼침 상태도 원복
      if (newActive) {
        setExpandedApps(prev => {
          const newSet = new Set(prev);
          newSet.delete(appId);
          return newSet;
        });
      }
    }
  }, [lineId, onPolicyChange]);

  const handleWhitelistToggle = useCallback(async (appPolicyId: number) => {
    setApps(prev => prev.map(a => 
      a.appPolicyId === appPolicyId ? { ...a, isWhiteList: !a.isWhiteList } : a
    ));

    try {
      await blockService.toggleWhitelist(appPolicyId);
      onPolicyChange?.();
    } catch (err) {
      alert(getErrorMessage(err));
      setApps(prev => prev.map(a => 
        a.appPolicyId === appPolicyId ? { ...a, isWhiteList: !a.isWhiteList } : a
      ));
    }
  }, [onPolicyChange]);

  const handleSpeedUpdate = useCallback(async (appPolicyId: number, mbps: number) => {
    const kbps = Math.round(mbps * 1024);
    setApps(prev => prev.map(a => 
      a.appPolicyId === appPolicyId ? { ...a, dailyLimitSpeed: kbps } : a
    ));

    try {
      await blockService.updateAppSpeed(appPolicyId, kbps);
      onPolicyChange?.();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  }, [onPolicyChange]);

  const handleDataUpdate = useCallback(async (appPolicyId: number, mb: number) => {
    const bytes = Math.round(mb * 1024 * 1024);
    setApps(prev => prev.map(a => 
      a.appPolicyId === appPolicyId ? { ...a, dailyLimitData: bytes } : a
    ));

    try {
      await blockService.updateAppLimit(appPolicyId, bytes);
      onPolicyChange?.();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  }, [onPolicyChange]);

  const toggleExpand = useCallback((appPolicyId: number) => {
    setExpandedApps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(appPolicyId)) {
        newSet.delete(appPolicyId);
      } else {
        newSet.add(appPolicyId);
      }
      return newSet;
    });
  }, []);

  const toggleConditionFilter = (condition: "사용량 제한" | "속도 제한") => {
    setConditionFilters((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(condition)) {
        newSet.delete(condition);
      } else {
        newSet.add(condition);
      }
      return newSet;
    });
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-400">불러오는 중...</div>;
  }

  return (
    <div className="relative py-2">
      <GlassCard
        title=""
        gradientFrom="#FFFFFF"
        gradientTo="#CCCCCC"
        bgGradientFrom="#FFFFFF"
        bgGradientTo="#F8F8F8"
        bgOpacity={0.7}
        borderWidth={1}
        borderRadius={20}
        className="w-full overflow-visible"
      >
        <div className="pt-2 mb-4">
          <AppFilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isListening={false}
            handleVoiceSearch={() => {}}
            cancelVoiceSearch={() => {}}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            showSortDropdown={showSortDropdown}
            setShowSortDropdown={setShowSortDropdown}
          />

          <AppPolicyFilters
            policyFilter={policyFilter}
            setPolicyFilter={setPolicyFilter}
            conditionFilters={conditionFilters}
            toggleConditionFilter={toggleConditionFilter}
            showPolicyDropdown={showPolicyDropdown}
            setShowPolicyDropdown={setShowPolicyDropdown}
          />
        </div>

        <div className="space-y-4 px-1.5 sm:px-[13px] pb-2">
          {filteredApps.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              일치하는 결과가 없습니다.
            </div>
          ) : (
            filteredApps.map((app) => {
              const isExpanded = expandedApps.has(app.appId);

              return (
                <AppCard
                  key={`app-${app.appId}`}
                  app={app}
                  isExpanded={isExpanded}
                  onToggle={() => handleToggle(app.appId, app.isActive || false)}
                  onExpand={() => toggleExpand(app.appId)}
                  onWhitelistToggle={() => handleWhitelistToggle(app.appPolicyId!)}
                  onSpeedUpdate={(mbps) => handleSpeedUpdate(app.appPolicyId!, mbps)}
                  onDataUpdate={(mb) => handleDataUpdate(app.appPolicyId!, mb)}
                />
              );
            })
          )}
        </div>
      </GlassCard>
    </div>
  );
}
