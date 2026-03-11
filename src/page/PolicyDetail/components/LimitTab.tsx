import RangeSlider from "@/components/common/RangeSlider";
import Toggle from "@/components/common/Toggle";
import GlassCard from "@/components/common/GlassCard";
import { useRef, useState } from "react";

// ── 공통 슬라이더 카드 컴포넌트 ──────────────────────────────────────────────
function SliderCard({
  title,
  label,
  min,
  max,
}: {
  title: string;
  label: string;
  min: number;
  max: number;
}) {
  const [enabled, setEnabled] = useState(true);
  const [value, setValue] = useState(min);
  const [inputValue, setInputValue] = useState(String(min));
  const contentRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    const numValue = parseFloat(newValue) || 0;
    setValue(Math.min(Math.max(numValue, min), max));
  };

  const handleInputBlur = () => {
    setInputValue(value.toString());
  };

  const handleSliderChange = (newValue: number) => {
    setValue(newValue);
    setInputValue(newValue.toString());
  };

  return (
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
      <div className="flex items-center justify-between mb-0">
        <span className="text-base font-bold text-gray-800">{title}</span>
        <Toggle checked={enabled} onChange={setEnabled} />
      </div>

      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: enabled ? "160px" : "0px",
          opacity: enabled ? 1 : 0,
          marginTop: enabled ? "20px" : "0px",
        }}
      >
        <div className="text-center mb-4">
          <span className="text-sm text-gray-600">{label}</span>
        </div>

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

        <RangeSlider
          value={value}
          onChange={handleSliderChange}
          min={min}
          max={max}
          step={0.1}
          disabled={!enabled}
        />

        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-300">{min}GB</span>
          <span className="text-xs text-gray-300">{max}GB</span>
        </div>
      </div>
    </GlassCard>
  );
}

// ── LimitTab ──────────────────────────────────────────────────────────────────
const LimitTab = () => {
  return (
    <div className="flex flex-col gap-3 px-4 py-8 text-center text-gray-500">
      <SliderCard
        title="월 공유 데이터 사용량 제한"
        label="가족 공유 데이터 임계치"
        min={1}
        max={5}
      />
      <SliderCard
        title="하루 총 데이터 사용량 제한"
        label="가족 공유 데이터 임계치"
        min={1}
        max={5}
      />
    </div>
  );
};

export default LimitTab;
