import { useMemo } from "react";
import { getDisplayAppName, matchesSearchQuery } from "@/constants/appIcons";
import type { AppPolicy } from "../../../data/policyDetailDummyData";

const MAX_DATA_LIMIT_MB = 5000;
const MAX_SPEED_LIMIT_MBPS = 50;

const hasDataLimit = (app: AppPolicy) =>
  app.enabled && app.dailyLimitMb < MAX_DATA_LIMIT_MB;
const hasSpeedLimit = (app: AppPolicy) =>
  app.enabled && (app.maxSpeedMbps || 0) < MAX_SPEED_LIMIT_MBPS;
const hasException = (app: AppPolicy) => app.blockAds;

export const shouldShowDataBadge = (app: AppPolicy) =>
  hasDataLimit(app) && !hasException(app);
export const shouldShowSpeedBadge = (app: AppPolicy) =>
  hasSpeedLimit(app) && !hasException(app);

export const useAppFilters = (
  appPolicyStates: AppPolicy[],
  searchQuery: string,
  policyFilter: "전체" | "정책없음" | "정책적용" | "정책예외",
  conditionFilters: Set<"사용량 제한" | "속도 제한">,
  sortOrder: "이름순" | "활성화순"
) => {
  const filteredAndSortedApps = useMemo(() => {
    const filtered = appPolicyStates.filter((app) => {
      // 검색어 필터
      if (!matchesSearchQuery(app.appName, searchQuery)) {
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

        const matchesDataLimit =
          conditionFilters.has("사용량 제한") && showDataBadge;
        const matchesSpeedLimit =
          conditionFilters.has("속도 제한") && showSpeedBadge;

        return matchesDataLimit || matchesSpeedLimit;
      }

      return true;
    });

    // 정렬
    return [...filtered].sort((a, b) => {
      if (sortOrder === "활성화순") {
        if (a.enabled === b.enabled) {
          const aName = getDisplayAppName(a.appName);
          const bName = getDisplayAppName(b.appName);
          return aName.localeCompare(bName);
        }
        return a.enabled ? -1 : 1;
      }
      const aName = getDisplayAppName(a.appName);
      const bName = getDisplayAppName(b.appName);
      return aName.localeCompare(bName);
    });
  }, [appPolicyStates, searchQuery, policyFilter, conditionFilters, sortOrder]);

  return filteredAndSortedApps;
};
