import micIcon from "../../../assets/icon/mic-icon.png";

interface AppFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isListening: boolean;
  handleVoiceSearch: () => void;
  cancelVoiceSearch: () => void;
  sortOrder: "이름순" | "활성화순";
  setSortOrder: (order: "이름순" | "활성화순") => void;
  showSortDropdown: boolean;
  setShowSortDropdown: (show: boolean) => void;
}

const AppFilterBar = ({
  searchQuery,
  setSearchQuery,
  isListening,
  handleVoiceSearch,
  cancelVoiceSearch,
  sortOrder,
  setSortOrder,
  showSortDropdown,
  setShowSortDropdown,
}: AppFilterBarProps) => {
  return (
    <>
      {isListening && (
        <div className="mb-3 flex items-center justify-between px-4 py-3 rounded-full bg-gradient-to-r from-[#678BF7] to-[#9A9CEA] text-white">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">음성 인식 중...</span>
          </div>
          <button
            onClick={cancelVoiceSearch}
            className="text-white text-sm underline hover:opacity-80"
          >
            취소
          </button>
        </div>
      )}

      <div className="flex gap-2 mb-3">
        <div
          className="flex-1 relative rounded-full overflow-hidden"
          style={{
            backgroundColor: "rgba(128, 120, 126, 0.16)",
          }}
        >
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle
                cx="11"
                cy="11"
                r="7"
                stroke="#727272"
                strokeWidth="2"
              />
              <path
                d="M20 20L16 16"
                stroke="#727272"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="앱 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isListening}
            className="w-full pl-12 pr-12 py-3 bg-transparent text-sm focus:outline-none disabled:opacity-50"
            style={{ color: "#727272" }}
          />
          <button
            onClick={handleVoiceSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            <img
              src={micIcon}
              alt="음성 검색"
              className={`w-3.5 h-auto ${isListening ? "animate-pulse" : ""}`}
            />
          </button>
        </div>
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className={`px-3 py-3 text-[13px] flex items-center gap-1.5 w-[90px] justify-between transition-all ${
              showSortDropdown ? "text-[#678BF7]" : ""
            }`}
            style={{
              borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
            }}
          >
            <span className="truncate">{sortOrder}</span>
            <svg 
              width="10" 
              height="10" 
              viewBox="0 0 12 12" 
              fill="none" 
              className={`flex-shrink-0 transition-transform ${showSortDropdown ? "rotate-180" : ""}`}
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

          {showSortDropdown && (
            <>
              <div 
                className="fixed inset-0 z-[90]" 
                onClick={() => setShowSortDropdown(false)}
              />
              <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-[100] w-[85px] flex flex-col">
                {(["이름순", "활성화순"] as const).map((sort) => (
                  <button
                    key={sort}
                    onClick={() => {
                      setSortOrder(sort);
                      setShowSortDropdown(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs hover:bg-gray-50 transition-colors block ${
                      sortOrder === sort
                        ? "text-[#678BF7] font-semibold bg-blue-50"
                        : "text-gray-700"
                    }`}
                  >
                    {sort}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AppFilterBar;
