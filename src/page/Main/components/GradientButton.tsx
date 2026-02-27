import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick?: () => void;
  bgColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
  textColor?: string;
  borderWidth?: number;
  width?: number;
  height?: number;
  className?: string;
};

export default function GradientButton({
  children,
  onClick,
  bgColor = "#83A0F7",
  gradientFrom = "#CDD9FC",
  gradientTo = "#678BF7",
  textColor = "#FFFFFF",
  borderWidth = 3,
  width = 40,
  height = 12,
  className = "",
}: Props) {
  return (
    // 바깥 div: 그라데이션 배경 (테두리 역할)
    <div
      className={`rounded-full ${className}`}
      style={{
        background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
        padding: borderWidth,
      }}
    >
      {/* 안쪽 버튼: 단색 배경 */}
      <button
        onClick={onClick}
        className={`flex items-center justify-center gap-2 rounded-full font-semibold text-base transition-opacity active:opacity-80`}
        style={{
          backgroundColor: bgColor,
          padding: `${height}px ${width}px`, // 세로 가로
          color: `${textColor}`,
        }}
      >
        {children}
      </button>
    </div>
  );
}
