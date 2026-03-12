import GlassCard from "../../components/common/GlassCard";
import SharedPoolUsage from "./components/SharedPoolUsage";
import BlockIcon from "../../assets/icon/block.svg";
import PlusIcon from "../../assets/icon/plus.svg";
import GradientButton from "../../components/common/GradientButton";
import { useNavigate } from "react-router-dom";
import FamilyMemberList from "./components/FamilyMemberList";
import type { FamilyMember } from "@/types/FamilyMember";
import PieChart from "../Main/components/PieChart";
import { useEffect, useState } from "react";
import { policyService } from "@/api";
import { useUserStore } from "@/store/userStore";

export default function Main() {
  const navigate = useNavigate();
  const lineId = useUserStore((state) => state.userInfo?.lineId);
  const [blockStatus, setBlockStatus] = useState<{
    blockEndsAt: string;
    blocked: boolean;
  } | null>(null);

  useEffect(() => {
    if (!lineId) return;

    policyService.getBlockStatus(lineId).then((res) => {
      setBlockStatus(res.data);
      console.log(res.data); // 여기서 찍어야 함
    });
  }, [lineId]); // 추후 페이지 진입시로 변경

  // /api/families/members로 FamilyApiResponse 받은 후 FamilyMemberList에 아래 구조로 전달
  const members: FamilyMember[] = [
    {
      userId: 100,
      userName: "김영희",
      role: "OWNER",
      remainingData: 0,
      basicDataAmount: 5000,
      sharedPoolRemainingAmount: 1600,
      sharedPoolTotalAmount: 2000,
    },
    {
      userId: 101,
      userName: "김철수",
      role: "MEMBER",
      remainingData: 1600,
      basicDataAmount: 2000,
      sharedPoolRemainingAmount: 2000,
      sharedPoolTotalAmount: 2000,
    },
  ];

  return (
    // 전체 영역
    <div className="relative h-[calc(100vh-106px-60px)] overflow-y-auto mt-[130px] mb-[60px]">
      <div className="min-h-full flex flex-col items-center justify-center gap-5 px-6 pb-[60px]">
        {/* 데이터 차단 활성화 배너 영역 */}
        {/* 아직 api 없음. 페이지 로드 시 api 호출 */}
        {blockStatus?.blocked && (
          <div className="w-full max-w-md">
            <GlassCard
              title=""
              gradientFrom="#FFFFFF"
              gradientTo="#999999"
              bgGradientFrom="#FFFFFF"
              bgGradientTo="#EEEEEE"
              bgOpacity={0.2}
              borderWidth={2}
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-[#E4E9FC]">
                  <img src={BlockIcon} alt="" className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  {/* 제목 */}
                  <h3 className="text-base font-semibold text-gray-800 mb-0.5">
                    데이터 차단 활성화
                  </h3>

                  {/* 내용 */}
                  <p className="text-sm text-gray-500 font-light">
                    현재 차단 시간 | 월요일 10시 ~ 화요일 06시
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {/* 그래프 영역 */}
        {/* /api/shared-pools/main/remaining-amount 엔드 포인트로 요청 */}
        <div className="flex flex-col items-center gap-4">
          <PieChart />
        </div>

        {/* 공유 데이터 담기 페이지 이동 버튼 */}
        <GradientButton onClick={() => navigate("/shared-data")}>
          <img src={PlusIcon} className="w-5 h-5" />
          가족 공유 데이터 담기
        </GradientButton>

        {/* 공유풀 사용량 */}
        {/* /api/families/members 요청후 각 member에 대해 sharedPoolRemainingAmount로 각각 사용량 계산 후 넘기기(%) */}
        <div className="w-full max-w-md">
          <SharedPoolUsage />
        </div>

        {/* 구성원별 데이터 정보 */}
        {/* /api/families/members 요청후 members 넘기기 */}
        <FamilyMemberList
          members={members}
          myUserId={100} // 로그인 유저 id}
        />
      </div>
    </div>
  );
}
