import { useState } from 'react';
import AdminHeader from './components/AdminHeader';
import SearchBar from './components/SearchBar';
import ConfirmModal from '@/components/common/ConfirmModal';
import InquiryList from './components/InquiryList';
import InquiryDetail from './components/InquiryDetail';
import { useInquiries } from './hooks/useInquiries';
import type { QuestionListItem, QuestionDetail } from '@/api/services/questionService';
import { getErrorMessage } from '@/api/client';

type StatusFilter = 'all' | 'pending' | 'answered';
type SortOrder = 'latest' | 'oldest';

const FILTER_OPTIONS: { key: StatusFilter; label: string; activeClass: string }[] = [
  { key: 'all', label: '전체', activeClass: 'bg-blue-600 text-white' },
  { key: 'pending', label: '대기중', activeClass: 'bg-yellow-500 text-white' },
  { key: 'answered', label: '답변완료', activeClass: 'bg-green-500 text-white' },
];

export default function InquiryManagement() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [sortOrder, setSortOrder] = useState<SortOrder>('latest');
  const [selectedDetail, setSelectedDetail] = useState<QuestionDetail | null>(null);
  const [replyText, setReplyText] = useState('');
  const [attachedImage, setAttachedImage] = useState<File | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    message: string;
    onConfirm: () => void;
  }>({ open: false, message: '', onConfirm: () => {} });

  // 커스텀 훅 사용
  const {
    inquiries,
    totalPages,
    totalElements,
    isLoading,
    error,
    fetchDetail,
    sendAnswer,
    deleteAnswer,
    deleteQuestion,
    isSending,
  } = useInquiries(statusFilter, page, searchQuery);

  const handleFilterChange = (filter: StatusFilter) => {
    setStatusFilter(filter);
    setPage(0);
    setSelectedDetail(null);
  };

  const handleSelectInquiry = async (item: QuestionListItem) => {
    const detail = await fetchDetail(item);
    setSelectedDetail(detail);
    setReplyText('');
  };

  // 답변 전송
  const handleSendReply = () => {
    if (!selectedDetail || !replyText.trim()) return;

    setConfirmModal({
      open: true,
      message: '답변을 전송하시겠습니까?',
      onConfirm: () => {
        setConfirmModal(prev => ({ ...prev, open: false }));
        sendAnswer(
          {
            questionId: selectedDetail.questionId,
            content: replyText,
            attachedImage,
          },
          {
            onSuccess: async () => {
              setReplyText('');
              setAttachedImage(null);
              // 상세 정보 다시 로드
              const updated = await fetchDetail({
                questionId: selectedDetail.questionId,
                questionCategoryId: selectedDetail.questionCategoryId,
                lineId: selectedDetail.lineId,
                title: selectedDetail.title,
                isAnswer: true,
              });
              setSelectedDetail(updated);
            },
            onError: (err) => {
              alert(getErrorMessage(err));
            },
          }
        );
      },
    });
  };

  // 답변 삭제
  const handleDeleteAnswer = (answerId: number) => {
    setConfirmModal({
      open: true,
      message: '답변을 삭제하시겠습니까?',
      onConfirm: () => {
        setConfirmModal(prev => ({ ...prev, open: false }));
        deleteAnswer(answerId, {
          onSuccess: async () => {
            if (selectedDetail) {
              const updated = await fetchDetail({
                questionId: selectedDetail.questionId,
                questionCategoryId: selectedDetail.questionCategoryId,
                lineId: selectedDetail.lineId,
                title: selectedDetail.title,
                isAnswer: false,
              });
              setSelectedDetail(updated);
            }
          },
          onError: (err) => {
            alert(getErrorMessage(err));
          },
        });
      },
    });
  };

  // 문의 삭제
  const handleDeleteQuestion = (questionId: number) => {
    setConfirmModal({
      open: true,
      message: '이 문의를 삭제하시겠습니까?',
      onConfirm: () => {
        setConfirmModal(prev => ({ ...prev, open: false }));
        deleteQuestion(questionId, {
          onSuccess: () => {
            setSelectedDetail(null);
          },
          onError: (err) => {
            alert(getErrorMessage(err));
          },
        });
      },
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <InquiryList
          inquiries={inquiries}
          totalElements={totalElements}
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
