import type { QuestionListItem } from '@/api/services/questionService';

type SortOrder = 'latest' | 'oldest';

const CATEGORY_MAP: Record<number, string> = {
  1: '정책 문의',
  2: '버그 제보',
  3: '기타',
};

const getCategoryName = (id: number) => CATEGORY_MAP[id] || `카테고리 ${id}`;

interface InquiryListProps {
  inquiries: QuestionListItem[];
  totalElements: number;
  isLoading: boolean;
  selectedId?: number;
  onSelect: (item: QuestionListItem) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
}

export default function InquiryList({
  inquiries,
  totalElements,
  isLoading,
  selectedId,
  onSelect,
  page,
  totalPages,
  onPageChange,
  sortOrder,
  onSortChange,
}: InquiryListProps) {
  const sortedInquiries = [...inquiries].sort((a, b) => {
    if (sortOrder === 'latest') return b.questionId - a.questionId;
    return a.questionId - b.questionId;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col" style={{ maxHeight: 'calc(100vh - 280px)' }}>
      <div className="p-6 border-b border-gray-200 shrink-0">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">문의 목록</h2>
            <p className="text-sm text-gray-600 mt-1">총 {totalElements}건 중 {inquiries.length}건 표시</p>
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

      <div className="divide-y divide-gray-200 overflow-y-auto flex-1">
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
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.isAnswer
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {item.isAnswer ? '답변완료' : '대기중'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-200 flex justify-center gap-2">
          <button
            onClick={() => onPageChange(Math.max(0, page - 1))}
            disabled={page === 0}
            className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-40 hover:bg-gray-50"
          >
            이전
          </button>
          <span className="px-3 py-1 text-sm text-gray-600">
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
            className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-40 hover:bg-gray-50"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}
