/**
 * LineChart 공용 컴포넌트
 */

import { formatDataLabel } from "@/utils/dataFormat";
import { useState, useEffect, useRef } from "react";

interface SliderProps {
  data: Array<{
    label: string;
    value: number; // 0-100 퍼센트 값
    gb?: number; // GB 값 (선택사항)
    isCurrent?: boolean; // 현재 달 여부
  }>;
  height?: number; // 차트 높이 (px)
  color?: string; // 라인 및 포인트 색상
  animated?: boolean; // 애니메이션 여부
}

export default function Slider({
  data,
  height = 192,
  color = "#678BF7",
  animated = false,
}: SliderProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isAnimated, setIsAnimated] = useState(animated);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (animated) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsAnimated(true);
          }
        });
      },
      { threshold: 0.2 },
    );

    const currentRef = chartRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [animated]);

  // 15%~85% 영역에 균등 분배
  const startPercent = 15;
  const endPercent = 85;
  const range = endPercent - startPercent;
  const totalGaps = data.length - 1;

  return (
    <div ref={chartRef} className="relative" style={{ height: `${height}px` }}>
      {/* 그리드 라인 */}
      <div className="absolute inset-0 flex flex-col justify-between pb-8">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-full border-t"
            style={{ borderColor: "rgba(209, 213, 219, 0.5)" }}
          ></div>
        ))}
      </div>

      {/* 차트 영역 */}
      <div className="absolute inset-0 pb-8">
        <div className="relative w-full h-full px-4">
          {/* SVG로 라인 그리기 */}
          <svg
            className="absolute inset-0 w-full h-full"
            style={{ overflow: "visible" }}
          >
            {/* 라인 연결 */}
            {data.map((item, index) => {
              if (index === data.length - 1) return null;

              const nextItem = data[index + 1];
              const x1Percent = startPercent + (index / totalGaps) * range;
              const x2Percent =
                startPercent + ((index + 1) / totalGaps) * range;
              const y1Percent = 100 - item.value;
              const y2Percent = 100 - nextItem.value;

              const animY1 = isAnimated ? y1Percent : 100;
              const animY2 = isAnimated ? y2Percent : 100;

              return (
                <line
                  key={`line-${index}`}
                  x1={`${x1Percent}%`}
                  y1={`${animY1}%`}
                  x2={`${x2Percent}%`}
                  y2={`${animY2}%`}
                  stroke={color}
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                  style={{
                    transitionDelay: `${index * 100}ms`,
                    opacity: 0.9,
                  }}
                />
              );
            })}

            {/* 포인트 */}
            {data.map((item, index) => {
              const xPercent = startPercent + (index / totalGaps) * range;
              const yPercent = 100 - item.value;
              const animY = isAnimated ? yPercent : 100;

              return (
                <circle
                  key={`point-${index}`}
                  cx={`${xPercent}%`}
                  cy={`${animY}%`}
                  r={hoveredIndex === index ? 7 : 5}
                  fill={color}
                  className="transition-all duration-1000 ease-out"
                  style={{
                    transitionDelay: `${index * 100}ms`,
                    filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))",
                  }}
                />
              );
            })}
          </svg>

          {/* 호버 영역 */}
          <div className="absolute inset-0 flex">
            {data.map((item, index) => {
              const xPercent = startPercent + (index / totalGaps) * range;
              const yPercent = 100 - item.value;

              return (
                <div
                  key={`hover-${index}`}
                  className="absolute cursor-pointer"
                  style={{
                    left: `${xPercent}%`,
                    transform: "translateX(-50%)",
                    width: "60px",
                    height: "100%",
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* 툴팁 */}
                  {hoveredIndex === index && item.gb !== undefined && (
                    <div
                      className="absolute bg-[#333333] text-white px-3 py-1.5 rounded text-sm font-medium z-20 whitespace-nowrap"
                      style={{
                        top: `${yPercent}%`,
                        left: "50%",
                        transform: "translate(-50%, calc(-100% - 12px))",
                      }}
                    >
                      {formatDataLabel(item.gb)}
                      <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#333333]"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 레이블 */}
      <div className="absolute bottom-0 left-0 right-0 h-8 flex px-4">
        {data.map((item, index) => {
          const xPercent = startPercent + (index / totalGaps) * range;

          return (
            <div
              key={`label-${index}`}
              className="absolute"
              style={{
                left: `${xPercent}%`,
                transform: "translateX(-50%)",
              }}
            >
              <span
                className={`text-center whitespace-nowrap ${item.isCurrent ? "text-[#678BF7] font-semibold" : "text-[#666666]"}`}
                style={{ fontSize: "0.875em" }}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
