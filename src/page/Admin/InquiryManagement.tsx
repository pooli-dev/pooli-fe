import { useState, useEffect, useCallback } from 'react';
import AdminHeader from './components/AdminHeader';
import SearchBar from './components/SearchBar';
import ConfirmModal from '@/components/common/ConfirmModal';
import { questionService } from '@/api';
import type { QuestionListItem, QuestionDetail } from '@/api/services/questionService';
import { getErrorMessage } from '@/api/client';

type StatusFilter = 'all' | 'pending' | 'answered';
type SortOrder = 'latest' | 'oldest';

const CATEGORY_MAP: Record<number, string> = {
  1: '정책 문의',
  2: '버그 제보',
  3: '기타',
};

const FILTER_OPTIONS: { key: StatusFilter; label: string; activeClass: string }[] = [
  { key: 'all', label: '전체', activeClass: 'bg-blue-600 text-white' },
  { key: 'pending', label: '대기중', activeClass: 'bg-yellow-500 text-white' },
  { key: 'answered', label: '답변완료', activeClass: 'bg-green-500 text-white' },
];

const PAGE_SIZE = 20;

const getCategoryName = (id: number) => CATEGORY_MAP[id] || `카테고리 ${id}`;

const isHtmlResponse = (data: unknown): boolean =>
  typeof data === 'string' && data.includes('<!doctype');

