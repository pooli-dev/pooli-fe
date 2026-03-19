import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { questionService } from '@/api';
import type { QuestionListItem, QuestionDetail } from '@/api/services/questionService';
import { getErrorMessage } from '@/api/client';

type StatusFilter = 'all' | 'pending' | 'answered';

const PAGE_SIZE = 20;

const isHtmlResponse = (data: unknown): boolean =>
  typeof data === 'string' && data.includes('<!doctype');

export function useInquiries(statusFilter: StatusFilter, page: number, searchQuery: string = '') {
  const queryClient = useQueryClient();
  const isSearching = searchQuery.trim().length > 0;

  // 문의 목록 조회
  const { data, isLoading, error } = useQuery({
    queryKey: ['adminInquiries', statusFilter, page, searchQuery],
    queryFn: async () => {
      const params: Parameters<typeof questionService.getAdminQuestions>[0] = {
        pageNumber: isSearching ? 0 : page,
        pageSize: isSearching ? 1000 : PAGE_SIZE,
      };

      if (statusFilter === 'pending') params.isAnswered = false;
      if (statusFilter === 'answered') params.isAnswered = true;

      const data = await questionService.getAdminQuestions(params);

      if (isHtmlResponse(data)) {
        throw new Error('세션이 만료되었습니다. 다시 로그인해주세요.');
      }

      let inquiries = data.content || [];

      // 검색어가 있으면 프론트에서 필터링
      if (isSearching) {
        const query = searchQuery.toLowerCase();
        inquiries = inquiries.filter((i) => i.title.toLowerCase().includes(query));
      }

      return {
        inquiries,
        totalPages: isSearching ? 1 : (data.totalPages || 0),
        totalElements: isSearching ? inquiries.length : (data.totalElements || 0),
      };
    },
  });

  // 문의 상세 조회
  const fetchDetail = useCallback(async (item: QuestionListItem): Promise<QuestionDetail | null> => {
    try {
      const detail = await questionService.getQuestionDetail(item.questionId);

      // 첨부파일 URL 로드
      if (detail.attachments?.length) {
        const s3Keys = detail.attachments.map((a) => a.s3Key).filter(Boolean) as string[];
        if (s3Keys.length) {
          try {
            const { downloads } = await questionService.getDownloadUrls(s3Keys);
            detail.attachments = detail.attachments.map((a) => {
              const match = downloads.find((d) => d.s3Key === a.s3Key);
              return match ? { ...a, url: match.downloadUrl } : a;
            });
          } catch {
            // 첨부파일 URL 조회 실패 시 무시
          }
        }
      }

      return detail;
    } catch {
      return null;
    }
  }, []);

  // 답변 전송
  const { mutate: sendAnswer, isPending: isSending } = useMutation({
    mutationFn: async ({
      questionId,
      content,
      attachedImage,
    }: {
      questionId: number;
      content: string;
      attachedImage: File | null;
    }) => {
      let uploadedAttachments: { s3Key: string; fileSize: number }[] = [];

      if (attachedImage) {
        try {
          const presigned = await questionService.getPresignedUrls({
            files: [{ fileName: attachedImage.name, contentType: attachedImage.type }],
            domain: 'ANSWER',
          });
          if (presigned.uploads?.length) {
            await questionService.uploadToS3(presigned.uploads[0].uploadUrl, attachedImage);
            uploadedAttachments = [
              { s3Key: presigned.uploads[0].s3Key, fileSize: attachedImage.size },
            ];
          }
        } catch {
          // 답변 이미지 업로드 실패 시 이미지 없이 전송
        }
      }

      await questionService.createAnswer({
        questionId,
        content,
        ...(uploadedAttachments.length > 0 && { attachments: uploadedAttachments }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminInquiries'] });
    },
  });

  // 답변 삭제
  const { mutate: deleteAnswer } = useMutation({
    mutationFn: (answerId: number) => questionService.deleteAnswer(answerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminInquiries'] });
    },
  });

  // 문의 삭제
  const { mutate: deleteQuestion } = useMutation({
    mutationFn: (questionId: number) => questionService.deleteQuestion(questionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminInquiries'] });
    },
  });

  return {
    inquiries: data?.inquiries || [],
    totalPages: data?.totalPages || 0,
    totalElements: data?.totalElements || 0,
    isLoading,
    error: error ? getErrorMessage(error) : '',
    fetchDetail,
    sendAnswer,
    deleteAnswer,
    deleteQuestion,
    isSending,
  };
}
