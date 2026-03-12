import GradientButton from "@/components/common/GradientButton";
import GlassCard from "../../../components/common/GlassCard";
import ClockIcon from "../../../assets/icon/clock.png";
import PlusIcon from "../../../assets/icon/plus.svg";
import { useNavigate } from "react-router-dom";
import Avatar from "@/components/common/Avatar";
import DataRemainingCard from "./DataRemainingCard";
import { useState } from "react";
import type { UserInfo } from "@/types/user";
import { useUserStore } from "@/store/userStore";
import { useQuery } from "@tanstack/react-query";
import type { Line } from "@/types/line";
import { lineService } from "@/api";
import { blockService } from "@/api";

type Props = {
  // 프로필
  userData: UserInfo;
};

export default function UserInfo({ userData }: Props) {
  const navigate = useNavigate();
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const lineId = useUserStore((state) => state.userInfo?.lineId);

  const isOwner = userData.role === "OWNER";
  // 회선이 여러개 인지 조회
  const { data: lines } = useQuery<Line[]>({
    queryKey: ["lines"],
    queryFn: () => lineService.getLines().then((res) => res.data),
  });

  const isDualPhone = (lines?.length ?? 0) > 1;

  // 차단 상태인지 확인
  const { data: blockStatus } = useQuery<{
    blockEndsAt: string;
    blocked: boolean;
  }>({
    queryKey: ["blockStatus", lineId],
    queryFn: () => blockService.getBlockStatus(lineId!).then((res) => res.data),
    enabled: !!lineId,
  });

  const isBlocked = blockStatus?.blocked;

  async function handleAccountSwitch() {
    setIsBottomSheetOpen(true);
  }

  async function handleSelectLine(lineId: number) {
    await lineService.switchLine(lineId);

    setIsBottomSheetOpen(false);
    // 전환 후 페이지 새로고침 or 상태 업데이트
    window.location.reload();
  }

  return (
    <>
      <GlassCard
        title=""
        gradientFrom="#FFFFFF"
        gradientTo="#CCCCCC"
        bgGradientFrom="#FFFFFF"
        bgGradientTo="#F0F0F0"
        bgOpacity={0.6}
        borderWidth={1}
        borderRadius={24}
        className="w-full"
      >
        {/* ── 프로필 영역 ── */}
        <div className="flex items-start gap-3 mb-4">
          <Avatar userName={userData.userName} isOwner={isOwner} />

          <div className="flex-1 min-w-0">
            {/* 대표자 뱃지 */}
            {isOwner && (
              <span className="inline-block mb-1 text-xs text-white bg-gradient-to-r from-[#9A9CEA] to-[#63B3ED] rounded-full px-2.5 py-0.5">
                대표자
              </span>
            )}

            {/* 이름 + 계정 전환 */}
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-gray-800">
                {userData.userName}
              </span>
              {isDualPhone && (
                <button
                  onClick={handleAccountSwitch}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  title="계정 전환"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* 요금제 */}
            {userData.planName && (
              <p className="text-xs text-gray-400 mt-0.5">
                이용중인 요금제: {userData.planName}
              </p>
            )}
          </div>

          {/* 차단 상태 */}
          <div
            className={`text-xs font-semibold flex-shrink-0 transition-colors ${
              isBlocked ? "text-red-400" : "text-green-400"
            }`}
          >
            차단 {isBlocked ? "ON" : "OFF"}
          </div>
        </div>

        {/* ── 데이터 잔여량 ── */}
        <div className="flex gap-3 mb-4">
          <DataRemainingCard
            label="가족 공유 데이터 잔여량"
            amount={userData.sharedDataRemaining}
            icon="share"
          />
          <DataRemainingCard
            label="개인 데이터 잔여량"
            amount={userData.personalDataRemaining}
            icon="person"
          />
        </div>

        {/* ── 액션 버튼 ── */}
        <div className="flex justify-center gap-3">
          {/* 공유 데이터 담기 */}
          <GradientButton
            width={12}
            height={8}
            onClick={() => navigate("/shared-data")}
          >
            <img src={PlusIcon} className="w-4 h-4" />
            가족 공유 데이터 담기
          </GradientButton>

          {/* 사용 로그 보기 */}
          <GradientButton
            width={14}
            height={8}
            bgColor="#FED2BF"
            gradientFrom="#FFFFFF"
            gradientTo="#FFA780"
            textColor="#FF5C14"
            onClick={() => navigate("/log")}
          >
            <img src={ClockIcon} className="w-4 h-4" />
            사용 로그 보기
          </GradientButton>
        </div>
      </GlassCard>

      {isBottomSheetOpen && (
        <>
          {/* 딤 배경 */}
          <div
            className="fixed inset-0 bg-black/30 z-[200]"
            onClick={() => setIsBottomSheetOpen(false)}
          />

          {/* 바텀시트 */}
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[480px] max-w-full z-[201] bg-white rounded-t-2xl p-6">
            <h3 className="text-base font-semibold text-gray-800 mb-4">
              계정 전환
            </h3>
            <ul className="flex flex-col">
              {(lines ?? []).map((line) => (
                <li key={line.lineId}>
                  <button
                    onClick={() => handleSelectLine(line.lineId)}
                    className="w-full flex items-center gap-3 py-3 border-b border-gray-100"
                  >
                    <Avatar
                      userName={userData.userName}
                      colorIndex={line.lineId}
                      size="md"
                    />
                    <span className="text-sm text-gray-700">
                      {line.phoneNumber}
                    </span>
                    {line.lineId === userData.lineId && (
                      <span className="ml-auto text-green-500">✓</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </>
  );
}
