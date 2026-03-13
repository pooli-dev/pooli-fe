import { formatData } from "@/utils/dataFormat";

function getRemainingPercent(remaining: number, total: number): number {
  // -1은 무제한을 의미하므로 100% 표시
  if (total === -1 || remaining === -1) return 100;
  if (total === 0) return 0;
  return Math.min(100, Math.round((remaining / total) * 100));
}

export default function DataBar({
  label,
  remaining,
  total,
  color,
}: {
  label: string;
  remaining: number;
  total: number;
  color: string;
}) {
  // -1 값을 무제한으로 처리
  const isUnlimited = total === -1 || remaining === -1;
  const displayRemaining = isUnlimited
    ? "무제한"
    : `${formatData(remaining)}GB`;
  const displayTotal = total === -1 ? "무제한" : `${formatData(total)}GB`;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-400">{label}</span>
        <span className="text-xs text-gray-500">
          {displayRemaining} / {displayTotal}
        </span>
      </div>
      <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${getRemainingPercent(remaining, total)}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}
