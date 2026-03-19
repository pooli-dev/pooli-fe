import { useRef, useState } from "react";
import GlassCard from "../../../components/common/GlassCard";
import Toggle from "@/components/common/Toggle";
import RangeSlider from "@/components/common/RangeSlider";
import type { LineThreshold, SharedPoolThreshold } from "@/types/threshold";
import { formatData, formatDataLabel } from "@/utils/dataFormat";
import { thresholdService } from "@/api";
import { useToastStore } from "@/store/toastStore";

type Props = {
  isOwner?: boolean;
  lineThreshold?: LineThreshold;
  sharedPoolThreshold?: SharedPoolThreshold;
};

export default function DataThresholdSlider({
  isOwner = false,
  lineThreshold,
  sharedPoolThreshold,
}: Props) {
  // 사용자가 변경한 값만 override로 관리
  const [familyOverride, setFamilyOverride] = useState<{
    enabled?: boolean;
    bytes?: number;
  }>({});
  const [individualOverride, setIndividualOverride] = useState<{
    enabled?: boolean;
    bytes?: number;
  }>({});

  const familyDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const individualDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const [prevLineThreshold, setPrevLineThreshold] = useState(lineThreshold);
  const [prevSharedPoolThreshold, setPrevSharedPoolThreshold] =
    useState(sharedPoolThreshold);

  const { show } = useToastStore();

  if (lineThreshold !== prevLineThreshold) {
    setPrevLineThreshold(lineThreshold);
    setIndividualOverride({});
  }

  if (sharedPoolThreshold !== prevSharedPoolThreshold) {
    setPrevSharedPoolThreshold(sharedPoolThreshold);
    setFamilyOverride({});
  }

  const toGB = (bytes: number) => formatData(bytes);
  const toBytes = (gb: number) => Math.round(gb * 1e9);

  // 실제 값 = override가 있으면 override, 없으면 props
  const familyEnabled =
    familyOverride.enabled ?? sharedPoolThreshold?.isThresholdActive ?? false;
  const familyBytes =
    familyOverride.bytes ?? sharedPoolThreshold?.familyThreshold ?? 0;
  const individualEnabled =
    individualOverride.enabled ?? lineThreshold?.isThresholdActive ?? false;
  const individualBytes =
    individualOverride.bytes ?? lineThreshold?.individualThreshold ?? 0;

  const familyGB = toGB(familyBytes);
  const individualGB = toGB(individualBytes);

  const familyMin = 0;
  const familyMax =
    sharedPoolThreshold?.maxThreshold === -1
      ? null
      : toGB(sharedPoolThreshold?.maxThreshold ?? 0);

  const individualMin = 0;
  const individualMax =
    lineThreshold?.thresholdMaxValue === -1
      ? null
      : toGB(lineThreshold?.thresholdMaxValue ?? 0);

  const handleFamilyChange = (newBytes: number) => {
    setFamilyOverride((prev) => ({ ...prev, bytes: newBytes }));
    if (familyDebounceRef.current) clearTimeout(familyDebounceRef.current);
    familyDebounceRef.current = setTimeout(() => {
      thresholdService
        .patchSharedPoolThreshold(newBytes)
        .then(() => show("가족 공유 데이터 임계치가 저장되었습니다."))
        .catch(() => show("저장에 실패했습니다.", "error"));
    }, 1000);
  };

  const handleFamilyToggle = (enabled: boolean) => {
    setFamilyOverride((prev) => ({ ...prev, enabled }));
    if (familyDebounceRef.current) clearTimeout(familyDebounceRef.current);
    familyDebounceRef.current = setTimeout(() => {
      thresholdService
        .patchSharedPoolThreshold(familyBytes)
        .then(() => show("가족 공유 데이터 임계치가 저장되었습니다."))
        .catch(() => show("저장에 실패했습니다.", "error"));
    }, 1000);
  };

  const handleIndividualChange = (newBytes: number) => {
    setIndividualOverride((prev) => ({ ...prev, bytes: newBytes }));
    if (individualDebounceRef.current)
      clearTimeout(individualDebounceRef.current);
    individualDebounceRef.current = setTimeout(() => {
      thresholdService
        .patchLineThreshold(newBytes, individualEnabled)
        .then(() => show("개인 데이터 임계치가 저장되었습니다."))
        .catch(() => show("저장에 실패했습니다.", "error"));
    }, 1000);
  };

  const handleIndividualToggle = (enabled: boolean) => {
    setIndividualOverride((prev) => ({ ...prev, enabled }));
    if (individualDebounceRef.current)
      clearTimeout(individualDebounceRef.current);
    individualDebounceRef.current = setTimeout(() => {
      thresholdService
        .patchLineThreshold(individualBytes, enabled)
        .then(() => show("개인 데이터 임계치가 저장되었습니다."))
        .catch(() => show("저장에 실패했습니다.", "error"));
    }, 1000);
  };

  const familyDisabled = !isOwner;
  const individualControlDisabled = !individualEnabled;

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
              onChange={handleFamilyToggle}
              disabled={familyDisabled}
            />
          </div>

          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center gap-1">
              <input
                type="text"
                inputMode="decimal"
                value={familyGB}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*\.?\d*$/.test(val)) {
                    handleFamilyChange(toBytes(Number(val)));
                  }
                }}
                onBlur={() => {
                  const max = familyMax ?? Infinity;
                  const clamped = Math.min(max, Math.max(familyMin, familyGB));
                  handleFamilyChange(toBytes(clamped));
                }}
                disabled={familyDisabled || !familyEnabled}
                className="w-20 text-center text-2xl font-bold text-gray-800 bg-transparent border-none outline-none focus:bg-white/50 rounded px-1 transition-colors disabled:opacity-50"
              />
              <span className="text-2xl font-bold text-gray-800">GB</span>
            </div>
          </div>

          <RangeSlider
            value={familyGB}
            onChange={(v) => handleFamilyChange(toBytes(v))}
            min={familyMin}
            max={familyMax ?? 1000}
            step={0.1}
            disabled={familyDisabled || !familyEnabled}
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-300">{familyMin}GB</span>
            <span className="text-xs text-gray-300">
              {familyMax === null
                ? "무제한"
                : formatDataLabel(toBytes(familyMax))}
            </span>
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
              onChange={handleIndividualToggle}
            />
          </div>

          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center gap-1">
              <input
                type="text"
                inputMode="decimal"
                value={individualGB}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*\.?\d*$/.test(val)) {
                    handleIndividualChange(toBytes(Number(val)));
                  }
                }}
                onBlur={() => {
                  const max = individualMax ?? Infinity;
                  const clamped = Math.min(
                    max,
                    Math.max(individualMin, individualGB),
                  );
                  handleIndividualChange(toBytes(clamped));
                }}
                disabled={individualControlDisabled}
                className="w-20 text-center text-2xl font-bold text-gray-800 bg-transparent border-none outline-none focus:bg-white/50 rounded px-1 transition-colors disabled:opacity-50"
              />
              <span className="text-2xl font-bold text-gray-800">GB</span>
            </div>
          </div>

          <RangeSlider
            value={individualGB}
            onChange={(v) => handleIndividualChange(toBytes(v))}
            min={individualMin}
            max={individualMax ?? 1000}
            step={0.1}
            disabled={individualControlDisabled}
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-300">{individualMin}GB</span>
            <span className="text-xs text-gray-300">
              {individualMax === null
                ? "무제한"
                : formatDataLabel(toBytes(individualMax))}
            </span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
