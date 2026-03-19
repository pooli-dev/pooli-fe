import { useEffect, useState, useCallback } from "react";
import SharedPoolCard from "./components/SharedPoolCard";
import DataTransferCard from "./components/DataTransferCard";
import { sharedPoolService, getErrorMessage } from "../../api";
import type {
  SharedPoolMainData,
  MySharedPoolData,
} from "../../api/services/sharedPoolService";
import { useToastStore } from "@/store/toastStore";
import { motion } from "framer-motion";
import {
  itemVariants,
  pageTransition,
  pageVariants,
} from "@/utils/pageAnimation";

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
  const { show: showToast } = useToastStore();

  useEffect(() => {
    console.log("myData:", myData);
  }, [myData]);

  const fetchSharedPoolData = useCallback(async () => {
    try {
      const [mainResponse, myResponse] = await Promise.all([
        sharedPoolService.getMainRemainingAmount(),
        sharedPoolService.getMySharedPool(),
      ]);

      setMainData(mainResponse);
      setMyData(myResponse);
    } catch (error) {
      console.error(
        "Failed to fetch shared pool data:",
        getErrorMessage(error),
      );
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
      showToast("데이터 공유가 완료되었습니다.", "success");
    } catch (error) {
      console.error("Failed to contribute data:", getErrorMessage(error));
      const errorMsg = getErrorMessage(error);
      showToast(errorMsg, "error");
    }
  };

  if (loading || !mainData || !myData) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-106px-60px)] mt-[106px]">
        <div className="w-10 h-10 border-4 border-[#678BF7] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const usedData =
    mainData.sharedPoolTotalData - mainData.sharedPoolRemainingData;
  const remainingDays = calculateDaysUntilNextMonth();

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      transition={pageTransition}
      className="px-6 pb-[20px] mt-4"
    >
      <motion.div
        variants={itemVariants}
        transition={{ ...pageTransition, delay: 0.1 }}
      >
        <SharedPoolCard
          totalData={mainData.sharedPoolTotalData}
          remainingData={mainData.sharedPoolRemainingData}
          baseData={mainData.sharedPoolBaseData}
          contributionData={mainData.sharedPoolAdditionalData}
          usageAmount={usedData}
          remainingDays={remainingDays}
        />
      </motion.div>

      <motion.div
        variants={itemVariants}
        transition={{ ...pageTransition, delay: 0.2 }}
      >
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          공유 데이터 담기
        </h3>
        <DataTransferCard
          personalDataRemaining={myData.remainingData}
          contributedData={myData.contributionAmount}
          onTransfer={handleTransfer}
        />
      </motion.div>
    </motion.div>
  );
}
