import GradientButton from "@/components/common/GradientButton";
import { useNavigate } from "react-router-dom";
import ClockIcon from "@/assets/icon/clock2.svg";

interface SharedPoolCardProps {
  totalData: number; // GB
  remainingData: number; // GB
  baseData: number; // GB
  contributionData: number; // GB
  usageAmount: number; // GB
  remainingDays: number;
}

export default function SharedPoolCard({
  totalData,
  remainingData,
  baseData,
  contributionData,
  usageAmount,
  remainingDays,
}: SharedPoolCardProps) {
  const navigate = useNavigate();

  const totalGB = totalData.toFixed(2);
  const baseGB = baseData.toFixed(2);
  const contributionGB = contributionData.toFixed(2);
  const usageGB = usageAmount.toFixed(2);
  const remainingGB = remainingData.toFixed(2);
  const usagePercent = totalData > 0 ? (usageAmount / totalData) * 100 : 0;

  return (
    <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
      <div className="flex justify-between items-start mb-1">
        <h2 className="text-[15px] font-medium" style={{ color: "#808692" }}>
          총 공유 데이터
        </h2>
        <span
          className="text-xs font-medium mr-2 mt-1"
          style={{ color: "#BA7E7D" }}
        >
          D-{remainingDays}
        </span>
      </div>

      <div className="mb-2 mt-3">
        <div className="flex justify-between items-center mb-2 gap-2">
          <div
            className="text-2xl sm:text-[30px] font-semibold"
            style={{ color: "#678BF7" }}
          >
            {totalGB} GB
          </div>
          <GradientButton
            onClick={() => navigate("/log")}
            width={20}
            height={8}
            borderRadius={15}
          >
            <img src={ClockIcon} className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm whitespace-nowrap">사용 로그 보기</span>
          </GradientButton>
        </div>
        <div className="flex gap-8 text-sm">
          <div>
            <span style={{ color: "#9CA3AF" }}>기본 공유</span>
            <div className="font-medium text-base" style={{ color: "#374151" }}>
              {baseGB} GB
            </div>
          </div>
          <div>
            <span style={{ color: "#9CA3AF" }}>가족 추가</span>
            <div className="font-medium text-base" style={{ color: "#374151" }}>
              {contributionGB} GB
            </div>
          </div>
        </div>
      </div>

      {/* 구분선 */}
      <div className="mx-4 mb-3 border-t" style={{ borderColor: "#F3F4F6" }} />

      <div className="mb-2">
        <div className="text-xs mb-2" style={{ color: "#9CA3AF" }}>
          <span>현재 사용량</span>
        </div>
        <div
          className="flex items-center gap-3 text-xs"
          style={{ color: "#9CA3AF" }}
        >
          <div className="flex-1 h-3 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${usagePercent}%`,
                background: "linear-gradient(to right, #678BF7, #9A9CEA)",
              }}
            />
          </div>
          <span className="whitespace-nowrap">
            사용 {usageGB}GB / 잔여 {remainingGB}GB
          </span>
        </div>
      </div>
    </div>
  );
}
