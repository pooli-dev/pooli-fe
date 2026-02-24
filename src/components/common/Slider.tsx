/**
 * LineChart 공용 컴포넌트
 * 
 * 사용 방법:
 * <Slider 
 *   data={[
 *     { label: '8월', value: 60, gb: 3.0 },
 *     { label: '9월', value: 80, gb: 4.0 },
 *     { label: '10월', value: 75, gb: 3.75 },
 *     { label: '평균', value: 78, gb: 3.9 }
 *   ]}
 *   height={192}
 *   color="#678BF7"
 *   showTooltip={true}
 *   animated={true}
 * />
 */

import { useState, useEffect, useRef, useId } from 'react';

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
  color = '#678BF7',
  animated = false
}: SliderProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isAnimated, setIsAnimated] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const gradientId = useId();

  // Intersection Observer로 애니메이션 트리거
  useEffect(() => {
    if (!animated) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsAnimated(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    const currentRef = chartRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [animated]);

  return (
    <div ref={chartRef} className="relative" style={{ height: `${height}px` }}>
      {/* 그리드 라인 */}
      <div className="absolute inset-0 flex flex-col justify-between">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="w-full border-t border-gray-100"></div>
        ))}
      </div>

      {/* SVG로 라인과 포인트 그리기 */}
      <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%', paddingBottom: '32px' }}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor="#9A9CEA" />
          </linearGradient>
        </defs>
        
        {/* 라인 그리기 */}
        {data.map((item, index) => {
          const nextItem = data[index + 1];
          if (!nextItem) return null;
          
          const currentHeight = (item.value / 100) * (height - 32);
          const nextHeight = (nextItem.value / 100) * (height - 32);
          
          const totalWidth = 100;
          const spacing = totalWidth / data.length;
          const x1 = spacing * index + spacing / 2;
          const x2 = spacing * (index + 1) + spacing / 2;
          const y1 = height - currentHeight - 32;
          const y2 = height - nextHeight - 32;
          
          // 애니메이션: 시작점에서 끝점으로
          const animY1 = isAnimated ? y1 : (animated ? height - 32 : y1);
          const animY2 = isAnimated ? y2 : (animated ? height - 32 : y2);
          
          return (
            <line
              key={`line-${index}`}
              x1={`${x1}%`}
              y1={animY1}
              x2={`${x2}%`}
              y2={animY2}
              stroke={`url(#${gradientId})`}
              strokeWidth="2.5"
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              style={{ transitionDelay: `${index * 100}ms` }}
            />
          );
        })}
        
        {/* 포인트 그리기 */}
        {data.map((item, index) => {
          const currentHeight = (item.value / 100) * (height - 32);
          const totalWidth = 100;
          const spacing = totalWidth / data.length;
          const x = spacing * index + spacing / 2;
          const y = height - currentHeight - 32;
          
          // 애니메이션: 아래에서 위로
          const animY = isAnimated ? y : (animated ? height - 32 : y);
          
          return (
            <circle
              key={`point-${index}`}
              cx={`${x}%`}
              cy={animY}
              r={hoveredIndex === index ? 7 : 5}
              fill={color}
              className="transition-all duration-1000 ease-out"
              style={{ 
                transitionDelay: `${index * 100}ms`,
                filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))'
              }}
            />
          );
        })}
      </svg>

      {/* 호버 영역과 레이블 */}
      <div className="absolute inset-0 flex items-end justify-around gap-4 pb-8">
        {data.map((item, index) => {
          const currentHeight = (item.value / 100) * (height - 32);
          
          return (
            <div 
              key={index} 
              className="flex-1 relative flex flex-col items-center cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* 호버 시 GB 표시 */}
              {hoveredIndex === index && item.gb !== undefined && (
                <div 
                  className="absolute bg-[#333333] text-white px-3 py-1.5 rounded text-sm font-medium z-20"
                  style={{ 
                    bottom: `${currentHeight + 16}px`,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {item.gb}GB
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#333333]"></div>
                </div>
              )}

              {/* 넓은 호버 영역 */}
              <div 
                className="absolute w-full"
                style={{ 
                  bottom: 0,
                  height: `${height - 32}px`
                }}
              ></div>

              {/* 레이블 */}
              <span 
                className={`absolute ${item.isCurrent ? 'text-[#678BF7] font-semibold' : 'text-[#666666]'}`}
                style={{ 
                  fontSize: '0.875em',
                  bottom: '-28px'
                }}
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
