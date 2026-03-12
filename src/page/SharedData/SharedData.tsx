import { useEffect, useState, useCallback } from "react";
import SharedPoolCard from "./components/SharedPoolCard";
import DataTransferCard from "./components/DataTransferCard";
import { sharedPoolService } from "../../api";
import type {
  SharedPoolMainData,
  MySharedPoolData,
} from "../../api/services/sharedPoolService";

const calculateDaysUntilNextMonth = (): number => {
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const diffTime = nextMonth.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export default function SharedData() {
  const [mainData, setMainData] = useState<SharedPoolMainData | null>(null);
  const [myData, setMyData] = useState<MySharedPoolData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSharedPoolData = useCallback(async () => {
    try {
      const [mainResponse, myResponse] = await Promise.all([
        sharedPoolService.getMainRemainingAmount(),
        sharedPoolService.getMySharedPool(),
      ]);

      setMainData(mainResponse);
      setMyData(myResponse);
    } catch (error) {
      console.error("Failed to fetch shared pool data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSharedPoolData();
  }, [fetchSharedPoolData]);

  const handleTransfer = async (amount: number) => {
    try {
      await sharedPoolService.contributeData({ amount });
      await fetchSharedPoolData();
    } catch (error) {
      console.error("Failed to contribute data:", error);
    }
  };

  if (loading || !mainData || !myData) {
    return <div>Loading...</div>;
  }

  const usedData =
    mainData.sharedPoolTotalData - mainData.sharedPoolRemainingData;
  const remainingDays = calculateDaysUntilNextMonth();

  return (
    <div className="relative h-[calc(100dvh-106px-60px)] overflow-y-auto mt-[106px] mb-[60px]">
      <div className="py-5 pb-[40px]">
        <div className="px-6">
          <SharedPoolCard
            totalData={mainData.sharedPoolTotalData}
            remainingData={mainData.sharedPoolRemainingData}
            baseData={mainData.sharedPoolBaseData}
            contributionData={mainData.sharedPoolAdditionalData}
            usageAmount={usedData}
            remainingDays={remainingDays}
          />
        </div>

        <div className="px-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            공유 데이터 담기
          </h3>
          <DataTransferCard
            personalDataRemaining={myData.remainingData}
            contributedData={myData.contributionAmount}
            onTransfer={handleTransfer}
          />
        </div>
      </div>
    </div>
  );
}
