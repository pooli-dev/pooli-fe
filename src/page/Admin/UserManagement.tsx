import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from './components/AdminHeader';
import { lineService } from '@/api';
import type { LineByPhoneResult } from '@/api/services/lineService';
import { getErrorMessage } from '@/api/client';

export default function UserManagement() {
  const navigate = useNavigate();
  const [searchPhone, setSearchPhone] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [searchResults, setSearchResults] = useState<LineByPhoneResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchPhone.trim()) {
      setError('전화번호 뒷자리를 입력해주세요.');
      return;
    }
    setIsLoading(true);
    setError('');
    setSearched(true);
    try {
      const response = await lineService.getLinesByPhone(searchPhone.trim());

      if (typeof response.data === 'string' && (response.data as unknown as string).includes('<!doctype')) {
        setError('API 응답이 올바르지 않습니다.');
        return;
      }

      setSearchResults(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(getErrorMessage(err));
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectLine = (line: LineByPhoneResult) => {
    // 별도 페이지로 이동
    navigate(`/admin/user-management?lineId=${line.lineId}`);
  };

  const filteredResults = nameFilter.trim()
    ? searchResults.filter(r => r.userName.toLowerCase().includes(nameFilter.trim().toLowerCase()))
    : searchResults;

  // 검색 화면
  return (
    <div className="p-8">
      <AdminHeader title="유저 검색 및 관리" description="전화번호로 유저 회선을 검색합니다." />

      {/* 검색 영역 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="text-lg font-bold text-gray-900">회선 검색</h3>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">전화번호 뒷자리</label>
            <input type="text" placeholder="예: 2222" value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">이름 (결과 필터)</label>
            <input type="text" placeholder="이름으로 필터링" value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
          </div>
          <div className="flex items-end">
            <button onClick={handleSearch} disabled={isLoading}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors flex items-center gap-2 disabled:opacity-50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {isLoading ? '검색 중...' : '검색'}
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">전화번호를 입력하고 검색하세요.</p>
      </div>

      {error && <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

      {/* 검색 결과 */}
      {(searched || isLoading) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold">검색 결과</h3>
            {!isLoading && <p className="text-sm text-gray-500 mt-1">{filteredResults.length}건{nameFilter.trim() ? ` (전체 ${searchResults.length}건 중)` : ''}</p>}
          </div>

          {isLoading ? (
            <div className="p-16 flex flex-col items-center justify-center text-gray-400">
              <svg className="w-10 h-10 animate-spin mb-4 text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-sm font-medium">검색 중...</p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-lg font-medium">검색 결과가 없습니다</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">회선 ID</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">유저 정보</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">유저 ID</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">이메일</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">관리</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((line) => (
                  <tr key={line.lineId} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">{line.lineId}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {line.userName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{line.userName}</p>
                          <p className="text-xs text-gray-500">{line.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">{line.userId}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{line.email}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleSelectLine(line)}
                        className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>관리</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="p-4 border-t border-gray-200 text-sm text-gray-600">
            총 {filteredResults.length}개의 회선
          </div>
        </div>
      )}
    </div>
  );
}
