import { useState, useEffect } from "react";
import { blockService, getErrorMessage } from "@/api";
import type { AppPolicy } from "../../../data/policyDetailDummyData";

const MAX_DATA_LIMIT_MB = 5000;

export const useAppPolicyData = (
  selectedLineId: number | undefined,
  sortOrder: "이름순" | "활성화순",
  onPolicyChange?: () => void
) => {
  const [appPolicyStates, setAppPolicyStates] = useState<AppPolicy[]>([]);

  useEffect(() => {
    if (!selectedLineId) return;

    blockService
      .getLineApps({
        lineId: selectedLineId,
        pageNumber: 0,
        pageSize: 100,
        sortType: sortOrder === "이름순" ? "NAME" : "ACTIVE",
      })
      .then((res) => {
        const apps = res.data.content.map((app) => {
          const dailyLimitData = app.dailyLimitData ?? 0;
          const dailyLimitSpeed = app.dailyLimitSpeed ?? 0;
          
          return {
            appPolicyId: app.appPolicyId || app.appId,
            appId: app.appId,
            appName: app.appName,
            category: "OTHER" as const,
            enabled: app.isActive ?? false,
            dailyLimitMb: dailyLimitData > 0 
              ? Math.max(0, Math.round(dailyLimitData / (1024 * 1024)))
              : 0,
            maxSpeedMbps: dailyLimitSpeed > 0
              ? Math.max(0, Math.round(dailyLimitSpeed / 1000))
              : 0,
            blockAds: app.isWhiteList ?? false,
          };
        });

        setAppPolicyStates(apps);
      })
      .catch((error) => {
        console.error("앱 목록 조회 실패:", getErrorMessage(error));
      });
  }, [selectedLineId, sortOrder]);

  const handleToggleApp = async (appPolicyId: number) => {
    if (!selectedLineId) return;

    const app = appPolicyStates.find((a) => a.appPolicyId === appPolicyId);
    if (!app) return;

    try {
      const response = await blockService.toggleAppPolicy(
        selectedLineId,
        app.appId
      );

      const dailyLimitData = response.data.dailyLimitData ?? 0;
      const dailyLimitSpeed = response.data.dailyLimitSpeed ?? 0;
      const newEnabled = response.data.isActive ?? false;

      setAppPolicyStates((prev) =>
        prev.map((a) =>
          a.appPolicyId === appPolicyId
            ? {
                ...a,
                appPolicyId: response.data.appPolicyId || a.appPolicyId,
                enabled: newEnabled,
                dailyLimitMb: dailyLimitData > 0
                  ? Math.max(0, Math.round(dailyLimitData / (1024 * 1024)))
                  : 0,
                maxSpeedMbps: dailyLimitSpeed > 0
                  ? Math.max(0, Math.round(dailyLimitSpeed / 1000))
                  : 0,
                blockAds: response.data.isWhiteList ?? false,
              }
            : a
        )
      );

      // OFF -> ON으로 변경된 경우, 기본값(0, 0)을 API에 전송
      if (!app.enabled && newEnabled) {
        const newAppPolicyId = response.data.appPolicyId || appPolicyId;
        
        await blockService.updateAppLimit(newAppPolicyId, 0);
        await blockService.updateAppSpeed(newAppPolicyId, 0);
      }

      onPolicyChange?.();
      return newEnabled;
    } catch (error) {
      console.error("앱 정책 토글 실패:", getErrorMessage(error));
      return null;
    }
  };

  const handleDataLimitChange = async (appPolicyId: number, value: number) => {
    setAppPolicyStates((prev) =>
      prev.map((app) =>
        app.appPolicyId === appPolicyId ? { ...app, dailyLimitMb: value } : app
      )
    );

    try {
      const valueInBytes = value * 1024 * 1024;
      const response = await blockService.updateAppLimit(appPolicyId, valueInBytes);
      
      const dailyLimitData = response.data.dailyLimitData ?? 0;
      const dailyLimitSpeed = response.data.dailyLimitSpeed ?? 0;
      
      setAppPolicyStates((prev) =>
        prev.map((app) =>
          app.appPolicyId === appPolicyId
            ? {
                ...app,
                dailyLimitMb: dailyLimitData > 0
                  ? Math.max(0, Math.round(dailyLimitData / (1024 * 1024)))
                  : 0,
                maxSpeedMbps: dailyLimitSpeed > 0
                  ? Math.max(0, Math.round(dailyLimitSpeed / 1000))
                  : app.maxSpeedMbps,
              }
            : app
        )
      );
      
      onPolicyChange?.();
    } catch (error) {
      console.error("데이터 제한 업데이트 실패:", getErrorMessage(error));
    }
  };

  const handleDataLimitInputChange = (appPolicyId: number, value: string) => {
    const numValue = parseInt(value) || 0;
    const clampedValue = Math.min(Math.max(numValue, 0), MAX_DATA_LIMIT_MB);
    handleDataLimitChange(appPolicyId, clampedValue);
  };

  const handleSpeedLimitChange = async (
    appPolicyId: number,
    value: number
  ) => {
    setAppPolicyStates((prev) =>
      prev.map((app) =>
        app.appPolicyId === appPolicyId ? { ...app, maxSpeedMbps: value } : app
      )
    );

    try {
      const valueInKbps = value * 1000;
      const response = await blockService.updateAppSpeed(appPolicyId, valueInKbps);
      
      const dailyLimitData = response.data.dailyLimitData ?? 0;
      const dailyLimitSpeed = response.data.dailyLimitSpeed ?? 0;
      
      setAppPolicyStates((prev) =>
        prev.map((app) =>
          app.appPolicyId === appPolicyId
            ? {
                ...app,
                dailyLimitMb: dailyLimitData > 0
                  ? Math.max(0, Math.round(dailyLimitData / (1024 * 1024)))
                  : app.dailyLimitMb,
                maxSpeedMbps: dailyLimitSpeed > 0
                  ? Math.max(0, Math.round(dailyLimitSpeed / 1000))
                  : 0,
              }
            : app
        )
      );
      
      onPolicyChange?.();
    } catch (error) {
      console.error("속도 제한 업데이트 실패:", getErrorMessage(error));
    }
  };

  const handleSpeedLimitInputChange = (
    appPolicyId: number,
    value: string
  ) => {
    const numValue = parseInt(value) || 0;
    const clampedValue = Math.min(Math.max(numValue, 0), 50);
    handleSpeedLimitChange(appPolicyId, clampedValue);
  };

  const handleBlockAdsToggle = async (appPolicyId: number) => {
    try {
      const response = await blockService.toggleWhitelist(appPolicyId);

      setAppPolicyStates((prev) =>
        prev.map((app) =>
          app.appPolicyId === appPolicyId
            ? { ...app, blockAds: response.data.isWhiteList ?? false }
            : app
        )
      );
      
      onPolicyChange?.();
    } catch (error) {
      console.error("정책 예외 토글 실패:", getErrorMessage(error));
    }
  };

  return {
    appPolicyStates,
    setAppPolicyStates,
    handleToggleApp,
    handleDataLimitChange,
    handleDataLimitInputChange,
    handleSpeedLimitChange,
    handleSpeedLimitInputChange,
    handleBlockAdsToggle,
  };
};
