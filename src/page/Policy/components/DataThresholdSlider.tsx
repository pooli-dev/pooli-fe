import { useState, useRef } from "react";
import GlassCard from "../../../components/common/GlassCard";
import Toggle from "@/components/common/Toggle";
import RangeSlider from "@/components/common/RangeSlider";

type Props = {
  isOwner?: boolean;
  individualThreshold?: number; // GB
  familyThreshold?: number;
};

export default function DataThresholdSlider({
  isOwner = true,
  individualThreshold = 2.5,
  familyThreshold = 2.5,
}: Props) {
  const [enabled, setEnabled] = useState(true);
  const [familyValue, setFamilyValue] = useState(String(familyThreshold));
  const [individualValue, setIndividualValue] = useState(
    String(individualThreshold),
  );

  const FAMILY_MIN = 1,
    FAMILY_MAX = 5;
  const INDIVIDUAL_MIN = 1,
    INDIVIDUAL_MAX = 5;
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <GlassCard
      title=""
      gradientFrom="#FFFFFF"
      gradientTo="#CCCCCC"
      bgGradientFrom="#FFFFFF"
      bgGradientTo="#F8F8F8"
      bgOpacity={0.7}
      borderWidth={1}
      borderRadius={20}
      className="w-full"
    >
      {/* 헤더: 제목 + 토글 */}
      <div className="flex items-center justify-between mb-0">
        <span className="text-base font-bold text-gray-800">
          데이터 임계치 알림 설정
        </span>

        {/* 토글 버튼 */}
        <Toggle checked={enabled} onChange={setEnabled} />
      </div>

      {/* 아코디언 영역 */}
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: enabled ? "200px" : "0px",
          opacity: enabled ? 1 : 0,
          marginTop: enabled ? "20px" : "0px",
        }}
      >
        {/* 가족 공유 데이터 임계치 - isOwner만 조작 가능 */}
        {/* 슬라이더 변경되고 몇 초 뒤에 api 요청하기 */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">가족 공유 데이터 임계치</span>
          <div
            className="flex items-center gap-1 px-3 py-1 rounded-full"
            style={{ border: "1px solid #E0E0E0", backgroundColor: "#FAFAFA" }}
          >
            <input
              type="text"
              inputMode="decimal"
              value={familyValue}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d*\.?\d*$/.test(val)) {
                  setFamilyValue(val);
                }
              }}
              onBlur={() => {
                const clamped = Math.min(
                  FAMILY_MAX,
                  Math.max(FAMILY_MIN, Number(familyValue)),
                );
                setFamilyValue(parseFloat(clamped.toFixed(1)).toString());
              }}
              disabled={!isOwner}
              className="w-10 text-sm font-semibold text-gray-700 text-center outline-none bg-transparent disabled:text-gray-300"
            />
            <span className="text-sm font-semibold text-gray-700">GB</span>
          </div>
        </div>

        <RangeSlider
          value={Number(familyValue)}
          onChange={(v) => setFamilyValue(String(v))}
          min={FAMILY_MIN}
          max={FAMILY_MAX}
          step={0.1}
          disabled={!isOwner} // 대표자 아니면 비활성화
        />
        <div className="flex justify-between mt-1 mb-3">
          <span className="text-xs text-gray-300">{FAMILY_MIN}GB</span>
          <span className="text-xs text-gray-300">{FAMILY_MAX}GB</span>
        </div>

        {/* 개인 데이터 임계치 - 모두 조작 가능 */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">개인 공유 데이터 임계치</span>
          <div
            className="flex items-center gap-1 px-3 py-1 rounded-full"
            style={{ border: "1px solid #E0E0E0", backgroundColor: "#FAFAFA" }}
          >
            <input
              type="text"
              inputMode="decimal" // 모바일에서 숫자 키패드
              value={individualValue}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d*\.?\d*$/.test(val)) {
                  // 숫자랑 소수점만 허용
                  setIndividualValue(val);
                }
              }}
              onBlur={(e) => {
                const clamped = Math.min(
                  INDIVIDUAL_MAX,
                  Math.max(INDIVIDUAL_MIN, Number(e.target.value)),
                );
                setIndividualValue(parseFloat(clamped.toFixed(1)).toString());
              }}
              className="w-10 text-sm font-semibold text-gray-700 text-center outline-none bg-transparent"
            />
            <span className="text-sm font-semibold text-gray-700">GB</span>
          </div>
        </div>

        <RangeSlider
          value={Number(individualValue)}
          onChange={(v) => setIndividualValue(String(v))}
          min={INDIVIDUAL_MIN}
          max={INDIVIDUAL_MAX}
          step={0.1}
          disabled={false}
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-300">{INDIVIDUAL_MIN}GB</span>
          <span className="text-xs text-gray-300">{INDIVIDUAL_MAX}GB</span>
        </div>
      </div>
    </GlassCard>
  );
}
