import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PolicyScroll from "../../components/common/PolicyScroll";
import { useAppliedPolicies } from "../PolicyDetail/hooks/useAppliedPolicies";
import { useUserStore } from "@/store/userStore";
import { useToastStore } from "@/store/toastStore";
import { userService } from "@/api/services/userService";
import { familyService } from "@/api/services/familyService";
import { getErrorMessage } from "@/api/client";
import DataBalance from "./components/DataBalance";
import UsageTrend from "./components/UsageTrend";
import DateSelector from "./components/DateSelector";
import AppUsageChart from "./components/AppUsageChart";
import { motion } from "framer-motion";
import {
  itemVariants,
  pageTransition,
  pageVariants,
} from "@/utils/pageAnimation";

interface DataUsage {
  personalUsedAmount: number;
  sharedPoolUsedAmount: number;
  personalTotalAmount: number | null;
  sharedPoolTotalAmount: number | null;
}

interface MonthlyUsage {
  usages: Array<{ yearMonth: string; usedAmount: number }>;
  averageAmount: number;
}

interface AppUsage {
  isPublic: boolean;
  totalUsedAmount: number;
  apps: Array<{ appName: string; usedAmount: number }>;
}

const formatYearMonth = (date: Date) =>
  `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}`;

const emptyAppUsage = (isPublic: boolean): AppUsage => ({
  isPublic,
  totalUsedAmount: 0,
  apps: [],
});

function parseAppUsageResponse(
  appRes: { headers?: Record<string, unknown>; data: unknown },
  fallbackIsPublic: boolean,
): { data: AppUsage; updatedIsPublic?: boolean } | null {
  const contentType = String(appRes.headers?.["content-type"] || "");
  const isJson = contentType.includes("application/json");

  if (!isJson) {
    return { data: emptyAppUsage(fallbackIsPublic) };
  }

  const d = appRes.data as Record<string, unknown> | null;
  if (d && typeof d === "object" && !Array.isArray(d)) {
    if ("isPublic" in d) {
      return {
        data: {
          isPublic: (d.isPublic as boolean) ?? true,
          totalUsedAmount: (d.totalUsedAmount as number) ?? 0,
          apps: (d.apps as AppUsage["apps"]) ?? [],
        },
        updatedIsPublic: (d.isPublic as boolean) ?? true,
      };
    }
    if ("apps" in d) {
      return {
        data: {
          isPublic: fallbackIsPublic,
          totalUsedAmount: (d.totalUsedAmount as number) ?? 0,
          apps: (d.apps as AppUsage["apps"]) ?? [],
        },
      };
    }
  }

  return { data: emptyAppUsage(fallbackIsPublic) };
}

