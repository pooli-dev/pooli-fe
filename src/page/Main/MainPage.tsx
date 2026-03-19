import GlassCard from "../../components/common/GlassCard";
import SharedPoolUsage from "./components/SharedPoolUsage";
import BlockIcon from "../../assets/icon/block.svg";
import PlusIcon from "../../assets/icon/plus.svg";
import GradientButton from "../../components/common/GradientButton";
import { useNavigate } from "react-router-dom";
import FamilyMemberList from "./components/FamilyMemberList";
import type { FamilyApiResponse } from "@/types/FamilyMember";
import PieChart from "../Main/components/PieChart";
import { blockService, sharedPoolService } from "@/api";
import { useUserStore } from "@/store/userStore";
import { familyService } from "@/api";
import type { SharedData, UsageData } from "@/types/SharedData";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  itemVariants,
  pageTransition,
  pageVariants,
} from "@/utils/pageAnimation";

export default function Main() {
  const navigate = useNavigate();
  const lineId = useUserStore((state) => state.userInfo?.lineId);
  // store에 저장된 user 정보 가져오기
  const userData = useUserStore((state) => state.userInfo);

  // 현재 로그인한 사용자가 대표자인가
  const isOwner = userData?.role === "OWNER";

  const { data: familyData, isPending: isFamilyLoading } =
    useQuery<FamilyApiResponse>({
      queryKey: ["familyMembers"],
      queryFn: () => familyService.getMembers().then((res) => res.data),
      refetchInterval: 1000,
      refetchIntervalInBackground: true,
      placeholderData: keepPreviousData, // ← v5 방식
    });

  const { data: usageData } = useQuery<UsageData>({
    queryKey: ["UsageData"],
    queryFn: () => sharedPoolService.getUsageData().then((res) => res.data),
    refetchInterval: 1000, // 10초마다 자동 폴링
    refetchIntervalInBackground: true, // 백그라운드에서도 폴링
    placeholderData: keepPreviousData,
  });

  // Avatar와 동일한 색상 기준 (Avatar.tsx BASE_COLORS와 동일)
  const BASE_COLORS = [
    "#FBC7C3",
    "#CAA6DB",
    "#B6DF82",
    "#FFA780",
    "#57CAFB",
    "#FFD580",
    "#A0C4FF",
    "#F9A8D4",
  ];
  const DARKEN: Record<number, string> = { 0: "FF", 1: "55" };

  // familyData로 lineIndexMap 계산
  const userLineMap = new Map<number, number[]>();
  familyData?.members.forEach((m) => {
    if (!userLineMap.has(m.userId)) userLineMap.set(m.userId, []);
    userLineMap.get(m.userId)!.push(m.lineId);
  });
  const lineIndexMap = new Map<number, number>();
  userLineMap.forEach((lineIds) => {
    lineIds
      .sort((a, b) => a - b)
      .forEach((lineId, index) => {
        lineIndexMap.set(lineId, index);
      });
  });

  const usageUsers = usageData?.membersUsageList.map((member) => {
    const familyMember = familyData?.members.find(
      (m) => m.phone === member.phoneNumber,
    );
    const userId = familyMember?.userId ?? 0;
    const lineId = familyMember?.lineId ?? 0;
    const lineIndex = lineIndexMap.get(lineId) ?? 0;
    const baseColor = BASE_COLORS[userId % BASE_COLORS.length];
    const opacity = DARKEN[lineIndex] ?? "BB";
    return {
      name: member.userName,
      phone: member.phoneNumber,
      percentage:
        (member.monthlySharedPoolUsage / usageData.sharedPoolTotalData) * 100,
      color: `${baseColor}${opacity}`,
    };
  });

  const { data: sharedPoolData, isPending: isPoolLoading } =
    useQuery<SharedData>({
      queryKey: ["sharedPool"],
      queryFn: () => sharedPoolService.getMainRemainingAmount(),
      refetchInterval: 1000, // 10초마다 자동 폴링
      refetchIntervalInBackground: true, // 백그라운드에서도 폴링
      placeholderData: keepPreviousData,
    });

  const { data: blockStatus } = useQuery<{
    blockEndsAt: string;
    blocked: boolean;
  }>({
    queryKey: ["blockStatus", lineId],
    queryFn: () => blockService.getBlockStatus(lineId!).then((res) => res.data),
    enabled: !!lineId,
    refetchInterval: 1000, // 10초마다 자동 폴링
    refetchIntervalInBackground: true, // 백그라운드에서도 폴링
    placeholderData: keepPreviousData,
  });

  const isLoading = isFamilyLoading || isPoolLoading;

  // 종료 시간 변환 함수
  const formatBlockEndTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const day = days[date.getDay()];
    const hour = date.getHours();
    const minute = date.getMinutes();
    return `${day}요일 ${hour}시${minute > 0 ? ` ${minute}분` : ""}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-106px-60px)] mt-[106px]">
        <div className="w-10 h-10 border-4 border-[#678BF7] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    // 전체 영역
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      transition={pageTransition}
      className="flex flex-col items-center gap-5 px-4 pb-[20px] mt-7"
    >
      {/* 데이터 차단 활성화 배너 영역 */}
      {/* 아직 api 없음. 페이지 로드 시 api 호출 */}
      {blockStatus?.blocked && (
        <motion.div
          variants={itemVariants}
          transition={{ ...pageTransition, delay: 0.1 }}
          className="w-full max-w-md"
        >
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
                  차단 종료 시간 | {formatBlockEndTime(blockStatus.blockEndsAt)}
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}
      {/* 그래프 영역 */}
      {/* /api/shared-pools/main/remaining-amount 엔드 포인트로 요청 */}
      <motion.div
        variants={itemVariants}
        transition={{ ...pageTransition, delay: 0.1 }}
        className="flex flex-col items-center gap-4 pt-5"
      >
        <PieChart sharedPoolData={sharedPoolData} />
      </motion.div>
      {/* 공유 데이터 담기 페이지 이동 버튼 */}
      <motion.div
        variants={itemVariants}
        transition={{ ...pageTransition, delay: 0.2 }}
      >
        <GradientButton onClick={() => navigate("/shared-data")}>
          <img src={PlusIcon} className="w-5 h-5" />
          가족 공유 데이터 담기
        </GradientButton>
      </motion.div>
      {/* 공유풀 사용량 */}
      {/* /api/families/members 요청후 각 member에 대해 sharedPoolRemainingAmount로 각각 사용량 계산 후 넘기기(%) */}
      <motion.div
        variants={itemVariants}
        transition={{ ...pageTransition, delay: 0.3 }}
        className="w-full max-w-md"
      >
        <SharedPoolUsage users={usageUsers} />
      </motion.div>
      {/* 구성원별 데이터 정보 */}
      {/* /api/families/members 요청후 members 넘기기 */}
      {familyData && (
        <motion.div
          variants={itemVariants}
          transition={{ ...pageTransition, delay: 0.4 }}
          className="w-full"
        >
          <FamilyMemberList
            members={familyData.members}
            isEnable={familyData.isEnable}
            isUserOwner={isOwner}
          />
        </motion.div>
      )}
    </motion.div>
  );
}
