import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick?: () => void;
  bgColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
  borderWidth?: number;
  className?: string;
};

export default function GradientButton({
  children,
  onClick,
  bgColor = "#83A0F7",
  gradientFrom = "#CDD9FC",
  gradientTo = "#678BF7",
  borderWidth = 3,
  className = "",
}: Props) {
  return (
    // 바깥 div: 그라데이션 배경 (테두리 역할)
    <div
      className={`p-[${borderWidth}px] rounded-full ${className}`}
      style={{
        background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
        padding: borderWidth,
      }}
    >
      {/* 안쪽 버튼: 단색 배경 */}
      <button
        onClick={onClick}
        className="flex items-center justify-center gap-2 px-10 py-3 rounded-full font-semibold text-white text-base transition-opacity active:opacity-80"
        style={{ backgroundColor: bgColor }}
      >
        {children}
      </button>
    </div>
  );
}
