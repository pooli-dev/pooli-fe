import BlockPolicyManager from "./Blockpolicymanager";
import ImmediateBlockPolicy from "./Immediateblockpolicy";

type Props = {
  onBlockApply?: (blockEndAt: string) => void;
  lineId?: number;
  onPolicyChange?: () => void; // ← 추가
};

const BlockTab = ({ onBlockApply, lineId, onPolicyChange }: Props) => {
  return (
    <div className="flex flex-col gap-3 py-4 tablet:grid tablet:grid-cols-2 tablet:items-start desktop:flex desktop:flex-col">
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

export default BlockTab;
