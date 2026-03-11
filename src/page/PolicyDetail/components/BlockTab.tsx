import BlockPolicyManager from "./Blockpolicymanager";
import ImmediateBlockPolicy from "./Immediateblockpolicy";

type Props = {
  onBlockApply?: (minutes: number) => void;
};

const BlockTab = ({ onBlockApply }: Props) => {
  return (
    <div className="flex flex-col gap-3 px-4 py-8 text-center text-gray-500">
      <BlockPolicyManager
        initialPolicies={[
          {
            id: 1,
            startHour: 22,
            startMin: 0,
            endHour: 7,
            endMin: 0,
            days: ["월", "수", "금"],
            enabled: true,
          },
          {
            id: 2,
            startHour: 22,
            startMin: 0,
            endHour: 7,
            endMin: 0,
            days: ["월", "수", "금"],
            enabled: false,
          },
        ]}
        onSave={() => {}}
      />
      <ImmediateBlockPolicy
        initialEnabled={true}
        onDurationChange={onBlockApply}
        onToggle={() => {}}
      />
    </div>
  );
};

export default BlockTab;
