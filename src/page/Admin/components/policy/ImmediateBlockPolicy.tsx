import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import GlassCard from "@/components/common/GlassCard";
import Toggle from "@/components/common/Toggle";
import { blockService } from "@/api";
import { useToastStore } from "@/store/toastStore";

type Props = {
  lineId: number;
  onPolicyChange?: () => void;
  onApply?: (blockEndAt: string) => void;
};

const PRESETS = [
  { label: "1시간", minutes: 60 },
  { label: "2시간", minutes: 120 },
  { label: "4시간", minutes: 240 },
  { label: "8시간", minutes: 480 },
];

function calcBlockEndAt(minutes: number): string {
  const now = new Date();
  now.setMinutes(now.getMinutes() + minutes);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

function calcEndTimeDisplay(blockEndAt: string | undefined): string {
  if (!blockEndAt) return "--:--";
  const date = new Date(blockEndAt);
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

function isBlockActive(blockEndAt: string | undefined): boolean {
  if (!blockEndAt) return false;
  return new Date(blockEndAt) > new Date();
}

export default function ImmediateBlockPolicy({ lineId, onPolicyChange, onApply }: Props) {
  const queryClient = useQueryClient();
  const [selectedMinutes, setSelectedMinutes] = useState<number>(60);
  const [isDirect, setIsDirect] = useState(false);
  const [directHour, setDirectHour] = useState("");
  const [directMin, setDirectMin] = useState("");
  const [directError, setDirectError] = useState("");
  const [isApplied, setIsApplied] = useState(false);
  const [optimisticEnabled, setOptimisticEnabled] = useState<boolean | null>(null);
  const previewEndTime = calcBlockEndAt(selectedMinutes);
  const { show } = useToastStore();

  // 현재 차단 상태 조회
  const { data } = useQuery({
    queryKey: ["immediateBlock", lineId],
    queryFn: () => blockService.getImmediateBlock(lineId).then((res) => res.data),
    enabled: !!lineId,
  });

  const enabled = optimisticEnabled ?? isBlockActive(data?.blockEndAt);

  // 차단 적용/해제
  const { mutate: patchBlock } = useMutation({
    mutationFn: (blockEndAt: string) =>
      blockService.patchImmediateBlock(lineId, blockEndAt),
    onMutate: (blockEndAt) => {
      setOptimisticEnabled(new Date(blockEndAt) > new Date());
    },
    onSuccess: (_, blockEndAt) => {
      setOptimisticEnabled(null);
      queryClient.invalidateQueries({ queryKey: ["immediateBlock", lineId] });
      
      const isActive = new Date(blockEndAt) > new Date();
      
      // 차단 상태를 부모 컴포넌트에 전달
      onApply?.(blockEndAt);
      
      // 적용중인 정책 목록 새로고침
      onPolicyChange?.();

      if (isActive) {
        show("차단 정책이 적용되었습니다.");
      } else {
        show("차단이 해제되었습니다.");
      }
    },
    onError: () => {
      setOptimisticEnabled(null);
      show("차단 정책 추가에 실패했습니다.", "error");
    },
  });

  const handleToggle = (v: boolean) => {
    if (v) {
      // 켜기 → 선택된 시간만큼 차단
      patchBlock(calcBlockEndAt(selectedMinutes));
    } else {
      // 끄기 → 현재 시간으로 즉시 해제
      patchBlock(new Date().toISOString().slice(0, 19));
    }
  };

  const handlePreset = (minutes: number) => {
    setIsDirect(false);
    setDirectHour("");
    setDirectMin("");
    setDirectError("");
    setIsApplied(false);
    setSelectedMinutes(minutes);
  };

  const handleDirectClick = () => {
    setIsDirect(true);
    setDirectHour("");
    setDirectMin("");
    setDirectError("");
    setIsApplied(false);
  };

  const applyDirectInput = () => {
    const h = parseInt(directHour || "0", 10);
    const m = parseInt(directMin || "0", 10);

    if (isNaN(h) || isNaN(m)) {
      setDirectError("올바른 숫자를 입력해주세요.");
      return;
    }
    if (h === 0 && m === 0) {
      setDirectError("1분 이상 입력해주세요.");
      return;
    }
    if (h > 24 || (h === 24 && m > 0) || m > 59) {
      setDirectError("최대 24시간까지 입력 가능합니다.");
      return;
    }

    const total = h * 60 + m;
    setDirectError("");
    setSelectedMinutes(total);
    setIsApplied(true);
    setTimeout(() => setIsApplied(false), 2000);
  };

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
      <div className="flex items-center justify-between mb-4">
        <span className="text-base font-bold text-gray-800">즉시 차단 정책</span>
        <Toggle checked={enabled} onChange={handleToggle} />
      </div>

      <div
        className="flex items-center rounded-2xl p-1"
        style={{ backgroundColor: "rgba(243,244,246,0.8)" }}
      >
        {PRESETS.map((preset) => (
          <button
            key={preset.minutes}
            onClick={() => handlePreset(preset.minutes)}
            disabled={enabled}
            className="flex-1 py-2.5 text-sm font-semibold transition-all rounded-xl"
            style={{
              color: !isDirect && selectedMinutes === preset.minutes ? "#678BF7" : "#9CA3AF",
              backgroundColor: !isDirect && selectedMinutes === preset.minutes ? "white" : "transparent",
              boxShadow: !isDirect && selectedMinutes === preset.minutes ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
            }}
          >
            {preset.label}
          </button>
        ))}

        {!isDirect && <span className="w-px h-4 bg-gray-200 flex-shrink-0" />}

        <button
          onClick={handleDirectClick}
          disabled={enabled}
          className="flex-1 py-2.5 text-sm font-semibold transition-all rounded-xl"
          style={{
            color: isDirect ? "#678BF7" : "#9CA3AF",
            backgroundColor: isDirect ? "white" : "transparent",
            boxShadow: isDirect ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
          }}
        >
          직접 입력
        </button>
      </div>

      {isDirect && (
        <div className="mt-4 p-4 rounded-2xl" style={{ backgroundColor: "rgba(243,244,246,0.6)" }}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs text-gray-400">시간</span>
              <input
                type="text"
                inputMode="numeric"
                value={directHour}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, "");
                  if (Number(val) <= 24) setDirectHour(val);
                  setDirectError("");
                  setIsApplied(false);
                }}
                placeholder="0"
                maxLength={2}
                className="w-16 h-14 text-center text-2xl font-bold rounded-xl outline-none border transition-colors"
                style={{
                  borderColor: directError ? "#F87171" : "#E5E7EB",
                  backgroundColor: "white",
                  color: "#374151",
                }}
              />
              <span className="text-xs text-gray-400">시</span>
            </div>

            <span className="text-2xl font-bold text-gray-300 mt-4">:</span>

            <div className="flex flex-col items-center gap-1">
              <span className="text-xs text-gray-400">분</span>
              <input
                type="text"
                inputMode="numeric"
                value={directMin}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, "");
                  if (Number(val) <= 59) setDirectMin(val);
                  setDirectError("");
                  setIsApplied(false);
                }}
                placeholder="0"
                maxLength={2}
                className="w-16 h-14 text-center text-2xl font-bold rounded-xl outline-none border transition-colors"
                style={{
                  borderColor: directError ? "#F87171" : "#E5E7EB",
                  backgroundColor: "white",
                  color: "#374151",
                }}
              />
              <span className="text-xs text-gray-400">분</span>
            </div>
          </div>

          {directError && (
            <p className="text-xs text-red-400 text-center mb-3">{directError}</p>
          )}
          {isApplied && !directError && (
            <p className="text-xs text-green-400 text-center mb-3">
              ✓ {directHour || "0"}시간 {directMin || "0"}분이 적용되었습니다.
            </p>
          )}

          <button
            onClick={applyDirectInput}
            className="w-full py-2.5 rounded-full text-sm font-semibold text-white transition-opacity active:opacity-80"
            style={{ backgroundColor: "#678BF7" }}
          >
            적용하기
          </button>
        </div>
      )}

      <p className="text-xs text-gray-400 mt-3">
        {enabled ? `종료 시간: ${calcEndTimeDisplay(previewEndTime)}` : '차단이 비활성화되어 있습니다'}
      </p>
    </GlassCard>
  );
}
