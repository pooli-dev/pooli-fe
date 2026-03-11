import GlassCard from "../../components/common/GlassCard";

// ── 타입 ─────────────────────────────────────────────────────────────────────
type LogEntry = {
  id: number;
  userName: string;
  profileImage?: string;
  amount: number; // MB, 양수 = 충전
  date: string; // "03.15 14:22"
  month: string; // "2024년 3월"
};

// ── 유틸 ─────────────────────────────────────────────────────────────────────
function formatMBSimple(mb: number): string {
  if (mb >= 1000) return `${(mb / 1000).toFixed(1)} GB`;
  return `${mb} MB`;
}

function formatAmount(mb: number): string {
  const abs =
    mb >= 1000
      ? `${(Math.abs(mb) / 1000).toFixed(1)} GB`
      : `${Math.abs(mb)} MB`;
  return mb >= 0 ? `+ ${abs}` : `- ${abs}`;
}

function getRemainingPercent(remaining: number, total: number): number {
  if (total === 0) return 0;
  return Math.min(100, Math.round((remaining / total) * 100));
}

// ── 더미 데이터 ───────────────────────────────────────────────────────────────
const DUMMY_LOGS: LogEntry[] = [
  {
    id: 1,
    userName: "김영희",
    amount: 5000,
    date: "03.15 14:22",
    month: "2024년 3월",
  },
  {
    id: 2,
    userName: "박아들",
    amount: -1200,
    date: "03.15 10:05",
    month: "2024년 3월",
  },
  {
    id: 3,
    userName: "박딸",
    amount: 2000,
    date: "03.14 09:00",
    month: "2024년 3월",
  },
  {
    id: 4,
    userName: "김아내",
    amount: -800,
    date: "03.13 18:30",
    month: "2024년 3월",
  },
  {
    id: 5,
    userName: "김영희",
    amount: 3000,
    date: "02.28 11:00",
    month: "2024년 2월",
  },
  {
    id: 6,
    userName: "박아들",
    amount: -2000,
    date: "02.25 09:30",
    month: "2024년 2월",
  },
];

// ── 아바타 ────────────────────────────────────────────────────────────────────
function Avatar({
  profileImage,
  userName,
}: {
  profileImage?: string;
  userName: string;
}) {
  return (
    <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-[#E8EEFF] to-[#C4D0FF] flex items-center justify-center flex-shrink-0">
      {profileImage ? (
        <img
          src={profileImage}
          alt={userName}
          className="w-full h-full object-cover"
        />
      ) : (
        <svg viewBox="0 0 24 24" fill="#9AA5C4" className="w-6 h-6">
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
        </svg>
      )}
    </div>
  );
}

// ── 로그 아이템 ───────────────────────────────────────────────────────────────
function LogItem({ entry }: { entry: LogEntry }) {
  const isPositive = entry.amount >= 0;
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
        <Avatar profileImage={entry.profileImage} userName={entry.userName} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800">
            {isPositive ? "데이터 보태기" : "데이터 사용"}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {entry.userName} • {entry.date}
          </p>
        </div>
        <span
          className="text-sm font-bold flex-shrink-0"
          style={{ color: isPositive ? "#678BF7" : "#9CA3AF" }}
        >
          {formatAmount(entry.amount)}
        </span>
      </div>
    </GlassCard>
  );
}

// ── SharedDataLog 페이지 ──────────────────────────────────────────────────────
export default function LogPage() {
  const remaining = 12500;
  const total = 20000;
  const totalContributed = 24500;
  const logs = DUMMY_LOGS;

  // 월별 그룹핑
  const grouped = logs.reduce<Record<string, LogEntry[]>>((acc, entry) => {
    if (!acc[entry.month]) acc[entry.month] = [];
    acc[entry.month].push(entry);
    return acc;
  }, {});

  return (
    <div className="relative h-[calc(100vh-106px-60px)] overflow-y-auto mt-[106px] mb-[60px]">
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
                {formatMBSimple(remaining)}
                <span className="text-base font-normal text-gray-400 ml-1">
                  / {formatMBSimple(total)}
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

          {/* 잔여량 막대 (네온 효과) */}
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

          {/* 총 누적 기여 */}
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
              {formatMBSimple(totalContributed)}
            </span>
          </div>
        </GlassCard>

        {/* ── 월별 로그 목록 ── */}
        {Object.entries(grouped).map(([month, entries]) => (
          <div key={month} className="flex flex-col gap-3">
            <p className="text-xs text-gray-400 px-1">{month}</p>
            {entries.map((entry) => (
              <LogItem key={entry.id} entry={entry} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
