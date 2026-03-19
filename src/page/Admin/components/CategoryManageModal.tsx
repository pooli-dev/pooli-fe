import { useState } from 'react';
import type { PolicyCategory } from '@/api/services/adminPolicyService';
import { getErrorMessage } from '@/api/client';

interface CategoryManageModalProps {
  categories: PolicyCategory[];
  onClose: () => void;
  onCreate: (data: { policyCategoryId: number; policyCategoryName: string }) => Promise<void>;
  onUpdate: (id: number, name: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function CategoryManageModal({
  categories,
  onClose,
  onCreate,
  onUpdate,
  onDelete,
}: CategoryManageModalProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);

  const getNextId = () => {
    if (categories.length === 0) return 1;
    return Math.max(...categories.map(c => c.policyCategoryId)) + 1;
  };

  const handleEdit = (cat: PolicyCategory) => {
    setEditingId(cat.policyCategoryId);
    setEditName(cat.policyCategoryName);
  };

  const handleSaveEdit = async (id: number) => {
    if (!editName.trim()) return;
    try {
      await onUpdate(id, editName.trim());
      setEditingId(null);
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await onDelete(id);
      setConfirmDelete(null);
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setAdding(true);
    try {
      await onCreate({
        policyCategoryId: getNextId(),
        policyCategoryName: newName.trim(),
      });
      setNewName('');
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setAdding(false);
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
          <h3 className="text-lg font-bold">카테고리 관리</h3>
          <p className="text-sm text-gray-500 mt-1">
            정책 카테고리를 추가/수정/삭제합니다.
          </p>
        </div>

        <div className="p-6 space-y-4">
          {/* 카테고리 추가 */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="카테고리명"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
            />
            <button
              onClick={handleAdd}
              disabled={adding || !newName.trim()}
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors whitespace-nowrap"
            >
              추가
            </button>
          </div>

          {/* 카테고리 목록 */}
          {categories.length === 0 ? (
            <p className="text-center text-gray-400 py-4">
              등록된 카테고리가 없습니다.
            </p>
          ) : (
            <div className="space-y-3">
              {categories.map(cat => (
                <div 
                  key={cat.policyCategoryId} 
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  {editingId === cat.policyCategoryId ? (
                    <>
                      <input
                        type="text"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                        onKeyDown={e => e.key === 'Enter' && handleSaveEdit(cat.policyCategoryId)}
                      />
                      <button
                        onClick={() => handleSaveEdit(cat.policyCategoryId)}
                        className="px-3 py-1.5 text-xs text-white bg-blue-600 rounded hover:bg-blue-700"
                      >
                        저장
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1.5 text-xs text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        취소
                      </button>
                    </>
                  ) : confirmDelete === cat.policyCategoryId ? (
                    <>
                      <span className="flex-1 text-sm text-red-600">
                        정말 삭제하시겠습니까?
                      </span>
                      <button
                        onClick={() => handleDelete(cat.policyCategoryId)}
                        className="px-3 py-1.5 text-xs text-white bg-red-600 rounded hover:bg-red-700"
                      >
                        삭제
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="px-3 py-1.5 text-xs text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        취소
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-xs text-gray-400 font-mono">
                        #{cat.policyCategoryId}
                      </span>
                      <span className="flex-1 text-sm font-medium text-gray-900">
                        {cat.policyCategoryName}
                      </span>
                      <button
                        onClick={() => handleEdit(cat)}
                        className="px-2.5 py-1 text-xs text-blue-600 bg-blue-50 rounded hover:bg-blue-100"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => setConfirmDelete(cat.policyCategoryId)}
                        className="px-2.5 py-1 text-xs text-red-600 bg-red-50 rounded hover:bg-red-100"
                      >
                        삭제
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
