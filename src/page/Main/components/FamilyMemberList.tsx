import { type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import GlassCard from "./GlassCard";

// ── API 타입 ──────────────────────────────────────────────────────────────────
export type FamilyMember = {
  userId: number;
  userName: string;
  role: "OWNER" | "MEMBER";
  remainingData: number; // 기본 데이터 잔여량 (MB)
  basicDataAmount: number; // 기본 데이터 총량 (MB)
  sharedPoolRemainingAmount: number; // 공유 데이터 잔여량 (MB)
  sharedPoolTotalAmount: number; // 공유 데이터 총량 (MB)
};

type Props = {
  members: FamilyMember[];
  myUserId: number; // 본인 userId → 상세보기 버튼 노출 기준
};

// ── 유틸 ─────────────────────────────────────────────────────────────────────
function formatMB(mb: number): string {
  if (mb >= 1000) return `${(mb / 1000).toFixed(1)}GB`;
  return `${mb}MB`;
}

function getRemainingPercent(remaining: number, total: number): number {
  if (total === 0) return 0;
  return Math.min(100, Math.round((remaining / total) * 100));
}

// ── 그라데이션 테두리 뱃지 ────────────────────────────────────────────────────
function GradientBadge({
  children,
  gradientFrom,
  gradientTo,
  textColor,
  bgColor,
}: {
  children: ReactNode;
  gradientFrom: string;
  gradientTo: string;
  textColor: string;
  bgColor: string;
}) {
  return (
    <div
      className="rounded-full p-[2px] flex-shrink-0"
      style={{
        background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
      }}
    >
      <div
        className="rounded-full px-3 py-2 text-xs font-medium"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        {children}
      </div>
    </div>
  );
}

// ── 막대 그래프 ───────────────────────────────────────────────────────────────
function DataBar({
  label,
  remaining,
  total,
  color,
}: {
  label: string;
  remaining: number;
  total: number;
  color: string;
}) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-400">{label}</span>
        <span className="text-xs text-gray-500">
          {formatMB(remaining)} / {formatMB(total)}
        </span>
      </div>
      <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${getRemainingPercent(remaining, total)}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

// ── FamilyMemberCard ──────────────────────────────────────────────────────────
function FamilyMemberCard({
  member,
  isMe,
}: {
  member: FamilyMember;
  isMe: boolean;
}) {
  const isOwner = member.role === "OWNER";
  const navigate = useNavigate();

  const isUsingShared =
    member.remainingData === 0 &&
    member.sharedPoolRemainingAmount < member.sharedPoolTotalAmount;

  return (
    <GlassCard
      title=""
      gradientFrom="#FFFFFF"
      gradientTo="#CCCCCC"
      bgGradientFrom="#FFFFFF"
      bgGradientTo="#F8F8F8"
      bgOpacity={0.7}
      borderWidth={1}
      className=""
    >
      {/* 상단: 프로필 + 이름 + 뱃지 */}
      <div className="flex items-start gap-3 mb-4">
        {/* 프로필 이미지 (임시) */}
        <div className="relative flex-shrink-0">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-[#E8EEFF] to-[#C4D0FF] flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="#9AA5C4" className="w-8 h-8">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </div>
          {isOwner && (
            <div className="absolute -bottom-1 right-1 text-base leading-none">
              👑
            </div>
          )}
        </div>

        {/* 이름 + 대표자 뱃지 */}
        <div className="flex-1 min-w-0 pt-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base font-semibold text-gray-800">
              {member.userName}
            </span>
            {isMe && (
              <button
                onClick={() => navigate("/detail")}
                className="flex items-center gap-0.5 text-xs text-[#6B9FD4] hover:text-[#4A7FB5] transition-colors"
              >
                상세보기
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 18l6-6-6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>
          {isOwner && (
            <span className="inline-block mt-1 text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
              대표자
            </span>
          )}
        </div>

        {/* 공유 사용중 / 사용전 뱃지 */}
        {isUsingShared ? (
          <GradientBadge
            gradientFrom="#FFFFFF"
            gradientTo="#C8D9B6"
            bgColor="#FAF8F0"
            textColor="#2A6E00"
          >
            공유 사용중
          </GradientBadge>
        ) : (
          <GradientBadge
            gradientFrom="#FFFFFF"
            gradientTo="#FFDADA"
            bgColor="#FAF0F0"
            textColor="#6E0000"
          >
            공유 사용전
          </GradientBadge>
        )}
      </div>

      {/* 데이터 막대 그래프 */}
      <div className="flex flex-col gap-3">
        <DataBar
          label="기본 데이터"
          remaining={member.remainingData}
          total={member.basicDataAmount}
          color="#ADE6FF"
        />
        {member.sharedPoolTotalAmount > 0 && (
          <DataBar
            label="제공받은 공유데이터"
            remaining={member.sharedPoolRemainingAmount}
            total={member.sharedPoolTotalAmount}
            color="#9A9CEA"
          />
        )}
      </div>
    </GlassCard>
  );
}

// ── FamilyMemberList (최종 export) ────────────────────────────────────────────
export default function FamilyMemberList({ members, myUserId }: Props) {
  return (
    <div className="w-full flex flex-col gap-3">
      <h2 className="text-lg font-bold text-gray-800">가족 구성원</h2>
      {members.map((member) => (
        <FamilyMemberCard
          key={member.userId}
          member={member}
          isMe={member.userId === myUserId}
        />
      ))}
    </div>
  );
}
