import RangeSlider from "@/components/common/RangeSlider";
import Toggle from "@/components/common/Toggle";
import GlassCard from "@/components/common/GlassCard";
import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { limitService } from "@/api";
import { formatData, formatDataLabel } from "@/utils/dataFormat";
import { useToastStore } from "@/store/toastStore";

type SliderCardProps = {
  title: string;
  type: "shared" | "daily";
  lineId?: number;
  limitPolicyId?: number | null;
  initialValue?: number | null;
  initialEnabled: boolean;
  max: number;
  onPolicyChange?: () => void;
};

export default function SliderCard({
  title,
  type,
  lineId,
  limitPolicyId,
  initialValue,
  initialEnabled,
  max,
  onPolicyChange,
}: SliderCardProps) {
  const { show } = useToastStore();
  const queryClient = useQueryClient();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [override, setOverride] = useState<{
    enabled?: boolean;
    bytes?: number;
  }>({});
  const [prevInitialValue, setPrevInitialValue] = useState(initialValue);
  const [prevInitialEnabled, setPrevInitialEnabled] = useState(initialEnabled);

  if (
    initialValue !== prevInitialValue ||
    initialEnabled !== prevInitialEnabled
  ) {
    setPrevInitialValue(initialValue);
    setPrevInitialEnabled(initialEnabled);
    setOverride({});
  }

  const enabled = override.enabled ?? initialEnabled;
  const bytes = override.bytes ?? initialValue ?? 0;
  const gb = formatData(bytes);
  const maxGb = formatData(max);

  // 토글 mutation (신규 생성 or 활성화/비활성화)
  const { mutate: toggleMutate } = useMutation({
    mutationFn: () =>
      type === "shared"
        ? limitService.patchSharedLimitToggle(lineId!)
        : limitService.patchDailyLimitToggle(lineId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["limits", lineId] });
      show(`${title}이 변경되었습니다.`);
      onPolicyChange?.();
    },
    onError: () => show("변경에 실패했습니다.", "error"),
  });

  // 값 변경 mutation
  const { mutate: patchValue } = useMutation({
    mutationFn: (policyValue: number) =>
      type === "shared"
        ? limitService.patchSharedLimit(limitPolicyId!, policyValue)
        : limitService.patchDailyLimit(limitPolicyId!, policyValue),
    onSuccess: () => {
      show(`${title}이 저장되었습니다.`);
      onPolicyChange?.();
    },
    onError: () => show("저장에 실패했습니다.", "error"),
  });

  const handleToggle = (newEnabled: boolean) => {
    setOverride((prev) => ({ ...prev, enabled: newEnabled }));
    toggleMutate();
  };

  const handleChange = (newBytes: number) => {
    setOverride((prev) => ({ ...prev, bytes: newBytes }));
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (!limitPolicyId) return;
      patchValue(newBytes);
    }, 1000);
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
        <Toggle checked={enabled} onChange={handleToggle} disabled={!lineId} />
      </div>

      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: enabled ? "160px" : "0px",
          opacity: enabled ? 1 : 0,
          marginTop: enabled ? "20px" : "0px",
        }}
      >
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center gap-1">
            <input
              type="text"
              inputMode="decimal"
              value={gb}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d*\.?\d*$/.test(val)) {
                  handleChange(Math.round(Number(val) * 1e9));
                }
              }}
              onBlur={() => {
                const clamped = Math.min(maxGb, Math.max(0, gb));
                handleChange(Math.round(clamped * 1e9));
              }}
              disabled={!enabled}
              className="w-16 text-center text-2xl font-bold text-gray-800 bg-transparent border-none outline-none focus:bg-white/50 rounded px-1 transition-colors disabled:opacity-50"
            />
            <span className="text-2xl font-bold text-gray-800">GB</span>
          </div>
        </div>

        <RangeSlider
          value={gb}
          onChange={(v) => handleChange(Math.round(v * 1e9))}
          min={0}
          max={maxGb}
          step={0.1}
          disabled={!enabled}
        />

        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-300">0GB</span>
          <span className="text-xs text-gray-300">{formatDataLabel(max)}</span>
        </div>
      </div>
    </GlassCard>
  );
}
