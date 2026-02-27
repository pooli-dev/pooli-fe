import { useState } from "react";
import GlassCard from "../../Main/components/GlassCard";
import Toggle from "@/components/common/Toggle";

// ── 타입 ─────────────────────────────────────────────────────────────────────
type MemberPermission = {
  userId: number;
  userName: string;
  canViewDetail: boolean; // 상세 페이지 열람
  canHideAppUsage: boolean; // 앱 사용량 비공개 허용
};

type Props = {
  members: MemberPermission[];
  onApply?: (members: MemberPermission[]) => void;
};

// ── PermissionManager ─────────────────────────────────────────────────────────
export default function PermissionManager({
  members: initialMembers,
  onApply,
}: Props) {
  const [members, setMembers] = useState<MemberPermission[]>(initialMembers);

  const handleToggle = (
    userId: number,
    field: keyof Omit<MemberPermission, "userId" | "userName">,
    value: boolean,
  ) => {
    setMembers((prev) =>
      prev.map((m) => (m.userId === userId ? { ...m, [field]: value } : m)),
    );
  };

  const handleReset = () => setMembers(initialMembers);

  const handleApply = () => onApply?.(members);

  return (
    <GlassCard
      title=""
      gradientFrom="#FFFFFF"
      gradientTo="#CCCCCC"
      bgGradientFrom="#FFFFFF"
      bgGradientTo="#F8F8F8"
      bgOpacity={0.8}
      borderWidth={1}
      borderRadius={20}
      className="w-full"
    >
      {/* 헤더 */}
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
            onClick={handleApply}
            className="px-3 py-1.5 text-xs text-white rounded-full transition-opacity active:opacity-80"
            style={{ backgroundColor: "#678BF7" }}
          >
            적용
          </button>
        </div>
      </div>

      {/* 테이블 */}
      <div className="w-full">
        {/* 헤더 행 */}
        <div className="grid grid-cols-3 mb-3 px-2">
          <span className="text-xs text-gray-400">구성원</span>
          <span className="text-xs text-gray-400 text-center">
            상세 페이지 열람
          </span>
          <span className="text-xs text-gray-400 text-center">
            앱 사용량 비공개 허용
          </span>
        </div>

        {/* 구분선 */}
        <div className="w-full h-px bg-gray-100 mb-2" />

        {/* 멤버 행 */}
        <div className="flex flex-col">
          {members.map((member, index) => (
            <div key={member.userId}>
              <div className="grid grid-cols-3 items-center py-3 px-2">
                <span className="text-sm text-gray-700">{member.userName}</span>
                <div className="flex justify-center">
                  <Toggle
                    checked={member.canViewDetail}
                    onChange={(v) =>
                      handleToggle(member.userId, "canViewDetail", v)
                    }
                  />
                </div>
                <div className="flex justify-center">
                  <Toggle
                    checked={member.canHideAppUsage}
                    onChange={(v) =>
                      handleToggle(member.userId, "canHideAppUsage", v)
                    }
                  />
                </div>
              </div>
              {/* 마지막 행 제외 구분선 */}
              {index < members.length - 1 && (
                <div className="w-full h-px bg-gray-100" />
              )}
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
