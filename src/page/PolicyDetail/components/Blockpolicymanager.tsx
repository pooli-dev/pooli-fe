import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import GlassCard from "@/components/common/GlassCard";
import BlockItem from "./Block/BlockItem";
import EditPanel from "./Block/EditPanel";
import { blockService } from "@/api/index";
import { toBlockPolicy, toApiPayload } from "@/utils/dataFormat";
import type { BlockPolicy } from "@/types/block";
import { useToastStore } from "@/store/toastStore";

export default function BlockPolicyManager({ lineId }: { lineId?: number }) {
  const [showAddPanel, setShowAddPanel] = useState(false);
  const queryClient = useQueryClient();
  const { show } = useToastStore();

  const { data: policies = [] } = useQuery({
    queryKey: ["repeatBlocks", lineId],
    queryFn: () =>
      blockService
        .getRepeatBlockPolicies(lineId!)
        .then((res) => res.data.map(toBlockPolicy)),
    enabled: !!lineId,
  });

  const { mutate: createBlock } = useMutation({
    mutationFn: (policy: BlockPolicy) =>
      blockService.createRepeatBlockPolicy(toApiPayload(policy)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repeatBlocks", lineId] });
      show("차단 정책이 추가되었습니다.");
    },
    onError: () => show("차단 정책 추가에 실패했습니다.", "error"),
  });

  const { mutate: updateBlock } = useMutation({
    mutationFn: (policy: BlockPolicy) =>
      blockService.updateRepeatBlockPolicy(policy.id, toApiPayload(policy)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repeatBlocks", lineId] });
      show("차단 정책이 수정되었습니다.");
    },
    onError: () => show("차단 정책 수정에 실패했습니다.", "error"),
  });

  const { mutate: deleteBlock } = useMutation({
    mutationFn: (id: number) => blockService.deleteRepeatBlockPolicy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repeatBlocks", lineId] });
      show("차단 정책이 삭제되었습니다.");
    },
    onError: () => show("차단 정책 삭제에 실패했습니다.", "error"),
  });

  const { mutate: toggleBlock } = useMutation({
    mutationFn: (policy: BlockPolicy) =>
      blockService.updateRepeatBlockPolicy(policy.id, toApiPayload(policy)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repeatBlocks"] });
      show("차단 정책이 변경되었습니다.");
    },
    onError: () => show("차단 정책 변경에 실패했습니다.", "error"),
  });

  const newDraft = (): BlockPolicy => ({
    id: 0,
    lineId: lineId!,
    startHour: 0,
    startMin: 0,
    endHour: 0,
    endMin: 0,
    days: [],
    enabled: true,
  });

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
      className="w-full"
    >
      <h2 className="text-base font-bold text-gray-800 mb-4 text-left">
        반복 차단 정책
      </h2>
      <div className="flex flex-col divide-y divide-gray-100">
        {policies.map((policy) => (
          <div key={policy.id} className="py-2 first:pt-0 last:pb-0">
            <BlockItem
              policy={policy}
              onUpdate={(p) => updateBlock(p)}
              onDelete={() => deleteBlock(policy.id)}
              onToggle={(enabled) => toggleBlock({ ...policy, enabled })}
            />
          </div>
        ))}
      </div>
      {showAddPanel && (
        <div className="mt-2">
          <EditPanel
            policy={newDraft()}
            mode="add"
            onConfirm={(p) => {
              createBlock(p);
              setShowAddPanel(false);
            }}
            onCancel={() => setShowAddPanel(false)}
          />
        </div>
      )}
      {!showAddPanel && (
        <button
          onClick={() => setShowAddPanel(true)}
          className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold text-gray-500 border border-dashed border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 4v16m8-8H4"
              stroke="#9CA3AF"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
          차단 일정 추가
        </button>
      )}
    </GlassCard>
  );
}
