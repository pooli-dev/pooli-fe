import { useState } from 'react';
import AdminHeader from './components/AdminHeader';
import UserSearchModal from './components/UserSearchModal';

interface Recipient {
  id: string;
  name: string;
  phone: string;
}

export default function NotificationManagement() {
  const [notificationForm, setNotificationForm] = useState({
    title: '',
  });

  const [recipientType, setRecipientType] = useState<'all' | 'representative' | 'normal'>('all');
  const [selectedRecipients, setSelectedRecipients] = useState<Recipient[]>([]);
  const [showUserSearchModal, setShowUserSearchModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);

  const handleSend = () => {
    setShowSendModal(true);
  };

  const handleRemoveRecipient = (id: string) => {
    setSelectedRecipients(selectedRecipients.filter((r) => r.id !== id));
  };

  const handleAddRecipient = (user: { id: string; name: string; phone: string }) => {
    if (!selectedRecipients.find((r) => r.id === user.id)) {
      setSelectedRecipients([...selectedRecipients, user]);
    }
  };

  return (
    <div className="p-8">
      <AdminHeader
        title="알림 전송"
        description="유저에게 데이터, 정책, 권한 관련 알림을 전송합니다."
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="space-y-6">
          {/* 수신자 유형 선택 */}
          <div>
            <label className="block text-sm font-bold mb-4">수신자 유형</label>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => setRecipientType('all')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  recipientType === 'all'
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center justify-center mb-3">
                  <svg className={`w-10 h-10 ${recipientType === 'all' ? 'text-blue-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className={`font-bold text-lg ${recipientType === 'all' ? 'text-gray-900' : 'text-gray-600'}`}>
                  All
                </div>
                <div className="text-sm text-gray-600 mt-1">전체 유저</div>
              </button>

              <button
                onClick={() => setRecipientType('representative')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  recipientType === 'representative'
                    ? 'border-purple-500 bg-purple-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center justify-center mb-3">
                  <svg className={`w-10 h-10 ${recipientType === 'representative' ? 'text-purple-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className={`font-bold text-lg ${recipientType === 'representative' ? 'text-gray-900' : 'text-gray-600'}`}>
                  대표자만
                </div>
                <div className="text-sm text-gray-600 mt-1">가족 대표자</div>
              </button>

              <button
                onClick={() => setRecipientType('normal')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  recipientType === 'normal'
                    ? 'border-green-500 bg-green-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center justify-center mb-3">
                  <svg className={`w-10 h-10 ${recipientType === 'normal' ? 'text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className={`font-bold text-lg ${recipientType === 'normal' ? 'text-gray-900' : 'text-gray-600'}`}>
                  일반 유저
                </div>
                <div className="text-sm text-gray-600 mt-1">일반 사용자</div>
              </button>
            </div>
          </div>

          {/* 개별 수신자 선택 */}
          {recipientType === 'normal' && (
            <div>
              <label className="block text-sm font-bold mb-3">수신자 검색</label>
              <div className="border border-gray-300 rounded-lg p-4 min-h-[120px]">
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedRecipients.map((recipient) => (
                    <div
                      key={recipient.id}
                      className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full"
                    >
                      <span className="text-sm font-medium">
                        {recipient.name} ({recipient.phone})
                      </span>
                      <button
                        onClick={() => handleRemoveRecipient(recipient.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setShowUserSearchModal(true)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  휴대폰 번호 또는 유저 이름 검색
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                추가 대상: 데이터 허용량 초과 유저
              </p>
            </div>
          )}

          {/* 제목 */}
          <div>
            <label className="block text-sm font-bold mb-2">제목</label>
            <input
              type="text"
              placeholder="예: [데이터] 공유 풀 잔여량 안내"
              value={notificationForm.title}
              onChange={(e) => setNotificationForm({ ...notificationForm, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          <button
            onClick={handleSend}
            className="w-full px-4 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold text-lg flex items-center justify-center gap-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            전송하기
          </button>
        </div>
      </div>

      {/* 유저 검색 모달 */}
      {showUserSearchModal && (
        <UserSearchModal
          onClose={() => setShowUserSearchModal(false)}
          onSelect={(user) => {
            handleAddRecipient(user);
            setShowUserSearchModal(false);
          }}
        />
      )}

      {/* 전송 확인 모달 */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md">
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">알림을 전송하시겠습니까?</h2>
              <p className="text-gray-600 text-center">전송된 알림은 취소할 수 없습니다.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSendModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => {
                  setShowSendModal(false);
                  alert('알림이 전송되었습니다.');
                }}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
              >
                전송
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
