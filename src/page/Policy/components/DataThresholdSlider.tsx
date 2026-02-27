import { useState, useRef } from "react";
import GlassCard from "../../Main/components/GlassCard";
import Toggle from "@/components/common/Toggle";
import RangeSlider from "@/components/common/RangeSlider";

type Props = {
  initialEnabled?: boolean;
  initialValue?: number; // GB
  min?: number;
  max?: number;
};

export default function DataThresholdSlider({
  initialEnabled = true,
  initialValue = 20,
  min = 1,
  max = 100,
}: Props) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [value, setValue] = useState(initialValue);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <GlassCard
      title=""
      gradientFrom="#FFFFFF"
      gradientTo="#CCCCCC"
      bgGradientFrom="#FFFFFF"
      bgGradientTo="#F8F8F8"
      bgOpacity={0.8}
      borderWidth={1}
      borderRadius={20}
      className="w-full"
    >
      {/* 헤더: 제목 + 토글 */}
      <div className="flex items-center justify-between mb-0">
        <span className="text-base font-bold text-gray-800">
          데이터 임계치 설정
        </span>

        {/* 토글 버튼 */}
        <Toggle checked={enabled} onChange={setEnabled} />
      </div>

      {/* 아코디언 영역 */}
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: enabled ? "120px" : "0px",
          opacity: enabled ? 1 : 0,
          marginTop: enabled ? "20px" : "0px",
        }}
      >
        {/* 안되는 부분 */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-600">가족 공유 데이터 임계치</span>
          <div
            className="px-3 py-1 rounded-full text-sm font-semibold text-gray-700"
            style={{
              border: "1px solid #E0E0E0",
              backgroundColor: "#FAFAFA",
            }}
          >
            {value} GB
          </div>
        </div>

        {/* 슬라이더 */}
        <RangeSlider
          value={value}
          onChange={setValue}
          min={min}
          max={max}
          step={10}
          disabled={false}
        />

        {/* min / max 라벨 */}
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-300">{min}GB</span>
          <span className="text-xs text-gray-300">{max}GB</span>
        </div>
      </div>
    </GlassCard>
  );
}
