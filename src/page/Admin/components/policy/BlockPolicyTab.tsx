import BlockPolicyManager from "./BlockPolicyManager";
import ImmediateBlockPolicy from "./ImmediateBlockPolicy";

type Props = {
  onBlockApply?: (blockEndAt: string) => void;
  lineId?: number;
  onPolicyChange?: () => void;
};

const BlockPolicyTab = ({ onBlockApply, lineId, onPolicyChange }: Props) => {
  if (!lineId) return null;

  return (
    <div className="flex flex-row gap-3 py-4 items-start">
      <BlockPolicyManager lineId={lineId} onPolicyChange={onPolicyChange} />
      <ImmediateBlockPolicy
        lineId={lineId}
        onApply={(blockEndAt) => {
          onBlockApply?.(blockEndAt);
          onPolicyChange?.();
        }}
      />
    </div>
  );
};

export default BlockPolicyTab;
