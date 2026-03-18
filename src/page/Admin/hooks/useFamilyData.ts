import { useQuery } from '@tanstack/react-query';
import { familyService, sharedPoolService } from '@/api';

export function useFamilyData(lineId: number | null) {
  // 가족 구성원 조회
  const { 
    data: familyData, 
    isLoading: isFamilyLoading, 
    error: familyError 
  } = useQuery({
    queryKey: ['familyMembersByLine', lineId],
    queryFn: async () => {
      const response = await familyService.getMembersByLine(lineId!);
      return response.data;
    },
    enabled: !!lineId,
  });

  // 공유 데이터 풀 조회
  const { 
    data: sharedPoolData, 
    error: sharedPoolError 
  } = useQuery({
    queryKey: ['sharedPools', familyData?.familyId],
    queryFn: async () => {
      const response = await sharedPoolService.getSharedPoolsByFamilyId(familyData!.familyId);
      
      return {
        totalData: response.poolTotalData,
        baseData: response.poolBaseData,
        contributionData: response.monthlyContributionAmount,
        usageAmount: response.monthlyUsageAmount,
        remainingData: response.poolRemainingData,
      };
    },
    enabled: !!familyData?.familyId,
    retry: false,
  });

  return {
    familyData,
    sharedPoolData,
    isFamilyLoading,
    familyError,
    sharedPoolError,
    members: familyData?.members || [],
    owner: familyData?.members?.find(m => m.role === 'OWNER'),
  };
}
