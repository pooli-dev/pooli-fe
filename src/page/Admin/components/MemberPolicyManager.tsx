import { useState, useEffect } from 'react';
import type { FamilyMember } from '@/api/services/familyService';
import BlockPolicyTab from '@/page/Admin/components/policy/BlockPolicyTab';
import LimitPolicyTab from '@/page/Admin/components/policy/LimitPolicyTab';
import AppPolicyTab from '@/page/Admin/components/policy/AppPolicyTab';
import PolicyScroll from '@/components/common/PolicyScroll';
import { blockService } from '@/api';

type TabType = 'block' | 'limit' | 'app';

const TABS: { key: TabType; label: string; icon: string }[] = [
  { key: 'block', label: '차단 관리', icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636' },
  { key: 'limit', label: '데이터 제한', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { key: 'app', label: '애플리케이션', icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' },
];

type AppliedPolicy = {
  type: 'block' | 'limit' | 'app';
  bgColor: string;
  title: string;
};

export default function MemberPolicyManager({ members }: { members: FamilyMember[] }) {
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(members[0] || null);
  const [activeTab, setActiveTab] = useState<TabType>('block');
  const [appliedPolicies, setAppliedPolicies] = useState<AppliedPolicy[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedMember) {
      loadAppliedPolicies();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMember]);

  const loadAppliedPolicies = async () => {
    if (!selectedMember) return;
    
    setLoading(true);
    try {
      console.log('적용 중인 정책 조회 시작:', selectedMember.lineId);
      const res = await blockService.getAppliedPolicies(selectedMember.lineId);
      console.log('적용 중인 정책 응답:', res.data);
      const policies: AppliedPolicy[] = [];

      // 즉시 차단
      if (res.data.immediateBlock && res.data.immediateBlock.blockEndAt) {
        const endTime = new Date(res.data.immediateBlock.blockEndAt);
        console.log('즉시 차단 종료 시간:', endTime, '현재 시간:', new Date());
        if (endTime > new Date()) {
          policies.push({
            type: 'block',
            bgColor: '#FF6B6B',
            title: '즉시 차단 활성화'
          });
        }
      }

      // 반복 차단
      const activeRepeatBlocks = res.data.repeatBlockPolicyList.filter(p => p.isActive);
      console.log('활성화된 반복 차단:', activeRepeatBlocks.length);
      if (activeRepeatBlocks.length > 0) {
        policies.push({
          type: 'block',
          bgColor: '#FFA94D',
          title: `반복 차단 ${activeRepeatBlocks.length}개 활성화`
        });
      }

      // 데이터 제한
      if (res.data.limitPolicy) {
        console.log('데이터 제한 정책:', res.data.limitPolicy);
        if (res.data.limitPolicy.isDailyDataLimitActive) {
          policies.push({
            type: 'limit',
            bgColor: '#4DABF7',
            title: '하루 총 사용량 제한'
          });
        }
        if (res.data.limitPolicy.isSharedDataLimitActive) {
          policies.push({
            type: 'limit',
            bgColor: '#51CF66',
            title: '월 공유 데이터 제한'
          });
        }
      }

      // 앱 정책
      const activeApps = res.data.appPolicyList.filter(p => p.enabled);
      console.log('활성화된 앱 정책:', activeApps.length);
      if (activeApps.length > 0) {
        policies.push({
          type: 'app',
          bgColor: '#9775FA',
          title: `앱 정책 ${activeApps.length}개 활성화`
        });
      }

      console.log('최종 적용 중인 정책:', policies);
      setAppliedPolicies(policies);
    } catch (err) {
      console.error('적용 중인 정책 조회 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  if (members.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-400">
        <p className="text-lg font-medium">구성원이 없습니다</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 구성원 선택 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold mb-4">구성원 선택</h3>
        <div className="flex flex-wrap gap-3">
          {members.map(member => (
            <button key={member.lineId}
              onClick={() => setSelectedMember(member)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all ${
                selectedMember?.lineId === member.lineId
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                selectedMember?.lineId === member.lineId
                  ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                  : 'bg-gradient-to-br from-gray-400 to-gray-500'
              }`}>
                {member.userName.charAt(0)}
              </div>
              <div className="text-left">
                <p className={`font-medium ${selectedMember?.lineId === member.lineId ? 'text-gray-900' : 'text-gray-600'}`}>
                  {member.userName}
                </p>
                <p className="text-xs text-gray-500">{member.phone}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 현재 적용 중인 정책 */}
      {selectedMember && !loading && appliedPolicies.length > 0 && (
        <div className="px-6">
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
      {selectedMember && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* 탭 헤더 */}
          <div className="border-b border-gray-200">
            <div className="flex">
              {TABS.map(tab => (
                <button key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                  </svg>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* 탭 콘텐츠 */}
          <div className="p-6">
            {activeTab === 'block' && <BlockPolicyTab lineId={selectedMember.lineId} onPolicyChange={loadAppliedPolicies} />}
            {activeTab === 'limit' && <LimitPolicyTab lineId={selectedMember.lineId} />}
            {activeTab === 'app' && <AppPolicyTab lineId={selectedMember.lineId} />}
          </div>
        </div>
      )}
    </div>
  );
}
