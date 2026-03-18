import { useState } from "react";
import Toggle from "@/components/common/Toggle";
import EditPanel from "./EditPanel";
import { formatTime, formatDays } from "@/utils/dataFormat";
import type { BlockPolicy } from "@/types/block";

export default function BlockItem({
  policy,
  onUpdate,
  onDelete,
  onToggle,
}: {
  policy: BlockPolicy;
  onUpdate: (p: BlockPolicy) => void;
  onDelete: () => void;
  onToggle: (enabled: boolean) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div
        className="flex items-start gap-3 cursor-pointer py-1"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 text-left">
            {formatTime(policy.startHour, policy.startMin)} ~{" "}
            {formatTime(policy.endHour, policy.endMin)}
          </p>
          <p className="text-xs text-gray-400 mt-0.5 text-left">
            {formatDays(policy.days)}
          </p>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <Toggle checked={policy.enabled} onChange={onToggle} />
        </div>
      </div>
      {open && (
        <EditPanel
          policy={policy}
          mode="edit"
          onConfirm={(updated) => {
            onUpdate(updated);
            setOpen(false);
          }}
          onDelete={() => {
            onDelete();
            setOpen(false);
          }}
          onCancel={() => setOpen(false)}
        />
      )}
    </div>
  );
}
