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
  return (
    <div className="w-full flex flex-col gap-3">
      <h2 className="text-lg font-bold text-black">가족 구성원</h2>
      {members.map((member) => (
        <FamilyMemberCard
          key={member.userId}
          member={member}
          isEnable={isEnable}
          isUserOwner={isUserOwner}
        />
      ))}
    </div>
  );
}
