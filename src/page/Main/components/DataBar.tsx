function formatMB(mb: number): string {
  if (mb >= 1000) return `${(mb / 1000).toFixed(1)}GB`;
  return `${mb}MB`;
}

function getRemainingPercent(remaining: number, total: number): number {
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
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-400">{label}</span>
        <span className="text-xs text-gray-500">
          {formatMB(remaining)} / {formatMB(total)}
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
