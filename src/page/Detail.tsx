import { useState, useEffect, useRef } from "react";
import Slider from "../components/common/Slider";
import Toggle from "../components/common/Toggle";
import PolicyScroll from "../components/common/PolicyScroll";
import GlassCard from "@/components/common/GlassCard";

// API 응답 타입 정의
interface DataBalanceResponse {
  userName: string;
  sharedDataRemaining: number; // MB 단위
  personalDataRemaining: number; // MB 단위
  planName: string;
  personalDataTotal: number; // MB 단위 (기본 데이터 한도)
  sharedDataTotal: number; // MB 단위 (공유 데이터 한도)
}

interface AppUsageResponse {
  isPublic: boolean;
  totalUsedAmount: number; // MB 단위
  apps: Array<{
    appName: string;
    usedAmount: number; // MB 단위
  }>;
}

// 더미 데이터
const dummyDataBalance: DataBalanceResponse = {
  userName: "홍길동",
  sharedDataRemaining: 1600, // 1.6GB
  personalDataRemaining: 5000, // 5GB
  planName: "5G 프리미엄",
  personalDataTotal: 5000, // 5GB
  sharedDataTotal: 5000, // 5GB
};

const dummyAppUsage: AppUsageResponse = {
  isPublic: true,
  totalUsedAmount: 5200,
  apps: [
    { appName: "YouTube", usedAmount: 2100 },
    { appName: "Instagram", usedAmount: 1500 },
    { appName: "KakaoTalk", usedAmount: 800 },
    { appName: "Naver", usedAmount: 800 },
  ],
};

// 앱 이름 한글 매핑
const appNameMap: { [key: string]: string } = {
  YouTube: "유튜브",
  Instagram: "인스타그램",
  KakaoTalk: "카카오톡",
  Naver: "네이버",
};

// 앱별 색상 매핑 (6개 이상 대응)
const appColorMap: { [key: string]: string } = {
  YouTube: "#B6DF82",
  Instagram: "#CAA6DB",
  KakaoTalk: "#FBC7C3",
  Naver: "#FFA780",
};

// 기본 색상 팔레트 (6개 이상일 경우 사용)
const defaultColors = [
  "#B6DF82", // 연한 초록
  "#CAA6DB", // 연한 보라
  "#FBC7C3", // 연한 핑크
  "#FFA780", // 연한 주황
  "#A8D8EA", // 연한 하늘색
  "#FFD3B6", // 연한 복숭아
  "#D4A5A5", // 연한 로즈
  "#B5EAD7", // 연한 민트
  "#C7CEEA", // 연한 라벤더
  "#FFDAC1", // 연한 살구
];

/**
 * 앱 색상을 가져오는 함수
 * @param appName - 앱 이름
 * @param index - 앱 인덱스
 * @returns 앱에 해당하는 색상 코드
 */
const getAppColor = (appName: string, index: number): string => {
  return appColorMap[appName] || defaultColors[index % defaultColors.length];
};

/**
 * 상세 페이지 컴포넌트
 * 데이터 사용량, 정책, 앱별 사용량 등을 표시합니다.
 * @returns 상세 페이지 JSX
 */
