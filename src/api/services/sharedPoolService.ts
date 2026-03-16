import type { HistoryEntry, UsageData } from "@/types/SharedData";
import apiClient from "../client";

// 공유풀 메인 데이터 타입
export interface SharedPoolMainData {
  sharedPoolBaseData: number;
  sharedPoolAdditionalData: number;
  sharedPoolRemainingData: number;
  sharedPoolTotalData: number;
}

// 내 공유 데이터 타입
export interface MySharedPoolData {
  remainingData: number;
  contributionAmount: number;
}

// 데이터 담기 요청 타입
export interface ContributeDataRequest {
  amount: number;
}

// Byte를 GB로 변환하는 헬퍼 함수 (1GB = 1e+9 Bytes, 소수점 둘째자리 반올림)
// 음수 값은 무제한을 의미하므로 그대로 반환
const bytesToGb = (bytes: number): number => {
  if (bytes < 0) return bytes; // 음수는 그대로 반환 (무제한)
  return Math.round((bytes / 1e9) * 100) / 100;
};

export const sharedPoolService = {
  // 공유풀 메인 데이터 조회
  getMainRemainingAmount: async () => {
    const response = await apiClient.get<SharedPoolMainData>(
      "/shared-pools/main/remaining-amount",
    );
    const data = response.data;

    // Bytes를 GB로 변환
    return {
      sharedPoolBaseData: bytesToGb(data.sharedPoolBaseData),
      sharedPoolAdditionalData: bytesToGb(data.sharedPoolAdditionalData),
      sharedPoolRemainingData: bytesToGb(data.sharedPoolRemainingData),
      sharedPoolTotalData: bytesToGb(data.sharedPoolTotalData),
    };
  },

  // 내 공유 데이터 조회
  getMySharedPool: async () => {
    const response = await apiClient.get<MySharedPoolData>("/shared-pools/my");
    const data = response.data;

    return {
      remainingData: bytesToGb(data.remainingData),
      contributionAmount: bytesToGb(data.contributionAmount),
    };
  },

  // 공유 데이터 담기
  contributeData: async (data: ContributeDataRequest) => {
    const response = await apiClient.post("/shared-pools", data);
    return response.data;
  },

  getUsageData: () =>
    apiClient.get<UsageData>("/shared-pools/usage/monthly-total"),

  getHistory: (yearMonth: string) =>
    apiClient.get<HistoryEntry[]>("/shared-pools/history", {
      params: { yearMonth },
    }),
};
