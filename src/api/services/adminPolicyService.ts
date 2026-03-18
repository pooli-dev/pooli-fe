import apiClient from '../client';

// 정책 목록 아이템
export interface AdminPolicy {
  policyId: number;
  policyName: string;
  policyCategoryId: number;
  policyCategoryName: string;
  isActive: boolean;
  isNew?: boolean;
  updatedAt?: string | null;
}

// 정책 생성/수정 요청
export interface PolicyRequest {
  policyName: string;
  policyCategoryId: number;
  isActive: boolean;
}

// 정책 활성화 토글 응답
export interface PolicyActivationResponse {
  policyId: number;
  isActive: boolean;
  updatedAt: string;
}

// 정책 카테고리
export interface PolicyCategory {
  policyCategoryId: number;
  policyCategoryName: string;
  updatedAt?: string;
}

export const adminPolicyService = {
  // 전체 정책 목록 조회
  getAllPolicies: async () => {
    const response = await apiClient.get<AdminPolicy[]>('/admin/policies', {
      timeout: 120000, // 2분
    });
    return response.data;
  },

  // 정책 추가
  createPolicy: async (data: PolicyRequest) => {
    const response = await apiClient.post<AdminPolicy>('/admin/policies', data, {
      timeout: 120000, // 2분
    });
    return response.data;
  },

  // 정책 삭제
  deletePolicy: async (policyId: number) => {
    const response = await apiClient.delete<AdminPolicy>('/admin/policies', {
      params: { policyId },
      timeout: 120000, // 2분
    });
    return response.data;
  },

  // 정책 수정
  updatePolicy: async (policyId: number, data: PolicyRequest) => {
    const response = await apiClient.patch<AdminPolicy>('/admin/policies', data, {
      params: { policyId },
      timeout: 120000, // 2분
    });
    return response.data;
  },

  // 정책 활성화/비활성화 토글
  toggleActivation: async (policyId: number, isActive: boolean) => {
    const response = await apiClient.patch<PolicyActivationResponse>(
      '/admin/policies/activation',
      { isActive },
      { 
        params: { policyId },
        timeout: 120000, // 2분 (백엔드 처리 시간이 오래 걸림)
      }
    );
    return response.data;
  },

  // 카테고리 목록 조회
  getCategories: async () => {
    const response = await apiClient.get<PolicyCategory[]>('/admin/policies/categories');
    return response.data;
  },

  // 카테고리 삭제
  deleteCategory: async (policyCategoryId: number) => {
    const response = await apiClient.delete('/admin/policies/categories', {
      params: { policyCategoryId },
    });
    return response.data;
  },

  // 카테고리 수정
  updateCategory: async (policyCategoryId: number, policyCategoryName: string) => {
    const response = await apiClient.patch<PolicyCategory>(
      '/admin/policies/categories',
      { policyCategoryId, policyCategoryName },
      { params: { policyCategoryId } },
    );
    return response.data;
  },

  // 카테고리 추가
  createCategory: async (data: { policyCategoryId: number; policyCategoryName: string }) => {
    const response = await apiClient.post<PolicyCategory>('/admin/policies/categories', data);
    return response.data;
  },
};