export default function Detail() {
  const today = new Date();
  const currentMonthLimit = new Date(today.getFullYear(), today.getMonth());

  const [currentDate, setCurrentDate] = useState(currentMonthLimit);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isFamilyPublic, setIsFamilyPublic] = useState(dummyAppUsage.isPublic);
  const [dataAnimated, setDataAnimated] = useState(false);
  const [chartAnimated, setChartAnimated] = useState(false);
  const [hoveredAppIndex, setHoveredAppIndex] = useState<number | null>(null);
  const dataRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  // API 데이터 상태 (현재는 더미 데이터 사용)
  const [dataBalance] = useState<DataBalanceResponse>(dummyDataBalance);
  const [appUsage] = useState<AppUsageResponse>(dummyAppUsage);

  // Intersection Observer로 애니메이션 트리거
  useEffect(() => {
    const dataObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setDataAnimated(true);
          }
        });
      },
      { threshold: 0.2 },
    );

    const chartObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setChartAnimated(true);
          }
        });
      },
      { threshold: 0.2 },
    );

    const currentDataRef = dataRef.current;
    const currentChartRef = chartRef.current;

    if (currentDataRef) dataObserver.observe(currentDataRef);
    if (currentChartRef) chartObserver.observe(currentChartRef);

    return () => {
      if (currentDataRef) dataObserver.unobserve(currentDataRef);
      if (currentChartRef) chartObserver.unobserve(currentChartRef);
    };
  }, []);

  /**
   * 월별 사용량 데이터를 차트 데이터로 변환
   * @returns 차트에 표시할 사용량 데이터 배열
   */
  const getUsageData = () => {
    const month = currentDate.getMonth(); // 0-11
    const year = currentDate.getFullYear();

    // 더미 데이터 (실제로는 API에서 가져올 데이터)
    const dummyData: { [key: string]: number } = {
      "2024-1": 3000,
      "2024-2": 3200,
      "2024-3": 2800,
      "2024-4": 3500,
      "2024-5": 3100,
      "2024-6": 3300,
      "2024-7": 2900,
      "2024-8": 3400,
      "2024-9": 3600,
      "2024-10": 3200,
      "2024-11": 3800,
      "2024-12": 3500,
      "2025-1": 3700,
      "2025-2": 3900,
      "2025-3": 3300,
      "2025-4": 3600,
      "2025-5": 3400,
      "2025-6": 3800,
      "2025-7": 3200,
      "2025-8": 3500,
      "2025-9": 3700,
      "2025-10": 3300,
      "2025-11": 4000,
      "2025-12": 3000,
      "2026-1": 3800,
      "2026-2": 4200,
    };

    const months = [];
    // 현재 선택된 달 기준으로 이전 2개월 포함 총 3개월
    for (let i = 2; i >= 0; i--) {
      const date = new Date(year, month - i);
      const monthNum = date.getMonth() + 1;
      const yearNum = date.getFullYear();
      const key = `${yearNum}-${monthNum}`;
      const mbValue = dummyData[key] ?? 3000;
      const gbValue = mbValue / 1000;

      months.push({
        label: `${monthNum}월`,
        value: (gbValue / (dataBalance.personalDataTotal / 1000)) * 100, // 플랜 한도 기준으로 퍼센트 계산
        gb: parseFloat(gbValue.toFixed(2)),
        isCurrent: i === 0,
      });
    }

    // 평균 계산
    const avgGb = months.reduce((sum, m) => sum + m.gb, 0) / months.length;
    months.push({
      label: "평균",
      value: (avgGb / (dataBalance.personalDataTotal / 1000)) * 100,
      gb: parseFloat(avgGb.toFixed(2)),
      isCurrent: false,
    });

    return months;
  };

  const usageData = getUsageData();

  /**
   * 이전 달로 이동
   */
  const handlePrevMonth = () => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
    );
    // 2024년 1월보다 이전으로 갈 수 없음
    if (newDate.getFullYear() < 2024) {
      return;
    }
    setCurrentDate(newDate);
  };

  /**
   * 다음 달로 이동 (현재 달까지만 가능)
   */
  const handleNextMonth = () => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
    );
    // 현재 달보다 미래로 갈 수 없음
    if (newDate > currentMonthLimit) {
      return;
    }
    setCurrentDate(newDate);
  };

  /**
   * 날짜 선택 핸들러
   * @param year - 선택한 연도
   * @param month - 선택한 월 (0-11)
   */
  const handleDateSelect = (year: number, month: number) => {
    setCurrentDate(new Date(year, month));
    setShowDatePicker(false);
  };

  // 더미 데이터
  const policies = [
    {
      id: 1,
      type: "한도",
      bgColor: "#FFE5E5",
      title: "공유 데이터 한도 1GB로 제한",
    },
    {
      id: 2,
      type: "시간",
      bgColor: "#E5E5FF",
      title: "10:00 ~ 12:00 데이터 사용 제한",
    },
    {
      id: 3,
      type: "앱",
      bgColor: "#E5F5E5",
      title: "SNS 앱 사용 제한",
    },
  ];

  return (
    <div className="relative h-[calc(100dvh-106px-60px)] overflow-y-auto mt-[106px] mb-[60px]">
      <div className="flex flex-col gap-3 px-[24px] py-5 pb-[60px]">
        {/* 현재 적용중인 정책 */}
        <PolicyScroll policies={policies} title="현재 적용중인 정책" />

        {/* 날짜 선택 */}
        <div className="flex items-center justify-center gap-4 mb-5 mt-2">
          <button onClick={handlePrevMonth} className="p-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18L9 12L15 6"
                stroke="#333333"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="flex items-center gap-2 px-6 py-2 rounded-3xl border border-white"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect
                x="3"
                y="4"
                width="18"
                height="18"
                rx="2"
                stroke="#678BF7"
                strokeWidth="2"
              />
              <path
                d="M3 10h18M8 2v4M16 2v4"
                stroke="#678BF7"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span
              className="font-semibold text-[#333333]"
              style={{ fontSize: "1.125em" }}
            >
              {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
            </span>
          </button>

          <button onClick={handleNextMonth} className="p-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 18L15 12L9 6"
                stroke="#333333"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* 날짜 선택 모달 */}
        {showDatePicker && (
          <div
            className="fixed inset-0 bg-black/50 z-[300] flex items-center justify-center"
            onClick={() => setShowDatePicker(false)}
          >
            <div
              className="bg-white rounded-2xl p-6 m-4 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4 text-center">
                날짜 선택
              </h3>
              <div className="grid grid-cols-3 gap-2 max-h-[400px] overflow-y-auto">
                {(() => {
                  const startYear = 2024;
                  const startMonth = 0; // 1월
                  const endYear = currentMonthLimit.getFullYear();
                  const endMonth = currentMonthLimit.getMonth();

                  const totalMonths =
                    (endYear - startYear) * 12 + (endMonth - startMonth) + 1;

                  return Array.from({ length: totalMonths }, (_, i) => {
                    const year = startYear + Math.floor((startMonth + i) / 12);
                    const month = (startMonth + i) % 12;
                    const shortYear = year.toString().slice(2);
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleDateSelect(year, month)}
                        className={`p-3 rounded-lg ${
                          currentDate.getFullYear() === year &&
                          currentDate.getMonth() === month
                            ? "bg-[#678BF7] text-white"
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        {shortYear}년 {month + 1}월
                      </button>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        )}

        {/* 데이터 잔여량 */}
        <div ref={dataRef}>
          <GlassCard
            title="데이터 잔여량"
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
                <span
                  className="text-[#666666]"
                  style={{ fontSize: "0.875em" }}
                >
                  기본 데이터
                </span>
                <span
                  className="text-[#666666]"
                  style={{ fontSize: "0.875em" }}
                >
                  {(dataBalance.personalDataRemaining / 1000).toFixed(1)}GB /{" "}
                  {(dataBalance.personalDataTotal / 1000).toFixed(1)}GB
                </span>
              </div>
              <div
                className="w-full h-3 rounded-full overflow-hidden relative"
                style={{
                  background: "#EDEDED",
                }}
              >
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: dataAnimated
                      ? `${(dataBalance.personalDataRemaining / dataBalance.personalDataTotal) * 100}%`
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
                <span
                  className="text-[#666666]"
                  style={{ fontSize: "0.875em" }}
                >
                  공유 데이터
                </span>
                <span
                  className="text-[#666666]"
                  style={{ fontSize: "0.875em" }}
                >
                  {(dataBalance.sharedDataRemaining / 1000).toFixed(1)}GB /{" "}
                  {(dataBalance.sharedDataTotal / 1000).toFixed(1)}GB
                </span>
              </div>
              <div
                className="w-full h-3 rounded-full overflow-hidden relative"
                style={{
                  background: "#EDEDED",
                }}
              >
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: dataAnimated
                      ? `${(dataBalance.sharedDataRemaining / dataBalance.sharedDataTotal) * 100}%`
                      : "0%",
                    background:
                      "linear-gradient(to right, #FFB84D 0%, #F4E87C 50%, #A8E063 100%)",
                    boxShadow: "0 2px 4px rgba(168, 224, 99, 0.3)",
                  }}
                ></div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* 구성원별 한도 배분 */}
        <GlassCard
          title="구성원별 한도 배분"
          gradientFrom="#FFFFFF"
          gradientTo="#CCCCCC"
          bgGradientFrom="#FFFFFF"
          bgGradientTo="#F8F8F8"
          bgOpacity={0.7}
          borderWidth={1}
          borderRadius={20}
          className="w-full"
        >
          {(() => {
            // 더미 데이터 (API 연동 시 교체)
            const memberQuotas = [
              {
                name: "김영희",
                percentage: 25,
                color: "rgba(200, 230, 201, 0.6)",
              },
              {
                name: "김철수",
                percentage: 25,
                color: "rgba(179, 229, 252, 0.6)",
              },
              {
                name: "김옥자",
                percentage: 25,
                color: "rgba(255, 204, 188, 0.6)",
              },
              {
                name: "김민우",
                percentage: 25,
                color: "rgba(209, 196, 233, 0.6)",
              },
            ];

            return (
              <>
                <div
                  className="w-full h-8 rounded-full overflow-hidden flex mb-4"
                  style={{
                    background:
                      "linear-gradient(to right, #FFFFFF 0%, #EDEDED 100%)",
                    border: "1px solid transparent",
                    backgroundClip: "padding-box",
                  }}
                >
                  {memberQuotas.map((member) => (
                    <div
                      key={member.name}
                      className="h-full"
                      style={{
                        width: `${member.percentage}%`,
                        backgroundColor: member.color,
                        boxShadow: "0 0 4px rgba(176, 176, 176, 0.5)",
                      }}
                    ></div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {memberQuotas.map((member) => (
                    <div key={member.name} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: member.color }}
                      ></div>
                      <span
                        className="text-[#666666]"
                        style={{ fontSize: "0.875em" }}
                      >
                        {member.name} {member.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </GlassCard>

        {/* 최근 3개월간 사용량 추이 */}
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
          <Slider
            data={usageData}
            height={200}
            color="#678BF7"
            animated={true}
          />
        </GlassCard>

        {/* 앱 서비스별 사용량 */}
        <div ref={chartRef}>
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
                <span
                  className="text-[#666666]"
                  style={{ fontSize: "0.875em" }}
                >
                  가족 공개
                </span>
                <div className="scale-90">
                  <Toggle
                    checked={isFamilyPublic}
                    onChange={setIsFamilyPublic}
                    aria-label="가족 공개"
                  />
                </div>
              </div>
            </div>

            <div className="relative">
              {/* 모자이크 오버레이 */}
              {!isFamilyPublic && (
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

              <div className={!isFamilyPublic ? "filter blur-md" : ""}>
                <div className="flex items-center justify-center mb-8">
                  <div
                    className="relative w-64 h-64"
                    style={{
                      filter: "drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1))",
                    }}
                  >
                    {/* 툴팁 */}
                    {hoveredAppIndex !== null && (
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#333333] text-white px-3 py-1.5 rounded text-sm font-medium z-30 whitespace-nowrap">
                        {appNameMap[appUsage.apps[hoveredAppIndex].appName] ||
                          appUsage.apps[hoveredAppIndex].appName}
                        :{" "}
                        {(
                          appUsage.apps[hoveredAppIndex].usedAmount / 1000
                        ).toFixed(1)}
                        GB
                        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#333333]"></div>
                      </div>
                    )}

                    <svg
                      className="w-full h-full -rotate-90"
                      viewBox="0 0 256 256"
                    >
                      {(() => {
                        const total = appUsage.totalUsedAmount;
                        if (total === 0) return null; // 0으로 나누기 방지

                        const radius = 96;
                        const circumference = 2 * Math.PI * radius;

                        return appUsage.apps.map((app, index) => {
                          const percentage = app.usedAmount / total;
                          const dashArray = circumference * percentage;
                          const dashOffset = -appUsage.apps
                            .slice(0, index)
                            .reduce(
                              (sum, a) =>
                                sum + (a.usedAmount / total) * circumference,
                              0,
                            );

                          const appColor = getAppColor(app.appName, index);

                          return (
                            <g key={index}>
                              <circle
                                cx="128"
                                cy="128"
                                r={radius}
                                fill="none"
                                stroke={appColor}
                                strokeWidth="32"
                                strokeDasharray={`${dashArray} ${circumference}`}
                                strokeDashoffset={
                                  chartAnimated ? dashOffset : -circumference
                                }
                                className="transition-all duration-1000 ease-out cursor-pointer hover:opacity-80"
                                style={{
                                  transitionDelay: `${index * 200}ms`,
                                  pointerEvents: "stroke",
                                }}
                                onMouseEnter={() => setHoveredAppIndex(index)}
                                onMouseLeave={() => setHoveredAppIndex(null)}
                              />
                            </g>
                          );
                        });
                      })()}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span
                        className="text-[#999999]"
                        style={{ fontSize: "0.875em" }}
                      >
                        총합
                      </span>
                      <span className="text-[#333333] font-bold text-3xl">
                        {(appUsage.totalUsedAmount / 1000).toFixed(1)}GB
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 px-6">
                  {appUsage.apps.map((app, index) => {
                    const appColor = getAppColor(app.appName, index);
                    const appNameKo = appNameMap[app.appName] || app.appName;

                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: appColor }}
                          ></div>
                          <span
                            className="text-[#333333]"
                            style={{ fontSize: "1em" }}
                          >
                            {appNameKo}
                          </span>
                        </div>
                        <span
                          className="text-[#666666]"
                          style={{ fontSize: "1em" }}
                        >
                          {(app.usedAmount / 1000).toFixed(1)}GB
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
