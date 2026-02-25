import { useState } from 'react';

type InquiryCategory = '정책 문의' | '버그 제보' | '기능 요청' | '기타';
type InquiryStatus = '대기중' | '완료';

interface Inquiry {
  id: number;
  category: InquiryCategory;
  title: string;
  content: string;
  status: InquiryStatus;
  date: string;
  response?: string;
  responseDate?: string;
}

// 더미 데이터 (테스트용 - 빈 배열로 변경하면 "문의 내역이 없습니다" UI 확인 가능)
const dummyInquiries: Inquiry[] = [
  {
    id: 1,
    category: '정책 문의',
    title: '데이터 한도 상향건으로 정책 문의드립니다',
    content: '다크모드 지원 건의로 탑으로는 컬러에 인합니다. 데이터 한도 상향 이니나, 앱급 도지가 마일이 돈을 가지가 있습니다.',
    status: '대기중',
    date: '2024.10.15',
  },
  {
    id: 2,
    category: '기능 요청',
    title: '데이터 한도 상향건으로 정책 문의드립니다',
    content: '다크모드 지원 건의로 탑으로는 컬러에 인합니다.',
    status: '완료',
    date: '2024.10.15',
    response: '안녕하세요 고객님, 소중한 의견 감사드립니다. 건의해주신 다크모드 기능은 현재 개발팀에서 긍정적으로 검토 중이며 다음 업데이트에 반영될 예정입니다.',
    responseDate: '2024.10.16',
  },
  {
    id: 3,
    category: '버그 제보',
    title: '데이터 한도 상향건으로 정책 문의드립니다',
    content: '',
    status: '완료',
    date: '2024.10.14',
  },
  {
    id: 4,
    category: '정책 문의',
    title: '가나다라마바사',
    content: '',
    status: '완료',
    date: '2024.10.13',
  },
];

/**
 * 고객지원 페이지 컴포넌트
 * @returns 고객지원 페이지 JSX
 */
