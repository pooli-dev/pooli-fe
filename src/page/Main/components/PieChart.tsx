import { motion } from "framer-motion";
import Chip from "./Chip";
import type { SharedData } from "@/types/SharedData";

type Props = {
  size?: number; // px, 그래프의 사이즈
  strokeWidth?: number; // px, 그래프의 두께
  sharedPoolData?: SharedData | null;
};

export default function PieChart({
  size = 320,
  strokeWidth = 25,
  sharedPoolData,
}: Props) {
  const remaining = sharedPoolData?.sharedPoolRemainingData ?? 0;
  const total = sharedPoolData?.sharedPoolTotalData ?? 1;
  const base = sharedPoolData?.sharedPoolBaseData ?? 0;
  const additional = sharedPoolData?.sharedPoolAdditionalData ?? 0;
  const value = (remaining / total) * 100;
  const clamped = Math.max(0, Math.min(100, value)); // value가 0~100 사이일 수 있도록
  const r = (size - strokeWidth - 10) / 2; // 원의 반지름
  const c = 2 * Math.PI * r;
  const offset = c * (1 - clamped / 100); //원형 그래프에서 회색 처리될 부분

  // 물결 애니메이션을 위한 내부 원 크기
  const innerCircleSize = size - strokeWidth * 2 - 10;
  const waveHeight = (innerCircleSize * clamped) / 100;

  return (
    <div className="relative w-fit">
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
            <stop offset="0%" stopColor="#9A9CEA" />
            <stop offset="100%" stopColor="#219BE4" />
          </linearGradient>
          {/* 네온 효과 */}
          <filter id="shadow">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#A2B9EE" />
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
      </svg>

      {/* 물결 애니메이션 레이어 */}
      <div
        className="absolute overflow-hidden rounded-full pointer-events-none"
        style={{
          width: innerCircleSize,
          height: innerCircleSize,
          top: strokeWidth + 5,
          left: strokeWidth + 5,
          clipPath: `circle(${innerCircleSize / 2}px at center)`,
        }}
      >
        {/* 물결 레이어 1 - 파랑색 */}
        <motion.div
          className="absolute w-[200%] h-[200%] rounded-[45%]"
          style={{
            background: "rgba(196, 236, 254, 0.3)",
            left: "-50%",
          }}
          animate={{
            y: [
              innerCircleSize - waveHeight + 5,
              innerCircleSize - waveHeight + 15,
              innerCircleSize - waveHeight + 5,
            ],
            rotate: [0, 360],
          }}
          transition={{
            y: {
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            },
            rotate: {
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            },
          }}
        />

        {/* 물결 레이어 2 - 주황색 */}
        <motion.div
          className="absolute w-[210%] h-[210%] rounded-[48%]"
          style={{
            background: "rgba(251, 215, 195, 0.3)",
            left: "-55%",
          }}
          animate={{
            y: [
              innerCircleSize - waveHeight + 10,
              innerCircleSize - waveHeight + 20,
              innerCircleSize - waveHeight + 10,
            ],
            rotate: [0, -360],
          }}
          transition={{
            y: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3,
            },
            rotate: {
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            },
          }}
        />

        {/* 물결 레이어 3 - 보라색 */}
        <motion.div
          className="absolute w-[220%] h-[220%] rounded-[42%]"
          style={{
            background: "rgba(202, 166, 219, 0.2)",
            left: "-60%",
          }}
          animate={{
            y: [
              innerCircleSize - waveHeight + 30,
              innerCircleSize - waveHeight + 15,
              innerCircleSize - waveHeight + 30,
            ],
            rotate: [0, 360],
          }}
          transition={{
            y: {
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.6,
            },
            rotate: {
              duration: 12,
              repeat: Infinity,
              ease: "linear",
            },
          }}
        />
      </div>

      {/* 중앙 텍스트 및 데이터 - 최상단 레이어 */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
        style={{ width: size, height: size }}
      >
        <div className="text-5xl font-bold text-black mb-1">
          {Math.round(clamped)}%
        </div>
        <div className="text-sm text-gray-600 mb-4">
          {remaining}GB / {total}GB
        </div>

        {/* 글래스모피즘 칩 */}
        <div className="flex flex-wrap gap-2 justify-center">
          <Chip
            gradientFrom="#ffffff"
            gradientTo="#CAF1FF"
            bgColor="173, 230, 255"
            bgOpacity={0.5}
          >
            <span className="text-xs text-gray-700 whitespace-nowrap">기본 {base}GB</span>
          </Chip>
          <Chip
            gradientFrom="#ffffff"
            gradientTo="#FFF5F9"
            bgColor="246, 202, 221"
            bgOpacity={0.5}
          >
            <span className="text-xs text-gray-700 whitespace-nowrap">추가 {additional}GB</span>
          </Chip>
        </div>
      </div>
    </div>
  );
}
