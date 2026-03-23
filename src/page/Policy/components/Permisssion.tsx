import { useEffect, useState, useMemo, memo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import GlassCard from "../../../components/common/GlassCard";
import Toggle from "@/components/common/Toggle";
import { permissionService } from "@/api/services/permissionService";
import type { PatchPermissionRequest } from "@/types/permission";
import { useToastStore } from "@/store/toastStore";
import { familyService } from "@/api";

const PERMISSION_VIEW_DETAIL = "상세페이지 열람 권한";
const PERMISSION_HIDE_APP_USAGE = "앱 사용량 비공개 허용 권한";

type MemberRow = {
  lineId: number;
  userName: string;
  viewDetailPermissionId: number;
  hideAppUsagePermissionId: number;
  canViewDetail: boolean;
  canHideAppUsage: boolean;
};

function PermissionManager() {
  const [rows, setRows] = useState<MemberRow[]>([]);
  const [showModal, setShowModal] = useState(false);
  const { show } = useToastStore();

  const { data: permissionsData } = useQuery({
    queryKey: ["memberPermissions"],
    queryFn: () =>
      permissionService.getMemberPermissions().then((res) => res.data),
  });

  // Derive initial rows from API data using useMemo
  const initialRows = useMemo(() => {
    if (!permissionsData) return [];
    if (!permissionsData.memberPermissions) return [];

    // 회선별로 권한 정보 저장하기
    const lineIds = [
      ...new Set(permissionsData.memberPermissions.map((p) => p.lineId)),
    ];

    return lineIds.map((lineId) => {
      const permissions = permissionsData.memberPermissions.filter(
        (p) => p.lineId === lineId,
      );
      const viewDetail = permissions.find(
        (p) => p.permissionTitle === PERMISSION_VIEW_DETAIL,
      );
      const hideAppUsage = permissions.find(
        (p) => p.permissionTitle === PERMISSION_HIDE_APP_USAGE,
      );

      return {
        lineId,
        userName: permissions[0]?.userName ?? `회선 ${lineId}`,
        viewDetailPermissionId: viewDetail?.permissionId ?? 0,
        hideAppUsagePermissionId: hideAppUsage?.permissionId ?? 0,
        canViewDetail: viewDetail?.is_enable ?? false,
        canHideAppUsage: hideAppUsage?.is_enable ?? false,
      };
    });
  }, [permissionsData]);

  // Initialize rows when initialRows changes
  useEffect(() => {
    setRows(initialRows);
  }, [initialRows]);

  const { mutate: patchPermissions } = useMutation({
    mutationFn: (permissions: PatchPermissionRequest[]) =>
      permissionService.patchMemberPermissions(permissions),
    onSuccess: () => {
      setShowModal(false);
      show("권한이 적용되었습니다.");
    },
    onError: () => {
      show("권한 적용에 실패했습니다. 다시 시도해주세요.", "error");
    },
  });

  const handleToggle = (
    lineId: number,
    field: "canViewDetail" | "canHideAppUsage",
    value: boolean,
  ) => {
    setRows((prev) =>
      prev.map((r) => (r.lineId === lineId ? { ...r, [field]: value } : r)),
    );
  };

  const handleReset = () => setRows(initialRows);

  // 변경된 항목만 추출
  const getChangedPayload = (): PatchPermissionRequest[] => {
    const changed: PatchPermissionRequest[] = [];

    rows.forEach((row) => {
      const original = initialRows.find((r) => r.lineId === row.lineId);
      if (!original) return;

      if (row.canViewDetail !== original.canViewDetail) {
        changed.push({
          lineId: row.lineId,
          permissionId: row.viewDetailPermissionId,
          is_enable: row.canViewDetail,
        });
      }
      if (row.canHideAppUsage !== original.canHideAppUsage) {
        changed.push({
          lineId: row.lineId,
          permissionId: row.hideAppUsagePermissionId,
          is_enable: row.canHideAppUsage,
        });
      }
    });

    return changed;
  };

  const changedPayload = getChangedPayload();

  const handleApplyClick = () => {
    if (changedPayload.length === 0) return;
    setShowModal(true);
  };

  const handleConfirm = () => {
    patchPermissions(changedPayload);
  };

  // 이미 캐시에 있는 데이터 가져오기
  const { data: familyMembers = [] } = useQuery({
    queryKey: ["familyMembersSimple"],
    queryFn: () => familyService.getMembersSimple().then((res) => res.data),
    staleTime: Infinity, // 이미 있으면 재요청 안함
  });

  // lineId로 phone 찾기
  const getPhone = (lineId: number) =>
    familyMembers.find((m) => m.lineId === lineId)?.phone;

  return (
    <>
      <GlassCard
        title=""
        gradientFrom="#FFFFFF"
        gradientTo="#CCCCCC"
        bgGradientFrom="#FFFFFF"
        bgGradientTo="#F8F8F8"
        bgOpacity={0.7}
        borderWidth={1}
        borderRadius={20}
        className="w-full"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-base font-bold text-gray-800">권한 관리</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-3 py-1.5 text-xs text-gray-500 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
            >
              되돌리기
            </button>
            <button
              onClick={handleApplyClick}
              disabled={changedPayload.length === 0}
              className="px-3 py-1.5 text-xs text-white rounded-full transition-opacity active:opacity-80 disabled:opacity-40"
              style={{ backgroundColor: "#678BF7" }}
            >
              적용
            </button>
          </div>
        </div>

        <div className="w-full">
          <div className="grid grid-cols-3 mb-3 px-2">
            <span className="text-xs text-gray-400">구성원</span>
            <span className="text-xs text-gray-400 text-center">
              상세 페이지 열람
            </span>
            <span className="text-xs text-gray-400 text-center">
              앱 사용량 비공개 허용
            </span>
          </div>

          <div className="w-full h-px bg-gray-100 mb-2" />

          <div className="flex flex-col">
            {rows.map((row, index) => (
              <div key={row.lineId}>
                <div className="grid grid-cols-3 items-center py-3 px-2">
                  <span className="text-sm text-gray-700">
                    {row.userName}
                    {/* 같은 이름이 여러 명이면 번호 표시 */}
                    {rows.filter((r) => r.userName === row.userName).length >
                      1 && (
                      <span className="text-xs text-gray-400 ml-1">
                        ({getPhone(row.lineId)?.slice(-4)})
                      </span>
                    )}
                  </span>
                  <div className="flex justify-center">
                    <Toggle
                      checked={row.canViewDetail}
                      onChange={(v) =>
                        handleToggle(row.lineId, "canViewDetail", v)
                      }
                    />
                  </div>
                  <div className="flex justify-center">
                    <Toggle
                      checked={row.canHideAppUsage}
                      onChange={(v) =>
                        handleToggle(row.lineId, "canHideAppUsage", v)
                      }
                    />
                  </div>
                </div>
                {index < rows.length - 1 && (
                  <div className="w-full h-px bg-gray-100" />
                )}
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* 확인 모달 */}
      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 w-80 shadow-xl">
            <h3 className="text-base font-bold text-gray-800 mb-4">
              변경 사항 확인
            </h3>

            <div className="flex flex-col gap-2 mb-6">
              {changedPayload.map((item, i) => {
                const row = rows.find((r) => r.lineId === item.lineId);
                const permissionName =
                  item.permissionId === row?.viewDetailPermissionId
                    ? "상세 페이지 열람"
                    : "앱 사용량 비공개";
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2"
                  >
                    <span>
                      {row?.userName}
                      {rows.filter((r) => r.userName === row?.userName).length >
                        1 && (
                        <span className="text-xs text-gray-400 ml-1">
                          ({getPhone(row!.lineId)?.slice(-4)})
                        </span>
                      )}
                      {" · "}
                      {permissionName}
                    </span>
                    <span
                      className="font-semibold"
                      style={{ color: item.is_enable ? "#678BF7" : "#999" }}
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
                className="flex-1 py-2 text-sm text-gray-500 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-2 text-sm text-white rounded-full transition-opacity active:opacity-80"
                style={{ backgroundColor: "#678BF7" }}
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

export default memo(PermissionManager);
