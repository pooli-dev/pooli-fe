import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FamilyMember } from '@/api/services/familyService';
import BlockPolicyTab from '@/page/Admin/components/policy/BlockPolicyTab';
import LimitPolicyTab from '@/page/Admin/components/policy/LimitPolicyTab';
import AppPolicyTab from '@/page/Admin/components/policy/AppPolicyTab';
import PolicyScroll from '@/components/common/PolicyScroll';
import { blockService } from '@/api';
import { useAppliedPolicies } from '@/page/PolicyDetail/hooks/useAppliedPolicies';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useToastStore } from '@/store/toastStore';

type TabType = '차단' | '제한' | '애플리케이션';

// 즉시 차단 배너 컴포넌트
function ActiveBlockBanner({ endTime, onRelease }: { endTime: Date; onRelease: () => void }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const diff = endTime.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeft('차단 종료');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft(`${hours}시간 ${minutes}분 ${seconds}초`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <div className="mb-4 md:mb-6 p-3 md:p-4 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <p className="text-sm md:text-base font-bold text-red-900">즉시 차단 활성화</p>
            <p className="text-xs md:text-sm text-red-700">남은 시간: {timeLeft}</p>
          </div>
        </div>
        <button
          onClick={onRelease}
          className="w-full sm:w-auto px-3 md:px-4 py-1.5 md:py-2 bg-white text-red-600 text-sm md:text-base font-medium rounded-lg hover:bg-red-50 transition-colors border border-red-200"
        >
          차단 해제
        </button>
      </div>
    </div>
  );
}

export default function MemberPolicyManager({ 
  members, 
  initialLineId 
}: { 
  members: FamilyMember[];
  initialLineId?: number;
}) {
  // initialLineId가 있으면 해당 member를 찾아서 선택, 없으면 첫번째 member 선택
  const initialMember = initialLineId 
    ? members.find(m => m.lineId === initialLineId) || members[0] 
    : members[0];
  
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(initialMember || null);
  const [activeTab, setActiveTab] = useState<TabType>('차단');
  const [activeBlockEndTime, setActiveBlockEndTime] = useState<Date | null>(null);
  const queryClient = useQueryClient();
  const { show } = useToastStore();
  const navigate = useNavigate();

  const { appliedPolicies, refetch: refetchAppliedPolicies } = useAppliedPolicies(selectedMember?.lineId);

  // 즉시 차단 상태 조회
  const { data: immediateBlockData } = useQuery({
    queryKey: ['immediateBlock', selectedMember?.lineId],
    queryFn: () => blockService.getImmediateBlock(selectedMember!.lineId).then(res => res.data),
    enabled: !!selectedMember?.lineId,
  });

  // immediateBlockData 변경 시 activeBlockEndTime 동기화
  const [prevImmediateBlockData, setPrevImmediateBlockData] = useState(immediateBlockData);
  if (immediateBlockData !== prevImmediateBlockData) {
    setPrevImmediateBlockData(immediateBlockData);
    if (immediateBlockData?.blockEndAt && new Date(immediateBlockData.blockEndAt) > new Date()) {
      setActiveBlockEndTime(new Date(immediateBlockData.blockEndAt));
    } else {
      setActiveBlockEndTime(null);
    }
  }

  // 차단 해제 핸들러
  const handleBlockRelease = async () => {
    if (!selectedMember?.lineId) return;
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const nowStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    await blockService.patchImmediateBlock(selectedMember.lineId, nowStr);
    setActiveBlockEndTime(null);
    queryClient.invalidateQueries({ queryKey: ['immediateBlock', selectedMember.lineId] });
    show('차단이 해제되었습니다.');
  };

  // 차단 적용 핸들러
  const handleBlockApply = (blockEndAt: string) => {
    setActiveBlockEndTime(new Date(blockEndAt));
  };

  if (members.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-400">
        <p className="text-lg font-medium">구성원이 없습니다</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* 가족 상세정보 관리 버튼 */}
      <div className="flex justify-end">
        <button
          onClick={() => navigate(`/admin/family-detail?lineId=${selectedMember?.lineId || members[0]?.lineId}`)}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          가족 상세정보 관리
        </button>
      </div>

      {/* 구성원 선택 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
        <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4">구성원 선택</h3>
        <div className="flex flex-wrap gap-2 md:gap-3">
          {members.map(member => {
            const roleLabel = member.role === 'OWNER' ? '대표자' : member.role === 'MEMBER' ? '구성원' : member.role;
            return (
              <button
                key={member.lineId}
                onClick={() => setSelectedMember(member)}
                className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg border-2 transition-all ${
                  selectedMember?.lineId === member.lineId
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm ${
                    selectedMember?.lineId === member.lineId
                      ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                      : 'bg-gradient-to-br from-gray-400 to-gray-500'
                  }`}
                >
                  {member.userName.charAt(0)}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <p
                      className={`text-sm md:text-base font-medium ${
                        selectedMember?.lineId === member.lineId ? 'text-gray-900' : 'text-gray-600'
                      }`}
                    >
                      {member.userName}
                    </p>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        member.role === 'OWNER'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {roleLabel}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{member.phone}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedMember && (
        <div className="space-y-4 md:space-y-6">
          {/* 즉시 차단 배너 */}
          {activeBlockEndTime && (
            <ActiveBlockBanner endTime={activeBlockEndTime} onRelease={handleBlockRelease} />
          )}

          {/* 현재 적용 중인 정책 */}
          {appliedPolicies.length > 0 && (
            <div>
              <PolicyScroll
                policies={appliedPolicies.map((policy, index) => ({
                  id: index + 1,
                  type: policy.type,
                  bgColor: policy.bgColor,
                  title: policy.title,
                }))}
                title="현재 적용중인 정책"
              />
            </div>
          )}

          {/* 정책 관리 탭 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* 탭 헤더 */}
            <div
              className="flex relative"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderBottom: '1px solid rgba(129, 129, 129, 0.3)',
              }}
            >
              {(['차단', '제한', '애플리케이션'] as TabType[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 md:py-3 text-xs md:text-sm font-medium relative ${
                    activeTab === tab ? 'text-black' : 'text-[#818181]'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div
                      className="absolute bottom-0 left-0 right-0 h-[2px]"
                      style={{ backgroundColor: '#818181' }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* 탭 콘텐츠 */}
            <div className="p-4 md:p-6">
              {activeTab === '차단' && (
                <BlockPolicyTab
                  lineId={selectedMember.lineId}
                  onPolicyChange={refetchAppliedPolicies}
                  onBlockApply={handleBlockApply}
                />
              )}
              {activeTab === '제한' && (
                <LimitPolicyTab 
                  lineId={selectedMember.lineId} 
                  onPolicyChange={refetchAppliedPolicies}
                />
              )}
              {activeTab === '애플리케이션' && (
                <AppPolicyTab 
                  lineId={selectedMember.lineId}
                  onPolicyChange={refetchAppliedPolicies}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
