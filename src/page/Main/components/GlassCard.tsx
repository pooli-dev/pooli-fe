import { type ReactNode, useId, useRef, useState, useEffect } from "react";

type Props = {
  title: string;
  children: ReactNode;
  icon?: string;
  gradientFrom?: string;
  gradientTo?: string;
  bgGradientFrom?: string;
  bgGradientTo?: string;
  bgOpacity?: number;
  borderWidth?: number;
  borderRadius?: number;
  className?: string;
};

// 헥사 코드를 rgba로 변환하는 함수
function hexToRgba(hex: string, opacity: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export default function DataBlockBanner({
  title,
  children,
  gradientFrom = "#EEEEEE",
  gradientTo = "#999999",
  bgGradientFrom = "#FFFFFF",
  bgGradientTo = "#FFFFFF",
  bgOpacity = 0.7,
  borderWidth = 1,
  borderRadius = 24,
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

  return (
    <div ref={containerRef} className={`relative flex w-full ${className}`}>
      {/* SVG 그라데이션 테두리 */}
      {size.w > 0 && (
        <svg
          width={size.w}
          height={size.h}
          className="absolute inset-0 pointer-events-none"
          style={{ overflow: "visible" }}
        >
          <defs>
            <linearGradient
              id={`grad-border-${uid}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor={gradientFrom} />
              <stop offset="100%" stopColor={gradientTo} />
            </linearGradient>
          </defs>
          <rect
            x={half}
            y={half}
            width={size.w - borderWidth}
            height={size.h - borderWidth}
            rx={borderRadius - half}
            ry={borderRadius - half}
            fill="none"
            stroke={`url(#grad-border-${uid})`}
            strokeWidth={borderWidth}
          />
        </svg>
      )}

      {/* 내부: 그라데이션 반투명 배경*/}
      <div
        className="relative flex items-center w-full "
        style={{
          background: `linear-gradient(135deg, 
            ${hexToRgba(bgGradientFrom, bgOpacity)}, 
            ${hexToRgba(bgGradientTo, bgOpacity)}
          )`,
          borderRadius: `${borderRadius}px`,
          padding: "16px 18px",
        }}
      >
        {/* 텍스트 영역 */}
        <div className="flex-1 min-w-0">
          {/* 제목 */}
          {!!title && (
            <h3 className="text-base font-semibold text-gray-800 mb-3">
              {title}
            </h3>
          )}

          {/* 내용 */}
          <div className="text-sm text-gray-600">{children}</div>
        </div>
      </div>
    </div>
  );
}
