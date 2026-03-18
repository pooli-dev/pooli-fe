import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminPolicyService } from '@/api/services/adminPolicyService';

export function useAdminCategories() {
  const queryClient = useQueryClient();

  // 카테고리 목록 조회
  const { data: categories = [], refetch } = useQuery({
    queryKey: ['policyCategories'],
    queryFn: async () => {
      const data = await adminPolicyService.getCategories();
      return Array.isArray(data) ? data : [];
    },
  });

  // 카테고리 생성
  const { mutate: createCategory, isPending: isCreating } = useMutation({
    mutationFn: (data: { policyCategoryId: number; policyCategoryName: string }) =>
      adminPolicyService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policyCategories'] });
    },
  });

  // 카테고리 수정
  const { mutate: updateCategory, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      adminPolicyService.updateCategory(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policyCategories'] });
    },
  });

  // 카테고리 삭제
  const { mutate: deleteCategory } = useMutation({
    mutationFn: (id: number) => adminPolicyService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policyCategories'] });
    },
  });

  return {
    categories,
    refetch,
    createCategory,
    updateCategory,
    deleteCategory,
    isCreating,
    isUpdating,
  };
}
