import type { FamilyMember } from "@/types/FamilyMember";
import FamilyMemberCard from "./MemberCard";

type Props = {
  members: FamilyMember[];
  isEnable: boolean;
  isUserOwner: boolean;
};

// ── FamilyMemberList (최종 export) ────────────────────────────────────────────
export default function FamilyMemberList({
  members,
  isEnable,
  isUserOwner,
}: Props) {
  // userId가 2개 이상인 경우 복수 회선 보유자
  const dualLineUserIds = new Set(
    members
      .map((m) => m.userId)
      .filter((id, _, arr) => arr.filter((x) => x === id).length > 1),
  );

  // userId별로 lineId 오름차순 정렬 후 index → colorIndex 매핑
  const colorIndexMap = new Map<number, number>();
  const userLineMap = new Map<number, number[]>();
  members.forEach((m) => {
    if (!userLineMap.has(m.userId)) userLineMap.set(m.userId, []);
    userLineMap.get(m.userId)!.push(m.lineId);
  });
  userLineMap.forEach((lineIds) => {
    lineIds
      .sort((a, b) => a - b)
      .forEach((lineId, index) => {
        colorIndexMap.set(lineId, index);
      });
  });

  // FamilyMemberList.tsx
  return (
    <div className="w-full flex flex-col gap-3">
      <h2 className="text-lg font-bold text-black">가족 구성원</h2>
      <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-1 gap-3">
        {" "}
        {members.map((member) => (
          <FamilyMemberCard
            key={member.lineId}
            member={member}
            isEnable={isEnable}
            isUserOwner={isUserOwner}
            isDualLine={dualLineUserIds.has(member.userId)}
            lineIndex={colorIndexMap.get(member.lineId) ?? 0}
          />
        ))}
      </div>
    </div>
  );
}
