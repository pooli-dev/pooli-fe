import { useState, useMemo, useCallback } from "react";
import Toggle from "../../../components/common/Toggle";
import RangeSlider from "../../../components/common/RangeSlider";
import InfoTooltip from "../../../components/common/InfoTooltip";
import { getAppIcon, getDisplayAppName } from "@/constants/appIcons";
import type { AppPolicy } from "../../../data/policyDetailDummyData";

const MAX_DATA_LIMIT_MB = 5000;
const MAX_SPEED_LIMIT_MBPS = 50;
const DATA_LIMIT_STEP = 100;
const SPEED_LIMIT_STEP = 1;

interface AppCardProps {
  app: AppPolicy;
  isExpanded: boolean;
  showDataBadge: boolean;
  showSpeedBadge: boolean;
  onToggle: () => void;
  onExpand: () => void;
  onDataLimitChange: (value: number) => void;
  onDataLimitInputChange: (value: string) => void;
  onSpeedLimitChange: (value: number) => void;
  onSpeedLimitInputChange: (value: string) => void;
  onBlockAdsToggle: () => void;
}

const AppCard = ({
  app,
  isExpanded,
  showDataBadge,
  showSpeedBadge,
  onToggle,
  onExpand,
  onDataLimitChange,
  onDataLimitInputChange,
  onSpeedLimitChange,
  onSpeedLimitInputChange,
  onBlockAdsToggle,
}: AppCardProps) => {
  const [showDataError, setShowDataError] = useState(false);
  const [showSpeedError, setShowSpeedError] = useState(false);
  const [tempDataLimit, setTempDataLimit] = useState(app.dailyLimitMb);
  const [tempSpeedLimit, setTempSpeedLimit] = useState(app.maxSpeedMbps || 0);

  // Props 변경 시 로컬 상태 동기화
  if (tempDataLimit !== app.dailyLimitMb) {
    setTempDataLimit(app.dailyLimitMb);
  }
  if (tempSpeedLimit !== (app.maxSpeedMbps || 0)) {
    setTempSpeedLimit(app.maxSpeedMbps || 0);
  }

  const appIcon = useMemo(() => getAppIcon(app.appName), [app.appName]);
  const displayName = useMemo(() => getDisplayAppName(app.appName), [app.appName]);
  const isDataUnlimited = tempDataLimit >= MAX_DATA_LIMIT_MB;
  const isSpeedUnlimited = tempSpeedLimit >= MAX_SPEED_LIMIT_MBPS;

  const handleDataInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (value && isNaN(Number(value))) {
      setShowDataError(true);
      setTimeout(() => setShowDataError(false), 1000);
      return;
    }
    
    setTempDataLimit(Number(value) || 0);
    onDataLimitInputChange(value);
  }, [onDataLimitInputChange]);

  const handleSpeedInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (value && isNaN(Number(value))) {
      setShowSpeedError(true);
      setTimeout(() => setShowSpeedError(false), 1000);
      return;
    }
    
    setTempSpeedLimit(Number(value) || 0);
    onSpeedLimitInputChange(value);
  }, [onSpeedLimitInputChange]);

  return (
    <div
      id={`app-${app.appPolicyId}`}
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
          onClick={onExpand}
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
                {app.blockAds ? (
                  <div
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6rem] whitespace-nowrap flex-shrink-0"
                    style={{
                      backgroundColor: "#E8F5E9",
                      color: "#4CAF50",
                    }}
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="flex-shrink-0"
                    >
                      <path
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        stroke="#4CAF50"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    정책 예외
                  </div>
                ) : (
                  <>
                    {showDataBadge && (
                      <div
                        className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6rem] whitespace-nowrap flex-shrink-0"
                        style={{
                          backgroundColor: "#FDECE4",
                          color: "#FF6520",
                        }}
                      >
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="flex-shrink-0"
                        >
                          <rect
                            x="3"
                            y="3"
                            width="4"
                            height="18"
                            fill="#FF6520"
                          />
                          <rect
                            x="10"
                            y="8"
                            width="4"
                            height="13"
                            fill="#FF6520"
                          />
                          <rect
                            x="17"
                            y="13"
                            width="4"
                            height="8"
                            fill="#FF6520"
                          />
                        </svg>
                        사용량 제한
                      </div>
                    )}
                    {showSpeedBadge && (
                      <div
                        className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6rem] whitespace-nowrap flex-shrink-0"
                        style={{
                          backgroundColor: "#F3ECF6",
                          color: "#B044E3",
                        }}
                      >
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="flex-shrink-0"
                        >
                          <path
                            d="M12 4C7.58172 4 4 7.58172 4 12C4 14.5 5 16.5 6.5 18"
                            stroke="#B044E3"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <path
                            d="M12 8V12L15 15"
                            stroke="#B044E3"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
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
            <Toggle
              checked={app.enabled}
              onChange={onToggle}
            />
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t">
            <div className="mb-4">
              <div className="flex justify-between items-center text-sm mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-700">
                    데이터 사용량 제한
                  </span>
                  <InfoTooltip text="데이터 사용량 제한은 0~5000MB까지 가능합니다. 범위 이상의 값은 무제한으로 인식됩니다." />
                </div>
                <div className="flex flex-col items-end gap-1">
                  {isDataUnlimited ? (
                    <span className="px-3 py-1 text-sm font-semibold text-blue-600">
                      무제한
                    </span>
                  ) : (
                    <div className="relative">
                      <input
                        type="text"
                        value={tempDataLimit}
                        onChange={handleDataInputChange}
                        disabled={!app.enabled}
                        className="w-20 sm:w-24 px-2 py-1 pr-8 text-right border border-gray-300 rounded text-sm font-medium disabled:bg-gray-100 disabled:text-gray-400"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
                        MB
                      </span>
                    </div>
                  )}
                  {showDataError && (
                    <span className="text-[10px] text-red-500 whitespace-nowrap">
                      숫자만 입력 가능합니다.
                    </span>
                  )}
                </div>
              </div>
              <RangeSlider
                value={tempDataLimit}
                onChange={setTempDataLimit}
                onChangeEnd={onDataLimitChange}
                min={0}
                max={MAX_DATA_LIMIT_MB}
                step={DATA_LIMIT_STEP}
                disabled={!app.enabled}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0MB</span>
                <span>무제한</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center text-sm mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-700">
                    최대 데이터 속도
                  </span>
                  <InfoTooltip text="최대 데이터 속도 제한은 0~50Mbps까지 가능합니다. 범위 이상의 값은 무제한으로 인식됩니다." />
                </div>
                <div className="flex flex-col items-end gap-1">
                  {isSpeedUnlimited ? (
                    <span className="px-3 py-1 text-sm font-semibold text-blue-600">
                      무제한
                    </span>
                  ) : (
                    <div className="relative">
                      <input
                        type="text"
                        value={tempSpeedLimit}
                        onChange={handleSpeedInputChange}
                        disabled={!app.enabled}
                        className="w-20 sm:w-24 px-2 py-1 pr-12 text-right border border-gray-300 rounded text-sm font-medium disabled:bg-gray-100 disabled:text-gray-400"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
                        Mbps
                      </span>
                    </div>
                  )}
                  {showSpeedError && (
                    <span className="text-[10px] text-red-500 whitespace-nowrap">
                      숫자만 입력 가능합니다.
                    </span>
                  )}
                </div>
              </div>
              <RangeSlider
                value={tempSpeedLimit}
                onChange={setTempSpeedLimit}
                onChangeEnd={onSpeedLimitChange}
                min={0}
                max={MAX_SPEED_LIMIT_MBPS}
                step={SPEED_LIMIT_STEP}
                disabled={!app.enabled}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0Mbps</span>
                <span>무제한</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">
                정책 예외 허용
              </span>
              <input
                type="checkbox"
                checked={app.blockAds}
                onChange={onBlockAdsToggle}
                disabled={!app.enabled}
                className="w-5 h-5"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppCard;
