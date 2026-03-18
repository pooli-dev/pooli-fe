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
    <div className="flex flex-col gap-3 py-4 text-center text-gray-500">
      <BlockPolicyManager lineId={lineId} onPolicyChange={onPolicyChange} />
      <ImmediateBlockPolicy lineId={lineId} onApply={onBlockApply} onPolicyChange={onPolicyChange} />
    </div>
  );
};

export default BlockPolicyTab;