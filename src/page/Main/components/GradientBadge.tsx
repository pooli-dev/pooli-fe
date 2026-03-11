import { type ReactNode } from "react";

export default function GradientBadge({
  children,
  gradientFrom,
  gradientTo,
  textColor,
  bgColor,
}: {
  children: ReactNode;
  gradientFrom: string;
  gradientTo: string;
  textColor: string;
  bgColor: string;
}) {
  return (
    <div
      className="rounded-full p-[2px] flex-shrink-0"
      style={{
        background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
      }}
    >
      <div
        className="rounded-full px-3 py-2 text-xs font-medium"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        {children}
      </div>
    </div>
  );
}
