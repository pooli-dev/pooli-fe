import { useState, useMemo } from 'react';
import Toggle from '@/components/common/Toggle';
import ConfirmModal from '@/components/common/ConfirmModal';
import AdminHeader from './components/AdminHeader';
import StatCard from './components/StatCard';
import PolicyFormModal from './components/PolicyFormModal';
import CategoryManageModal from './components/CategoryManageModal';
import { useAdminPolicies } from './hooks/useAdminPolicies';
import { useAdminCategories } from './hooks/useAdminCategories';
import type { AdminPolicy } from '@/api/services/adminPolicyService';

export default function PolicyManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  
  // 모달 상태
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean; message: string; onConfirm: () => void;
  }>({ open: false, message: '', onConfirm: () => {} });
  const [policyModal, setPolicyModal] = useState<{
    open: boolean; mode: 'create' | 'edit'; policy?: AdminPolicy;
  }>({ open: false, mode: 'create' });
  const [categoryModal, setCategoryModal] = useState(false);

  // 커스텀 훅 사용
  const {
    policies,
    isLoading,
    error,
    togglingPolicyId,
    toggleActivation,
    createPolicy,
    updatePolicy,
    deletePolicy,
  } = useAdminPolicies();

  const {
    categories,
    refetch: refetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useAdminCategories();

  // 카테고리 색상 매핑
  const CATEGORY_COLORS = [
    'bg-red-100 text-red-700',
    'bg-yellow-100 text-yellow-700',
    'bg-green-100 text-green-700',
    'bg-blue-100 text-blue-700',
    'bg-purple-100 text-purple-700',
    'bg-pink-100 text-pink-700',
    'bg-indigo-100 text-indigo-700',
    'bg-orange-100 text-orange-700',
    'bg-teal-100 text-teal-700',
    'bg-cyan-100 text-cyan-700',
  ];

  const getCategoryBadge = (categoryId: number) => {
    const idx = categories.findIndex(c => c.policyCategoryId === categoryId);
    return idx >= 0 ? CATEGORY_COLORS[idx % CATEGORY_COLORS.length] : 'bg-gray-100 text-gray-700';
  };

  // 필터링된 정책 목록
  const { categoryTypes, filteredPolicies, activeCount, inactiveCount } = useMemo(() => {
    const categoryTypes = [...new Set(policies.map(p => p.policyCategoryName))];
    const filtered = policies
      .filter(p => filterType === 'all' || p.policyCategoryName === filterType)
      .filter(p => !searchQuery || p.policyName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return {
      categoryTypes,
      filteredPolicies: filtered,
      activeCount: policies.filter(p => p.isActive).length,
      inactiveCount: policies.filter(p => !p.isActive).length,
    };
  }, [policies, filterType, searchQuery]);

  // 활성화/비활성화 토글
  const handleToggle = (policy: AdminPolicy) => {
    const newState = !policy.isActive;
    const action = newState ? '활성화' : '비활성화';
    
    setConfirmModal({
      open: true,
      message: `"${policy.policyName}" 정책을 ${action}하시겠습니까?\n\n⚠️ 처리 시간이 오래 걸릴 수 있습니다 (최대 2분)`,
      onConfirm: () => {
        setConfirmModal(prev => ({ ...prev, open: false }));
        
        toggleActivation({ policyId: policy.policyId, isActive: newState });
        alert(`✅ "${policy.policyName}" 정책이 ${action}되었습니다.\n\n백그라운드에서 처리 중입니다.`);
      },
    });
  };

  // 정책 삭제
  const handleDelete = (policy: AdminPolicy) => {
    setConfirmModal({
      open: true,
      message: `"${policy.policyName}" 정책을 정말 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`,
      onConfirm: () => {
        setConfirmModal(prev => ({ ...prev, open: false }));
        deletePolicy(policy.policyId);
      },
    });
  };

  // 정책 저장 핸들러
  const handlePolicySave = async (data: { policyName: string; policyCategoryId: number; isActive: boolean }) => {
    if (policyModal.mode === 'create') {
      await new Promise<void>((resolve, reject) => {
        createPolicy(data, {
          onSuccess: () => resolve(),
          onError: (err) => reject(err),
        });
      });
    } else if (policyModal.policy) {
      await new Promise<void>((resolve, reject) => {
        updatePolicy(
          { policyId: policyModal.policy!.policyId, data },
          {
            onSuccess: () => resolve(),
            onError: (err) => reject(err),
          }
        );
      });
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <AdminHeader title="정책 관리" description="정책을 추가/수정/삭제하고 활성화 상태를 관리합니다." />

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <StatCard icon="shield" label="전체 정책" value={policies.length} color="blue" />
        <StatCard icon="check" label="활성화" value={activeCount} color="green" />
        <StatCard icon="x" label="비활성화" value={inactiveCount} color="gray" />
      </div>

      {/* 검색 + 필터 + 버튼 */}
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1 relative">
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="정책명으로 검색..." className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm" />
        </div>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
          <option value="all">전체 타입</option>
          {categoryTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <button onClick={() => setPolicyModal({ open: true, mode: 'create' })}
          className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 whitespace-nowrap">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          정책 추가
        </button>
        <button 
          onClick={() => { refetchCategories(); setCategoryModal(true); }}
          className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors whitespace-nowrap"
        >
          카테고리 관리
        </button>
      </div>

      {error && <div className="mb-4 p-3 sm:p-4 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

      {/* 정책 목록 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-bold">정책 목록</h2>
          <p className="text-sm text-gray-500 mt-1">{filteredPolicies.length}개 표시</p>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-gray-400">불러오는 중...</div>
        ) : filteredPolicies.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            {policies.length === 0 ? '등록된 정책이 없습니다.' : '검색 결과가 없습니다.'}
          </div>
        ) : (
          <>
            {/* 데스크탑 테이블 */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs sm:text-sm font-bold text-gray-700">ID</th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs sm:text-sm font-bold text-gray-700">정책명</th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs sm:text-sm font-bold text-gray-700">카테고리</th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs sm:text-sm font-bold text-gray-700">상태</th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs sm:text-sm font-bold text-gray-700">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPolicies.map((policy) => (
                    <tr key={policy.policyId} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-4 lg:px-6 py-4 text-sm text-gray-500 font-mono">{policy.policyId}</td>
                      <td className="px-4 lg:px-6 py-4 font-medium text-gray-900 text-sm">
                        {policy.policyName}
                        {policy.isNew && <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-600 text-xs rounded font-semibold">NEW</span>}
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getCategoryBadge(policy.policyCategoryId)}`}>{policy.policyCategoryName}</span>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Toggle checked={policy.isActive} onChange={() => handleToggle(policy)} />
                          {togglingPolicyId === policy.policyId && (
                            <span className="text-xs text-blue-600 animate-pulse">상태 변경 중...</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => setPolicyModal({ open: true, mode: 'edit', policy })}
                            className="px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">수정</button>
                          <button onClick={() => handleDelete(policy)}
                            className="px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">삭제</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 모바일 카드 */}
            <div className="md:hidden divide-y divide-gray-200">
              {filteredPolicies.map((policy) => (
                <div key={policy.policyId} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {policy.policyName}
                        {policy.isNew && <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-600 text-xs rounded font-semibold">NEW</span>}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getCategoryBadge(policy.policyCategoryId)}`}>{policy.policyCategoryName}</span>
                        <span className="text-xs text-gray-500">ID: {policy.policyId}</span>
                        {togglingPolicyId === policy.policyId && (
                          <span className="text-xs text-blue-600 animate-pulse">변경 중...</span>
                        )}
                      </div>
                    </div>
                    <Toggle checked={policy.isActive} onChange={() => handleToggle(policy)} />
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex gap-2">
                      <button onClick={() => setPolicyModal({ open: true, mode: 'edit', policy })}
                        className="px-2 py-1 text-xs text-blue-600 bg-blue-50 rounded hover:bg-blue-100">수정</button>
                      <button onClick={() => handleDelete(policy)}
                        className="px-2 py-1 text-xs text-red-600 bg-red-50 rounded hover:bg-red-100">삭제</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        <div className="p-3 sm:p-4 border-t border-gray-200 text-xs sm:text-sm text-gray-600">총 {filteredPolicies.length}개의 정책</div>
      </div>

      {/* 정책 추가/수정 모달 */}
      {policyModal.open && (
        <PolicyFormModal
          mode={policyModal.mode}
          policy={policyModal.policy}
          categories={categories}
          onClose={() => setPolicyModal({ open: false, mode: 'create' })}
          onSubmit={handlePolicySave}
        />
      )}

      {/* 카테고리 관리 모달 */}
      {categoryModal && (
        <CategoryManageModal
          categories={categories}
          onClose={() => setCategoryModal(false)}
          onCreate={async (data) => {
            await new Promise<void>((resolve, reject) => {
              createCategory(data, {
                onSuccess: () => resolve(),
                onError: (err) => reject(err),
              });
            });
          }}
          onUpdate={async (id, name) => {
            await new Promise<void>((resolve, reject) => {
              updateCategory({ id, name }, {
                onSuccess: () => resolve(),
                onError: (err) => reject(err),
              });
            });
          }}
          onDelete={async (id) => {
            await new Promise<void>((resolve, reject) => {
              deleteCategory(id, {
                onSuccess: () => resolve(),
                onError: (err) => reject(err),
              });
            });
          }}
        />
      )}

      <ConfirmModal 
        isOpen={confirmModal.open} 
        onClose={() => setConfirmModal(prev => ({ ...prev, open: false }))}
        onConfirm={confirmModal.onConfirm} 
        message={confirmModal.message} 
      />
    </div>
  );
}
