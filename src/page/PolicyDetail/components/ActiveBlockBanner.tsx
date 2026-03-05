import { useState, useEffect } from "react";

type Props = {
  endTime: Date; // 차단 종료 시각
  onRelease?: () => void; // 차단 해제 버튼 콜백
};

function formatCountdown(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

function formatEndTime(date: Date): string {
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

export default function ActiveBlockBanner({ endTime, onRelease }: Props) {
  const calcRemaining = () =>
    Math.max(0, Math.floor((endTime.getTime() - Date.now()) / 1000));

  const [remaining, setRemaining] = useState(calcRemaining);

  useEffect(() => {
    if (remaining <= 0) return;
    const timer = setInterval(() => {
      const r = calcRemaining();
      setRemaining(r);
      if (r <= 0) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  // 시간이 다 됐으면 렌더링 안 함
  if (remaining <= 0) return null;

  return (
    <div
      className="w-full rounded-2xl p-4 mb-4"
      style={{ backgroundColor: "#F7CDCA", border: "1px solid #FF887E" }}
    >
      {/* 상단: 아이콘 + 제목 */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-base">🚫</span>
        <span className="text-sm font-semibold text-black">
          현재 즉시 차단 정책 적용 중
        </span>
      </div>

      {/* 종료 시간 */}
      <p className="text-xs text-gray-600 mb-3">
        종료 시간: {formatEndTime(endTime)}
      </p>

      {/* 카운트다운 + 해제 버튼 */}
      <div className="flex items-center justify-between">
        <span className="text-3xl font-bold text-gray-800 tabular-nums tracking-wide">
          {formatCountdown(remaining)}
        </span>

        <button
          onClick={onRelease}
          className="px-4 py-2 rounded-2xl text-sm font-semibold text-gray-700 transition-opacity active:opacity-70"
          style={{
            backgroundColor: "#FBEBEA",
            border: "1px solid #FF887E",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          }}
        >
          차단 해제
        </button>
      </div>
    </div>
  );
}
