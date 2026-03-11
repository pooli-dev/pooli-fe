import { type ReactNode, useId, useRef, useState, useEffect } from "react";

type Props = {
  title: string;
  children: ReactNode;
  gradientFrom?: string;
  gradientTo?: string;
  bgGradientFrom?: string;
  bgGradientTo?: string;
  bgOpacity?: number;
  borderWidth?: number;
  borderRadius?: number;
  textColor?: string;
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

export default function GlassCard({
  title,
  children,
  gradientFrom = "#EEEEEE",
  gradientTo = "#999999",
  bgGradientFrom = "#FFFFFF",
  bgGradientTo = "#FFFFFF",
  bgOpacity = 0.7,
  borderWidth = 1,
  borderRadius = 24,
  textColor = "#000000",
  className = "",
}: Props) {
  // 같은 컴포넌트가 여러개 렌더링 될때 충돌하지 않도록 고유 id 값 생성
  const uid = useId().replace(/:/g, "");
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  // 카드 DOM 요소의 실제 픽셀 크기를 측정 -> 그라데이션 테두리 적용 가능해짐
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

  // 선 중심으로 그려지기 때문에, 테두리가 밖으로 삐져나오지 않도록 처리
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
            <h3
              className="text-base font-semibold mb-3"
              style={{ color: textColor }}
            >
              {title}
            </h3>
          )}

          {/* 내용 */}
          <div className="text-sm text-black">{children}</div>
        </div>
      </div>
    </div>
  );
}
