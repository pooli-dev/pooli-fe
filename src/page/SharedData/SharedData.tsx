import { useNavigate } from "react-router-dom";
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

  const handleTransfer = (amount: number) => {
    console.log("공유하기:", amount, "MB");
    // API 호출 로직
    // POST /api/data-transfer
    // body: { fromLineId: 1, toLineId: 2, amount: amount }
    navigate("/");
  };

  return (
    <>
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
