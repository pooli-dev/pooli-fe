import BlockPolicyManager from "./Blockpolicymanager";
import ImmediateBlockPolicy from "./Immediateblockpolicy";

const BlockTab = () => {
  return (
    <div className="flex flex-col gap-3 px-4 py-8 text-center text-gray-500">
      <BlockPolicyManager
        initialPolicies={[
          {
            id: 1,
            repeatType: "반복",
            startHour: 22,
            startMin: 0,
            endHour: 7,
            endMin: 0,
            days: ["월", "수", "금"],
            enabled: true,
          },
          {
            id: 2,
            repeatType: "1회",
            startHour: 22,
            startMin: 0,
            endHour: 7,
            endMin: 0,
            days: ["월", "수", "금"],
            enabled: false,
          },
        ]}
        onSave={(updated) => console.log("저장:", updated)}
      />
      <ImmediateBlockPolicy
        initialEnabled={true}
        onToggle={(enabled) => console.log("차단 토글:", enabled)}
        onDurationChange={(minutes) => console.log("차단 시간:", minutes, "분")}
      />
    </div>
  );
};

export default BlockTab;
