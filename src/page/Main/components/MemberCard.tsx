import GlassCard from "@/components/common/GlassCard";
import type { FamilyMember } from "@/types/FamilyMember";
import { useNavigate } from "react-router-dom";
import GradientBadge from "./GradientBadge";
import DataBar from "./DataBar";
import Avatar from "@/components/common/Avatar";
import RightIcon from "@/assets/icon/right.svg";

export default function FamilyMemberCard({
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
        <Avatar
          userName={member.userName}
          isOwner={isOwner}
          colorIndex={member.userId}
        />

        {/* 이름 + 대표자 뱃지 */}
        {/* 이름만 수직 정렬 되도록 */}
        <div className="flex-1 min-w-0 self-center">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base font-semibold text-black">
              {member.userName}
            </span>
            {/* 본인 이거나 혹은 대표자일 때 조건부 렌더링 */}
            {isMe && (
              <button
                onClick={() => navigate("/detail")}
                className="flex items-center justify-center gap-0.2 text-xs text-[#0F4E7A] hover:text-[#4A7FB5] transition-colors"
              >
                상세보기
                <img src={RightIcon} width={15} height={15} />
              </button>
            )}
          </div>
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
