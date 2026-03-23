import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick?: () => void;
  bgColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
  textColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  className?: string;
  buttonClassName?: string;
  disabled?: boolean;
  fullWidth?: boolean;
};

export default function GradientButton({
  children,
  onClick,
  bgColor = "#83A0F7",
  gradientFrom = "#CDD9FC",
  gradientTo = "#678BF7",
  textColor = "#FFFFFF",
  borderWidth = 3,
  borderRadius,
  className = "",
  buttonClassName = "",
  disabled = false,
  fullWidth = false,
}: Props) {
  return (
    <div
      className={`rounded-full ${fullWidth ? "w-full" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      style={{
        borderRadius: borderRadius ? `${borderRadius}px` : undefined,
        background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
        padding: borderWidth,
      }}
    >
      <button
        onClick={onClick}
        disabled={disabled}
        className={`gradient-btn flex items-center justify-center gap-2 rounded-full font-semibold transition-opacity ${fullWidth ? "w-full" : ""} ${disabled ? "cursor-not-allowed" : "active:opacity-80"} ${buttonClassName}`}
        style={{
          borderRadius: borderRadius ? `${borderRadius}px` : undefined,
          backgroundColor: bgColor,
          padding: "10px 24px",
          color: textColor,
        }}
      >
        {children}
      </button>
    </div>
  );
}
