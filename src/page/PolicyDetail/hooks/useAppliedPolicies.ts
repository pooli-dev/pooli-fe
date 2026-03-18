import { useState, useEffect, useCallback } from "react";
import { blockService, limitService } from "@/api";
import { formatData } from "@/utils/dataFormat";

export type PolicyItem = {
  type: "한도" | "시간" | "앱";
  bgColor: string;
  title: string;
};

const DAY_MAP: { [key: string]: string } = {
  SUN: "일",
  MON: "월",
  TUE: "화",
  WED: "수",
  THU: "목",
  FRI: "금",
  SAT: "토",
};

export const useAppliedPolicies = (lineId: number | undefined) => {
  const [appliedPolicies, setAppliedPolicies] = useState<PolicyItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAppliedPolicies = useCallback(async () => {
    if (!lineId) {
      setAppliedPolicies([]);
      return;
    }

    setLoading(true);
    try {
      const [appliedRes, limitsRes] = await Promise.all([
        blockService.getAppliedPolicies(lineId).catch(() => null),
        limitService.getLimits(lineId).catch(() => null),
      ]);
      
      const policies: PolicyItem[] = [];
      const data = appliedRes?.data;
      const limitsData = limitsRes?.data;

      // 한도 정책 - getLimits API의 값 사용
      if (limitsData) {
        const { dailyDataLimit, isDailyDataLimitActive, sharedDataLimit, isSharedDataLimitActive } = limitsData;

        if (isDailyDataLimitActive && dailyDataLimit > 0) {
          const limitGB = formatData(dailyDataLimit);
          policies.push({
            type: "한도",
            bgColor: "#FFE5E5",
            title: `하루 총 데이터 ${limitGB}GB 제한`,
          });
        }

        if (isSharedDataLimitActive && sharedDataLimit > 0) {
          const limitGB = formatData(sharedDataLimit);
          policies.push({
            type: "한도",
            bgColor: "#FFE5E5",
            title: `월 공유데이터 한도 ${limitGB}GB`,
          });
        }
      }

      if (!data) {
        setAppliedPolicies(policies);
        return;
      }

      // 시간 정책 (일시 차단) - 현재 시간보다 미래인 경우만 표시
      if (data.immediateBlock && data.immediateBlock.blockEndAt) {
        const endTime = new Date(data.immediateBlock.blockEndAt);
        const now = new Date();
        if (endTime > now) {
          const formattedTime = `${endTime.getMonth() + 1}/${endTime.getDate()} ${String(endTime.getHours()).padStart(2, "0")}:${String(endTime.getMinutes()).padStart(2, "0")}`;
          policies.push({
            type: "시간",
            bgColor: "#E5E5FF",
            title: `${formattedTime}까지 일시차단`,
          });
        }
      }

      // 시간 정책 (반복 차단) - 같은 시간대끼리 묶기
      if (data.repeatBlockPolicyList && data.repeatBlockPolicyList.length > 0) {
        const timeGroups = new Map<string, Set<string>>();
        
        data.repeatBlockPolicyList.forEach((policy) => {
          if (policy.isActive && policy.days && policy.days.length > 0) {
            policy.days.forEach((day) => {
              if (!day || !day.startAt || !day.endAt || !day.dayOfWeek) {
                return;
              }
              
              const startTime = day.startAt.substring(0, 5);
              const endTime = day.endAt.substring(0, 5);
              const timeKey = `${startTime}~${endTime}`;
              
              if (!timeGroups.has(timeKey)) {
                timeGroups.set(timeKey, new Set<string>());
              }
              timeGroups.get(timeKey)!.add(DAY_MAP[day.dayOfWeek]);
            });
          }
        });

        timeGroups.forEach((daysSet, timeRange) => {
          const daysStr = Array.from(daysSet).join(', ');
          policies.push({
            type: "시간",
            bgColor: "#E5E5FF",
            title: `${daysStr} ${timeRange} 차단`,
          });
        });
      }

      // 앱 정책
      if (data.appPolicyList && data.appPolicyList.length > 0) {
        interface AppPolicy {
          enabled?: boolean;
          isActive?: boolean;
          appName: string;
        }

        const enabledApps = data.appPolicyList.filter(
          (app: AppPolicy) => app.enabled === true || app.isActive === true,
        );

        if (enabledApps.length > 0) {
          const sortedApps = [...enabledApps].sort(
            (a: AppPolicy, b: AppPolicy) => a.appName.localeCompare(b.appName),
          );

          if (sortedApps.length === 1) {
            policies.push({ type: "앱", bgColor: "#E5F5E5", title: `${sortedApps[0].appName} 사용 제한` });
          } else if (sortedApps.length === 2) {
            policies.push({ type: "앱", bgColor: "#E5F5E5", title: `${sortedApps[0].appName}, ${sortedApps[1].appName} 사용 제한` });
          } else {
            policies.push({ type: "앱", bgColor: "#E5F5E5", title: `${sortedApps[0].appName} 외 ${sortedApps.length - 1}개 사용 제한` });
          }
        }
      }

      setAppliedPolicies(policies);
    } catch {
      setAppliedPolicies([]);
    } finally {
      setLoading(false);
    }
  }, [lineId]);

  useEffect(() => {
    fetchAppliedPolicies();
  }, [fetchAppliedPolicies]);

  return { appliedPolicies, loading, refetch: fetchAppliedPolicies };
};
