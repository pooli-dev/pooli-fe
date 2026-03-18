import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { permissionService } from "@/api";
import type { PatchPermissionRequest } from "@/types/permission";
import Toggle from "@/components/common/Toggle";
import { useToastStore } from "@/store/toastStore";

type PermissionRow = {
  lineId: number;
  userName: string;
  permissions: {
    permissionId: number;
    permissionTitle: string;
    is_enable: boolean;
  }[];
};

interface PermissionManagerProps {
  lineId: number;
}

export default function PermissionManager({ lineId }: PermissionManagerProps) {
  const queryClient = useQueryClient();
  const { show } = useToastStore();
  const [permissionRows, setPermissionRows] = useState<PermissionRow[]>([]);
  const [showModal, setShowModal] = useState(false);

  // 권한 목록 조회
  const { data: permissionsData, isLoading } = useQuery({
    queryKey: ["memberPermissions", lineId],
    queryFn: async () => {
      const response = await permissionService.getMemberPermissionsByLine(lineId);
      return response.data;
    },
    enabled: !!lineId,
  });

  // 권한 데이터를 행 형식으로 변환
  const initialPermissionRows = useMemo(() => {
    if (!permissionsData || !permissionsData.memberPermissions) return [];

    const lineIds = [...new Set(permissionsData.memberPermissions.map((p) => p.lineId))];

    return lineIds.map((lid) => {
      const permissions = permissionsData.memberPermissions.filter((p) => p.lineId === lid);
      
      return {
        lineId: lid,
        userName: permissions[0]?.userName ?? `회선 ${lid}`,
        permissions: permissions.map((p) => ({
          permissionId: p.permissionId,
          permissionTitle: p.permissionTitle,
          is_enable: p.is_enable,
        })),
      };
    });
  }, [permissionsData]);

  // 초기 권한 데이터로 상태 초기화
  useEffect(() => {
    setPermissionRows(initialPermissionRows);
  }, [initialPermissionRows]);

  // 권한 변경 mutation
  const { mutate: patchPermissions } = useMutation({
    mutationFn: (permissions: PatchPermissionRequest[]) => {
      return permissionService.patchMemberPermissionsByLine(lineId, permissions);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memberPermissions"] });
      setShowModal(false);
      show("권한이 적용되었습니다.", "success");
    },
    onError: (error: Error & { response?: { data?: { code?: string; errorCode?: string; message?: string } }; message?: string }) => {
      const errorCode = error?.response?.data?.code || error?.response?.data?.errorCode || '';
      const errorMsg = error?.response?.data?.message || error?.message || '알 수 없는 오류';
      show(`권한 변경 실패\n${errorCode ? `[${errorCode}] ` : ''}${errorMsg}`, "error");
    },
  });

  // 권한 토글
  const handleToggle = (lineId: number, permissionId: number, value: boolean) => {
    setPermissionRows((prev) =>
      prev.map((row) =>
        row.lineId === lineId
          ? {
              ...row,
              permissions: row.permissions.map((p) =>
                p.permissionId === permissionId ? { ...p, is_enable: value } : p
              ),
            }
          : row
      )
    );
  };

  // 되돌리기
  const handleReset = () => {
    setPermissionRows(initialPermissionRows);
  };

  // 변경된 권한만 추출
  const getChangedPermissions = (): PatchPermissionRequest[] => {
    const changed: PatchPermissionRequest[] = [];

    permissionRows.forEach((row) => {
      const original = initialPermissionRows.find((r) => r.lineId === row.lineId);
      if (!original) return;

      row.permissions.forEach((perm) => {
        const originalPerm = original.permissions.find((p) => p.permissionId === perm.permissionId);
        if (originalPerm && perm.is_enable !== originalPerm.is_enable) {
          changed.push({
            lineId: row.lineId,
            permissionId: perm.permissionId,
            is_enable: perm.is_enable,
          });
        }
      });
    });

    return changed;
  };

  const changedPermissions = getChangedPermissions();

  const handleApplyClick = () => {
    if (changedPermissions.length === 0) return;
    setShowModal(true);
  };

  const handleConfirm = () => {
    patchPermissions(changedPermissions);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!permissionRows || permissionRows.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        권한 정보를 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          권한을 변경한 후 "적용" 버튼을 클릭하세요.
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 text-xs text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            되돌리기
          </button>
          <button
            onClick={handleApplyClick}
            disabled={changedPermissions.length === 0}
            className="px-4 py-1.5 text-xs text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            적용 ({changedPermissions.length})
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {permissionRows.map((row) => (
          <div key={row.lineId} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                {row.userName.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{row.userName}</p>
                <p className="text-xs text-gray-500">Line ID: {row.lineId}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {row.permissions.map((permission) => (
                <div
                  key={`${row.lineId}-${permission.permissionId}`}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {permission.permissionTitle}
                    </p>
                    <p className="text-xs text-gray-500">
                      권한 ID: {permission.permissionId}
                    </p>
                  </div>
                  <Toggle
                    checked={permission.is_enable}
                    onChange={(value) => handleToggle(row.lineId, permission.permissionId, value)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 확인 모달 */}
      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              변경 사항 확인
            </h3>

            <div className="flex flex-col gap-2 mb-6 max-h-64 overflow-y-auto">
              {changedPermissions.map((item, i) => {
                const row = permissionRows.find((r) => r.lineId === item.lineId);
                const permission = row?.permissions.find((p) => p.permissionId === item.permissionId);
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2"
                  >
                    <span>
                      {row?.userName} · {permission?.permissionTitle}
                    </span>
                    <span
                      className={`font-semibold ${item.is_enable ? 'text-indigo-600' : 'text-gray-400'}`}
                    >
                      {item.is_enable ? "허용" : "차단"}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
