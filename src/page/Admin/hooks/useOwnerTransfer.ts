import { useMutation, useQueryClient } from '@tanstack/react-query';
import { familyService } from '@/api';
import { useToastStore } from '@/store/toastStore';
import { extractErrorCode, extractErrorMessage, extractHttpStatus } from '../utils/formatters';

interface OwnerTransferParams {
  currentLineId: number;
  changeLineId: number;
}

export function useOwnerTransfer(lineId: number | null) {
  const queryClient = useQueryClient();
  const { show } = useToastStore();

  const { mutate: transferOwner, isPending: isTransferring } = useMutation({
    mutationFn: async ({ currentLineId, changeLineId }: OwnerTransferParams) => {
      const response = await familyService.transferOwnerAdmin(currentLineId, changeLineId);
      return response;
    },
    onSuccess: async () => {
      if (lineId) {
        await queryClient.refetchQueries({ 
          queryKey: ['familyMembersByLine', lineId],
          type: 'active'
        });
      }
      show('대표자가 양도되었습니다.', 'success');
    },
    onError: (error: Error) => {
      
      const errorCode = extractErrorCode(error);
      const errorMsg = extractErrorMessage(error);
      const httpStatus = extractHttpStatus(error);
      
      let errorDetails = '대표자 양도 실패';
      
      if (httpStatus === 500) {
        errorDetails = [
          '대표자 양도 실패',
          '',
          '⚠️ 백엔드 이슈',
          '어드민 세션으로는 이 API를 호출할 수 없습니다.',
          '',
          '백엔드 팀에 다음을 요청하세요:',
          '• PATCH /api/roles/representative',
          '• lineId 파라미터 추가 지원',
          '• 또는 어드민 전용 엔드포인트 생성',
          '',
          `에러 코드: ${errorCode}`,
          `메시지: ${errorMsg}`,
        ].join('\n');
      } else if (httpStatus === 400) {
        errorDetails = [
          '대표자 양도 실패',
          '',
          '⚠️ 잘못된 요청',
          '파라미터가 올바르지 않습니다.',
          '',
          errorCode ? `에러 코드: ${errorCode}` : '',
          errorMsg ? `메시지: ${errorMsg}` : '',
          '',
          '개발자 콘솔을 확인하여 전달된 파라미터를 검토하세요.',
        ].filter(Boolean).join('\n');
      } else {
        errorDetails = [
          '대표자 양도 실패',
          errorCode ? `[에러 코드: ${errorCode}]` : '',
          errorMsg,
          httpStatus ? `(HTTP ${httpStatus})` : ''
        ].filter(Boolean).join('\n');
      }
      
      show(errorDetails, 'error');
    },
  });

  return {
    transferOwner,
    isTransferring,
  };
}
