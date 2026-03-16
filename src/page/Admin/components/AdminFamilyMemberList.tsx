import type { FamilyMember } from "@/api/services/familyService";
import GlassCard from "@/components/common/GlassCard";
import Avatar from "@/components/common/Avatar";

type Props = {
  members: FamilyMember[];
};

export default function AdminFamilyMemberList({ members }: Props) {
  return (
    <div className="w-full flex flex-col gap-3">
      <h2 className="text-lg font-bold text-black">가족 구성원</h2>
      {members.map((member) => {
        const isOwner = member.role === "OWNER";
        const roleLabel = member.role === 'OWNER' ? '대표자' : member.role === 'MEMBER' ? '구성원' : member.role;
        
        return (
          <GlassCard
            key={member.userId}
            title=""
            gradientFrom="#FFFFFF"
            gradientTo="#CCCCCC"
            bgGradientFrom="#FFFFFF"
            bgGradientTo="#F8F8F8"
            bgOpacity={0.7}
            borderWidth={1}
            className=""
          >
            <div className="flex items-start gap-3">
              <Avatar
                userName={member.userName}
                isOwner={isOwner}
                colorIndex={member.userId}
              />

              <div className="flex-1 min-w-0 self-center">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-base font-semibold text-black">
                    {member.userName}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      member.role === 'OWNER'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {roleLabel}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{member.phone}</p>
              </div>
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
}
