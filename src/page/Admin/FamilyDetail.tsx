import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { FamilyMember } from "@/api/services/familyService";
import ConfirmModal from "@/components/common/ConfirmModal";
import PermissionManager from "./components/PermissionManager";
import FamilyInfoCard from "./components/FamilyInfoCard";
import SharedPoolCard from "./components/SharedPoolCard";
import RoleManagementCard from "./components/RoleManagementCard";
import { useFamilyData } from "./hooks/useFamilyData";
import { useOwnerTransfer } from "./hooks/useOwnerTransfer";

export default function FamilyDetail() {
  const navigate = useNavigate();
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    message: string;
    onConfirm: () => void;
  }>({ open: false, message: "", onConfirm: () => {} });

  const searchParams = new URLSearchParams(window.location.search);
  const lineIdParam = searchParams.get("lineId");
  const lineId = lineIdParam ? Number(lineIdParam) : null;

  // 커스텀 훅 사용
  const {
    familyData,
    sharedPoolData,
    isFamilyLoading,
    familyError,
    sharedPoolError,
    members,
    owner,
  } = useFamilyData(lineId);

  const { transferOwner, isTransferring } = useOwnerTransfer(lineId);

  // 대표자 양도 핸들러
  const handleTransferOwner = useCallback((member: FamilyMember) => {
    if (!owner) return;
    
    setConfirmModal({
      open: true,
      message: `${member.userName}님에게 대표자 권한을 양도하시겠습니까?\n\n⚠️ 주의사항:\n• 대표자 권한이 즉시 이전됩니다\n• 이 작업은 되돌릴 수 없습니다\n• 양도 후에는 다시 대표자가 될 수 없습니다`,
      onConfirm: () => {
        setConfirmModal((prev) => ({ ...prev, open: false }));
        transferOwner({
          currentLineId: Number(owner.lineId),
          changeLineId: Number(member.lineId)
        });
      },
    });
  }, [transferOwner, owner]);

  if (isFamilyLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="w-10 h-10 border-4 border-[#678BF7] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!lineId || !familyData) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">가족 상세정보 관리</h1>
          <button onClick={() => navigate(-1)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
            ← 돌아가기
          </button>
        </div>
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-400 mb-4">가족 정보를 불러올 수 없습니다.</p>
          {familyError && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg text-left max-w-2xl mx-auto">
              <p className="text-sm font-semibold text-red-800 mb-2">에러 상세:</p>
              <div className="text-xs text-red-700 space-y-1">
                <p>• Status: {(familyError as Error & { response?: { status?: number } }).response?.status || "N/A"}</p>
                <p>• Code: {(familyError as Error & { response?: { data?: { code?: string; errorCode?: string } }; code?: string }).response?.data?.code || (familyError as Error & { response?: { data?: { errorCode?: string } } }).response?.data?.errorCode || (familyError as Error & { code?: string }).code || "N/A"}</p>
                <p>• Message: {(familyError as Error & { response?: { data?: { message?: string } }; message?: string }).response?.data?.message || (familyError as Error).message || "N/A"}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* 헤더 */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">유저 및 가족 상세 정보 관리</h1>
          <p className="text-gray-500 mt-1">가족의 모든 정보, 구성원 권한, 공유 데이터를 관리합니다.</p>
        </div>
        <button
          onClick={() => navigate(`/admin/user-management?lineId=${lineId}`)}
          className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          ← 유저 정책 관리로
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <FamilyInfoCard 
          familyId={familyData.familyId} 
          members={members} 
          owner={owner} 
        />
        <SharedPoolCard 
          data={sharedPoolData} 
          error={sharedPoolError ?? undefined} 
        />
      </div>

      {/* 역할 관리 */}
      <RoleManagementCard
        members={members}
        isTransferring={isTransferring}
        onTransferOwner={handleTransferOwner}
      />

      {/* 권한 관리 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">권한 관리</h2>
            <p className="text-sm text-gray-500">가족 구성원별 권한을 관리합니다.</p>
          </div>
        </div>

        {lineId && <PermissionManager lineId={lineId} />}

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex gap-2">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-blue-800">권한 안내</p>
              <p className="text-xs text-blue-700 mt-1">권한을 변경한 후 "적용" 버튼을 클릭하면 일괄 적용됩니다.</p>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal((prev) => ({ ...prev, open: false }))}
        onConfirm={confirmModal.onConfirm}
        message={confirmModal.message}
      />
    </div>
  );
}