export default function Support() {
  const [activeTab, setActiveTab] = useState<'inquiry' | 'history'>('inquiry');
  const [selectedCategory, setSelectedCategory] = useState<InquiryCategory>('정책 문의');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [expandedInquiries, setExpandedInquiries] = useState<number[]>([]);
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [contentError, setContentError] = useState(false);
  const [showValidationMessage, setShowValidationMessage] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const categories: InquiryCategory[] = ['정책 문의', '버그 제보', '기타'];
  
  const getCategoryColor = (category: InquiryCategory) => {
    switch (category) {
      case '정책 문의':
        return 'bg-[#DADFFD] text-[#363D81]';
      case '기능 요청':
        return 'bg-[#FDEBD2] text-[#AD6E2F]';
      case '버그 제보':
        return 'bg-[#F9DBDB] text-[#973E40]';
      default:
        return 'bg-[#F0F0F0] text-[#666666]';
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).slice(0, 3 - images.length);
      setImages([...images, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    // 유효성 검사
    const isTitleValid = title.trim().length > 0;
    const isContentValid = content.trim().length >= 10;
    
    setTitleError(!isTitleValid);
    setContentError(!isContentValid);
    
    if (!isTitleValid || !isContentValid) {
      setShowValidationMessage(true);
      return;
    }
    
    setShowValidationMessage(false);
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = () => {
    console.log({ selectedCategory, title, content, images });
    // API 호출 로직
    
    // 성공 후 초기화 및 문의내역으로 이동
    setTitle('');
    setContent('');
    setImages([]);
    setShowConfirmModal(false);
    setActiveTab('history');
  };

  const sortedInquiries = [...dummyInquiries].sort((a, b) => {
    if (sortOrder === 'latest') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const toggleInquiry = (id: number) => {
    setExpandedInquiries(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="pt-[106px] pb-24">
      {/* 탭 */}
      <div className="bg-[#E8E8E8] rounded-2xl p-1 mx-9 mb-6 flex gap-1 justify-center">
        <button
          onClick={() => setActiveTab('inquiry')}
          className={`px-[70px] py-2 rounded-2xl font-medium transition-colors text-sm ${
            activeTab === 'inquiry'
              ? 'bg-white text-[#219BE4]'
              : 'bg-transparent text-[#999999]'
          }`}
          aria-label="문의하기 탭"
        >
          문의하기
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-[70px] py-2 rounded-2xl font-medium transition-colors text-sm ${
            activeTab === 'history'
              ? 'bg-white text-[#219BE4]'
              : 'bg-transparent text-[#999999]'
          }`}
          aria-label="문의내역 탭"
        >
          문의내역
        </button>
      </div>

      {activeTab === 'inquiry' ? (
        <div>
          {/* 문의 유형 */}
          <h3 className="text-base font-semibold mb-3 px-9">문의 유형</h3>
          <div className="flex gap-2 mb-8 px-9">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-full border transition-colors ${
                  selectedCategory === category
                    ? 'border-[#219BE4] bg-[#E3F2FC] text-[#298EEE]'
                    : 'border-[#DDDDDD] bg-white text-[#666666]'
                }`}
                aria-label={`${category} 선택`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* 제목 */}
          <div className="mb-8 px-[33px]">
            <div className="flex items-center gap-1 mb-2">
              <h3 className="text-sm font-semibold">제목</h3>
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full" aria-label="필수" />
              {titleError && (
                <span className="ml-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  !
                </span>
              )}
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError && e.target.value.trim()) setTitleError(false);
              }}
              placeholder="제목을 입력해주세요"
              className="w-full px-4 py-3 rounded-lg border border-[#E4E9F0] focus:outline-none focus:border-[#678BF7] placeholder:font-light text-sm font-light"
              aria-label="문의 제목"
            />
          </div>

          {/* 내용 */}
          <div className="mb-6 px-[33px]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1">
                <h3 className="text-base font-semibold">내용</h3>
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full" aria-label="필수" />
                {contentError && (
                  <span className="ml-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    !
                  </span>
                )}
              </div>
              <span className="text-xs text-[#999999] pr-[3px]">{content.length} / 500</span>
            </div>
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value.slice(0, 500));
                if (contentError && e.target.value.trim().length >= 10) setContentError(false);
              }}
              placeholder="문의하실 내용을 상세히 적어주세요. 구체적인 상황을 알려주시면 빠른 처리가 가능합니다. (10자 이상 500자 이하)"
              className="w-full h-40 px-4 py-3 rounded-lg border border-[#E4E9F0] focus:outline-none focus:border-[#678BF7] resize-none placeholder:font-light text-sm font-light"
              aria-label="문의 내용"
            />
          </div>

          {/* 이미지 첨부 */}
          <div className="mb-6 px-[33px]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-semibold">이미지 첨부</h3>
              <span className="text-xs text-[#999999] pr-[3px]">최대 3장</span>
            </div>
            <div className="flex gap-3">
              {images.map((image, index) => (
                <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden bg-[#2C4A3B]">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`첨부 이미지 ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 w-5 h-5 bg-[#2C4A3B] rounded-full flex items-center justify-center text-white text-xs"
                    aria-label={`이미지 ${index + 1} 삭제`}
                  >
                    ×
                  </button>
                </div>
              ))}
              {images.length < 3 && (
                <label className="w-20 h-20 rounded-lg border-2 border-dashed border-[#DDDDDD] flex flex-col items-center justify-center cursor-pointer bg-[#F5F5F5]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="5" width="18" height="16" rx="2" stroke="#999999" strokeWidth="1.5" />
                    <circle cx="8.5" cy="10.5" r="1.5" fill="#999999" />
                    <path d="M3 17L8 12L11 15" stroke="#999999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M11 13L14 10L21 17" stroke="#999999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-xs text-[#999999] mt-1">추가</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    aria-label="이미지 추가"
                  />
                </label>
              )}
            </div>
          </div>

          {/* 유효성 검사 메시지 */}
          {showValidationMessage && (
            <p className="text-sm text-red-500 mb-4 text-center">문의 내용을 확인해주세요</p>
          )}

          {/* 제출 버튼 */}
          <div className="px-9">
            <button
              onClick={handleSubmit}
              className="w-full py-4 bg-[#678BF7] text-white rounded-xl font-semibold text-lg"
              aria-label="문의 접수하기"
            >
              문의 접수하기
            </button>
          </div>

          {/* 확인 모달 */}
          {showConfirmModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full">
                <p className="text-center text-[#333333] mb-6 leading-relaxed">
                  문의 접수 후 문의 취소가 불가합니다.<br />
                  정말 접수하시겠습니까?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="flex-1 py-3 bg-[#E0E0E0] text-[#666666] rounded-lg font-medium"
                  >
                    아니요
                  </button>
                  <button
                    onClick={handleConfirmSubmit}
                    className="flex-1 py-3 bg-[#678BF7] text-white rounded-lg font-medium"
                  >
                    예
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="px-6">
          {/* 정렬 */}
          <div className="relative mb-4 pl-2">
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
              <div className="absolute top-full left-2 mt-2 bg-white rounded-lg shadow-lg border border-[#EEEEEE] overflow-hidden z-10">
                <button
                  onClick={() => {
                    setSortOrder('latest');
                    setShowSortDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-[#F5F5F5] transition-colors"
                >
                  최신순
                </button>
                <button
                  onClick={() => {
                    setSortOrder('oldest');
                    setShowSortDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-[#F5F5F5] transition-colors"
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
                key={inquiry.id}
                className="relative bg-white rounded-2xl p-5 overflow-hidden"
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
                  className="flex items-start justify-between cursor-pointer relative z-10"
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
                  <div className="flex-1 min-w-0 flex items-center gap-2">
                    <span className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 ${getCategoryColor(inquiry.category)}`}>
                      {inquiry.category}
                    </span>
                    <h4 className={`font-semibold text-[#333333] text-base ${expandedInquiries.includes(inquiry.id) ? '' : 'truncate'}`}>
                      {inquiry.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                    <span
                      className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
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
                      className={`transition-transform ${expandedInquiries.includes(inquiry.id) ? 'rotate-180' : ''}`}
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
                    <p className="text-sm text-[#333333] mb-4">{inquiry.content}</p>

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
                        <p className="text-sm text-[#333333]">{inquiry.response}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          )}
        </div>
      )}
    </div>
  );
}
