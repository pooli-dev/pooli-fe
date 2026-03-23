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
  borderRadius?: number;
  fontSize?: number;
  className?: string;
  buttonClassName?: string; // ← 추가: 안쪽 button에 적용할 className
  disabled?: boolean;
  fullWidth?: boolean; // ← 추가: 부모 너비 꽉 채우기
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
  borderRadius,
  fontSize,
  className = "",
  buttonClassName = "",
  disabled = false,
  fullWidth = false,
}: Props) {
  return (
    <div
      className={`rounded-full ${fullWidth ? "w-full" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      style={{
        borderRadius: `${borderRadius}px`,
        background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
        padding: borderWidth,
      }}
    >
      <button
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center justify-center gap-2 rounded-full font-semibold text-base transition-opacity ${fullWidth ? "w-full" : ""} ${disabled ? "cursor-not-allowed" : "active:opacity-80"} ${buttonClassName}`}
        style={{
          borderRadius: `${borderRadius}px`,
          backgroundColor: bgColor,
          padding: `${height}px ${width}px`,
          color: textColor,
          fontSize: fontSize ? `${fontSize}rem` : undefined,
        }}
      >
        {children}
      </button>
    </div>
  );
}
