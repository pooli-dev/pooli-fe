import BlockPolicyManager from "./Blockpolicymanager";
import ImmediateBlockPolicy from "./Immediateblockpolicy";

type Props = {
  onBlockApply?: (blockEndAt: string) => void;
  lineId?: number;
};

const BlockTab = ({ onBlockApply, lineId }: Props) => {
  return (
    <div className="flex flex-col gap-3 py-4 text-center text-gray-500">
      <BlockPolicyManager lineId={lineId} />
      <ImmediateBlockPolicy lineId={lineId} onApply={onBlockApply} />
    </div>
  );
};

export default BlockTab;