export default function Detail() {
  const location = useLocation();
  const userInfo = useUserStore((state) => state.userInfo);
  const { show: showToast } = useToastStore();

  const lineId = location.state?.lineId || userInfo?.lineId;
  const { appliedPolicies } = useAppliedPolicies(lineId);
  const isOwnData = lineId === userInfo?.lineId;

  const today = new Date();
  const currentMonthLimit = new Date(today.getFullYear(), today.getMonth(), 1);
  const [currentDate, setCurrentDate] = useState(currentMonthLimit);

  const [dataUsage, setDataUsage] = useState<DataUsage | null>(null);
  const [monthlyUsage, setMonthlyUsage] = useState<MonthlyUsage | null>(null);
  const [appUsage, setAppUsage] = useState<AppUsage | null>(null);
  const [globalIsPublic, setGlobalIsPublic] = useState(true);
  const [hasPrivacyPermission, setHasPrivacyPermission] = useState(false);
  const [loading, setLoading] = useState(true);

  // 본인 비공개 허용 권한 체크
  useEffect(() => {
    if (!isOwnData) {
      setHasPrivacyPermission(false);
      return;
    }
    const fetchPermissions = async () => {
      try {
        const { data } = await familyService.getMyPermissions();
        const hasPerm = data.memberPermissions.some(
          (p) => p.permissionTitle === "앱 사용량 비공개 허용 권한",
        );
        setHasPrivacyPermission(hasPerm);
        if (!hasPerm) setGlobalIsPublic(true);
      } catch {
        setHasPrivacyPermission(false);
        setGlobalIsPublic(true);
      }
    };
    fetchPermissions();
  }, [isOwnData]);

  const fetchAppUsage = async (
    targetLineId: number,
    yearMonth: string,
    fallbackIsPublic: boolean,
  ): Promise<AppUsage> => {
    try {
      const appRes = await userService.getAppUsage(targetLineId, yearMonth);
      const result = parseAppUsageResponse(appRes, fallbackIsPublic);
      return result?.data ?? emptyAppUsage(fallbackIsPublic);
    } catch {
      return emptyAppUsage(fallbackIsPublic);
    }
  };

  // 메인 데이터 로드
  useEffect(() => {
    if (!lineId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const yearMonth = formatYearMonth(currentDate);

        const [dataRes, monthlyRes] = await Promise.all([
          userService.getDataUsage(lineId, yearMonth),
          userService.getMonthlyUsage(lineId, yearMonth),
        ]);

        setDataUsage(dataRes.data);
        setMonthlyUsage(monthlyRes.data);

        const fallback = loading ? true : globalIsPublic;
        const appRes = await userService.getAppUsage(lineId, yearMonth);
        const parsed = parseAppUsageResponse(appRes, fallback);

        if (parsed) {
          // 본인 + 권한 없으면 isPublic 강제 true
          if (isOwnData && !hasPrivacyPermission) {
            parsed.data.isPublic = true;
          }
          // 다른 사람 데이터: API의 isPublic 그대로 사용
          // isPublic: false → 비공개 자물쇠 UI 표시
          setAppUsage(parsed.data);
          if (isOwnData && !hasPrivacyPermission) {
            setGlobalIsPublic(true);
          } else if (parsed.updatedIsPublic != null) {
            setGlobalIsPublic(parsed.updatedIsPublic);
          } else if (loading) {
            setGlobalIsPublic(true);
          }
        } else {
          setAppUsage(emptyAppUsage(fallback));
          if (loading) setGlobalIsPublic(true);
        }
      } catch {
        setAppUsage(emptyAppUsage(globalIsPublic));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineId, currentDate]);

  const fetchMonthData = async (newDate: Date) => {
    const yearMonth = formatYearMonth(newDate);

    const [dataRes, monthlyRes] = await Promise.all([
      userService.getDataUsage(lineId!, yearMonth),
      userService.getMonthlyUsage(lineId!, yearMonth),
    ]);

    const hasValidMonthly =
      monthlyRes?.data &&
      Array.isArray(monthlyRes.data.usages) &&
      monthlyRes.data.usages.length > 0 &&
      typeof monthlyRes.data.averageAmount === "number";

    if (!hasValidMonthly) return false;

    setCurrentDate(newDate);

    const hasValidData =
      dataRes?.data &&
      typeof dataRes.data.personalUsedAmount === "number" &&
      typeof dataRes.data.sharedPoolUsedAmount === "number";

    if (hasValidData) setDataUsage(dataRes.data);
    setMonthlyUsage(monthlyRes.data);

    const appData = await fetchAppUsage(lineId!, yearMonth, globalIsPublic);
    setAppUsage(appData);

    return true;
  };

  const handleMonthChange = async (direction: "prev" | "next") => {
    const offset = direction === "prev" ? -1 : 1;
    const msg = direction === "prev" ? "이전 달" : "다음 달";
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + offset,
      1,
    );

    if (direction === "prev" && newDate.getFullYear() < 2024) {
      showToast(`${msg} 데이터가 없습니다.`, "info");
      return;
    }
    if (direction === "next" && newDate > currentMonthLimit) {
      showToast(`${msg} 데이터가 없습니다.`, "info");
      return;
    }

    try {
      const success = await fetchMonthData(newDate);
      if (!success) showToast(`${msg} 데이터가 없습니다.`, "info");
    } catch {
      showToast(`${msg} 데이터가 없습니다.`, "info");
    }
  };

  const handleVisibilityToggle = async (newValue: boolean) => {
    if (!lineId) return;

    if (!isOwnData) {
      showToast("본인의 공개 설정만 변경할 수 있습니다.", "info");
      return;
    }

    if (!hasPrivacyPermission) {
      showToast("앱 사용량 비공개 권한이 없습니다.", "info");
      return;
    }

    try {
      await familyService.updateVisibility({ lineId, isPublic: newValue });
      setGlobalIsPublic(newValue);

      const yearMonth = formatYearMonth(currentDate);
      const appData = await fetchAppUsage(lineId, yearMonth, newValue);
      setAppUsage({ ...appData, isPublic: newValue });
    } catch (error) {
      showToast(getErrorMessage(error), "error");
    }
  };

  if (loading) {
    return (
      <div className="relative h-[calc(100dvh-106px-60px)] overflow-y-auto mt-[106px] mb-[60px] flex items-center justify-center">
        <div className="text-[#666666]">로딩 중...</div>
      </div>
    );
  }

  if (!dataUsage || !monthlyUsage || !appUsage) {
    return (
      <div className="relative h-[calc(100dvh-106px-60px)] overflow-y-auto mt-[106px] mb-[60px] flex items-center justify-center">
        <div className="text-[#666666]">데이터를 불러올 수 없습니다.</div>
      </div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      transition={pageTransition}
      className="flex flex-col gap-4 px-4 pb-[20px]"
    >
      {appliedPolicies.length > 0 && (
        <motion.div
          variants={itemVariants}
          transition={{ ...pageTransition, delay: 0.1 }}
        >
          <PolicyScroll
            policies={appliedPolicies.map((policy, index) => ({
              id: index + 1,
              type: policy.type,
              bgColor: policy.bgColor,
              title: policy.title,
            }))}
            title="현재 적용중인 정책"
          />
        </motion.div>
      )}

      <motion.div
        variants={itemVariants}
        transition={{ ...pageTransition, delay: 0.15 }}
      >
        <DateSelector
          currentDate={currentDate}
          onPrevMonth={() => handleMonthChange("prev")}
          onNextMonth={() => handleMonthChange("next")}
        />
      </motion.div>

      <motion.div
        variants={itemVariants}
        transition={{ ...pageTransition, delay: 0.2 }}
      >
        <DataBalance
          personalUsed={dataUsage.personalUsedAmount}
          personalTotal={dataUsage.personalTotalAmount}
          sharedUsed={dataUsage.sharedPoolUsedAmount}
          sharedTotal={dataUsage.sharedPoolTotalAmount}
        />
      </motion.div>

      <motion.div
        variants={itemVariants}
        transition={{ ...pageTransition, delay: 0.3 }}
      >
        <UsageTrend
          usages={monthlyUsage.usages}
          averageAmount={monthlyUsage.averageAmount}
          currentYearMonth={formatYearMonth(currentDate)}
        />
      </motion.div>

      <motion.div
        variants={itemVariants}
        transition={{ ...pageTransition, delay: 0.4 }}
      >
        <AppUsageChart
          apps={appUsage.apps}
          totalUsedAmount={appUsage.totalUsedAmount}
          isPublic={appUsage.isPublic}
          onPublicToggle={handleVisibilityToggle}
          disableToggle={!hasPrivacyPermission}
          showToggle={isOwnData}
        />
      </motion.div>
    </motion.div>
  );
}
