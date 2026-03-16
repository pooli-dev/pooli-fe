import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import GlassCard from "../../components/common/GlassCard";
import { sharedPoolService } from "@/api";
import type { HistoryEntry } from "@/types/SharedData";
import { formatData } from "@/utils/dataFormat";
import Avatar from "@/components/common/Avatar";
import { useEffect, useRef } from "react";

// ── 유틸 ─────────────────────────────────────────────────────────────────────
function getCurrentYearMonth(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  return `${y}${m}`;
}

function getPrevYearMonth(yearMonth: string): string {
  const y = parseInt(yearMonth.slice(0, 4));
  const m = parseInt(yearMonth.slice(4, 6));
  const date = new Date(y, m - 2); // 이전 달
  const ny = date.getFullYear();
  const nm = String(date.getMonth() + 1).padStart(2, "0");
  return `${ny}${nm}`;
}

function formatAmount(entry: HistoryEntry): string {
  const gb = formatData(Math.abs(entry.amount));
  return entry.eventType === "USAGE" ? `- ${gb}GB` : `+ ${gb}GB`;
}

function getRemainingPercent(remaining: number, total: number): number {
  if (total === 0) return 0;
  return Math.min(100, Math.round((remaining / total) * 100));
}

// ── 로그 아이템 ───────────────────────────────────────────────────────────────
function LogItem({ entry }: { entry: HistoryEntry }) {
  const isPositive = entry.eventType !== "USAGE";
  const date = new Date(entry.occurredAt);
  const dateStr = `${date.getMonth() + 1}.${date.getDate()}`;
  return (
    <GlassCard
      title=""
      gradientFrom="#FFFFFF"
      gradientTo="#CCCCCC"
      bgGradientFrom="#FFFFFF"
      bgGradientTo="#F8F8F8"
      bgOpacity={0.8}
      borderWidth={1}
      borderRadius={16}
      className="w-full"
    >
      <div className="flex items-center gap-3">
        <Avatar userName={entry.userName} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800">{entry.title}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {entry.userName} • {dateStr}
          </p>
        </div>
        <span
          className="text-sm font-bold flex-shrink-0"
          style={{ color: isPositive ? "#678BF7" : "#9CA3AF" }}
        >
          {formatAmount(entry)}
        </span>
      </div>
    </GlassCard>
  );
}

// ── SharedDataLog 페이지 ──────────────────────────────────────────────────────
export default function LogPage() {
  const observerRef = useRef<HTMLDivElement>(null);

  const { data: poolData } = useQuery({
    queryKey: ["sharedPoolMain"],
    queryFn: () => sharedPoolService.getMainRemainingAmount(),
  });

  const remaining = poolData?.sharedPoolRemainingData ?? 0;
  const total = poolData?.sharedPoolTotalData ?? 0;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["sharedPoolHistory"],
      queryFn: async ({ pageParam }: { pageParam: string }) => {
        const res = await sharedPoolService.getHistory(pageParam);
        return { data: res.data, yearMonth: pageParam };
      },
      initialPageParam: getCurrentYearMonth(),
      getNextPageParam: (lastPage) => {
        // 데이터 없으면 더 이상 로드 안 함
        if (!lastPage.data || lastPage.data.length === 0) return undefined;
        return getPrevYearMonth(lastPage.yearMonth);
      },
    });

  // 무한 스크롤 옵저버
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // 월별 그룹핑
  const grouped = (data?.pages ?? []).reduce<Record<string, HistoryEntry[]>>(
    (acc, page) => {
      if (!page.data) return acc;
      page.data.forEach((entry) => {
        const date = new Date(entry.occurredAt);
        const month = `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
        if (!acc[month]) acc[month] = [];
        acc[month].push(entry);
      });
      return acc;
    },
    {},
  );

  return (
    <div className="relative overflow-y-auto mb-[60px]">
      <div className="flex flex-col gap-4 px-6 pb-8 pt-2">
        {/* ── 현재 공유 데이터 요약 카드 ── */}
        <GlassCard
          title=""
          gradientFrom="#FFFFFF"
          gradientTo="#CCCCCC"
          bgGradientFrom="#FFFFFF"
          bgGradientTo="#F0F0F0"
          bgOpacity={0.7}
          borderWidth={1}
          borderRadius={20}
          className="w-full"
        >
          <div className="flex items-start justify-between mb-4 py-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">현재 공유 데이터</p>
              <p className="text-3xl font-bold text-gray-800">
                {remaining}GB
                <span className="text-base font-normal text-gray-400 ml-1">
                  / {total}GB
                </span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#EEF2FF] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 6h18M3 12h18M3 18h18"
                  stroke="#678BF7"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <div className="relative w-full my-2">
            <div
              className="absolute w-full h-3 rounded-full"
              style={{
                backgroundColor: "#E8F0FF",
                filter: "blur(3px)",
                opacity: 0.7,
                transform: "scaleY(0.5)",
                boxShadow: "0 0 10px 3px #93C5FD",
              }}
            />
            <div
              className="relative w-full h-3 rounded-full overflow-hidden"
              style={{ backgroundColor: "#F0F5FF" }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${getRemainingPercent(remaining, total)}%`,
                  background: "linear-gradient(to right, #9A9CEA, #678BF7)",
                }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z"
                  fill="#678BF7"
                />
              </svg>
              <span className="text-xs text-gray-400">총 누적 기여</span>
            </div>
            <span
              className="text-sm font-semibold"
              style={{ color: "#678BF7" }}
            >
              {poolData?.sharedPoolAdditionalData ?? 0}GB
            </span>
          </div>
        </GlassCard>

        {/* ── 월별 로그 목록 ── */}
        {Object.entries(grouped).map(([month, entries]) => (
          <div key={month} className="flex flex-col gap-3">
            <p className="text-xs text-gray-400 px-1">{month}</p>
            {entries.map((entry, index) => (
              <LogItem key={`${entry.occurredAt}-${index}`} entry={entry} />
            ))}
          </div>
        ))}

        {/* 무한 스크롤 트리거 */}
        <div
          ref={observerRef}
          className="py-4 text-center text-sm text-gray-400"
        >
          {isFetchingNextPage && "불러오는 중..."}
          {!hasNextPage &&
            Object.keys(grouped).length > 0 &&
            "모든 기록을 불러왔습니다."}
        </div>

        {Object.keys(grouped).length === 0 && !isFetchingNextPage && (
          <div className="text-center py-20 text-gray-400">
            히스토리가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
