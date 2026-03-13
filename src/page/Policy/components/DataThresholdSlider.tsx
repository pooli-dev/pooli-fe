import { useRef, useState } from "react";
import GlassCard from "../../../components/common/GlassCard";
import Toggle from "@/components/common/Toggle";
import RangeSlider from "@/components/common/RangeSlider";
import type { LineThreshold, SharedPoolThreshold } from "@/types/threshold";
import { formatData } from "@/utils/dataFormat";
import { thresholdService } from "@/api";

type Props = {
  isOwner?: boolean;
  lineThreshold?: LineThreshold;
  sharedPoolThreshold?: SharedPoolThreshold;
};

export default function DataThresholdSlider({
  isOwner = true,
  lineThreshold,
  sharedPoolThreshold,
}: Props) {
  const [familyOverride, setFamilyOverride] = useState<{
    enabled?: boolean;
    value?: string;
  }>({});
  const [individualOverride, setIndividualOverride] = useState<{
    enabled?: boolean;
    value?: string;
  }>({});

  const familyDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const individualDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  // 실제 사용 값 = 유저가 바꾼 값 OR props 값
  const familyEnabled =
    familyOverride.enabled ?? sharedPoolThreshold?.isThresholdActive ?? false;
  const familyValue =
    familyOverride.value ??
    String(formatData(sharedPoolThreshold?.familyThreshold ?? 0));
  const individualEnabled =
    individualOverride.enabled ?? lineThreshold?.isThresholdActive ?? false;
  const individualValue =
    individualOverride.value ??
    String(formatData(lineThreshold?.individualThreshold ?? 0));

  const FAMILY_MIN = formatData(sharedPoolThreshold?.minThreshold ?? 0);
  const FAMILY_MAX =
    sharedPoolThreshold?.maxThreshold === -1
      ? "무제한"
      : formatData(sharedPoolThreshold?.maxThreshold ?? 100);
  const INDIVIDUAL_MIN = formatData(lineThreshold?.thresholdMinValue ?? 0);
  const INDIVIDUAL_MAX =
    lineThreshold?.thresholdMaxValue === -1
      ? "무제한"
      : formatData(lineThreshold?.thresholdMaxValue ?? 100);

  const isFamilyUnlimited = sharedPoolThreshold?.maxThreshold === -1;
  const isIndividualUnlimited = lineThreshold?.thresholdMaxValue === -1;

  const handleFamilyChange = (patch: { enabled?: boolean; value?: string }) => {
    const next = { ...familyOverride, ...patch };
    setFamilyOverride(next);

    if (familyDebounceRef.current) clearTimeout(familyDebounceRef.current);
    familyDebounceRef.current = setTimeout(() => {
      const val = next.value ?? familyValue;
      thresholdService
        .patchSharedPoolThreshold(gbToBytes(Number(val)))
        .catch(console.error);
    }, 1000);
  };

  const handleIndividualChange = (patch: {
    enabled?: boolean;
    value?: string;
  }) => {
    const next = { ...individualOverride, ...patch };
    setIndividualOverride(next);

    if (individualDebounceRef.current)
      clearTimeout(individualDebounceRef.current);
    individualDebounceRef.current = setTimeout(() => {
      const val = next.value ?? individualValue;
      const enabled = next.enabled ?? individualEnabled;
      thresholdService
        .patchLineThreshold(gbToBytes(Number(val)), enabled)
        .catch(console.error);
    }, 1000);
  };

  // GB → bytes 변환
  const gbToBytes = (gb: number): number => Math.round(gb * 1e9);

  console.log(lineThreshold, sharedPoolThreshold);
  console.log("familyThreshold raw:", sharedPoolThreshold?.familyThreshold);
  console.log(
    "formatData 결과:",
    formatData(sharedPoolThreshold?.familyThreshold ?? 0),
  );

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
      <div className="flex items-center justify-between mb-0">
        <span className="text-base font-bold text-gray-800">
          데이터 임계치 알림 설정
        </span>
      </div>

      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: "400px", marginTop: "20px" }}
      >
        {/* 가족 공유 데이터 임계치 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              가족 공유 데이터 임계치
            </span>
            <Toggle
              checked={familyEnabled}
              onChange={(v) => handleFamilyChange({ enabled: v })}
              disabled={!isOwner}
            />
          </div>

          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center gap-1">
              <input
                type="text"
                inputMode="decimal"
                value={familyValue}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*\.?\d*$/.test(val))
                    handleFamilyChange({ value: val });
                }}
                onBlur={() => {
                  if (!isFamilyUnlimited) {
                    const maxVal =
                      typeof FAMILY_MAX === "number"
                        ? FAMILY_MAX
                        : parseFloat(FAMILY_MAX);
                    const clamped = Math.min(
                      maxVal,
                      Math.max(FAMILY_MIN, Number(familyValue)),
                    );
                    handleFamilyChange({
                      value: parseFloat(clamped.toFixed(1)).toString(),
                    });
                  }
                }}
                disabled={!familyEnabled || !isOwner}
                className="w-20 text-center text-2xl font-bold text-gray-800 bg-transparent border-none outline-none focus:bg-white/50 rounded px-1 transition-colors disabled:opacity-50"
              />
              <span className="text-2xl font-bold text-gray-800">GB</span>
            </div>
          </div>

          <RangeSlider
            value={Number(familyValue)}
            onChange={(v) => handleFamilyChange({ value: String(v) })}
            min={FAMILY_MIN}
            max={
              isFamilyUnlimited
                ? 1000
                : typeof FAMILY_MAX === "number"
                  ? FAMILY_MAX
                  : parseFloat(FAMILY_MAX)
            }
            step={0.1}
            disabled={!familyEnabled || !isOwner}
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-300">{FAMILY_MIN}GB</span>
            <span className="text-xs text-gray-300">{FAMILY_MAX}</span>
          </div>
        </div>

        {/* 개인 공유 데이터 임계치 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              개인 공유 데이터 임계치
            </span>
            <Toggle
              checked={individualEnabled}
              onChange={(v) => handleIndividualChange({ enabled: v })}
              disabled={false}
            />
          </div>

          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center gap-1">
              <input
                type="text"
                inputMode="decimal"
                value={individualValue}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*\.?\d*$/.test(val))
                    handleIndividualChange({ value: val });
                }}
                onBlur={() => {
                  if (!isIndividualUnlimited) {
                    const maxVal =
                      typeof INDIVIDUAL_MAX === "number"
                        ? INDIVIDUAL_MAX
                        : parseFloat(INDIVIDUAL_MAX);
                    const clamped = Math.min(
                      maxVal,
                      Math.max(INDIVIDUAL_MIN, Number(individualValue)),
                    );
                    handleIndividualChange({
                      value: parseFloat(clamped.toFixed(1)).toString(),
                    });
                  }
                }}
                disabled={!individualEnabled}
                className="w-20 text-center text-2xl font-bold text-gray-800 bg-transparent border-none outline-none focus:bg-white/50 rounded px-1 transition-colors disabled:opacity-50"
              />
              <span className="text-2xl font-bold text-gray-800">GB</span>
            </div>
          </div>

          <RangeSlider
            value={Number(individualValue)}
            onChange={(v) => handleIndividualChange({ value: String(v) })}
            min={INDIVIDUAL_MIN}
            max={
              isIndividualUnlimited
                ? 1000
                : typeof INDIVIDUAL_MAX === "number"
                  ? INDIVIDUAL_MAX
                  : parseFloat(INDIVIDUAL_MAX)
            }
            step={0.1}
            disabled={!individualEnabled}
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-300">{INDIVIDUAL_MIN}GB</span>
            <span className="text-xs text-gray-300">{INDIVIDUAL_MAX}</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
