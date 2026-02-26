import { type ReactNode } from "react";
import GlassCard from "./GlassCard";

// ── 타입 ─────────────────────────────────────────────────────────────────────
export type FamilyMember = {
  id: string;
  name: string;
  profileImage?: string;
  isRepresentative?: boolean; // 대표자 (왕관)
  isMe?: boolean; // 본인 (상세보기 버튼)
  basicDataRemaining: number; // basicDataUsed → basicDataRemaining
  basicDataTotal: number;
  sharedDataRemaining: number; // sharedDataUsed → sharedDataRemaining
  sharedDataTotal: number;
};

// ── 유틸 ─────────────────────────────────────────────────────────────────────
function formatMB(mb: number): string {
  if (mb >= 1000) return `${(mb / 1000).toFixed(1)}GB`;
  return `${mb}MB`;
}

function getPercent(used: number, total: number): number {
  if (total === 0) return 0;
  return Math.min(100, Math.round((used / total) * 100));
}

// ── 그라데이션 테두리 뱃지 (두 div 겹치기) ───────────────────────────────────
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
      className="rounded-full p-[1.5px] flex-shrink-0"
      style={{
        background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
      }}
    >
      <div
        className="rounded-full px-3 py-1 text-xs font-medium"
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
  used,
  total,
  color,
}: {
  label: string;
  used: number;
  total: number;
  color: string;
}) {
  const percent = getPercent(used, total);
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-400">{label}</span>
        <span className="text-xs text-gray-500">
          {formatMB(used)} / {formatMB(total)}
        </span>
      </div>
      <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// ── FamilyMemberCard ──────────────────────────────────────────────────────────
function FamilyMemberCard({ member }: { member: FamilyMember }) {
  const isUsingShared =
    member.basicDataRemaining === 0 &&
    member.sharedDataRemaining < member.sharedDataTotal;

  return (
    <GlassCard
      title=""
      gradientFrom="#FFFFFF"
      gradientTo="#CCCCCC"
      bgGradientFrom="#FFFFFF"
      bgGradientTo="#F8F8F8"
      bgOpacity={0.3}
      borderWidth={1}
      className=""
    >
      {/* 상단: 프로필 + 이름 + 뱃지 */}
      <div className="flex items-start gap-3 mb-4">
        {/* 프로필 이미지 */}
        <div className="relative flex-shrink-0">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-[#E8EEFF] to-[#C4D0FF]">
            {member.profileImage ? (
              <img
                src={member.profileImage}
                alt={member.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">
                👤
              </div>
            )}
          </div>
          {/* 왕관 */}
          {member.isRepresentative && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-base leading-none">
              👑
            </div>
          )}
        </div>

        {/* 이름 + 대표자 뱃지 */}
        <div className="flex-1 min-w-0 pt-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base font-semibold text-gray-800">
              {member.name}
            </span>
            {member.isMe && (
              <button className="flex items-center gap-0.5 text-xs text-gray-400 hover:text-gray-600 transition-colors">
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
          {member.isRepresentative && (
            <span className="inline-block mt-1 text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
              대표자
            </span>
          )}
        </div>

        {/* 공유 사용중 뱃지 */}
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
          used={member.basicDataTotal - member.basicDataRemaining} // 잔여량으로 사용량 역산
          total={member.basicDataTotal}
          color="#ADE6FF"
        />
        {member.sharedDataTotal > 0 && (
          <DataBar
            label="제공받은 공유데이터"
            used={member.sharedDataTotal - member.sharedDataRemaining}
            total={member.sharedDataTotal}
            color="#9A9CEA"
          />
        )}
      </div>
    </GlassCard>
  );
}

// ── FamilyMemberList (최종 export) ────────────────────────────────────────────
type Props = {
  members: FamilyMember[];
  onDetailClick?: (memberId: string) => void;
};

export default function FamilyMemberList({ members }: Props) {
  return (
    <div className="w-full flex flex-col gap-3">
      <h2 className="text-lg font-bold text-gray-800">가족 구성원</h2>
      {members.map((member) => (
        <FamilyMemberCard key={member.id} member={member} />
      ))}
    </div>
  );
}
