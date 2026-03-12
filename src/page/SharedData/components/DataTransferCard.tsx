import { useState, useMemo } from "react";
import ConfirmModal from "../../../components/common/ConfirmModal";
import GradientButton from "@/components/common/GradientButton";
import SendIcon from "@/assets/icon/send.svg";

interface DataTransferCardProps {
  personalDataRemaining: number;
  contributedData: number;
  onTransfer: (amount: number) => void;
}

const GB_TO_BYTES = 1e9;
const MIN_TRANSFER_AMOUNT = 0;

const COLORS = {
  primary: "#678BF7",
  secondary: "#9A9CEA",
  textGray: "#6B7280",
  textLight: "#9CA3AF",
  border: "#D0D0D0",
  info: "#868A8A",
} as const;

const GRADIENT_STYLE = `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`;

export default function DataTransferCard({
  personalDataRemaining,
  contributedData,
  onTransfer,
}: DataTransferCardProps) {
  const limitData = useMemo(
    () => Math.max(0, Math.floor(personalDataRemaining) - 1),
    [personalDataRemaining]
  );

  const [sharedAmount, setSharedAmount] = useState(MIN_TRANSFER_AMOUNT);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const formattedPersonalGB = personalDataRemaining.toFixed(2);
  const formattedContributedGB = contributedData.toFixed(2);

  const clampAmount = (value: number) =>
    Math.min(Math.max(value, MIN_TRANSFER_AMOUNT), limitData);

  const handleIncrement = () => setSharedAmount((prev) => clampAmount(prev + 1));
  const handleDecrement = () => setSharedAmount((prev) => clampAmount(prev - 1));

  const handleInputChange = (value: string) => {
    const numValue = parseInt(value) || MIN_TRANSFER_AMOUNT;
    setSharedAmount(clampAmount(numValue));
  };

  const handleShare = () => setShowConfirmModal(true);

  const handleConfirmShare = () => {
    onTransfer(sharedAmount * GB_TO_BYTES);
    setShowConfirmModal(false);
  };

  return (
    <>
      <DataCard
        personalGB={formattedPersonalGB}
        contributedGB={formattedContributedGB}
        limitData={limitData}
        sharedAmount={sharedAmount}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
        onInputChange={handleInputChange}
      />

      <InfoSection />

      <ShareButton onClick={handleShare} />

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmShare}
        message="데이터를 공유하시겠습니까?<br />공유 후에는 취소가 불가능합니다."
      />
    </>
  );
}

interface DataCardProps {
  personalGB: string;
  contributedGB: string;
  limitData: number;
  sharedAmount: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onInputChange: (value: string) => void;
}

function DataCard({
  personalGB,
  contributedGB,
  limitData,
  sharedAmount,
  onIncrement,
  onDecrement,
  onInputChange,
}: DataCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
      <PersonalDataHeader personalGB={personalGB} />
      <DataStats
        contributedGB={contributedGB}
        limitData={limitData}
        sharedAmount={sharedAmount}
      />
      <DataInputControl
        sharedAmount={sharedAmount}
        limitData={limitData}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
        onInputChange={onInputChange}
      />
    </div>
  );
}

function PersonalDataHeader({ personalGB }: { personalGB: string }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
          stroke={COLORS.primary}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="7" r="4" stroke={COLORS.primary} strokeWidth="2" />
      </svg>
      <span className="font-normal text-gray-800">
        개인 데이터 잔여량: <span className="font-medium">{personalGB}GB</span>
      </span>
    </div>
  );
}

interface DataStatsProps {
  contributedGB: string;
  limitData: number;
  sharedAmount: number;
}

function DataStats({ contributedGB, limitData, sharedAmount }: DataStatsProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-start mb-3">
        <DataStatItem label="공유한 데이터" value={contributedGB} color={COLORS.primary} />
        <DataStatItem label="한도 데이터" value={limitData.toString()} color={COLORS.textGray} />
      </div>
      <div className="text-center">
        <DataStatItem label="담을 데이터" value={sharedAmount.toString()} color={COLORS.primary} />
      </div>
    </div>
  );
}

interface DataStatItemProps {
  label: string;
  value: string;
  color: string;
}

function DataStatItem({ label, value, color }: DataStatItemProps) {
  return (
    <div className="flex-1 text-center">
      <div className="text-sm mb-1" style={{ color: COLORS.textLight }}>
        {label}
      </div>
      <div className="text-2xl font-medium" style={{ color }}>
        {value} GB
      </div>
    </div>
  );
}

interface DataInputControlProps {
  sharedAmount: number;
  limitData: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onInputChange: (value: string) => void;
}

function DataInputControl({
  sharedAmount,
  limitData,
  onIncrement,
  onDecrement,
  onInputChange,
}: DataInputControlProps) {
  return (
    <div className="flex items-center justify-center gap-3">
      <ControlButton onClick={onDecrement} label="−" />
      <DataInput
        value={sharedAmount}
        max={limitData}
        onChange={onInputChange}
      />
      <ControlButton onClick={onIncrement} label="+" />
    </div>
  );
}

function ControlButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0"
      style={{ background: GRADIENT_STYLE }}
    >
      {label}
    </button>
  );
}

interface DataInputProps {
  value: number;
  max: number;
  onChange: (value: string) => void;
}

function DataInput({ value, max, onChange }: DataInputProps) {
  return (
    <div className="relative flex items-center justify-center w-40">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-[52px] text-center text-xl font-semibold rounded-xl focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        style={{
          borderColor: COLORS.border,
          borderWidth: "0.3px",
          borderStyle: "solid",
          paddingRight: "32px",
        }}
        min="0"
        max={max}
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none">
        GB
      </span>
    </div>
  );
}

function InfoSection() {
  const infoItems = [
    "개인 데이터 잔여량이 1GB 이상일 때만 전송 가능합니다",
    "데이터는 1GB 단위로 전송할 수 있습니다.",
    "전송 완료 후에는 취소가 불가능하니 주의해주세요",
  ];

  return (
    <div className="space-y-0.5 mb-4 px-4 sm:px-[34px]">
      {infoItems.map((item, index) => (
        <p key={index} className="text-xs" style={{ color: COLORS.info }}>
          • {item}
        </p>
      ))}
    </div>
  );
}

function ShareButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex items-center justify-center">
      <div className="w-auto">
        <GradientButton
          onClick={onClick}
          width={150}
          height={15}
          borderRadius={20}
          fontSize={1.5}
          className="min-w-max"
        >
          <img src={SendIcon} className="w-7 h-7 flex-shrink-0" alt="send" />
          <span className="whitespace-nowrap">공유하기</span>
        </GradientButton>
      </div>
    </div>
  );
}
