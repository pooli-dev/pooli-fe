// 공유 데이터 조회 응답 타입
export interface SharedPoolData {
  poolTotalData: number; // 총 공유 데이터 (MB)
  poolRemainingData: number; // 남은 공유 데이터 (MB)
  pool_base_data: number; // 기본 공유 데이터 (MB)
  monthlyUsageAmount: number; // 월간 사용량 (MB)
  monthlyContributionAmount: number; // 월간 기여량 (MB)
}

// 데이터 이체 요청 타입
export interface DataTransferRequest {
  fromLineId: number;
  toLineId: number;
  amount: number; // MB 단위
}

// 더미 데이터
export const dummySharedPoolData: SharedPoolData = {
  poolTotalData: 60000, // 60GB
  poolRemainingData: 20000, // 20GB
  pool_base_data: 40000, // 40GB (기본 공유)
  monthlyUsageAmount: 40000, // 40GB 사용
  monthlyContributionAmount: 20000, // 20GB 기여 (가족 추가)
};

// 잔여 기간 (일)
export const remainingDays = 9;
