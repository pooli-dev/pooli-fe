import { useState, useEffect, useCallback } from 'react';
import Toggle from '@/components/common/Toggle';
import ConfirmModal from '@/components/common/ConfirmModal';
import AdminHeader from './components/AdminHeader';
import { adminPolicyService } from '@/api/services/adminPolicyService';
import type { AdminPolicy, PolicyCategory } from '@/api/services/adminPolicyService';
import { getErrorMessage } from '@/api/client';

export default function PolicyManagement() {
  const [policies, setPolicies] = useState<AdminPolicy[]>([]);
  const [categories, setCategories] = useState<PolicyCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
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

  const fetchPolicies = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await adminPolicyService.getAllPolicies();
      console.log('정책 목록 응답:', data);
      if (typeof data === 'string' && (data as unknown as string).includes('<!doctype')) {
        setError('세션이 만료되었습니다. 다시 로그인해주세요.');
        return;
      }
      setPolicies(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await adminPolicyService.getCategories();
      if (Array.isArray(data)) setCategories(data);
    } catch (err) {
      console.error('카테고리 조회 실패:', err);
    }
  }, []);

  useEffect(() => { fetchPolicies(); fetchCategories(); }, [fetchPolicies, fetchCategories]);

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

  // 활성화/비활성화 토글
  const handleToggle = (policy: AdminPolicy) => {
    const action = policy.isActive ? '비활성화' : '활성화';
    setConfirmModal({
      open: true,
      message: `"${policy.policyName}" 정책을 ${action}하시겠습니까?`,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, open: false }));
        try {
          await adminPolicyService.toggleActivation(policy.policyId, !policy.isActive);
          await fetchPolicies();
        } catch (err) { alert(getErrorMessage(err)); }
      },
    });
  };

  // 정책 삭제
  const handleDelete = (policy: AdminPolicy) => {
    setConfirmModal({
      open: true,
      message: `"${policy.policyName}" 정책을 정말 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, open: false }));
        try {
          await adminPolicyService.deletePolicy(policy.policyId);
          await fetchPolicies();
        } catch (err) { alert(getErrorMessage(err)); }
      },
    });
  };

  const categoryTypes = [...new Set(policies.map(p => p.policyCategoryName))];
  const filteredPolicies = policies
    .filter(p => filterType === 'all' || p.policyCategoryName === filterType)
    .filter(p => !searchQuery || p.policyName.toLowerCase().includes(searchQuery.toLowerCase()));

  const activeCount = policies.filter(p => p.isActive).length;
  const inactiveCount = policies.filter(p => !p.isActive).length;

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
        <button onClick={() => { fetchCategories(); setCategoryModal(true); }}
          className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors whitespace-nowrap">
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
                        <Toggle checked={policy.isActive} onChange={() => handleToggle(policy)} />
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
          onSaved={() => { setPolicyModal({ open: false, mode: 'create' }); fetchPolicies(); }}
        />
      )}

      {/* 카테고리 관리 모달 */}
      {categoryModal && (
        <CategoryManageModal
          categories={categories}
          onClose={() => setCategoryModal(false)}
          onUpdated={fetchCategories}
        />
      )}

      <ConfirmModal isOpen={confirmModal.open} onClose={() => setConfirmModal(prev => ({ ...prev, open: false }))}
        onConfirm={confirmModal.onConfirm} message={confirmModal.message} />
    </div>
  );
}

// 통계 카드
function StatCard({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    green: { bg: 'bg-green-100', text: 'text-green-600' },
    gray: { bg: 'bg-gray-100', text: 'text-gray-500' },
  };
  const c = colors[color] || colors.blue;
  const icons: Record<string, string> = {
    shield: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    check: 'M5 13l4 4L19 7',
    x: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636',
  };
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 ${c.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
          <svg className={`w-5 h-5 sm:w-6 sm:h-6 ${c.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icons[icon]} />
          </svg>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-gray-500">{label}</p>
          <p className={`text-xl sm:text-2xl font-bold ${color === 'green' ? 'text-green-600' : color === 'gray' ? 'text-gray-500' : 'text-gray-900'}`}>{value}</p>
        </div>
      </div>
    </div>
  );
}

// 정책 추가/수정 모달
function PolicyFormModal({ mode, policy, categories, onClose, onSaved }: {
  mode: 'create' | 'edit';
  policy?: AdminPolicy;
  categories: PolicyCategory[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(policy?.policyName || '');
  const [categoryId, setCategoryId] = useState(policy?.policyCategoryId || (categories[0]?.policyCategoryId ?? 0));
  const [isActive, setIsActive] = useState(policy?.isActive ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!name.trim()) { setError('정책명을 입력해주세요.'); return; }
    if (!categoryId) { setError('카테고리를 선택해주세요.'); return; }
    setSaving(true);
    setError('');
    try {
      if (mode === 'create') {
        await adminPolicyService.createPolicy({ policyName: name.trim(), policyCategoryId: categoryId, isActive });
      } else if (policy) {
        await adminPolicyService.updatePolicy(policy.policyId, { policyName: name.trim(), policyCategoryId: categoryId, isActive });
      }
      onSaved();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold">{mode === 'create' ? '정책 추가' : '정책 수정'}</h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">정책명</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="정책명을 입력하세요" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">카테고리</label>
            <select value={categoryId} onChange={e => setCategoryId(Number(e.target.value))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300">
              {categories.map(c => <option key={c.policyCategoryId} value={c.policyCategoryId}>{c.policyCategoryName}</option>)}
            </select>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-700">활성화</label>
            <Toggle checked={isActive} onChange={() => setIsActive(!isActive)} />
          </div>
          {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}
        </div>
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">취소</button>
          <button onClick={handleSubmit} disabled={saving}
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
            {saving ? '저장 중...' : mode === 'create' ? '추가' : '저장'}
          </button>
        </div>
      </div>
    </div>
  );
}

// 카테고리 관리 모달
function CategoryManageModal({ categories, onClose, onUpdated }: {
  categories: PolicyCategory[];
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [newId, setNewId] = useState('');
  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);

  const handleEdit = (cat: PolicyCategory) => {
    setEditingId(cat.policyCategoryId);
    setEditName(cat.policyCategoryName);
  };

  const handleSaveEdit = async (id: number) => {
    if (!editName.trim()) return;
    try {
      await adminPolicyService.updateCategory(id, editName.trim());
      setEditingId(null);
      onUpdated();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await adminPolicyService.deleteCategory(id);
      setConfirmDelete(null);
      onUpdated();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const handleAdd = async () => {
    if (!newId.trim() || !newName.trim()) return;
    setAdding(true);
    try {
      await adminPolicyService.createCategory({ policyCategoryId: Number(newId), policyCategoryName: newName.trim() });
      setNewId('');
      setNewName('');
      onUpdated();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold">카테고리 관리</h3>
          <p className="text-sm text-gray-500 mt-1">정책 카테고리를 추가/수정/삭제합니다.</p>
        </div>
        <div className="p-6 space-y-4">
          {/* 카테고리 추가 */}
          <div className="flex gap-2">
            <input type="number" value={newId} onChange={e => setNewId(e.target.value)} placeholder="ID"
              className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="카테고리명"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              onKeyDown={e => e.key === 'Enter' && handleAdd()} />
            <button onClick={handleAdd} disabled={adding || !newId.trim() || !newName.trim()}
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors whitespace-nowrap">추가</button>
          </div>

          {/* 카테고리 목록 */}
          {categories.length === 0 ? (
            <p className="text-center text-gray-400 py-4">등록된 카테고리가 없습니다.</p>
          ) : (
            <div className="space-y-3">
              {categories.map(cat => (
                <div key={cat.policyCategoryId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  {editingId === cat.policyCategoryId ? (
                    <>
                      <input type="text" value={editName} onChange={e => setEditName(e.target.value)}
                        className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                        onKeyDown={e => e.key === 'Enter' && handleSaveEdit(cat.policyCategoryId)} />
                      <button onClick={() => handleSaveEdit(cat.policyCategoryId)}
                        className="px-3 py-1.5 text-xs text-white bg-blue-600 rounded hover:bg-blue-700">저장</button>
                      <button onClick={() => setEditingId(null)}
                        className="px-3 py-1.5 text-xs text-gray-600 bg-gray-200 rounded hover:bg-gray-300">취소</button>
                    </>
                  ) : confirmDelete === cat.policyCategoryId ? (
                    <>
                      <span className="flex-1 text-sm text-red-600">정말 삭제하시겠습니까?</span>
                      <button onClick={() => handleDelete(cat.policyCategoryId)}
                        className="px-3 py-1.5 text-xs text-white bg-red-600 rounded hover:bg-red-700">삭제</button>
                      <button onClick={() => setConfirmDelete(null)}
                        className="px-3 py-1.5 text-xs text-gray-600 bg-gray-200 rounded hover:bg-gray-300">취소</button>
                    </>
                  ) : (
                    <>
                      <span className="text-xs text-gray-400 font-mono">#{cat.policyCategoryId}</span>
                      <span className="flex-1 text-sm font-medium text-gray-900">{cat.policyCategoryName}</span>
                      <button onClick={() => handleEdit(cat)}
                        className="px-2.5 py-1 text-xs text-blue-600 bg-blue-50 rounded hover:bg-blue-100">수정</button>
                      <button onClick={() => setConfirmDelete(cat.policyCategoryId)}
                        className="px-2.5 py-1 text-xs text-red-600 bg-red-50 rounded hover:bg-red-100">삭제</button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">닫기</button>
        </div>
      </div>
    </div>
  );
}
