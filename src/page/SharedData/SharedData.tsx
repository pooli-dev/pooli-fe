import { useNavigate } from "react-router-dom";
import alarmIcon from "../../assets/icon/alarm-icon.png";
import settingIcon from "../../assets/icon/setting-icon.png";
import SharedPoolCard from "./components/SharedPoolCard";
import DataTransferCard from "./components/DataTransferCard";
import {
  dummySharedPoolData,
  remainingDays,
} from "../../data/sharedDataDummyData";

export default function SharedData() {
  const navigate = useNavigate();

  // 더미 데이터
  const personalDataRemaining = 15000; // 15GB (MB 단위)

  const handleTransfer = () => {
    // API 호출 로직
    // POST /api/data-transfer
    // body: { fromLineId: 1, toLineId: 2, amount: amount }
    navigate("/");
  };

  return (
    <>
      {/* 커스텀 헤더 */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[480px] max-w-full flex justify-between items-center px-5 h-20 pt-[env(safe-area-inset-top)] z-[100]">
        <div className="flex items-center w-20">
          <button
            type="button"
            aria-label="뒤로 가기"
            className="p-1 bg-transparent border-none cursor-pointer flex items-center justify-center"
            onClick={() => navigate(-1)}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="#333333"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 flex justify-center items-center">
          <h1
            className="font-semibold text-[#333333] m-0"
            style={{ fontSize: "1.25em" }}
          >
            가족 공유 풀
          </h1>
        </div>

        <div className="flex items-center gap-3 w-20 justify-end">
          <button
            type="button"
            aria-label="알림"
            className="relative cursor-pointer flex items-center justify-center w-12 h-12 rounded-full shrink-0 border-[3px] border-white bg-gradient-to-b from-white/0 to-white/100 to-42%"
            onClick={() => navigate("/alarm")}
          >
            <img src={alarmIcon} alt="" className="w-6 h-6" />
            <div className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-[#FF0000] rounded-full flex items-center justify-center">
              <span className="text-white text-[10px] font-bold leading-none">
                3
              </span>
            </div>
          </button>
          <button
            type="button"
            aria-label="설정"
            className="cursor-pointer flex items-center justify-center w-12 h-12 rounded-full shrink-0 border-[3px] border-white bg-gradient-to-b from-white/0 to-white/100 to-42%"
            onClick={() => navigate("/setting")}
          >
            <img src={settingIcon} alt="" className="w-6 h-6" />
          </button>
        </div>
      </header>

      <div className="relative h-[calc(100vh-106px-60px)] overflow-y-auto mt-[106px] mb-[60px]">
        <div className="py-5 pb-[40px]">
          {/* 총 공유 데이터 카드 */}
          <div className="px-6">
            <SharedPoolCard
              totalData={dummySharedPoolData.poolTotalData}
              remainingData={dummySharedPoolData.poolRemainingData}
              baseData={dummySharedPoolData.pool_base_data}
              contributionData={dummySharedPoolData.monthlyContributionAmount}
              usageAmount={dummySharedPoolData.monthlyUsageAmount}
              remainingDays={remainingDays}
            />
          </div>

          {/* 공유 데이터 담기 */}
          <div className="px-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              공유 데이터 담기
            </h3>

            <DataTransferCard
              personalDataRemaining={personalDataRemaining}
              poolTotalData={dummySharedPoolData.poolTotalData}
              onTransfer={handleTransfer}
            />
          </div>
        </div>
      </div>
    </>
  );
}
