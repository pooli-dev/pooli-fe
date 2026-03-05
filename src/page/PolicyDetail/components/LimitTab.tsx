import RangeSlider from "@/components/common/RangeSlider";
import Toggle from "@/components/common/Toggle";
import GlassCard from "@/page/Main/components/GlassCard";
import { useRef, useState } from "react";

const LimitTab = () => {
  const [enabled, setEnabled] = useState(true);
  const [value, setValue] = useState(3);
  const [inputValue, setInputValue] = useState("3");
  const contentRef = useRef<HTMLDivElement>(null);
  const min = 1;
  const max = 5;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    const numValue = parseFloat(newValue) || 0;
    const clampedValue = Math.min(Math.max(numValue, min), max);
    setValue(clampedValue);
  };

  const handleInputBlur = () => {
    // 입력이 끝났을 때 값을 정리
    setInputValue(value.toString());
  };

  const handleSliderChange = (newValue: number) => {
    setValue(newValue);
    setInputValue(newValue.toString());
  };

  return (
    <div className="flex flex-col gap-3 px-4 py-8 text-center text-gray-500">
      <GlassCard
        title=""
        gradientFrom="#FFFFFF"
        gradientTo="#CCCCCC"
        bgGradientFrom="#FFFFFF"
        bgGradientTo="#F8F8F8"
        bgOpacity={0.5}
        borderWidth={1}
        borderRadius={20}
        className="w-full"
      >
        {/* 헤더: 제목 + 토글 */}
        <div className="flex items-center justify-between mb-0">
          <span className="text-base font-bold text-gray-800">
            월 공유 데이터 사용량 제한
          </span>

          {/* 토글 버튼 */}
          <Toggle checked={enabled} onChange={setEnabled} />
        </div>

        {/* 아코디언 영역 */}
        <div
          ref={contentRef}
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{
            maxHeight: enabled ? "160px" : "0px",
            opacity: enabled ? 1 : 0,
            marginTop: enabled ? "20px" : "0px",
          }}
        >
          {/* 라벨 */}
          <div className="text-center mb-4">
            <span className="text-sm text-gray-600">
              가족 공유 데이터 임계치
            </span>
          </div>

          {/* 중앙 입력 폼 */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                disabled={!enabled}
                className="w-16 text-center text-2xl font-bold text-gray-800 bg-transparent border-none outline-none focus:bg-white/50 rounded px-1 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                min={min}
                max={max}
                step="0.1"
              />
              <span className="text-2xl font-bold text-gray-800">GB</span>
            </div>
          </div>

          {/* 슬라이더 */}
          <RangeSlider
            value={value}
            onChange={handleSliderChange}
            min={min}
            max={max}
            step={0.1}
            disabled={!enabled}
          />

          {/* min / max 라벨 */}
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-300">{min}GB</span>
            <span className="text-xs text-gray-300">{max}GB</span>
          </div>
        </div>
      </GlassCard>
      <GlassCard
        title=""
        gradientFrom="#FFFFFF"
        gradientTo="#CCCCCC"
        bgGradientFrom="#FFFFFF"
        bgGradientTo="#F8F8F8"
        bgOpacity={0.5}
        borderWidth={1}
        borderRadius={20}
        className="w-full"
      >
        {/* 헤더: 제목 + 토글 */}
        <div className="flex items-center justify-between mb-0">
          <span className="text-base font-bold text-gray-800">
            하루 총 데이터 사용량 제한
          </span>

          {/* 토글 버튼 */}
          <Toggle checked={enabled} onChange={setEnabled} />
        </div>

        {/* 아코디언 영역 */}
        <div
          ref={contentRef}
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{
            maxHeight: enabled ? "160px" : "0px",
            opacity: enabled ? 1 : 0,
            marginTop: enabled ? "20px" : "0px",
          }}
        >
          {/* 라벨 */}
          <div className="text-center mb-4">
            <span className="text-sm text-gray-600">
              가족 공유 데이터 임계치
            </span>
          </div>

          {/* 중앙 입력 폼 */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                disabled={!enabled}
                className="w-16 text-center text-2xl font-bold text-gray-800 bg-transparent border-none outline-none focus:bg-white/50 rounded px-1 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                min={min}
                max={max}
                step="0.1"
              />
              <span className="text-2xl font-bold text-gray-800">GB</span>
            </div>
          </div>

          {/* 슬라이더 */}
          <RangeSlider
            value={value}
            onChange={handleSliderChange}
            min={min}
            max={max}
            step={0.1}
            disabled={!enabled}
          />

          {/* min / max 라벨 */}
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-300">{min}GB</span>
            <span className="text-xs text-gray-300">{max}GB</span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default LimitTab;
