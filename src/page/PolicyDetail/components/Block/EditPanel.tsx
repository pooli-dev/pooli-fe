import { useState } from "react";
import TimePicker from "./TimePicker";
import { clampEndTime } from "@/utils/dataFormat";
import type { BlockPolicy, DayKey } from "@/types/block";
import { DAYS } from "@/types/block";

export default function EditPanel({
  policy,
  mode,
  onConfirm,
  onDelete,
  onCancel,
}: {
  policy: BlockPolicy;
  mode: "add" | "edit";
  onConfirm: (p: BlockPolicy) => void;
  onDelete?: () => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<BlockPolicy>({ ...policy });

  const setStartHour = (h: number) => {
    const clamped = clampEndTime(
      h,
      draft.startMin,
      draft.endHour,
      draft.endMin,
    );
    setDraft((d) => ({ ...d, startHour: h, ...clamped }));
  };
  const setStartMin = (m: number) => {
    const clamped = clampEndTime(
      draft.startHour,
      m,
      draft.endHour,
      draft.endMin,
    );
    setDraft((d) => ({ ...d, startMin: m, ...clamped }));
  };
  const setEndHour = (h: number) => {
    const clamped = clampEndTime(
      draft.startHour,
      draft.startMin,
      h,
      draft.endMin,
    );
    setDraft((d) => ({ ...d, ...clamped }));
  };
  const setEndMin = (m: number) => {
    const clamped = clampEndTime(
      draft.startHour,
      draft.startMin,
      draft.endHour,
      m,
    );
    setDraft((d) => ({ ...d, ...clamped }));
  };
  const toggleDay = (day: DayKey) => {
    setDraft((d) => ({
      ...d,
      days: d.days.includes(day)
        ? d.days.filter((x) => x !== day)
        : [...d.days, day],
    }));
  };

  return (
    <div
      className="mt-2 rounded-2xl p-4 border border-dashed border-gray-200"
      style={{ backgroundColor: "rgba(248,249,255,0.8)" }}
    >
      <div className="flex justify-between mb-5">
        {DAYS.map((day) => {
          const selected = draft.days.includes(day);
          return (
            <button
              key={day}
              onClick={() => toggleDay(day)}
              className="w-9 h-9 rounded-full text-sm font-semibold transition-all"
              style={{
                backgroundColor: selected ? "#678BF7" : "transparent",
                color: selected ? "white" : "#9CA3AF",
                border: selected ? "none" : "1.5px solid #E5E7EB",
              }}
            >
              {day}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-6">
        <TimePicker
          label="시작 시간"
          hour={draft.startHour}
          min={draft.startMin}
          onHourChange={setStartHour}
          onMinChange={setStartMin}
        />
        <span className="text-xl text-gray-300 mt-4">~</span>
        <TimePicker
          label="종료 시간"
          hour={draft.endHour}
          min={draft.endMin}
          onHourChange={setEndHour}
          onMinChange={setEndMin}
        />
      </div>

      <div className="mt-4 space-y-1">
        <p className="text-xs text-gray-400 text-left">
          • 요일 설정은 시작일 기준입니다.
        </p>
        <p className="text-xs text-gray-400 text-left">
          • 차단 시간은 최대 24시간까지만 설정할 수 있습니다.
        </p>
      </div>

      <div className="flex gap-2 mt-4">
        {mode === "add" ? (
          <>
            <button
              onClick={() => onConfirm(draft)}
              disabled={draft.days.length === 0}
              className="flex-1 py-2.5 rounded-full text-sm font-semibold text-white"
              style={{ backgroundColor: "#678BF7" }}
            >
              정책 추가하기
            </button>
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-full text-sm font-semibold text-gray-500 border border-gray-200"
            >
              취소하기
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onConfirm({ ...draft, enabled: true })}
              className="flex-1 py-2.5 rounded-full text-sm font-semibold text-white"
              style={{ backgroundColor: "#678BF7" }}
            >
              정책 수정하기
            </button>
            <button
              onClick={onDelete}
              className="flex-1 py-2.5 rounded-full text-sm font-semibold text-white"
              style={{ backgroundColor: "#F87171" }}
            >
              삭제하기
            </button>
          </>
        )}
      </div>
    </div>
  );
}
