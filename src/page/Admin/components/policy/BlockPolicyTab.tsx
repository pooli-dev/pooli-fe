import BlockPolicyManager from "./BlockPolicyManager";
import ImmediateBlockPolicy from "@/page/PolicyDetail/components/Immediateblockpolicy";

export default function BlockPolicyTab({
  lineId,
  onPolicyChange,
}: {
  lineId: number;
  onPolicyChange?: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 px-4 py-4">
      <BlockPolicyManager lineId={lineId} onPolicyChange={onPolicyChange} />
      <ImmediateBlockPolicy
        lineId={lineId}
        onApply={() => onPolicyChange?.()}
      />
    </div>
  );
}
