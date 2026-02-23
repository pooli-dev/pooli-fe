type Props = {
  value: number; // 0~100, 그래프의 값
  size?: number; // px, 그래프의 사이즈
  strokeWidth?: number; // px, 그래프의 두께
};

export default function CircleProgress({
  value,
  size = 260,
  strokeWidth = 20,
}: Props) {
  const clamped = Math.max(0, Math.min(100, value)); // value가 0~100 사이일 수 있도록
  const r = (size - strokeWidth - 10) / 2; // 원의 반지름
  const c = 2 * Math.PI * r;
  const offset = c * (1 - clamped / 100); //원형 그래프에서 회색 처리될 부분

  return (
    <div className="w-fit">
      <svg width={size} height={size} className="block">
        {/* 전체 영역 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgb(237 237 237)"
          strokeWidth={strokeWidth}
          filter="url(#shadow)"
        />

        <defs>
          {/* 그라데이션 */}
          <linearGradient id="myGradient">
            <stop offset="0%" stop-color="#9A9CEA" />
            <stop offset="100%" stop-color="#219BE4" />
          </linearGradient>
          {/* 네온 효과 */}
          <filter id="shadow">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="3"
              flood-color="#A2B9EE"
            />
          </filter>
        </defs>

        {/* 잔여량 영역 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#myGradient)"
          filter="url(#shadow)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="transition-[stroke-dashoffset] duration-500 ease-out"
        />

        {/* 중앙 텍스트 (Tailwind 테스트용) */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-black font-bold"
          style={{ fontSize: 55 }}
        >
          {Math.round(clamped)}%
        </text>
      </svg>
    </div>
  );
}
