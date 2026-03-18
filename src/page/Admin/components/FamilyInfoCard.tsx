import type { FamilyMember } from '@/api/services/familyService';

interface FamilyInfoCardProps {
  familyId: number;
  members: FamilyMember[];
  owner?: FamilyMember;
}

export default function FamilyInfoCard({ familyId, members, owner }: FamilyInfoCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900">가족 그룹 정보</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-500 mb-1">대표자</p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {owner?.userName.charAt(0) || '?'}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{owner?.userName || '없음'}</p>
                <p className="text-xs text-gray-500">{owner?.phone || '-'}</p>
              </div>
            </div>
          </div>
          <span className="px-3 py-1.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
            OWNER
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">가족 ID</p>
            <p className="text-lg font-bold text-gray-900">{familyId}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">구성원 수</p>
            <p className="text-lg font-bold text-gray-900">{members.length}명</p>
          </div>
        </div>
      </div>
    </div>
  );
}
