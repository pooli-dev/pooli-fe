import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PolicyScroll from "../../components/common/PolicyScroll";
import { useAppliedPolicies } from "../PolicyDetail/hooks/useAppliedPolicies";
import { useUserStore } from "@/store/userStore";
import { useToastStore } from "@/store/toastStore";
import { userService } from "@/api/services/userService";
import { familyService } from "@/api/services/familyService";
import DataBalance from "./components/DataBalance";
import UsageTrend from "./components/UsageTrend";
import DateSelector from "./components/DateSelector";
import AppUsageChart from "./components/AppUsageChart";

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

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const { data } = await familyService.getMyPermissions();
        const hasPermission = data.memberPermissions.some(
          (permission) => permission.permissionTitle === "앱 사용량 비공개 허용 권한"
        );
        setHasPrivacyPermission(hasPermission);
      } catch {
        setHasPrivacyPermission(false);
      }
    };

    fetchPermissions();
  }, []);

  useEffect(() => {
    if (!lineId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const yearMonth = `${currentDate.getFullYear()}${String(currentDate.getMonth() + 1).padStart(2, "0")}`;
        
        const [dataRes, monthlyRes] = await Promise.all([
          userService.getDataUsage(lineId, yearMonth),
          userService.getMonthlyUsage(lineId, yearMonth),
        ]);

        setDataUsage(dataRes.data);
        setMonthlyUsage(monthlyRes.data);
        
        try {
          const appRes = await userService.getAppUsage(lineId, yearMonth);
          const contentType = appRes.headers?.['content-type'] || '';
          const isJson = contentType.includes('application/json');
          
          if (import.meta.env.DEV && isJson) {
            console.log("📱 앱 사용량:", appRes.data);
          }
          
          if (isJson && appRes.data && typeof appRes.data === 'object' && !Array.isArray(appRes.data) && 'isPublic' in appRes.data) {
            const normalizedData = {
              isPublic: appRes.data.isPublic ?? true,
              totalUsedAmount: appRes.data.totalUsedAmount ?? 0,
              apps: appRes.data.apps ?? []
            };
            
            setAppUsage(normalizedData);
            setGlobalIsPublic(appRes.data.isPublic ?? true);
          } else {
            if (import.meta.env.DEV) {
              console.error("❌ 앱 사용량 API 응답 오류 (백엔드 확인 필요)");
            }
            const defaultIsPublic = loading ? true : globalIsPublic;
            setAppUsage({
              isPublic: defaultIsPublic,
              totalUsedAmount: 0,
              apps: []
            });
            if (loading) {
              setGlobalIsPublic(true);
            }
          }
        } catch {
          const defaultIsPublic = loading ? true : globalIsPublic;
          setAppUsage({
            isPublic: defaultIsPublic,
            totalUsedAmount: 0,
            apps: []
          });
          if (loading) {
            setGlobalIsPublic(true);
          }
        }
      } catch {
        setAppUsage({
          isPublic: globalIsPublic,
          totalUsedAmount: 0,
          apps: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineId, currentDate]);

  const fetchMonthData = async (newDate: Date) => {
    const yearMonth = `${newDate.getFullYear()}${String(newDate.getMonth() + 1).padStart(2, "0")}`;
    
    const [dataRes, monthlyRes, appRes] = await Promise.all([
      userService.getDataUsage(lineId!, yearMonth),
      userService.getMonthlyUsage(lineId!, yearMonth),
      userService.getAppUsage(lineId!, yearMonth),
    ]);
    
    const hasValidMonthlyUsage = 
      monthlyRes?.data && 
      Array.isArray(monthlyRes.data.usages) && 
      monthlyRes.data.usages.length > 0 &&
      typeof monthlyRes.data.averageAmount === 'number';
    
    if (!hasValidMonthlyUsage) {
      return false;
    }
    
    const hasValidDataUsage = 
      dataRes?.data && 
      typeof dataRes.data.personalUsedAmount === 'number' &&
      typeof dataRes.data.sharedPoolUsedAmount === 'number';
    
    setCurrentDate(newDate);
    if (hasValidDataUsage) {
      setDataUsage(dataRes.data);
    }
    setMonthlyUsage(monthlyRes.data);
    
    const contentType = appRes.headers?.['content-type'] || '';
    const isJson = contentType.includes('application/json');
    
    if (isJson && appRes.data && typeof appRes.data === 'object' && 'isPublic' in appRes.data) {
      const normalizedData = {
        isPublic: globalIsPublic,
        totalUsedAmount: appRes.data.totalUsedAmount ?? 0,
        apps: appRes.data.apps ?? []
      };
      setAppUsage(normalizedData);
    } else {
      setAppUsage({
        isPublic: globalIsPublic,
        totalUsedAmount: 0,
        apps: []
      });
    }
    
    return true;
  };

  const handlePrevMonth = async () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    if (newDate.getFullYear() < 2024) {
      showToast("이전 달 데이터가 없습니다.", "info");
      return;
    }
    
    try {
      const success = await fetchMonthData(newDate);
      if (!success) {
        showToast("이전 달 데이터가 없습니다.", "info");
      }
    } catch {
      showToast("이전 달 데이터가 없습니다.", "info");
    }
  };

  const handleNextMonth = async () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    if (newDate > currentMonthLimit) {
      showToast("다음 달 데이터가 없습니다.", "info");
      return;
    }
    
    try {
      const success = await fetchMonthData(newDate);
      if (!success) {
        showToast("다음 달 데이터가 없습니다.", "info");
      }
    } catch {
      showToast("다음 달 데이터가 없습니다.", "info");
    }
  };

  const handleVisibilityToggle = async (newValue: boolean) => {
    if (!lineId || !hasPrivacyPermission || !isOwnData) {
      return;
    }

    try {
      await familyService.updateVisibility({ lineId, isPublic: newValue });
      
      setGlobalIsPublic(newValue);
      if (appUsage) {
        setAppUsage({ ...appUsage, isPublic: newValue });
      }
      
      const yearMonth = `${currentDate.getFullYear()}${String(currentDate.getMonth() + 1).padStart(2, "0")}`;
      try {
        const appRes = await userService.getAppUsage(lineId, yearMonth);
        const contentType = appRes.headers?.['content-type'] || '';
        const isJson = contentType.includes('application/json');
        
        if (isJson && appRes.data && typeof appRes.data === 'object' && 'isPublic' in appRes.data) {
          const normalizedData = {
            isPublic: newValue,
            totalUsedAmount: appRes.data.totalUsedAmount ?? 0,
            apps: appRes.data.apps ?? []
          };
          setAppUsage(normalizedData);
        } else {
          setAppUsage({
            isPublic: newValue,
            totalUsedAmount: 0,
            apps: []
          });
        }
      } catch {
        setAppUsage({
          isPublic: newValue,
          totalUsedAmount: 0,
          apps: []
        });
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("❌ 공개 설정 변경 실패:", error);
      }
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
    <div className="relative h-[calc(100dvh-106px-60px)] overflow-y-auto mt-[106px] mb-[60px]">
      <div className="flex flex-col gap-3 px-[24px] py-5 pb-[60px]">
        {appliedPolicies.length > 0 && (
          <PolicyScroll 
            policies={appliedPolicies.map((policy, index) => ({
              id: index + 1,
              type: policy.type,
              bgColor: policy.bgColor,
              title: policy.title,
            }))} 
            title="현재 적용중인 정책" 
          />
        )}

        <DateSelector
          currentDate={currentDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />

        <DataBalance
          personalUsed={dataUsage.personalUsedAmount}
          personalTotal={dataUsage.personalTotalAmount}
          sharedUsed={dataUsage.sharedPoolUsedAmount}
          sharedTotal={dataUsage.sharedPoolTotalAmount}
        />

        <UsageTrend
          usages={monthlyUsage.usages}
          averageAmount={monthlyUsage.averageAmount}
        />

        <AppUsageChart
          apps={appUsage.apps}
          totalUsedAmount={appUsage.totalUsedAmount}
          isPublic={appUsage.isPublic}
          canToggle={hasPrivacyPermission && isOwnData}
          onPublicToggle={handleVisibilityToggle}
        />
      </div>
    </div>
  );
}
