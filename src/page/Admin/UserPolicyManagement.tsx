import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AdminHeader from './components/AdminHeader';
import { familyService } from '@/api';
import type { FamilyMember } from '@/api/services/familyService';
import { getErrorMessage } from '@/api/client';
import MemberPolicyManager from '@/page/Admin/components/MemberPolicyManager';

export default function UserPolicyManagement() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const lineId = searchParams.get('lineId');

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (!lineId) {
      navigate('/admin/users');
      return;
    }

    const fetchMembers = async () => {
      setLoadingMembers(true);
      try {
        const response = await familyService.getMembersByLine(Number(lineId));
        setFamilyMembers(response.data.members || []);
        
        // 선택된 유저 이름 찾기
        const selectedMember = response.data.members.find((m: FamilyMember) => m.lineId === Number(lineId));
        if (selectedMember) {
          setUserName(selectedMember.userName);
        }
      } catch (err) {
        alert(getErrorMessage(err));
        setFamilyMembers([]);
      } finally {
        setLoadingMembers(false);
      }
    };

    fetchMembers();
  }, [lineId, navigate]);

  const handleBackToSearch = () => {
    navigate('/admin/users');
  };

  if (!lineId) {
    return null;
  }

  return (
    <div className="p-8">
      <AdminHeader 
        title="유저 정책 관리" 
        description={userName ? `${userName}님의 가족 구성원 정책을 관리합니다.` : '가족 구성원 정책을 관리합니다.'} 
      />
      
      {/* 뒤로가기 */}
      <button 
        onClick={handleBackToSearch}
        className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        검색으로 돌아가기
      </button>

      {loadingMembers ? (
        <div className="flex justify-center items-center py-20">
          <svg className="w-10 h-10 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      ) : (
        <MemberPolicyManager members={familyMembers} initialLineId={Number(lineId)} />
      )}
    </div>
  );
}
