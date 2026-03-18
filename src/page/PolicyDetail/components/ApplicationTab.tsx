import { useState } from "react";
import GlassCard from "@/components/common/GlassCard";
import AppFilterBar from "./AppFilterBar";
import AppPolicyFilters from "./AppPolicyFilters";
import AppCard from "./AppCard";
import { useAppPolicyData } from "../hooks/useAppPolicyData";
import { useAppFilters, shouldShowDataBadge, shouldShowSpeedBadge } from "../hooks/useAppFilters";

interface ApplicationTabProps {
  expandedApps: Set<number>;
  setExpandedApps: React.Dispatch<React.SetStateAction<Set<number>>>;
  isListening: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleVoiceSearch: () => void;
  cancelVoiceSearch: () => void;
  selectedLineId: number | undefined;
  onPolicyChange?: () => void;
}

const ApplicationTab = ({
  expandedApps,
  setExpandedApps,
  isListening,
  searchQuery,
  setSearchQuery,
  handleVoiceSearch,
  cancelVoiceSearch,
  selectedLineId,
  onPolicyChange,
}: ApplicationTabProps) => {
  const [policyFilter, setPolicyFilter] = useState<
    "전체" | "정책없음" | "정책적용" | "정책예외"
  >("전체");
  const [conditionFilters, setConditionFilters] = useState<
    Set<"사용량 제한" | "속도 제한">
  >(new Set());
  const [showPolicyDropdown, setShowPolicyDropdown] = useState(false);
  const [sortOrder, setSortOrder] = useState<"이름순" | "활성화순">("이름순");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const {
    appPolicyStates,
    handleToggleApp,
    handleDataLimitChange,
    handleDataLimitInputChange,
    handleSpeedLimitChange,
    handleSpeedLimitInputChange,
    handleBlockAdsToggle,
  } = useAppPolicyData(selectedLineId, sortOrder, onPolicyChange);

  const sortedApps = useAppFilters(
    appPolicyStates,
    searchQuery,
    policyFilter,
    conditionFilters,
    sortOrder
  );

  const toggleExpand = (appPolicyId: number) => {
    setExpandedApps((prev) => {
      const newSet = new Set(prev);
      const isExpanding = !newSet.has(appPolicyId);

      if (newSet.has(appPolicyId)) {
        newSet.delete(appPolicyId);
      } else {
        newSet.add(appPolicyId);
      }

      if (isExpanding) {
        setTimeout(() => {
          const element = document.getElementById(`app-${appPolicyId}`);
          if (element) {
            const container = element.closest(".overflow-y-auto");
            if (container) {
              const elementRect = element.getBoundingClientRect();
              const containerRect = container.getBoundingClientRect();

              if (elementRect.bottom > containerRect.bottom) {
                element.scrollIntoView({ behavior: "smooth", block: "end" });
              }
            }
          }
        }, 150);
      }

      return newSet;
    });
  };

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

  const handleCardExpand = (appPolicyId: number) => {
    toggleExpand(appPolicyId);
  };

  return (
    <div className="relative py-4">
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
            isListening={isListening}
            handleVoiceSearch={handleVoiceSearch}
            cancelVoiceSearch={cancelVoiceSearch}
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
                <AppCard
                  key={`${app.appPolicyId}-${app.appId}`}
                  app={app}
                  isExpanded={isExpanded}
                  showDataBadge={showDataBadge}
                  showSpeedBadge={showSpeedBadge}
                  onToggle={async () => {
                    const currentEnabled = app.enabled;
                    const newEnabled = await handleToggleApp(app.appPolicyId);
                    
                    if (newEnabled !== null) {
                      // off -> on: 펼치기
                      if (!currentEnabled && newEnabled) {
                        setExpandedApps((prev) => {
                          const newSet = new Set(prev);
                          newSet.add(app.appPolicyId);
                          return newSet;
                        });
                      }
                      // on -> off: 접기
                      else if (currentEnabled && !newEnabled) {
                        setExpandedApps((prev) => {
                          const newSet = new Set(prev);
                          newSet.delete(app.appPolicyId);
                          return newSet;
                        });
                      }
                    }
                  }}
                  onExpand={() => handleCardExpand(app.appPolicyId)}
                  onDataLimitChange={(value) =>
                    handleDataLimitChange(app.appPolicyId, value)
                  }
                  onDataLimitInputChange={(value) =>
                    handleDataLimitInputChange(app.appPolicyId, value)
                  }
                  onSpeedLimitChange={(value) =>
                    handleSpeedLimitChange(app.appPolicyId, value)
                  }
                  onSpeedLimitInputChange={(value) =>
                    handleSpeedLimitInputChange(app.appPolicyId, value)
                  }
                  onBlockAdsToggle={() => handleBlockAdsToggle(app.appPolicyId)}
                />
              );
            })
          )}
        </div>
      </GlassCard>
    </div>
  );
};

export default ApplicationTab;
