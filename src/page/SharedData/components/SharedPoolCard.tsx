import { useMemo } from "react";
import { formatDataLabel } from "@/utils/dataFormat";
import { useNavigate } from "react-router-dom";
import GradientButton from "@/components/common/GradientButton";
import ClockIcon from "@/assets/icon/clock2.svg";

interface SharedPoolCardProps {
  totalData: number;
  remainingData: number;
  baseData: number;
  contributionData: number;
  usageAmount: number;
  remainingDays: number;
}

const COLORS = {
  primary: "#678BF7",
  secondary: "#9A9CEA",
  textGray: "#808692",
  textDark: "#374151",
  textLight: "#9CA3AF",
  danger: "#BA7E7D",
  divider: "#F3F4F6",
} as const;

export default function SharedPoolCard({
  totalData,
  remainingData,
  baseData,
  contributionData,
  usageAmount,
  remainingDays,
}: SharedPoolCardProps) {
  const navigate = useNavigate();

  const formattedData = useMemo(
    () => ({
      total: formatDataLabel(totalData),
      base: formatDataLabel(baseData),
      contribution: formatDataLabel(contributionData),
      usage: formatDataLabel(usageAmount),
      remaining: formatDataLabel(remainingData),
    }),
    [totalData, baseData, contributionData, usageAmount, remainingData],
  );

  const usagePercent = useMemo(
    () => (totalData > 0 ? (usageAmount / totalData) * 100 : 0),
    [totalData, usageAmount],
  );

  return (
    <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
      <CardHeader remainingDays={remainingDays} />
      <DataSummary
        totalGB={formattedData.total}
        baseGB={formattedData.base}
        contributionGB={formattedData.contribution}
        onViewLog={() => navigate("/log")}
      />
      <Divider />
      <UsageProgress
        usagePercent={usagePercent}
        usageGB={formattedData.usage}
        remainingGB={formattedData.remaining}
      />
    </div>
  );
}

function CardHeader({ remainingDays }: { remainingDays: number }) {
  return (
    <div className="flex justify-between items-start mb-1">
      <h2
        className="text-[15px] font-medium"
        style={{ color: COLORS.textGray }}
      >
        총 공유 데이터
      </h2>
      <span
        className="text-xs font-medium mr-2 mt-1"
        style={{ color: COLORS.danger }}
      >
        D-{remainingDays}
      </span>
    </div>
  );
}

interface DataSummaryProps {
  totalGB: string;
  baseGB: string;
  contributionGB: string;
  onViewLog: () => void;
}

function DataSummary({
  totalGB,
  baseGB,
  contributionGB,
  onViewLog,
}: DataSummaryProps) {
  return (
    <div className="mb-2 mt-3">
      <div className="flex justify-between items-center mb-2 gap-2">
        <div
          className="text-2xl sm:text-[30px] font-semibold"
          style={{ color: COLORS.primary }}
        >
          {totalGB}
        </div>
        <GradientButton onClick={onViewLog} borderRadius={15}>
          <img src={ClockIcon} className="w-4 h-4 sm:w-5 sm:h-5" alt="clock" />
          <span className="text-xs sm:text-sm whitespace-nowrap">
            사용 로그 보기
          </span>
        </GradientButton>
      </div>
      <div className="flex gap-8 text-sm">
        <DataItem label="기본 공유" value={baseGB} />
        <DataItem label="가족 추가" value={contributionGB} />
      </div>
    </div>
  );
}

function DataItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span style={{ color: COLORS.textLight }}>{label}</span>
      <div className="font-medium text-base" style={{ color: COLORS.textDark }}>
        {value}
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div
      className="mx-4 mb-3 border-t"
      style={{ borderColor: COLORS.divider }}
    />
  );
}

interface UsageProgressProps {
  usagePercent: number;
  usageGB: string;
  remainingGB: string;
}

function UsageProgress({
  usagePercent,
  usageGB,
  remainingGB,
}: UsageProgressProps) {
  return (
    <div className="mb-2">
      <div className="text-xs mb-2" style={{ color: COLORS.textLight }}>
        <span>현재 사용량</span>
      </div>
      <div
        className="flex items-center gap-3 text-xs"
        style={{ color: COLORS.textLight }}
      >
        <div className="flex-1 h-3 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${usagePercent}%`,
              background: `linear-gradient(to right, ${COLORS.primary}, ${COLORS.secondary})`,
            }}
          />
        </div>
        <span className="whitespace-nowrap">
          사용 {usageGB} / 잔여 {remainingGB}
        </span>
      </div>
    </div>
  );
}
