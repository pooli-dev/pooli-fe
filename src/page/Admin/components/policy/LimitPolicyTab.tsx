import { useState, useEffect, useRef } from 'react';
import { blockService, thresholdService } from '@/api';
import type { AppliedPoliciesResponse } from '@/api/services/blockService';
import { getErrorMessage } from '@/api/client';
import Toggle from '@/components/common/Toggle';
import RangeSlider from '@/components/common/RangeSlider';
import GlassCard from '@/components/common/GlassCard';

function SliderCard({
  title,
  label,
  min,
  max,
  enabled,
  value,
  inputValue,
  onToggle,
  onInputChange,
  onInputBlur,
  onSliderChange,
}: {
  title: string;
  label: string;
  min: number;
  max: number;
  enabled: boolean;
  value: number;
  inputValue: string;
  onToggle: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInputBlur: () => void;
  onSliderChange: (newValue: number) => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);

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
        <Toggle checked={enabled} onChange={onToggle} />
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
              onChange={onInputChange}
              onBlur={onInputBlur}
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
          onChange={onSliderChange}
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

export default function LimitPolicyTab({ lineId }: { lineId: number }) {
  const [loading, setLoading] = useState(true);
  const [policies, setPolicies] = useState<AppliedPoliciesResponse | null>(null);
  
  // 일일 데이터 제한
  const [dailyEnabled, setDailyEnabled] = useState(false);
  const [dailyLimit, setDailyLimit] = useState(1);
  const [dailyInput, setDailyInput] = useState('1.0');
  
  // 공유풀 데이터 제한
  const [sharedEnabled, setSharedEnabled] = useState(false);
  const [sharedLimit, setSharedLimit] = useState(1);
  const [sharedInput, setSharedInput] = useState('1.0');

  useEffect(() => {
    loadPolicies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineId]);

  const loadPolicies = async () => {
    setLoading(true);
    try {
      const res = await blockService.getAppliedPolicies(lineId);
      console.log('제한 정책:', res.data.limitPolicy);
      setPolicies(res.data);
      
      if (res.data.limitPolicy) {
        const { dailyDataLimit, isDailyDataLimitActive, sharedDataLimit, isSharedDataLimitActive } = res.data.limitPolicy;
        
        // 일일 제한 (byte → GB)
        const dailyGB = Math.max(0, dailyDataLimit / (1024 * 1024 * 1024));
        setDailyEnabled(isDailyDataLimitActive);
        setDailyLimit(dailyGB);
        setDailyInput(dailyGB.toFixed(1));
        
        // 공유풀 제한 (byte → GB)
        const sharedGB = Math.max(0, sharedDataLimit / (1024 * 1024 * 1024));
        setSharedEnabled(isSharedDataLimitActive);
        setSharedLimit(sharedGB);
        setSharedInput(sharedGB.toFixed(1));
      }
    } catch (err) {
      console.error('정책 조회 실패:', err);
      alert(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDailyToggle = async () => {
    try {
      await thresholdService.toggleDailyLimit(lineId);
      setDailyEnabled(!dailyEnabled);
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const handleDailyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setDailyInput(newValue);
    const numValue = parseFloat(newValue) || 0;
    setDailyLimit(Math.min(Math.max(numValue, 0.1), 100));
  };

  const handleDailyInputBlur = () => {
    setDailyInput(dailyLimit.toFixed(1));
    handleDailyLimitChange(dailyLimit);
  };

  const handleDailySliderChange = (newValue: number) => {
    setDailyLimit(newValue);
    setDailyInput(newValue.toFixed(1));
  };

  const handleDailyLimitChange = async (gb: number) => {
    const safeGb = Math.max(0, gb);
    try {
      const bytes = Math.round(safeGb * 1024 * 1024 * 1024);
      await thresholdService.updateDailyLimit(lineId, bytes);
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const handleSharedToggle = async () => {
    try {
      await thresholdService.toggleSharedLimit(lineId);
      setSharedEnabled(!sharedEnabled);
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const handleSharedInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSharedInput(newValue);
    const numValue = parseFloat(newValue) || 0;
    setSharedLimit(Math.min(Math.max(numValue, 0.1), 100));
  };

  const handleSharedInputBlur = () => {
    setSharedInput(sharedLimit.toFixed(1));
    handleSharedLimitChange(sharedLimit);
  };

  const handleSharedSliderChange = (newValue: number) => {
    setSharedLimit(newValue);
    setSharedInput(newValue.toFixed(1));
  };

  const handleSharedLimitChange = async (gb: number) => {
    const safeGb = Math.max(0, gb);
    try {
      const bytes = Math.round(safeGb * 1024 * 1024 * 1024);
      await thresholdService.updateSharedLimit(lineId, bytes);
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-400">불러오는 중...</div>;
  }

  if (!policies?.limitPolicy) {
    return <div className="text-center py-8 text-gray-400">제한 정책이 없습니다</div>;
  }

  return (
    <div className="flex flex-col gap-3 px-4 py-4">
      <SliderCard
        title="월 공유 데이터 사용량 제한"
        label="가족 공유 데이터 임계치"
        min={0.1}
        max={100}
        enabled={sharedEnabled}
        value={sharedLimit}
        inputValue={sharedInput}
        onToggle={handleSharedToggle}
        onInputChange={handleSharedInputChange}
        onInputBlur={handleSharedInputBlur}
        onSliderChange={handleSharedSliderChange}
      />
      <SliderCard
        title="하루 총 데이터 사용량 제한"
        label="일일 데이터 사용 한도"
        min={0.1}
        max={100}
        enabled={dailyEnabled}
        value={dailyLimit}
        inputValue={dailyInput}
        onToggle={handleDailyToggle}
        onInputChange={handleDailyInputChange}
        onInputBlur={handleDailyInputBlur}
        onSliderChange={handleDailySliderChange}
      />
    </div>
  );
}
