import shareIcon from "@/assets/icon/share.svg";
import personIcon from "@/assets/icon/person.svg";
import GlassCard from "@/components/common/GlassCard";
import { formatDataLabel } from "@/utils/dataFormat";

export default function DataRemainingCard({
  label,
  amount,
  icon,
}: {
  label: string;
  amount: number;
  icon: "share" | "person";
}) {
  const displayAmount = amount === -1 ? "무제한" : `${formatDataLabel(amount)}`;

  return (
    <GlassCard
      title=""
      gradientFrom="#FFFFFF"
      gradientTo="#CCCCCC"
      bgGradientFrom="#FFFFFF"
      bgGradientTo="#F8F8F8"
      bgOpacity={0.8}
      borderWidth={1}
      borderRadius={20}
      className="flex-1 overflow-hidden"
    >
      <div className="flex flex-col gap-1">
        {/* label + 아이콘 */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400 whitespace-pre-wrap">{label}</p>
          <div className="w-8 h-8 rounded-full bg-[#EEF0FF] flex items-center justify-center flex-shrink-0">
            {icon === "share" ? (
              <img src={shareIcon} />
            ) : (
              <img src={personIcon} />
            )}
          </div>
        </div>
        {/* 금액 */}
        <p className="text-xl font-bold text-gray-800">{displayAmount}</p>
      </div>
    </GlassCard>
  );
}
