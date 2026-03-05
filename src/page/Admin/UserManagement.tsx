import { useState } from 'react';
import AdminHeader from './components/AdminHeader';
import UserSearchModal from './components/UserSearchModal';

interface User {
  id: string;
  name: string;
  phone: string;
  role: string;
  groupId: string;
}

interface SelectedUser extends User {
  dataUsage: string;
  familyMembers: Array<{ name: string; role: string; phone: string }>;
  sharedPool: {
    total: number;
    used: number;
    remaining: number;
    percentage: number;
  };
}

export default function UserManagement() {
  const [searchPhone, setSearchPhone] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);
  const [showSearchModal, setShowSearchModal] = useState(false);

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
    setSelectedUser(null);
  };

  const handleSelectUser = (user: User) => {
    setSelectedUser({
      ...user,
      dataUsage: '15.2GB / 20GB',
      familyMembers: [
        { name: '김철수', role: '부모', phone: '010-1111-2222' },
        { name: '김영희', role: '부모', phone: '010-3333-4444' },
      ],
      sharedPool: {
        total: 200,
        used: 150.4,
        remaining: 49.6,
        percentage: 75.2,
      },
    });
    setSearchResults([]);
  };

  return (
    <div className="p-8">
      <AdminHeader
        title="유저 검색 및 역할 관리"
        description="전화번호 뒷자리 또는 이름으로 유저를 검색하고 권한을 관리합니다."
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="text-lg font-bold text-gray-900">휴대폰 번호 또는 유저 이름 검색</h3>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">전화번호 뒷자리</label>
            <input
              type="text"
              placeholder="예: 5678"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              검색
            </button>
          </div>
        </div>
      </div>

      {searchResults.length > 0 && !selectedUser && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-bold mb-4">검색 결과 ({searchResults.length}명)</h3>
          <div className="space-y-2">
            {searchResults.map((user) => (
              <div
                key={user.id}
                onClick={() => handleSelectUser(user)}
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
        </div>
      )}

      {selectedUser && (
        <div className="text-center py-8">
          <p className="text-gray-600">선택된 유저: {selectedUser.name}</p>
          <button
            onClick={() => setSelectedUser(null)}
            className="mt-4 px-4 py-2 bg-gray-200 rounded-lg"
          >
            목록으로
          </button>
        </div>
      )}

      {showSearchModal && (
        <UserSearchModal
          onClose={() => setShowSearchModal(false)}
          onSelect={(user) => {
            handleSelectUser(user);
            setShowSearchModal(false);
          }}
        />
      )}
    </div>
  );
}
