import type { QuestionDetail } from '@/api/services/questionService';
import { formatDate } from '../utils/formatters';

const CATEGORY_MAP: Record<number, string> = {
  1: '정책 문의',
  2: '버그 제보',
  3: '기타',
};

const getCategoryName = (id: number) => CATEGORY_MAP[id] || `카테고리 ${id}`;

interface InquiryDetailProps {
  detail: QuestionDetail | null;
  replyText: string;
  onReplyChange: (text: string) => void;
  attachedImage: File | null;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: () => void;
  onSendReply: () => void;
  onDeleteAnswer: (answerId: number) => void;
  onDeleteQuestion: (questionId: number) => void;
  isSending: boolean;
}

export default function InquiryDetail({
  detail,
  replyText,
  onReplyChange,
  attachedImage,
  onImageUpload,
  onImageRemove,
  onSendReply,
  onDeleteAnswer,
  onDeleteQuestion,
  isSending,
}: InquiryDetailProps) {
  if (!detail) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center text-gray-400 py-20">
        <svg 
          className="w-16 h-16 mb-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
          />
        </svg>
        <p className="text-lg font-medium">문의를 선택해주세요</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">문의 상세</h2>
          <button
            onClick={() => onDeleteQuestion(detail.questionId)}
            className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            문의 삭제
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <span className="text-sm font-semibold text-gray-600">제목</span>
            <p className="font-bold text-gray-900 mt-1">{detail.title}</p>
          </div>

          <div className="flex gap-6">
            <div>
              <span className="text-sm font-semibold text-gray-600">카테고리</span>
              <p className="text-gray-900 mt-1">
                {getCategoryName(detail.questionCategoryId)}
              </p>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-600">회선 ID</span>
              <p className="text-gray-900 mt-1">{detail.lineId}</p>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-600">작성일</span>
              <p className="text-gray-900 mt-1">{formatDate(detail.createdAt)}</p>
            </div>
          </div>

          <div>
            <span className="text-sm font-semibold text-gray-600">내용</span>
            <p className="mt-2 p-4 bg-gray-50 rounded-lg text-gray-900 whitespace-pre-wrap">
              {detail.content}
            </p>
          </div>

          {detail.attachments && detail.attachments.length > 0 && (
            <div>
              <span className="text-sm font-semibold text-gray-600">첨부파일</span>
              <div className="mt-2 flex flex-wrap gap-3">
                {detail.attachments.map((att, idx) => (
                  <a
                    key={idx}
                    href={att.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <img
                      src={att.url}
                      alt={`첨부 ${idx + 1}`}
                      className="w-32 h-32 object-cover rounded-lg border border-gray-200 hover:opacity-80 transition-opacity"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 답변 영역 */}
      <div className="p-6">
        {detail.answer ? (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold text-green-700">답변 완료</h3>
              <button
                onClick={() => onDeleteAnswer(detail.answer!.answerId)}
                className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                답변 삭제
              </button>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-gray-900 whitespace-pre-wrap">{detail.answer.content}</p>
              <p className="text-xs text-gray-500 mt-3">
                {formatDate(detail.answer.createdAt)}
              </p>
              {detail.answer.attachments?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {detail.answer.attachments.map((att, idx) => (
                    <a
                      key={idx}
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={att.url}
                        alt={`답변 첨부 ${idx + 1}`}
                        className="w-24 h-24 object-cover rounded-lg border"
                      />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">답변 작성</h3>
            <textarea
              value={replyText}
              onChange={(e) => onReplyChange(e.target.value)}
              placeholder="답변 내용을 입력하세요..."
              className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
              rows={5}
            />
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                  <svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" 
                    />
                  </svg>
                  이미지 첨부
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onImageUpload}
                    className="hidden"
                  />
                </label>
                {attachedImage && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <span className="truncate max-w-[150px]">{attachedImage.name}</span>
                    <button
                      onClick={onImageRemove}
                      className="text-red-400 hover:text-red-600"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={onSendReply}
                disabled={!replyText.trim() || isSending}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {isSending ? '전송 중...' : '답변 전송'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
