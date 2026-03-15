interface DatePickerModalProps {
  show: boolean;
  currentDate: Date;
  currentMonthLimit: Date;
  onClose: () => void;
  onSelect: (year: number, month: number) => void;
}

export default function DatePickerModal({
  show,
  currentDate,
  currentMonthLimit,
  onClose,
  onSelect,
}: DatePickerModalProps) {
  if (!show) return null;

  const startYear = 2024;
  const startMonth = 0;
  const endYear = currentMonthLimit.getFullYear();
  const endMonth = currentMonthLimit.getMonth();
  const totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[300] flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 m-4 max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-4 text-center">날짜 선택</h3>
        <div className="grid grid-cols-3 gap-2 max-h-[400px] overflow-y-auto">
          {Array.from({ length: totalMonths }, (_, i) => {
            // 역순으로 표시 (최신이 오른쪽/아래)
            const reverseIndex = totalMonths - 1 - i;
            const year = startYear + Math.floor((startMonth + reverseIndex) / 12);
            const month = (startMonth + reverseIndex) % 12;
            const shortYear = year.toString().slice(2);
            const isSelected =
              currentDate.getFullYear() === year && currentDate.getMonth() === month;

            return (
              <button
                key={i}
                type="button"
                onClick={() => onSelect(year, month)}
                className={`p-3 rounded-lg ${
                  isSelected
                    ? "bg-[#678BF7] text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {shortYear}년 {month + 1}월
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
