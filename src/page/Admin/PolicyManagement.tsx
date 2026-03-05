import { useState } from 'react';
import Toggle from '@/components/common/Toggle';
import AdminHeader from './components/AdminHeader';

export default function PolicyManagement() {
  const [policies, setPolicies] = useState([
    {
      id: 1,
      name: '날짜별 반복 차단 정책',
      category: '반복 차단',
      lastModified: '2023-11-23 10:00',
      status: true,
    },
    {
      id: 2,
      name: '즉시 차단 정책',
      category: '즉시 차단',
      lastModified: '2023-11-23 09:30',
      status: false,
    },
    {
      id: 3,
      name: '월 공유 데이터 사용량 제한',
      category: '데이터 제한',
      lastModified: '2023-11-22 16:45',
      status: true,
    },
    {
      id: 4,
      name: '하루 총 데이터 사용량 제한',
      category: '데이터 제한',
      lastModified: '2023-11-22 15:00',
      status: true,
    },
    {
      id: 5,
      name: '어플리케이션 속도 제한',
      category: '앱별 제한',
      lastModified: '2023-11-21 11:20',
      status: true,
    },
    {
      id: 6,
      name: '어플리케이션 최대 데이터 제한',
      category: '앱별 제한',
      lastModified: '2023-11-21 10:15',
      status: false,
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="p-8">
      <AdminHeader
        title="정책 관리"
        description="정책을 생성, 수정, 삭제하고 상태를 관리합니다."
      />

      {/* 기능 카드 */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold mb-2">정책 관리 및 부여</h3>
          <p className="text-sm text-gray-600">무선통신 데이터 관리 및 전송 차단 스케줄 설정합니다.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold mb-2">유저 권한 설정</h3>
          <p className="text-sm text-gray-600">여러는 계정의 역할 및 권한 가능한 레벨 범위를 제어합니다.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold mb-2">고객 문의 확인</h3>
          <p className="text-sm text-gray-600">실시간 고객 문의 내역을 확인하고 처리 상태를 관리합니다.</p>
        </div>
      </div>

      {/* 정책 목록 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold">상세 정책 설정 및 관리</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>정책 추가</span>
          </button>
        </div>

        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">정책명</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">카테고리</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">최종 수정일</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">상태</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">관리</th>
            </tr>
          </thead>
          <tbody>
            {policies.map((policy) => (
              <tr key={policy.id} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{policy.name}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    {policy.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{policy.lastModified}</td>
                <td className="px-6 py-4">
                  <Toggle
                    checked={policy.status}
                    onChange={(checked) => {
                      setPolicies(
                        policies.map((p) =>
                          p.id === policy.id ? { ...p, status: checked } : p
                        )
                      );
                    }}
                    aria-label={`${policy.name} 상태 토글`}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="p-4 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-600">총 {policies.length}개의 정책이 조회되었습니다.</div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 text-sm font-medium">이전</button>
            <button className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm font-medium">1</button>
            <button className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 text-sm font-medium">2</button>
            <button className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 text-sm font-medium">다음</button>
          </div>
        </div>
      </div>

      {/* 정책 추가 모달 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">새 정책 추가</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold mb-2">정책명</label>
                <input
                  type="text"
                  placeholder="예: 야간 데이터 사용 차단"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">카테고리</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium">
                  <option>카테고리 선택</option>
                  <option>데이터 제한</option>
                  <option>즉시 차단</option>
                  <option>반복 차단</option>
                  <option>권한 제어</option>
                </select>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Toggle checked={true} onChange={() => {}} aria-label="상태 설정" />
                <div>
                  <div className="text-sm font-bold">상태 설정</div>
                  <p className="text-sm text-gray-600">생성과 동시에 정책을 활성화합니다.</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
                >
                  취소
                </button>
                <button className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors">
                  추가하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
