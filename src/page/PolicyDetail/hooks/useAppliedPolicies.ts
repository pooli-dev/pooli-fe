import { useState, useEffect, useCallback } from "react";
import { blockService } from "@/api";

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
      const res = await blockService.getAppliedPolicies(lineId);
      const policies: PolicyItem[] = [];
      const data = res.data;

      // 한도 정책
      if (data.limitPolicy) {
        const { dailyDataLimit, isDailyDataLimitActive, sharedDataLimit, isSharedDataLimitActive } = data.limitPolicy;

        if (isDailyDataLimitActive && dailyDataLimit > 0) {
          const limitGB = (dailyDataLimit / (1024 * 1024 * 1024)).toFixed(1);
          policies.push({
            type: "한도",
            bgColor: "#FFE5E5",
            title: `하루 총 데이터 ${limitGB}GB 제한`,
          });
        }

        if (isSharedDataLimitActive && sharedDataLimit > 0) {
          const limitGB = (sharedDataLimit / (1024 * 1024 * 1024)).toFixed(1);
          policies.push({
            type: "한도",
            bgColor: "#FFE5E5",
            title: `월 공유데이터 한도 ${limitGB}GB`,
          });
        }
      }

      // 시간 정책 (일시 차단)
      if (data.immediateBlock && data.immediateBlock.blockEndAt) {
        const endTime = new Date(data.immediateBlock.blockEndAt);
        const formattedTime = `${endTime.getMonth() + 1}/${endTime.getDate()} ${String(endTime.getHours()).padStart(2, "0")}:${String(endTime.getMinutes()).padStart(2, "0")}`;
        policies.push({
          type: "시간",
          bgColor: "#E5E5FF",
          title: `${formattedTime}까지 일시차단`,
        });
      }

      // 시간 정책 (반복 차단)
      if (data.repeatBlockPolicyList && data.repeatBlockPolicyList.length > 0) {
        data.repeatBlockPolicyList.forEach((policy) => {
          if (policy.isActive && policy.days && policy.days.length > 0) {
            policy.days.forEach((day) => {
              const dayName = DAY_MAP[day.dayOfWeek];
              const startTime = day.startAt.substring(0, 5);
              const endTime = day.endAt.substring(0, 5);
              policies.push({
                type: "시간",
                bgColor: "#E5E5FF",
                title: `${dayName} ${startTime}~${endTime}`,
              });
            });
          }
        });
      }

      // 앱 정책
      if (data.appPolicyList && data.appPolicyList.length > 0) {
        interface AppPolicy {
          enabled?: boolean;
          isActive?: boolean;
          appName: string;
        }
        
        const enabledApps = data.appPolicyList.filter((app: AppPolicy) => app.enabled === true || app.isActive === true);

        if (enabledApps.length > 0) {
          const sortedApps = [...enabledApps].sort((a: AppPolicy, b: AppPolicy) => a.appName.localeCompare(b.appName));

          if (sortedApps.length === 1) {
            policies.push({
              type: "앱",
              bgColor: "#E5F5E5",
              title: `${sortedApps[0].appName} 사용 제한`,
            });
          } else if (sortedApps.length === 2) {
            policies.push({
              type: "앱",
              bgColor: "#E5F5E5",
              title: `${sortedApps[0].appName}, ${sortedApps[1].appName} 사용 제한`,
            });
          } else {
            policies.push({
              type: "앱",
              bgColor: "#E5F5E5",
              title: `${sortedApps[0].appName} 외 ${sortedApps.length - 1}개 사용 제한`,
            });
          }
        }
      }

      setAppliedPolicies(policies);
    } catch (error) {
      console.error("적용 중인 정책 조회 실패:", error);
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
