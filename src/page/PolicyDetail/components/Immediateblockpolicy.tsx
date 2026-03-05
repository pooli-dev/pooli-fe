import { useState } from "react";
import GlassCard from "../../Main/components/GlassCard";
import Toggle from "@/components/common/Toggle";

type Props = {
  initialEnabled?: boolean;
  onToggle?: (enabled: boolean) => void;
  onDurationChange?: (minutes: number) => void;
};

const PRESETS = [
  { label: "1시간", minutes: 60 },
  { label: "2시간", minutes: 120 },
  { label: "4시간", minutes: 240 },
  { label: "8시간", minutes: 480 },
];

function calcEndTime(minutes: number): string {
  const now = new Date();
  now.setMinutes(now.getMinutes() + minutes);
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

export default function ImmediateBlockPolicy({
  initialEnabled = true,
  onToggle,
  onDurationChange,
}: Props) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [selectedMinutes, setSelectedMinutes] = useState<number>(60);
  const [isDirect, setIsDirect] = useState(false);
  const [directInput, setDirectInput] = useState("");
  const [directError, setDirectError] = useState("");
  const [isApplied, setIsApplied] = useState(false);

  const handleToggle = (v: boolean) => {
    setEnabled(v);
    onToggle?.(v);
  };

  const handlePreset = (minutes: number) => {
    setIsDirect(false);
    setDirectInput("");
    setDirectError("");
    setIsApplied(false);
    setSelectedMinutes(minutes);
    onDurationChange?.(minutes);
  };

  const handleDirectClick = () => {
    setIsDirect(true);
    setDirectInput("");
    setDirectError("");
    setIsApplied(false);
  };

  const handleDirectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setDirectInput(val);
    setDirectError("");
    setIsApplied(false);
  };

  const applyDirectInput = () => {
    const minutes = parseInt(directInput, 10);
    if (!directInput || isNaN(minutes) || minutes <= 0) {
      setDirectError("1분 이상 입력해주세요.");
      setIsApplied(false);
      return;
    }
    if (minutes > 1440) {
      setDirectError("최대 1440분(24시간)까지 입력 가능합니다.");
      setIsApplied(false);
      return;
    }
    setDirectError("");
    setSelectedMinutes(minutes);
    onDurationChange?.(minutes);
    setIsApplied(true);
    setTimeout(() => setIsApplied(false), 2000);
  };

  const handleDirectKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") applyDirectInput();
  };

  const endTime = calcEndTime(selectedMinutes);

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
        <span className="text-base font-bold text-gray-800">
          즉시 차단 정책
        </span>
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
            className="flex-1 py-2.5 text-sm font-semibold transition-all rounded-xl"
            style={{
              color:
                !isDirect && selectedMinutes === preset.minutes
                  ? "#678BF7"
                  : "#9CA3AF",
              backgroundColor:
                !isDirect && selectedMinutes === preset.minutes
                  ? "white"
                  : "transparent",
              boxShadow:
                !isDirect && selectedMinutes === preset.minutes
                  ? "0 1px 4px rgba(0,0,0,0.08)"
                  : "none",
            }}
          >
            {preset.label}
          </button>
        ))}

        {!isDirect && <span className="w-px h-4 bg-gray-200 flex-shrink-0" />}

        <button
          onClick={handleDirectClick}
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
        <div className="mt-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              inputMode="numeric"
              value={directInput}
              onChange={handleDirectChange}
              onBlur={applyDirectInput}
              onKeyDown={handleDirectKeyDown}
              placeholder="분 단위로 입력 (예: 90)"
              className="flex-1 px-4 py-2.5 rounded-xl text-sm text-gray-700 outline-none border transition-colors"
              style={{
                borderColor: directError
                  ? "#F87171"
                  : isApplied
                    ? "#34D399"
                    : "#E5E7EB",
                backgroundColor: "rgba(255,255,255,0.9)",
              }}
              autoFocus
            />
            <span className="text-sm text-gray-400 flex-shrink-0">분</span>
          </div>
          {directError && (
            <p className="text-xs text-red-400 mt-1">{directError}</p>
          )}
          {isApplied && !directError && (
            <p className="text-xs text-green-400 mt-1">
              ✓ {directInput}분이 적용되었습니다.
            </p>
          )}
        </div>
      )}

      <p className="text-xs text-gray-400 mt-3">종료 시간: {endTime}</p>
    </GlassCard>
  );
}
