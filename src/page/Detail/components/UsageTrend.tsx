import GlassCard from "@/components/common/GlassCard";
import Slider from "@/components/common/Slider";

interface UsageTrendProps {
  usages: Array<{
    yearMonth: string;
    usedAmount: number;
  }>;
  averageAmount: number;
}

export default function UsageTrend({ usages, averageAmount }: UsageTrendProps) {
  // usages가 배열이 아니면 빈 배열로 처리
  const safeUsages = Array.isArray(usages) ? usages : [];
  
  // 날짜순으로 정렬 (오래된 것부터)
  const sortedUsages = [...safeUsages].sort((a, b) => {
    return a.yearMonth.localeCompare(b.yearMonth);
  });
  
  // 모든 사용량 중 최대값 찾기 (평균 포함)
  const allAmounts = [...sortedUsages.map(u => u.usedAmount), averageAmount];
  const maxAmount = Math.max(...allAmounts);
  
  // 그래프 범위를 최대값의 120%로 설정 (여유 공간 확보)
  const chartMaxAmount = maxAmount * 1.2;

  const chartData = sortedUsages.map((usage, index) => {
    // yearMonth 형식: "2026-03" 또는 "202603" 모두 처리
    let month: number;
    if (usage.yearMonth.includes('-')) {
      // "2026-03" 형식
      const parts = usage.yearMonth.split('-');
      month = parseInt(parts[1], 10);
    } else {
      // "202603" 형식
      month = parseInt(usage.yearMonth.slice(4, 6), 10);
    }
    
    const gbValue = usage.usedAmount / (1024 * 1024 * 1024);
    // 최대값 기준으로 퍼센트 계산
    const percentage = chartMaxAmount > 0 ? (usage.usedAmount / chartMaxAmount) * 100 : 0;

    return {
      label: `${month}월`,
      value: percentage,
      gb: parseFloat(gbValue.toFixed(2)),
      isCurrent: index === sortedUsages.length - 1, // 마지막(최신)이 현재 달
    };
  });

  // 평균 추가 (맨 오른쪽)
  const avgGb = averageAmount / (1024 * 1024 * 1024);
  const avgPercentage = chartMaxAmount > 0 ? (averageAmount / chartMaxAmount) * 100 : 0;
  
  chartData.push({
    label: "평균",
    value: avgPercentage,
    gb: parseFloat(avgGb.toFixed(2)),
    isCurrent: false,
  });

  return (
    <GlassCard
      title="최근 3개월간 사용량 추이"
      gradientFrom="#FFFFFF"
      gradientTo="#CCCCCC"
      bgGradientFrom="#FFFFFF"
      bgGradientTo="#F8F8F8"
      bgOpacity={0.7}
      borderWidth={1}
      borderRadius={20}
      className="w-full"
    >
      <Slider data={chartData} height={200} color="#678BF7" animated={true} />
    </GlassCard>
  );
}
