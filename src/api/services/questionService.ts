import apiClient from '../client';
import type { ApiResponse } from '../types';

// 문의 카테고리
export interface QuestionCategory {
  questionCategoryId: number;
  questionCategoryName: string;
}

// 카테고리 코드를 한글로 변환
export const getCategoryDisplayName = (categoryName: string): string => {
  const categoryMap: Record<string, string> = {
    'policy_inquiry': '정책 문의',
    'bug_report': '버그 제보',
    'others': '기타',
  };
  return categoryMap[categoryName] || categoryName;
};

// 첨부파일
export interface Attachment {
  s3Key?: string;
  url?: string;
  fileSize: number;
}

// 답변
export interface Answer {
  answerId: number;
  userId: number;
  content: string;
  createdAt: string;
  attachments: Attachment[];
}

// 문의사항 목록 아이템
export interface QuestionListItem {
  questionId: number;
  questionCategoryId: number;
  lineId: number;
  title: string;
  isAnswer: boolean;
}

// 문의사항 상세
export interface QuestionDetail {
  questionId: number;
  questionCategoryId: number;
  lineId: number;
  title: string;
  content: string;
  isAnswer: boolean;
  createdAt: string;
  attachments: Attachment[];
  answer?: Answer;
}

// 문의사항 생성 요청
export interface CreateQuestionRequest {
  questionCategoryId: number;
  title: string;
  content: string;
  attachments?: Attachment[];
}

// 페이지네이션 응답
export interface PaginatedQuestions {
  content: QuestionListItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// Presigned URL 요청
export interface PresignedUrlRequest {
  files: {
    fileName: string;
    contentType: string;
  }[];
  domain: 'QUESTION' | 'ANSWER';
}

// Presigned URL 응답
export interface PresignedUrlResponse {
  uploads: {
    uploadUrl: string;
    s3Key: string;
  }[];
}

export const questionService = {
  // 문의 카테고리 조회
  getCategories: async () => {
    const response = await apiClient.get<{ questionCategories: QuestionCategory[] }>(
      '/questions/categories'
    );
    return response.data;
  },

  // 문의사항 목록 조회
  getQuestions: async (pageNumber: number = 0, pageSize: number = 10) => {
    const response = await apiClient.get<PaginatedQuestions>('/questions/users', {
      params: { 
        pageNumber,
        pageSize,
      },
    });
    return response.data;
  },

  // 문의사항 상세 조회
  getQuestionDetail: async (questionId: number) => {
    const response = await apiClient.get<QuestionDetail>('/questions/details', {
      params: { questionId },
    });
    return response.data;
  },

  // Presigned URL 발급
  getPresignedUrls: async (request: PresignedUrlRequest) => {
    const response = await apiClient.post<PresignedUrlResponse>(
      '/uploads/presigned-urls',
      request
    );
    return response.data;
  },

  // S3에 파일 업로드
  uploadToS3: async (presignedUrl: string, file: File) => {
    await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });
  },

  // 문의사항 생성
  createQuestion: async (question: CreateQuestionRequest) => {
    const response = await apiClient.post<{ questionId: number; title: string }>(
      '/questions',
      question
    );
    return response.data;
  },

  // 문의사항 삭제
  deleteQuestion: async (questionId: number) => {
    const response = await apiClient.delete<ApiResponse<void>>('/questions', {
      params: { questionId },
    });
    return response.data;
  },
};
