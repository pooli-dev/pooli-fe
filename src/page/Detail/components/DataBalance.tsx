import { useEffect, useRef, useState } from "react";
import GlassCard from "@/components/common/GlassCard";
import { formatDataLabel } from "@/utils/dataFormat";

interface DataBalanceProps {
  personalUsed: number;
  personalTotal: number | null;
  sharedUsed: number;
  sharedTotal: number | null;
}

export default function DataBalance({
  personalUsed,
  personalTotal,
  sharedUsed,
  sharedTotal,
}: DataBalanceProps) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimated(true);
          }
        });
      },
      { threshold: 0.2 },
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const isUnlimitedPersonal = personalTotal !== null && personalTotal < 0;
  const isUnlimitedShared = sharedTotal !== null && sharedTotal < 0;

  // null 처리: null이면 50GB 기준으로 표시 (이전 달)
  const REFERENCE_GB = 50 * 1024 * 1024 * 1024; // 50GB in bytes

  const safePersonalTotal = personalTotal ?? REFERENCE_GB;
  const safeSharedTotal = sharedTotal ?? REFERENCE_GB;

  // 퍼센트 계산: null이면 50GB 기준, 무제한이면 100%, 아니면 사용량/총량
  const personalPercentage =
    personalTotal === null
      ? Math.min((personalUsed / REFERENCE_GB) * 100, 100)
      : isUnlimitedPersonal
        ? 100
        : safePersonalTotal > 0
          ? (personalUsed / safePersonalTotal) * 100
          : 0;

  const sharedPercentage =
    sharedTotal === null
      ? Math.min((sharedUsed / REFERENCE_GB) * 100, 100)
      : isUnlimitedShared
        ? 100
        : safeSharedTotal > 0
          ? (sharedUsed / safeSharedTotal) * 100
          : 0;

  const formatGB = (bytes: number | null) => {
    if (bytes === null || bytes < 0) return "무제한";
    return formatDataLabel(bytes);
  };

  return (
    <div ref={ref}>
      <GlassCard
        title="데이터 사용량"
        gradientFrom="#FFFFFF"
        gradientTo="#CCCCCC"
        bgGradientFrom="#FFFFFF"
        bgGradientTo="#F8F8F8"
        bgOpacity={0.7}
        borderWidth={1}
        borderRadius={20}
        className="w-full"
      >
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[#666666]" style={{ fontSize: "0.875em" }}>
              기본 데이터
            </span>
            <span className="text-[#666666]" style={{ fontSize: "0.875em" }}>
              {isUnlimitedPersonal
                ? `${formatGB(personalUsed)} 사용 / 무제한`
                : personalTotal === null
                  ? `${formatGB(personalUsed)} 사용`
                  : `${formatGB(personalUsed)} / ${formatGB(personalTotal)}`}
            </span>
          </div>
          <div
            className="w-full h-3 rounded-full overflow-hidden relative"
            style={{ background: "#EDEDED" }}
          >
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: animated
                  ? `${Math.min(personalPercentage, 100)}%`
                  : "0%",
                background:
                  "linear-gradient(to right, rgba(33, 155, 228, 0.4) 0%, rgba(33, 155, 228, 0.6) 50%, rgba(33, 155, 228, 1) 100%)",
                boxShadow: "0 2px 4px rgba(33, 155, 228, 0.3)",
              }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[#666666]" style={{ fontSize: "0.875em" }}>
              공유 데이터
            </span>
            <span className="text-[#666666]" style={{ fontSize: "0.875em" }}>
              {isUnlimitedShared
                ? `${formatGB(sharedUsed)} 사용 / 무제한`
                : sharedTotal === null
                  ? `${formatGB(sharedUsed)} 사용`
                  : `${formatGB(sharedUsed)} / ${formatGB(sharedTotal)}`}
            </span>
          </div>
          <div
            className="w-full h-3 rounded-full overflow-hidden relative"
            style={{ background: "#EDEDED" }}
          >
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: animated ? `${Math.min(sharedPercentage, 100)}%` : "0%",
                background:
                  "linear-gradient(to right, #FFB84D 0%, #F4E87C 50%, #A8E063 100%)",
                boxShadow: "0 2px 4px rgba(168, 224, 99, 0.3)",
              }}
            ></div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
