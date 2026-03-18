import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminPolicyService } from '@/api/services/adminPolicyService';
import type { AdminPolicy, PolicyRequest } from '@/api/services/adminPolicyService';
import { getErrorMessage } from '@/api/client';

export function useAdminPolicies() {
  const queryClient = useQueryClient();
  const [togglingPolicyId, setTogglingPolicyId] = useState<number | null>(null);

  // 정책 목록 조회
  const { data: policies = [], isLoading, error, refetch } = useQuery({
    queryKey: ['adminPolicies'],
    queryFn: async () => {
      const data = await adminPolicyService.getAllPolicies();
      if (typeof data === 'string' && (data as unknown as string).includes('<!doctype')) {
        throw new Error('세션이 만료되었습니다. 다시 로그인해주세요.');
      }
      return Array.isArray(data) ? data : [];
    },
  });

  // 정책 활성화 토글 (낙관적 업데이트)
  const { mutate: toggleActivation } = useMutation({
    mutationFn: async ({ policyId, isActive }: { policyId: number; isActive: boolean }) => {
      setTogglingPolicyId(policyId);
      
      // 낙관적 업데이트
      queryClient.setQueryData<AdminPolicy[]>(['adminPolicies'], (old = []) =>
        old.map(p => p.policyId === policyId ? { ...p, isActive } : p)
      );

      try {
        await adminPolicyService.toggleActivation(policyId, isActive);
      } catch (error: Error & { response?: { status?: number } }) {
        // 504 타임아웃은 무시 (백엔드에서 처리 중)
        if (error?.response?.status !== 504) {
          throw error;
        }
      } finally {
        setTimeout(() => setTogglingPolicyId(null), 1000);
      }
    },
    onError: (error: Error & { response?: { status?: number } }, { policyId, isActive }) => {
      // 504가 아닌 에러만 롤백
      if (error?.response?.status !== 504) {
        queryClient.setQueryData<AdminPolicy[]>(['adminPolicies'], (old = []) =>
          old.map(p => p.policyId === policyId ? { ...p, isActive: !isActive } : p)
        );
      }
    },
  });

  // 정책 생성
  const { mutate: createPolicy, isPending: isCreating } = useMutation({
    mutationFn: (data: PolicyRequest) => adminPolicyService.createPolicy(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPolicies'] });
    },
  });

  // 정책 수정
  const { mutate: updatePolicy, isPending: isUpdating } = useMutation({
    mutationFn: ({ policyId, data }: { policyId: number; data: PolicyRequest }) =>
      adminPolicyService.updatePolicy(policyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPolicies'] });
    },
  });

  // 정책 삭제
  const { mutate: deletePolicy } = useMutation({
    mutationFn: (policyId: number) => adminPolicyService.deletePolicy(policyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPolicies'] });
    },
  });

  return {
    policies,
    isLoading,
    error: error ? getErrorMessage(error) : '',
    togglingPolicyId,
    refetch,
    toggleActivation,
    createPolicy,
    updatePolicy,
    deletePolicy,
    isCreating,
    isUpdating,
  };
}
