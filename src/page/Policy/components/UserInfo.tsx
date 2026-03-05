import GradientButton from "@/page/Main/components/GradientButton";
import GlassCard from "../../Main/components/GlassCard";
import ClockIcon from "../../../assets/icon/clock.png";
import PlusIcon from "../../../assets/icon/plus.svg";
import { useNavigate } from "react-router-dom";

// ── 타입 ─────────────────────────────────────────────────────────────────────
type Props = {
  // 프로필
  userName: string;
  profileImage?: string;
  isOwner?: boolean;
  planName?: string;
  isDualPhone?: boolean; // 투폰 여부 → 계정 전환 버튼 노출
  onAccountSwitch?: () => void;

  // 데이터 잔여량
  sharedDataRemaining: number; // MB
  personalDataRemaining: number; // MB

  // 차단 상태
  isBlocked?: boolean;
  onBlockToggle?: () => void;

  // 액션 버튼
  onAddSharedData?: () => void;
  onViewLog?: () => void;
};

// ── 유틸 ─────────────────────────────────────────────────────────────────────
function formatMB(mb: number): string {
  if (mb >= 1000) return `${(mb / 1000).toFixed(1)} GB`;
  return `${mb} MB`;
}

// ── 프로필 아바타 (공통으로 쓸 수 있도록 export) ─────────────────────────────
export function ProfileAvatar({
  profileImage,
  userName,
  isOwner = false,
  size = "md",
}: {
  profileImage?: string;
  userName: string;
  isOwner?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass = { sm: "w-10 h-10", md: "w-14 h-14", lg: "w-20 h-20" }[size];
  const crownSize = { sm: "text-sm", md: "text-base", lg: "text-xl" }[size];

  return (
    <div className="relative flex-shrink-0">
      <div
        className={`${sizeClass} rounded-full overflow-hidden bg-gradient-to-br from-[#E8EEFF] to-[#C4D0FF] flex items-center justify-center`}
      >
        {profileImage ? (
          <img
            src={profileImage}
            alt={userName}
            className="w-full h-full object-cover"
          />
        ) : (
          <svg viewBox="0 0 24 24" fill="#9AA5C4" className="w-1/2 h-1/2">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        )}
      </div>
      {isOwner && (
        <div className={`absolute -bottom-1 right-1 ${crownSize} leading-none`}>
          👑
        </div>
      )}
    </div>
  );
}

// ── 데이터 잔여량 카드 ────────────────────────────────────────────────────────
function DataRemainingCard({
  label,
  amount,
  icon,
}: {
  label: string;
  amount: number;
  icon: "share" | "person";
}) {
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
      className="flex-1"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-400 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-800">{formatMB(amount)}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#EEF0FF] flex items-center justify-center flex-shrink-0">
          {icon === "share" ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"
                fill="#9A9CEA"
              />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"
                fill="#CAA6DB"
              />
            </svg>
          )}
        </div>
      </div>
    </GlassCard>
  );
}

// ── PolicyPageHeader ──────────────────────────────────────────────────────────
export default function PolicyPageHeader({
  userName,
  profileImage,
  isOwner = false,
  planName,
  isDualPhone = false,
  onAccountSwitch,
  sharedDataRemaining,
  personalDataRemaining,
  isBlocked = false,
  onBlockToggle,
}: Props) {
  const navigate = useNavigate();
  return (
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
        <ProfileAvatar
          profileImage={profileImage}
          userName={userName}
          isOwner={isOwner}
          size="md"
        />

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
              {userName}
            </span>
            {isDualPhone && (
              <button
                onClick={onAccountSwitch}
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
          {planName && (
            <p className="text-xs text-gray-400 mt-0.5">
              이용중인 요금제: {planName}
            </p>
          )}
        </div>

        {/* 차단 상태 */}
        <button
          onClick={onBlockToggle}
          className={`text-sm font-semibold flex-shrink-0 transition-colors ${
            isBlocked ? "text-red-400" : "text-green-400"
          }`}
        >
          차단 {isBlocked ? "ON" : "OFF"}
        </button>
      </div>

      {/* ── 데이터 잔여량 ── */}
      <div className="flex gap-3 mb-4">
        <DataRemainingCard
          label="가족 공유 데이터 잔여량"
          amount={sharedDataRemaining}
          icon="share"
        />
        <DataRemainingCard
          label="개인 데이터 잔여량"
          amount={personalDataRemaining}
          icon="person"
        />
      </div>

      {/* ── 액션 버튼 ── */}
      <div className="flex gap-3">
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
  );
}
