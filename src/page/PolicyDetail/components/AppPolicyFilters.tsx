interface AppPolicyFiltersProps {
  policyFilter: "전체" | "정책없음" | "정책적용" | "정책예외";
  setPolicyFilter: (
    filter: "전체" | "정책없음" | "정책적용" | "정책예외",
  ) => void;
  conditionFilters: Set<"사용량 제한" | "속도 제한">;
  toggleConditionFilter: (condition: "사용량 제한" | "속도 제한") => void;
  showPolicyDropdown: boolean;
  setShowPolicyDropdown: (show: boolean) => void;
}

const AppPolicyFilters = ({
  policyFilter,
  setPolicyFilter,
  conditionFilters,
  toggleConditionFilter,
  showPolicyDropdown,
  setShowPolicyDropdown,
}: AppPolicyFiltersProps) => {
  return (
    <div className="flex gap-4 px-2 pb-2 flex-wrap relative items-center text-sm">
      <div className="flex items-center gap-2 relative flex-shrink-0 whitespace-nowrap">
        <span className="text-gray-700 whitespace-nowrap text-sm">정책</span>
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowPolicyDropdown(!showPolicyDropdown)}
            className={`px-3 py-1 xs:py-2 text-xs rounded-full border flex items-center justify-between whitespace-nowrap flex-shrink-0 transition-all min-w-[80px] ${
              showPolicyDropdown
                ? "bg-[#678BF7] text-white border-[#678BF7]"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            {policyFilter}
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className={`transition-transform ${showPolicyDropdown ? "rotate-180" : ""}`}
            >
              <path
                d="M3 4.5L6 7.5L9 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {showPolicyDropdown && (
            <>
              <div
                className="fixed inset-0 z-[90]"
                onClick={() => setShowPolicyDropdown(false)}
              />
              <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-[100] w-[90px] flex flex-col">
                {(["전체", "정책없음", "정책적용", "정책예외"] as const).map(
                  (filter) => (
                    <button
                      key={filter}
                      onClick={() => {
                        setPolicyFilter(filter);
                        setShowPolicyDropdown(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs hover:bg-gray-50 whitespace-nowrap transition-colors block ${
                        policyFilter === filter
                          ? "text-[#678BF7] font-semibold bg-blue-50"
                          : "text-gray-700"
                      }`}
                    >
                      {filter}
                    </button>
                  ),
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0 whitespace-nowrap">
        <span className="text-gray-700 whitespace-nowrap text-sm">조건</span>
        <div className="flex gap-1 flex-wrap">
          {(["사용량 제한", "속도 제한"] as const).map((condition) => (
            <button
              key={condition}
              onClick={() => toggleConditionFilter(condition)}
              className={`relative text-xs px-2.5 py-1 xs:py-2 rounded-full transition-colors whitespace-nowrap flex-shrink-0 ${
                conditionFilters.has(condition)
                  ? "text-[#003458]"
                  : "text-gray-600"
              }`}
              style={{
                backgroundColor: conditionFilters.has(condition)
                  ? "rgba(223, 248, 254, 0.6)"
                  : "transparent",
                border: "0.5px solid transparent",
                backgroundImage: conditionFilters.has(condition)
                  ? "linear-gradient(rgba(223, 248, 254, 0.6), rgba(223, 248, 254, 0.6)), linear-gradient(90deg, rgba(0, 52, 88, 0.2) 0%, rgba(0, 52, 88, 0.6) 100%)"
                  : "linear-gradient(white, white), linear-gradient(90deg, rgba(0, 52, 88, 0.2) 0%, rgba(0, 52, 88, 0.6) 100%)",
                backgroundOrigin: "border-box",
                backgroundClip: "padding-box, border-box",
              }}
            >
              {condition}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppPolicyFilters;
