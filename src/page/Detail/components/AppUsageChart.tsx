import { useState, useRef, useEffect } from "react";
import { formatDataLabel } from "@/utils/dataFormat";
import Toggle from "@/components/common/Toggle";
import GlassCard from "@/components/common/GlassCard";

interface AppUsage {
  appName: string;
  usedAmount: number;
}

interface AppUsageChartProps {
  apps: AppUsage[];
  totalUsedAmount: number;
  isPublic: boolean;
  onPublicToggle: (value: boolean) => void;
}

const appNameMap: Record<string, string> = {
  YouTube: "유튜브",
  Instagram: "인스타그램",
  KakaoTalk: "카카오톡",
  Naver: "네이버",
};

const defaultColors = [
  "#B6DF82",
  "#CAA6DB",
  "#FBC7C3",
  "#FFA780",
  "#A8D8EA",
  "#FFD3B6",
  "#D4A5A5",
  "#B5EAD7",
  "#C7CEEA",
  "#FFDAC1",
];

const appColorMap: Record<string, string> = {
  YouTube: "#B6DF82",
  Instagram: "#CAA6DB",
  KakaoTalk: "#FBC7C3",
  Naver: "#FFA780",
};

const getAppColor = (appName: string, index: number) =>
  appColorMap[appName] || defaultColors[index % defaultColors.length];

export default function AppUsageChart({
  apps,
  totalUsedAmount,
  isPublic,
  onPublicToggle,
}: AppUsageChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // apps가 null이거나 undefined일 경우 빈 배열로 처리
  const safeApps = apps || [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setAnimated(true);
        });
      },
      { threshold: 0.2 },
    );
    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  const radius = 96;
  const circumference = 2 * Math.PI * radius;

  return (
    <div ref={ref}>
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
        <div className="flex items-center justify-between mb-4">
          <h3
            className="font-semibold text-[#333333]"
            style={{ fontSize: "1.125em" }}
          >
            앱 서비스별 사용량
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[#666666]" style={{ fontSize: "0.875em" }}>
              가족 공개
            </span>
            <div className="scale-90">
              <Toggle
                checked={isPublic}
                onChange={onPublicToggle}
                aria-label="가족 공개"
              />
            </div>
          </div>
        </div>

        <div className="relative">
          {!isPublic && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                className="mb-2"
              >
                <rect
                  x="3"
                  y="11"
                  width="18"
                  height="11"
                  rx="2"
                  stroke="#999999"
                  strokeWidth="2"
                />
                <path
                  d="M7 11V7a5 5 0 0 1 10 0v4"
                  stroke="#999999"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-[#999999] font-medium">
                비공개 상태입니다
              </span>
            </div>
          )}

          <div className={!isPublic ? "filter blur-md" : ""}>
            {/* 데이터가 없을 때 메시지 표시 */}
            {safeApps.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="mb-4 opacity-30"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="#999999"
                    strokeWidth="2"
                  />
                  <path
                    d="M12 8v4M12 16h.01"
                    stroke="#999999"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="text-[#999999] text-center">
                  데이터를 사용한 앱이 없습니다
                </span>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center mb-8">
                  <div
                    className="relative w-64 h-64"
                    style={{
                      filter: "drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1))",
                    }}
                  >
                    {hoveredIndex !== null && safeApps[hoveredIndex] && (
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#333333] text-white px-3 py-1.5 rounded text-sm font-medium z-30 whitespace-nowrap">
                        {appNameMap[safeApps[hoveredIndex].appName] ||
                          safeApps[hoveredIndex].appName}
                        :{" "}
                        {formatDataLabel(
                          safeApps[hoveredIndex].usedAmount || 0,
                        )}
                        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#333333]"></div>
                      </div>
                    )}

                    <svg
                      className="w-full h-full -rotate-90"
                      viewBox="0 0 256 256"
                    >
                      {totalUsedAmount > 0 &&
                        safeApps.map((app, index) => {
                          const percentage = app.usedAmount / totalUsedAmount;
                          const dashArray = circumference * percentage;
                          const dashOffset = -safeApps
                            .slice(0, index)
                            .reduce(
                              (sum, a) =>
                                sum +
                                (a.usedAmount / totalUsedAmount) *
                                  circumference,
                              0,
                            );
                          const color = getAppColor(app.appName, index);

                          return (
                            <circle
                              key={index}
                              cx="128"
                              cy="128"
                              r={radius}
                              fill="none"
                              stroke={color}
                              strokeWidth="32"
                              strokeDasharray={`${dashArray} ${circumference}`}
                              strokeDashoffset={
                                animated ? dashOffset : -circumference
                              }
                              className="transition-all duration-1000 ease-out cursor-pointer hover:opacity-80"
                              style={{
                                transitionDelay: `${index * 200}ms`,
                                pointerEvents: "stroke",
                              }}
                              onMouseEnter={() => setHoveredIndex(index)}
                              onMouseLeave={() => setHoveredIndex(null)}
                            />
                          );
                        })}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span
                        className="text-[#999999]"
                        style={{ fontSize: "0.875em" }}
                      >
                        총합
                      </span>
                      <span className="text-[#333333] font-bold text-3xl">
                        {formatDataLabel(totalUsedAmount || 0)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 px-6">
                  {safeApps.map((app, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: getAppColor(app.appName, index),
                          }}
                        ></div>
                        <span
                          className="text-[#333333]"
                          style={{ fontSize: "1em" }}
                        >
                          {appNameMap[app.appName] || app.appName}
                        </span>
                      </div>
                      <span
                        className="text-[#666666]"
                        style={{ fontSize: "1em" }}
                      >
                        {formatDataLabel(app.usedAmount || 0)}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
