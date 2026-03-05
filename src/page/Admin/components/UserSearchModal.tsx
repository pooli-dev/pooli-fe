import { useState } from 'react';

interface User {
  id: string;
  name: string;
  phone: string;
  role: string;
  groupId: string;
}

interface UserSearchModalProps {
  onClose: () => void;
  onSelect: (user: User) => void;
}

export default function UserSearchModal({ onClose, onSelect }: UserSearchModalProps) {
  const [searchPhone, setSearchPhone] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);

  const dummyUsers: User[] = [
    { id: '1', name: '김민수', phone: '010-1234-5678', role: '자녀', groupId: '10245' },
    { id: '2', name: '김철수', phone: '010-1111-2222', role: '부모', groupId: '10245' },
    { id: '3', name: '김영희', phone: '010-3333-4444', role: '부모', groupId: '10245' },
    { id: '4', name: '박영희', phone: '010-9876-5432', role: '부모', groupId: '10246' },
    { id: '5', name: '박지훈', phone: '010-5555-6666', role: '자녀', groupId: '10246' },
  ];

  const handleSearch = () => {
    const results = dummyUsers.filter((user) => {
      const phoneMatch = !searchPhone || user.phone.includes(searchPhone);
      const nameMatch = !searchName || user.name.includes(searchName);
      return phoneMatch && nameMatch;
    });
    setSearchResults(results);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">유저 검색</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* 검색 입력 */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">전화번호 뒷자리</label>
            <input
              type="text"
              placeholder="예: 5678"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">이름</label>
            <input
              type="text"
              placeholder="예: 김민수"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
            >
              검색
            </button>
          </div>
        </div>

        {/* 검색 결과 */}
        <div className="flex-1 overflow-y-auto">
          {searchResults.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 mb-3">총 {searchResults.length}명의 유저가 검색되었습니다.</p>
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  onClick={() => onSelect(user)}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user.name[0]}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                      {user.role}
                    </span>
                    <span className="text-xs text-gray-500">GID: {user.groupId}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-lg font-medium">검색 결과가 없습니다</p>
              <p className="text-sm">전화번호 또는 이름으로 검색해주세요</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
