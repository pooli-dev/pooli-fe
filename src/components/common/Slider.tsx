import { useState, useRef, useEffect } from 'react';

/**
 * 슬라이더바 컴포넌트
 * 
 * @example
 * // 기본 사용 (0-100)
 * const [volume, setVolume] = useState(50);
 * <Slider value={volume} onChange={setVolume} />
 * 
 * @example
 * // 범위 지정
 * const [temperature, setTemperature] = useState(20);
 * <Slider 
 *   value={temperature} 
 *   onChange={setTemperature}
 *   min={10}
 *   max={30}
 *   step={0.5}
 * />
 * 
 * @example
 * // 비활성화 상태
 * <Slider value={50} onChange={() => {}} disabled />
 */

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

export default function Slider({ 
  value, 
  onChange, 
  min = 0, 
  max = 100, 
  step = 1,
  disabled = false 
}: SliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const percentage = ((value - min) / (max - min)) * 100;

  const handleMove = (clientX: number) => {
    if (!sliderRef.current || disabled) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = x / rect.width;
    const newValue = min + percent * (max - min);
    const steppedValue = Math.round(newValue / step) * step;
    const clampedValue = Math.max(min, Math.min(max, steppedValue));

    onChange(clampedValue);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    setIsDragging(true);
    handleMove(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    setIsDragging(true);
    handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMove(e.clientX);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        handleMove(e.touches[0].clientX);
      }
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  return (
    <div className="w-full py-2">
      <div
        ref={sliderRef}
        className={`relative h-2 rounded-full bg-[#E0E0E0] ${disabled ? 'opacity-50' : 'cursor-pointer'}`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* 활성화된 트랙 */}
        <div
          className="absolute h-full rounded-full bg-[#7B9EFF] transition-all duration-100"
          style={{ width: `${percentage}%` }}
        />

        {/* 썸 (동그란 핸들) */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white shadow-lg transition-all duration-100 ${
            isDragging ? 'scale-110' : 'scale-100'
          }`}
          style={{ left: `${percentage}%`, transform: `translate(-50%, -50%)` }}
        />
      </div>
    </div>
  );
}
