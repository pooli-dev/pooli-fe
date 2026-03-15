import { useState, useEffect } from "react";
import GlassCard from "@/components/common/GlassCard";
import Toggle from "@/components/common/Toggle";
import { blockService } from "@/api";
import { getErrorMessage } from "@/api/client";

type Props = {
  lineId: number;
  onPolicyChange?: () => void;
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

export default function ImmediateBlockPolicy({ lineId, onPolicyChange }: Props) {
  const [enabled, setEnabled] = useState(false);
  const [selectedMinutes, setSelectedMinutes] = useState<number>(60);
  const [isDirect, setIsDirect] = useState(false);
  const [directHour, setDirectHour] = useState("");
  const [directMin, setDirectMin] = useState("");
  const [directError, setDirectError] = useState("");
  const [isApplied, setIsApplied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadImmediateBlock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineId]);

  const loadImmediateBlock = async () => {
    setLoading(true);
    try {
      const res = await blockService.getImmediateBlock(lineId);
      console.log('즉시 차단 조회 성공:', res.data);
      if (res.data && res.data.blockEndAt) {
        const endTime = new Date(res.data.blockEndAt);
        const now = new Date();
        if (endTime > now) {
          setEnabled(true);
          const diffMinutes = Math.floor((endTime.getTime() - now.getTime()) / 60000);
          setSelectedMinutes(diffMinutes);
        } else {
          setEnabled(false);
        }
      } else {
        setEnabled(false);
      }
    } catch (err) {
      console.error('즉시 차단 조회 실패:', err);
      setEnabled(false);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (v: boolean) => {
    // 낙관적 업데이트: UI 먼저 변경
    const prevEnabled = enabled;
    setEnabled(v);
    
    try {
      if (v) {
        // 차단 활성화
        const endAt = new Date(Date.now() + selectedMinutes * 60 * 1000).toISOString();
        console.log('즉시 차단 활성화 요청:', { lineId, blockEndAt: endAt });
        await blockService.updateImmediateBlock(lineId, endAt);
        console.log('즉시 차단 활성화 성공');
      } else {
        // 차단 해제
        const pastTime = new Date(Date.now() - 1000).toISOString();
        console.log('즉시 차단 해제 요청:', { lineId, blockEndAt: pastTime });
        await blockService.updateImmediateBlock(lineId, pastTime);
        console.log('즉시 차단 해제 성공');
      }
      onPolicyChange?.();
    } catch (err) {
      // 실패 시 원래 상태로 복구
      console.error('즉시 차단 토글 실패:', err);
      setEnabled(prevEnabled);
      alert(getErrorMessage(err));
    }
  };

  const handlePreset = async (minutes: number) => {
    console.log('프리셋 선택:', { minutes, enabled });
    // UI 먼저 업데이트
    const prevMinutes = selectedMinutes;
    setIsDirect(false);
    setDirectHour("");
    setDirectMin("");
    setDirectError("");
    setIsApplied(false);
    setSelectedMinutes(minutes);
    
    if (enabled) {
      try {
        const endAt = new Date(Date.now() + minutes * 60 * 1000).toISOString();
        console.log('프리셋 적용 API 호출:', { lineId, blockEndAt: endAt });
        await blockService.updateImmediateBlock(lineId, endAt);
        console.log('프리셋 적용 성공');
        onPolicyChange?.();
      } catch (err) {
        // 실패 시 원래 값으로 복구
        console.error('프리셋 적용 실패:', err);
        setSelectedMinutes(prevMinutes);
        alert(getErrorMessage(err));
      }
    }
  };

  const handleDirectClick = () => {
    setIsDirect(true);
    setDirectHour("");
    setDirectMin("");
    setDirectError("");
    setIsApplied(false);
  };

  const applyDirectInput = async () => {
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
    const prevMinutes = selectedMinutes;
    
    console.log('직접 입력 적용:', { hour: h, min: m, total, enabled });
    
    // UI 먼저 업데이트
    setDirectError("");
    setSelectedMinutes(total);
    setIsApplied(true);
    setTimeout(() => setIsApplied(false), 2000);

    if (enabled) {
      try {
        const endAt = new Date(Date.now() + total * 60 * 1000).toISOString();
        console.log('직접 입력 API 호출:', { lineId, blockEndAt: endAt });
        await blockService.updateImmediateBlock(lineId, endAt);
        console.log('직접 입력 적용 성공');
        onPolicyChange?.();
      } catch (err) {
        // 실패 시 원래 값으로 복구
        console.error('직접 입력 적용 실패:', err);
        setSelectedMinutes(prevMinutes);
        setIsApplied(false);
        alert(getErrorMessage(err));
      }
    }
  };

  if (loading) {
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
        <div className="text-center py-4 text-gray-400">불러오는 중...</div>
      </GlassCard>
    );
  }

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
        {enabled ? `종료 시간: ${endTime}` : '차단이 비활성화되어 있습니다'}
      </p>
    </GlassCard>
  );
}