export default function InquiryManagement() {
  const [inquiries, setInquiries] = useState<QuestionListItem[]>([]);
  const [selectedDetail, setSelectedDetail] = useState<QuestionDetail | null>(null);
  const [replyText, setReplyText] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [attachedImage, setAttachedImage] = useState<File | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>('latest');
  const [confirmModal, setConfirmModal] = useState<{ open: boolean; message: string; onConfirm: () => void }>({ open: false, message: '', onConfirm: () => {} });

  // 문의 목록 조회
  const fetchInquiries = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const params: Parameters<typeof questionService.getAdminQuestions>[0] = {
        pageNumber: page,
        pageSize: PAGE_SIZE,
      };
      if (statusFilter === 'pending') params.isAnswered = false;
      if (statusFilter === 'answered') params.isAnswered = true;

      const data = await questionService.getAdminQuestions(params);

      if (isHtmlResponse(data)) {
        setError('세션이 만료되었습니다. 다시 로그인해주세요.');
        localStorage.removeItem('adminAuthenticated');
        return;
      }

      setInquiries(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error('문의 목록 조회 실패:', err);
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { fetchInquiries(); }, [fetchInquiries]);

  // 문의 상세 조회 + 첨부파일 URL 로드
  const handleSelectInquiry = async (item: QuestionListItem) => {
    try {
      const detail = await questionService.getQuestionDetail(item.questionId);

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
            console.warn('첨부파일 URL 조회 실패');
          }
        }
      }

      setSelectedDetail(detail || null);
      setReplyText('');
    } catch (err) {
      console.error('문의 상세 조회 실패:', err);
      setSelectedDetail(null);
    }
  };

  const handleFilterChange = (filter: StatusFilter) => {
    setStatusFilter(filter);
    setPage(0);
    setSelectedDetail(null);
  };

  // 답변 전송
  const handleSendReply = async () => {
    if (!selectedDetail || !replyText.trim()) return;
    setConfirmModal({
      open: true,
      message: '답변을 전송하시겠습니까?',
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, open: false }));
        setIsSending(true);
        try {
          let uploadedAttachments: { s3Key: string; fileSize: number }[] = [];

          if (attachedImage) {
            try {
              const presigned = await questionService.getPresignedUrls({
                files: [{ fileName: attachedImage.name, contentType: attachedImage.type }],
                domain: 'ANSWER',
              });
              if (presigned.uploads?.length) {
                await questionService.uploadToS3(presigned.uploads[0].uploadUrl, attachedImage);
                uploadedAttachments = [{ s3Key: presigned.uploads[0].s3Key, fileSize: attachedImage.size }];
              }
            } catch {
              console.warn('답변 이미지 업로드 실패, 이미지 없이 전송합니다.');
            }
          }

          await questionService.createAnswer({
            questionId: selectedDetail.questionId,
            content: replyText,
            ...(uploadedAttachments.length > 0 && { attachments: uploadedAttachments }),
          });

          setReplyText('');
          setAttachedImage(null);
          await handleSelectInquiry({ questionId: selectedDetail.questionId, questionCategoryId: selectedDetail.questionCategoryId, lineId: selectedDetail.lineId, title: selectedDetail.title, isAnswer: true });
          await fetchInquiries();
        } catch (err) {
          console.error('답변 전송 실패:', err);
          alert(getErrorMessage(err));
        } finally {
          setIsSending(false);
        }
      },
    });
  };

  // 답변 삭제
  const handleDeleteAnswer = async (answerId: number) => {
    setConfirmModal({
      open: true,
      message: '답변을 삭제하시겠습니까?',
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, open: false }));
        try {
          await questionService.deleteAnswer(answerId);
          if (selectedDetail) {
            await handleSelectInquiry({ questionId: selectedDetail.questionId, questionCategoryId: selectedDetail.questionCategoryId, lineId: selectedDetail.lineId, title: selectedDetail.title, isAnswer: false });
          }
          await fetchInquiries();
        } catch (err) {
          console.error('답변 삭제 실패:', err);
          alert(getErrorMessage(err));
        }
      },
    });
  };

  // 문의 삭제
  const handleDeleteQuestion = async (questionId: number) => {
    setConfirmModal({
      open: true,
      message: '이 문의를 삭제하시겠습니까?',
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, open: false }));
        try {
          await questionService.deleteQuestion(questionId);
          setSelectedDetail(null);
          await fetchInquiries();
        } catch (err) {
          console.error('문의 삭제 실패:', err);
          alert(getErrorMessage(err));
        }
      },
    });
  };

  const filteredInquiries = searchQuery
    ? inquiries.filter((i) => i.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : inquiries;

  return (
    <div className="p-8">
      <AdminHeader
        title="문의 사항 관리"
        description="유저의 문의사항을 확인하고 답변을 작성합니다."
      />

      {/* 검색 및 필터 */}
      <div className="mb-6 space-y-4">
        <SearchBar placeholder="제목으로 검색..." value={searchQuery} onChange={setSearchQuery} onSearch={() => {}} />
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            {FILTER_OPTIONS.map(({ key, label, activeClass }) => (
              <button
                key={key}
                onClick={() => handleFilterChange(key)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === key ? activeClass : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <span className="text-sm text-gray-500">총 {totalElements}건</span>
        </div>
      </div>

      {error && <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

      <div className="grid grid-cols-2 gap-6">
        <InquiryList
          inquiries={filteredInquiries}
          isLoading={isLoading}
          selectedId={selectedDetail?.questionId}
          onSelect={handleSelectInquiry}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
        />
        <InquiryDetail
          detail={selectedDetail}
          replyText={replyText}
          onReplyChange={setReplyText}
          attachedImage={attachedImage}
          onImageUpload={(e) => e.target.files?.[0] && setAttachedImage(e.target.files[0])}
          onImageRemove={() => setAttachedImage(null)}
          onSendReply={handleSendReply}
          onDeleteAnswer={handleDeleteAnswer}
          onDeleteQuestion={handleDeleteQuestion}
          isSending={isSending}
        />
      </div>

      <ConfirmModal
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal(prev => ({ ...prev, open: false }))}
        onConfirm={confirmModal.onConfirm}
        message={confirmModal.message}
      />
    </div>
  );
}

// 문의 목록 컴포넌트
function InquiryList({
  inquiries, isLoading, selectedId, onSelect, page, totalPages, onPageChange, sortOrder, onSortChange,
}: {
  inquiries: QuestionListItem[];
  isLoading: boolean;
  selectedId?: number;
  onSelect: (item: QuestionListItem) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
}) {
  const sortedInquiries = [...inquiries].sort((a, b) => {
    if (sortOrder === 'latest') return b.questionId - a.questionId;
    return a.questionId - b.questionId;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">문의 목록</h2>
            <p className="text-sm text-gray-600 mt-1">{inquiries.length}건 표시</p>
          </div>
          <select
            value={sortOrder}
            onChange={(e) => onSortChange(e.target.value as SortOrder)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="latest">최신순</option>
            <option value="oldest">오래된순</option>
          </select>
        </div>
      </div>
      <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
        {isLoading ? (
          <div className="p-8 text-center text-gray-400">불러오는 중...</div>
        ) : sortedInquiries.length === 0 ? (
          <div className="p-8 text-center text-gray-400">문의사항이 없습니다.</div>
        ) : (
          sortedInquiries.map((item) => (
            <div
              key={item.questionId}
              onClick={() => onSelect(item)}
              className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedId === item.questionId ? 'bg-blue-50 border-l-4 border-blue-600' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{item.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {getCategoryName(item.questionCategoryId)} · 회선 {item.lineId}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  item.isAnswer ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {item.isAnswer ? '답변완료' : '대기중'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-200 flex justify-center gap-2">
          <button onClick={() => onPageChange(Math.max(0, page - 1))} disabled={page === 0}
            className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-40 hover:bg-gray-50">이전</button>
          <span className="px-3 py-1 text-sm text-gray-600">{page + 1} / {totalPages}</span>
          <button onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1}
            className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-40 hover:bg-gray-50">다음</button>
        </div>
      )}
    </div>
  );
}

// 문의 상세 컴포넌트
function InquiryDetail({
  detail, replyText, onReplyChange, attachedImage, onImageUpload, onImageRemove,
  onSendReply, onDeleteAnswer, onDeleteQuestion, isSending,
}: {
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
}) {
  if (!detail) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center text-gray-400 py-20">
        <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <p className="text-lg font-medium">문의를 선택해주세요</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 max-h-[700px] overflow-y-auto">
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
              <p className="text-gray-900 mt-1">{getCategoryName(detail.questionCategoryId)}</p>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-600">회선 ID</span>
              <p className="text-gray-900 mt-1">{detail.lineId}</p>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-600">작성일</span>
              <p className="text-gray-900 mt-1">{new Date(detail.createdAt).toLocaleString('ko-KR')}</p>
            </div>
          </div>
          <div>
            <span className="text-sm font-semibold text-gray-600">내용</span>
            <p className="mt-2 p-4 bg-gray-50 rounded-lg text-gray-900 whitespace-pre-wrap">{detail.content}</p>
          </div>
          {detail.attachments && detail.attachments.length > 0 && (
            <div>
              <span className="text-sm font-semibold text-gray-600">첨부파일</span>
              <div className="mt-2 flex flex-wrap gap-3">
                {detail.attachments.map((att, idx) => (
                  <a key={idx} href={att.url} target="_blank" rel="noopener noreferrer" className="block">
                    <img src={att.url} alt={`첨부 ${idx + 1}`} className="w-32 h-32 object-cover rounded-lg border border-gray-200 hover:opacity-80 transition-opacity" />
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
              <p className="text-xs text-gray-500 mt-3">{new Date(detail.answer.createdAt).toLocaleString('ko-KR')}</p>
              {detail.answer.attachments?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {detail.answer.attachments.map((att, idx) => (
                    <a key={idx} href={att.url} target="_blank" rel="noopener noreferrer">
                      <img src={att.url} alt={`답변 첨부 ${idx + 1}`} className="w-24 h-24 object-cover rounded-lg border" />
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
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  이미지 첨부
                  <input type="file" accept="image/*" onChange={onImageUpload} className="hidden" />
                </label>
                {attachedImage && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <span className="truncate max-w-[150px]">{attachedImage.name}</span>
                    <button onClick={onImageRemove} className="text-red-400 hover:text-red-600">✕</button>
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
