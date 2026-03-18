import type { FamilyMember } from '@/api/services/familyService';

interface RoleManagementCardProps {
  members: FamilyMember[];
  isTransferring: boolean;
  onTransferOwner: (member: FamilyMember) => void;
}

export default function RoleManagementCard({ 
  members, 
  isTransferring, 
  onTransferOwner 
}: RoleManagementCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
            />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">역할 관리</h2>
          <p className="text-sm text-gray-500">가족 대표자를 변경할 수 있습니다.</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                구성원 정보
              </th>
              <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">
                역할
              </th>
              <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">
                관리
              </th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => {
              const isOwner = member.role === 'OWNER';
              return (
                <tr 
                  key={member.lineId} 
                  className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                          isOwner 
                            ? 'bg-gradient-to-br from-purple-500 to-pink-600' 
                            : 'bg-gradient-to-br from-blue-400 to-indigo-500'
                        }`}
                      >
                        {member.userName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{member.userName}</p>
                        <p className="text-sm text-gray-500">{member.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {isOwner ? (
                      <span className="px-4 py-2 bg-purple-100 text-purple-700 text-sm font-bold rounded-lg">
                        가족 대표자
                      </span>
                    ) : (
                      <span className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg">
                        일반 멤버
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {isOwner ? (
                      <span className="text-sm text-gray-500">현재 대표자</span>
                    ) : (
                      <button
                        onClick={() => onTransferOwner(member)}
                        disabled={isTransferring}
                        className="px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isTransferring ? '처리 중...' : '대표자 양도'}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex gap-2">
          <svg 
            className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>
          <div>
            <p className="text-sm font-semibold text-yellow-800">주의사항</p>
            <p className="text-xs text-yellow-700 mt-1">
              대표자 양도는 되돌릴 수 없습니다. 신중하게 선택해주세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
