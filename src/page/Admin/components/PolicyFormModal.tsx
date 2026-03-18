import { useState } from 'react';
import type { AdminPolicy, PolicyCategory } from '@/api/services/adminPolicyService';
import Toggle from '@/components/common/Toggle';
import { getErrorMessage } from '@/api/client';

interface PolicyFormModalProps {
  mode: 'create' | 'edit';
  policy?: AdminPolicy;
  categories: PolicyCategory[];
  onClose: () => void;
  onSubmit: (data: { policyName: string; policyCategoryId: number; isActive: boolean }) => Promise<void>;
}

export default function PolicyFormModal({ 
  mode, 
  policy, 
  categories, 
  onClose, 
  onSubmit 
}: PolicyFormModalProps) {
  const [name, setName] = useState(policy?.policyName || '');
  const [categoryId, setCategoryId] = useState(
    policy?.policyCategoryId || (categories[0]?.policyCategoryId ?? 0)
  );
  const [isActive, setIsActive] = useState(policy?.isActive ?? false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('정책명을 입력해주세요.');
      return;
    }
    if (!categoryId) {
      setError('카테고리를 선택해주세요.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      // 추가 모드에서는 무조건 false
      const submitData = {
        policyName: name.trim(),
        policyCategoryId: categoryId,
        isActive: mode === 'create' ? false : isActive,
      };

      await onSubmit(submitData);
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-xl w-full max-w-md" 
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold">
            {mode === 'create' ? '정책 추가' : '정책 수정'}
          </h3>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              정책명
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="정책명을 입력하세요"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              카테고리
            </label>
            <select
              value={categoryId}
              onChange={e => setCategoryId(Number(e.target.value))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {categories.map(c => (
                <option key={c.policyCategoryId} value={c.policyCategoryId}>
                  {c.policyCategoryName}
                </option>
              ))}
            </select>
          </div>

          {mode === 'create' ? (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                ℹ️ 새 정책은 <span className="font-semibold">비활성화 상태</span>로 추가됩니다.<br/>
                추가 후 목록에서 활성화할 수 있습니다.
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700">활성화</label>
              <Toggle checked={isActive} onChange={() => setIsActive(!isActive)} />
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? '저장 중...' : mode === 'create' ? '추가' : '저장'}
          </button>
        </div>
      </div>
    </div>
  );
}
