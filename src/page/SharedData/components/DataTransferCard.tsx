import { useState } from "react";
import ConfirmModal from "../../../components/common/ConfirmModal";
import GradientButton from "@/components/common/GradientButton";
import SendIcon from "@/assets/icon/send.svg";

interface DataTransferCardProps {
  personalDataRemaining: number; // MB
  poolTotalData: number; // MB
  onTransfer: (amount: number) => void;
}

export default function DataTransferCard({
  personalDataRemaining,
  poolTotalData,
  onTransfer,
}: DataTransferCardProps) {
  const [sharedAmount, setSharedAmount] = useState(3);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const personalGB = (personalDataRemaining / 1000).toFixed(0);
  const poolGB = (poolTotalData / 1000).toFixed(1);

  const handleIncrement = () => {
    setSharedAmount((prev) => Math.min(prev + 1, 60));
  };

  const handleDecrement = () => {
    setSharedAmount((prev) => Math.max(prev - 1, 0));
  };

  const handleInputChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    setSharedAmount(Math.min(Math.max(numValue, 0), 60));
  };

  const handleShare = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmShare = () => {
    onTransfer(sharedAmount * 1000); // GB를 MB로 변환
    setShowConfirmModal(false);
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-6">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
              stroke="#678BF7"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="7" r="4" stroke="#678BF7" strokeWidth="2" />
          </svg>
          <span className="font-normal text-gray-800">
            개인 데이터 잔여량:{" "}
            <span className="font-medium">{personalGB}GB</span>
          </span>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1 text-center">
              <div className="text-sm mb-1" style={{ color: "#9CA3AF" }}>
                총 공유 데이터
              </div>
              <div
                className="text-2xl font-medium"
                style={{ color: "#678BF7" }}
              >
                {sharedAmount} GB
              </div>
            </div>
            <div className="flex-1 text-center">
              <div className="text-sm mb-1" style={{ color: "#9CA3AF" }}>
                충전 데이터 한도
              </div>
              <div
                className="text-2xl font-medium"
                style={{ color: "#6B7280" }}
              >
                {poolGB} GB
              </div>
            </div>
          </div>
        </div>

        {/* 입력 컨트롤 */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleDecrement}
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0"
            style={{ background: "linear-gradient(135deg, #678BF7, #9A9CEA)" }}
          >
            −
          </button>

          <div className="relative flex items-center justify-center w-40">
            <input
              type="number"
              value={sharedAmount}
              onChange={(e) => handleInputChange(e.target.value)}
              className="w-full h-[52px] text-center text-xl font-semibold rounded-xl focus:outline-none focus:border-[#D0D0D0] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              style={{
                borderColor: "#D0D0D0",
                borderWidth: "0.3px",
                borderStyle: "solid",
                paddingRight: "32px",
              }}
              min="0"
              max="60"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none">
              GB
            </span>
          </div>

          <button
            onClick={handleIncrement}
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0"
            style={{ background: "linear-gradient(135deg, #678BF7, #9A9CEA)" }}
          >
            +
          </button>
        </div>
      </div>

      {/* 안내 문구 */}
      <div className="space-y-0.5 mb-4 px-[34px]">
        <p className="text-xs" style={{ color: "#868A8A" }}>
          • 개인 데이터 잔여량이 1GB 이상일 때만 전송 가능합니다
        </p>
        <p className="text-xs" style={{ color: "#868A8A" }}>
          • 데이터는 1GB 단위로 전송할 수 있습니다.
        </p>
        <p className="text-xs" style={{ color: "#868A8A" }}>
          • 전송 완료 후에는 취소가 불가능하니 주의해주세요
        </p>
      </div>

      {/* 공유하기 버튼 */}
      <div className="flex items-center justify-center">
        <GradientButton
          onClick={handleShare}
          width={150}
          height={15}
          borderRadius={20}
          fontSize={1.5}
        >
          <img src={SendIcon} className="w-7 h-7" />
          공유하기
        </GradientButton>
      </div>

      {/* 확인 모달 */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmShare}
        message="데이터를 공유하시겠습니까?<br />공유 후에는 취소가 불가능합니다."
      />
    </>
  );
}
