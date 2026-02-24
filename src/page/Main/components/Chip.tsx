import { type ReactNode, useId, useRef, useState, useEffect } from "react";

type Props = {
  children: ReactNode;
  gradientFrom?: string;
  gradientTo?: string;
  bgColor?: string;
  bgOpacity?: number;
  borderWidth?: number;
  className?: string;
};

export default function GlassChip({
  children,
  gradientFrom = "#FBE4EE",
  gradientTo = "#E0CDE0",
  bgColor = "#FFFFFF",
  bgOpacity = 0.12,
  borderWidth = 1,
  className = "",
}: Props) {
  const uid = useId().replace(/:/g, "");
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: width, h: height });
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const half = borderWidth / 2;
  const rx = size.h / 2; // pill 모양: border-radius = 높이의 절반

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center ${className}`}
    >
      {/* SVG 그라데이션 테두리 - 실제 px 크기로 그림 */}
      {size.w > 0 && (
        <svg
          width={size.w}
          height={size.h}
          className="absolute inset-0 pointer-events-none"
          style={{ overflow: "visible" }}
        >
          <defs>
            <linearGradient
              id={`grad-${uid}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="50%" stopColor={gradientFrom} />
              <stop offset="100%" stopColor={gradientTo} />
            </linearGradient>
          </defs>
          <rect
            x={half}
            y={half}
            width={size.w - borderWidth}
            height={size.h - borderWidth}
            rx={rx - half}
            ry={rx - half}
            fill="none"
            stroke={`url(#grad-${uid})`}
            strokeWidth={borderWidth}
          />
        </svg>
      )}

      {/* 내부: 반투명 + blur만 담당, 배경색 없음 */}
      <div
        className="flex items-center relative px-3.5 py-2 rounded-full"
        style={{
          backgroundColor: `rgba(${bgColor}, ${bgOpacity})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
