import shareIcon from "@/assets/icon/share.svg";
import personIcon from "@/assets/icon/person.svg";
import GlassCard from "@/components/common/GlassCard";

function formatMB(mb: number): string {
  if (mb >= 1000) return `${(mb / 1000).toFixed(1)} GB`;
  return `${mb} MB`;
}

export default function DataRemainingCard({
  label,
  amount,
  icon,
}: {
  label: string;
  amount: number;
  icon: "share" | "person";
}) {
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
      className="flex-1"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-400 mb-1">{label}</p>
          <p className="text-xl font-bold text-gray-800">{formatMB(amount)}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#EEF0FF] flex items-center justify-center flex-shrink-0">
          {icon === "share" ? (
            <img src={shareIcon} />
          ) : (
            <img src={personIcon} />
          )}
        </div>
      </div>
    </GlassCard>
  );
}
