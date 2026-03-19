import GlassCard from "@/components/common/GlassCard";
import Slider from "@/components/common/Slider";

interface UsageTrendProps {
  usages: Array<{
    yearMonth: string;
    usedAmount: number;
  }>;
  averageAmount: number;
  currentYearMonth?: string; // "202603" 형식
}

function parseYearMonth(ym: string): { year: number; month: number } {
  if (ym.includes('-')) {
    const [y, m] = ym.split('-');
    return { year: parseInt(y, 10), month: parseInt(m, 10) };
  }
  return { year: parseInt(ym.slice(0, 4), 10), month: parseInt(ym.slice(4, 6), 10) };
}

function formatYM(year: number, month: number): string {
  return `${year}${String(month).padStart(2, '0')}`;
}

export default function UsageTrend({ usages, averageAmount, currentYearMonth }: UsageTrendProps) {
  const safeUsages = Array.isArray(usages) ? usages : [];

  // 현재 달 기준으로 최근 3개월 슬롯 생성
  const now = currentYearMonth ? parseYearMonth(currentYearMonth) : { year: new Date().getFullYear(), month: new Date().getMonth() + 1 };
  
  const threeMonths: Array<{ yearMonth: string; year: number; month: number }> = [];
  for (let i = 2; i >= 0; i--) {
    let m = now.month - i;
    let y = now.year;
    if (m <= 0) { m += 12; y -= 1; }
    threeMonths.push({ yearMonth: formatYM(y, m), year: y, month: m });
  }

  // API 응답을 맵으로 변환
  const usageMap = new Map<string, number>();
  safeUsages.forEach(u => {
    // 키 정규화
    const { year, month } = parseYearMonth(u.yearMonth);
    usageMap.set(formatYM(year, month), u.usedAmount);
  });

  // 3개월 슬롯에 데이터 매핑
  const filledUsages = threeMonths.map(slot => ({
    month: slot.month,
    usedAmount: usageMap.get(slot.yearMonth) ?? -1, // -1 = 데이터 없음
  }));

  // 유효한 사용량만으로 최대값 계산
  const validAmounts = filledUsages.filter(u => u.usedAmount > 0).map(u => u.usedAmount);
  const allAmounts = [...validAmounts, averageAmount].filter(v => v > 0);
  const maxAmount = allAmounts.length > 0 ? Math.max(...allAmounts) : 1;
  const chartMaxAmount = maxAmount * 1.2;

  const chartData = filledUsages.map((usage, index) => {
    const hasData = usage.usedAmount > 0;
    const percentage = hasData && chartMaxAmount > 0 ? (usage.usedAmount / chartMaxAmount) * 100 : 0;

    return {
      label: `${usage.month}월`,
      value: percentage,
      gb: hasData ? usage.usedAmount : -1, // -1이면 데이터 없음
      isCurrent: index === filledUsages.length - 1,
    };
  });

  // 평균 추가
  const avgPercentage = chartMaxAmount > 0 ? (averageAmount / chartMaxAmount) * 100 : 0;
  chartData.push({
    label: "평균",
    value: avgPercentage,
    gb: averageAmount,
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
