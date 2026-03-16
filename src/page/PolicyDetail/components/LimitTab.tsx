import { useQuery } from "@tanstack/react-query";
import SliderCard from "./SliderCard";
import { limitService } from "@/api";

const LimitTab = ({
  lineId,
  onPolicyChange,
}: {
  lineId?: number;
  onPolicyChange?: () => void;
}) => {
  const { data } = useQuery({
    queryKey: ["limits", lineId],
    queryFn: () => limitService.getLimits(lineId!).then((res) => res.data),
    enabled: !!lineId,
  });

  return (
    <div className="flex flex-col gap-3 py-4 text-center text-gray-500">
      <SliderCard
        title="월 공유 데이터 사용량 제한"
        type="shared"
        lineId={lineId}
        limitPolicyId={data?.lineLimitId}
        initialValue={data?.sharedDataLimit}
        initialEnabled={data?.isSharedDataLimitActive ?? false}
        max={data?.maxSharedData ?? 0}
        onPolicyChange={onPolicyChange}
      />
      <SliderCard
        title="하루 총 데이터 사용량 제한"
        type="daily"
        lineId={lineId}
        limitPolicyId={data?.lineLimitId}
        initialValue={data?.dailyDataLimit}
        initialEnabled={data?.isDailyDataLimitActive ?? false}
        max={data?.maxDailyData ?? 0}
        onPolicyChange={onPolicyChange}
      />
    </div>
  );
};

export default LimitTab;
