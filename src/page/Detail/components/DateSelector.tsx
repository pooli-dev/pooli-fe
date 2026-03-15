interface DateSelectorProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export default function DateSelector({
  currentDate,
  onPrevMonth,
  onNextMonth,
}: DateSelectorProps) {
  return (
    <div className="flex items-center justify-center gap-4 mb-5 mt-2">
      <button onClick={onPrevMonth} className="p-2">
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

      <div
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
        <span className="font-semibold text-[#333333]" style={{ fontSize: "1.125em" }}>
          {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
        </span>
      </div>

      <button onClick={onNextMonth} className="p-2">
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
  );
}
