import { useState } from 'react';
import AdminHeader from './components/AdminHeader';
import SearchBar from './components/SearchBar';

export default function InquiryManagement() {
  const [inquiries] = useState([
    {
      id: 1,
      userName: '김민수',
      phone: '010-1234-5678',
      title: '데이터 사용량 문의',
      content: '이번 달 데이터 사용량이 갑자기 증가했는데 확인 부탁드립니다.',
      date: '2023-11-23 14:30',
      status: 'pending',
    },
    {
      id: 2,
      userName: '이영희',
      phone: '010-2345-6789',
      title: '앱 차단 해제 요청',
      content: '유튜브 앱 차단을 일시적으로 해제해주실 수 있나요?',
      date: '2023-11-23 10:15',
      status: 'answered',
    },
    {
      id: 3,
      userName: '박철수',
      phone: '010-3456-7890',
      title: '정책 변경 문의',
      content: '자녀 계정의 사용 시간 제한을 변경하고 싶습니다.',
      date: '2023-11-22 16:20',
      status: 'pending',
    },
    {
      id: 4,
      userName: '최지은',
      phone: '010-4567-8901',
      title: '공유 데이터 문의',
      content: '가족 공유 데이터 풀 설정 방법을 알고 싶습니다.',
      date: '2023-11-21 09:30',
      status: 'answered',
    },
  ]);

  const [selectedInquiry, setSelectedInquiry] = useState<typeof inquiries[0] | null>(null);
  const [replyText, setReplyText] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'answered'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');
  const [attachedImage, setAttachedImage] = useState<File | null>(null);

  const filteredInquiries = inquiries
    .filter((inquiry) => {
      if (statusFilter !== 'all' && inquiry.status !== statusFilter) return false;
      if (searchQuery && !inquiry.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === 'latest') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedImage(e.target.files[0]);
    }
  };

  return (
    <div className="p-8">
      <AdminHeader
        title="문의 사항 관리"
        description="유저의 문의사항을 확인하고 답변을 작성합니다."
      />

      {/* 검색 및 필터 */}
      <div className="mb-6 space-y-4">
        <SearchBar
          placeholder="제목으로 검색..."
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={() => {}}
        />

        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'pending'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              대기중
            </button>
            <button
              onClick={() => setStatusFilter('answered')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'answered'
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              답변완료
            </button>
          </div>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'latest' | 'oldest')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            <option value="latest">최신순</option>
            <option value="oldest">오래된순</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* 문의 목록 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold">문의 목록</h2>
            <p className="text-sm text-gray-600 mt-1">
              총 {filteredInquiries.length}건
            </p>
          </div>
          <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
            {filteredInquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                onClick={() => setSelectedInquiry(inquiry)}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedInquiry?.id === inquiry.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{inquiry.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {inquiry.userName} ({inquiry.phone})
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      inquiry.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {inquiry.status === 'pending' ? '대기중' : '답변완료'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{inquiry.content}</p>
                <p className="text-xs text-gray-400 mt-2">{inquiry.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 문의 상세 및 답변 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {selectedInquiry ? (
            <>
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold mb-4">문의 상세</h2>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-semibold text-gray-600">제목</span>
                    <p className="font-bold text-gray-900 mt-1">{selectedInquiry.title}</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-600">작성자</span>
                    <p className="font-bold text-gray-900 mt-1">
                      {selectedInquiry.userName} ({selectedInquiry.phone})
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-600">작성일</span>
                    <p className="font-bold text-gray-900 mt-1">{selectedInquiry.date}</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-600">내용</span>
                    <p className="mt-2 p-4 bg-gray-50 rounded-lg text-gray-900">{selectedInquiry.content}</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-bold mb-3">답변 작성</h3>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="답변 내용을 입력하세요..."
                  className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />

                {/* 이미지 첨부 */}
                <div className="mt-4">
                  <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer w-fit">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">이미지 첨부</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  {attachedImage && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {attachedImage.name}
                      <button
                        onClick={() => setAttachedImage(null)}
                        className="text-red-600 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-4">
                  <button className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold transition-colors">
                    임시저장
                  </button>
                  <button className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors">
                    답변 전송
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 py-20">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <p className="text-lg font-medium">문의를 선택해주세요</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
