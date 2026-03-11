import { useState } from 'react';

type InquiryStatus = '대기중' | '완료';

export interface Inquiry {
  id: number;
  categoryId: number;
  categoryName: string;
  title: string;
  content: string;
  status: InquiryStatus;
  date: string;
  response?: string;
  responseDate?: string;
  attachments?: { url?: string; fileSize: number }[];
  responseAttachments?: { url?: string; fileSize: number }[];
}

interface InquiryHistoryProps {
  inquiries: Inquiry[];
  sortOrder: 'latest' | 'oldest';
  onSortChange: (order: 'latest' | 'oldest') => void;
}

export default function InquiryHistory({ inquiries, sortOrder, onSortChange }: InquiryHistoryProps) {
  const [expandedInquiries, setExpandedInquiries] = useState<number[]>([]);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const getCategoryColor = (categoryName: string) => {
    if (categoryName.includes('정책')) {
      return 'bg-[#DADFFD] text-[#363D81]';
    } else if (categoryName.includes('기능')) {
      return 'bg-[#FDEBD2] text-[#AD6E2F]';
    } else if (categoryName.includes('버그')) {
      return 'bg-[#F9DBDB] text-[#973E40]';
    }
    return 'bg-[#F0F0F0] text-[#666666]';
  };

  const toggleInquiry = (id: number) => {
    setExpandedInquiries(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
    
    if (!expandedInquiries.includes(id)) {
      setTimeout(() => {
        const element = document.getElementById(`inquiry-${id}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const sortedInquiries = [...inquiries].sort((a, b) => {
    if (sortOrder === 'latest') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return (
    <div className="px-6">
      {/* 정렬 */}
      <div className="relative mb-4">
        <button
          onClick={() => setShowSortDropdown(!showSortDropdown)}
          className="flex items-center gap-2 text-sm font-medium text-[#666666]"
          aria-label="정렬 옵션"
        >
          <span>{sortOrder === 'latest' ? '최신순' : '오래된 순'}</span>
          <svg
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
            className={`transition-transform ${showSortDropdown ? 'rotate-180' : ''}`}
          >
            <path d="M1 1L6 6L11 1" stroke="#666666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        
        {showSortDropdown && (
          <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-[#EEEEEE] overflow-hidden z-50">
            <button
              onClick={() => {
                onSortChange('latest');
                setShowSortDropdown(false);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-[#F5F5F5] transition-colors whitespace-nowrap"
            >
              최신순
            </button>
            <button
              onClick={() => {
                onSortChange('oldest');
                setShowSortDropdown(false);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-[#F5F5F5] transition-colors whitespace-nowrap"
            >
              오래된 순
            </button>
          </div>
        )}
      </div>

      {/* 문의 내역 리스트 */}
      {sortedInquiries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 bg-[#F5F5F5] rounded-full flex items-center justify-center mb-4">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path
                d="M20 5C11.716 5 5 11.716 5 20C5 28.284 11.716 35 20 35C28.284 35 35 28.284 35 20C35 11.716 28.284 5 20 5Z"
                stroke="#CCCCCC"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M20 15V20M20 25H20.01"
                stroke="#CCCCCC"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p className="text-[#999999] text-sm">문의 내역이 없습니다</p>
        </div>
      ) : (
        <div className="space-y-[11px]">
          {sortedInquiries.map((inquiry) => (
            <div
              id={`inquiry-${inquiry.id}`}
              key={inquiry.id}
              className="relative bg-white rounded-2xl p-4 sm:p-5 overflow-hidden"
              style={{
                boxShadow: '0 4px 4px rgba(0, 0, 0, 0.25)',
              }}
            >
              {/* 그라데이션 테두리 효과 */}
              <div 
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(196, 196, 196, 0.2) 0%, rgba(196, 196, 196, 1) 100%)',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                  padding: '0.5px',
                }}
              />
              
              <div
                className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 cursor-pointer relative z-10"
                onClick={() => toggleInquiry(inquiry.id)}
                role="button"
                tabIndex={0}
                aria-expanded={expandedInquiries.includes(inquiry.id)}
                aria-label={`${inquiry.title} 문의 상세보기`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleInquiry(inquiry.id);
                  }
                }}
              >
                <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap flex-shrink-0 self-start ${getCategoryColor(inquiry.categoryName)}`}>
                    {inquiry.categoryName}
                  </span>
                  <h4 className={`font-semibold text-[#333333] text-sm sm:text-base break-words ${expandedInquiries.includes(inquiry.id) ? '' : 'line-clamp-2'}`}>
                    {inquiry.title}
                  </h4>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-start">
                  <span
                    className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap ${
                      inquiry.status === '완료'
                        ? 'bg-[#CBF7E0] text-[#16754B]'
                        : 'bg-[#FEEFB8] text-[#B1843D]'
                    }`}
                  >
                    {inquiry.status}
                  </span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className={`transition-transform flex-shrink-0 ${expandedInquiries.includes(inquiry.id) ? 'rotate-180' : ''}`}
                  >
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="#999999"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {expandedInquiries.includes(inquiry.id) && inquiry.content && (
                <div className="mt-4 pt-4 border-t border-[#F0F0F0] relative z-10">
                  <p className="text-xs text-[#999999] mb-2">문의 일시 : {inquiry.date}</p>
                  <p className="text-sm text-[#333333] mb-4 break-words whitespace-pre-wrap">{inquiry.content}</p>

                  {inquiry.response && (
                    <div 
                      className="bg-[#F8FCFD] rounded-lg p-4"
                      style={{
                        boxShadow: '0 0 8px rgba(241, 245, 246, 0.8)',
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 bg-[#678BF7] rounded-full flex items-center justify-center flex-shrink-0">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 8C9.65685 8 11 6.65685 11 5C11 3.34315 9.65685 2 8 2C6.34315 2 5 3.34315 5 5C5 6.65685 6.34315 8 8 8Z" fill="white"/>
                            <path d="M8 9C5.33333 9 3 10.3333 3 12V14H13V12C13 10.3333 10.6667 9 8 9Z" fill="white"/>
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-[#333333]">
                          고객센터 답변
                        </span>
                        <span className="text-xs text-[#999999]">
                          {inquiry.responseDate}
                        </span>
                      </div>
                      <p className="text-sm text-[#333333] break-words whitespace-pre-wrap">{inquiry.response}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
