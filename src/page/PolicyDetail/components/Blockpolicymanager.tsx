import { useState } from "react";
import GlassCard from "../../Main/components/GlassCard";
import Toggle from "@/components/common/Toggle";

// ── 타입 ─────────────────────────────────────────────────────────────────────
type RepeatType = "반복" | "1회";
type DayKey = "월" | "화" | "수" | "목" | "금" | "토" | "일";

const DAYS: DayKey[] = ["월", "화", "수", "목", "금", "토", "일"];

type BlockPolicy = {
  id: number;
  repeatType: RepeatType;
  startHour: number;
  startMin: number;
  endHour: number;
  endMin: number;
  days: DayKey[];
  enabled: boolean;
};

type Props = {
  initialPolicies?: BlockPolicy[];
  onSave?: (policies: BlockPolicy[]) => void;
};

// ── 유틸 ─────────────────────────────────────────────────────────────────────
function formatTime(h: number, m: number) {
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function formatDays(days: DayKey[]) {
  return days.join(", ") + " 적용됨";
}

// 시작시간 기준 최대 24시간 이내로 종료시간 계산
function clampEndTime(
  startH: number,
  startM: number,
  endH: number,
  endM: number,
): { endHour: number; endMin: number } {
  const startTotal = startH * 60 + startM;
  const endTotal = endH * 60 + endM;
  // 종료가 시작보다 이전이면 다음날로 간주 (+1440)
  const diff =
    endTotal >= startTotal
      ? endTotal - startTotal
      : endTotal + 1440 - startTotal;

  if (diff > 24 * 60) {
    // 최대 24시간
    const maxTotal = (startTotal + 24 * 60) % (24 * 60);
    return { endHour: Math.floor(maxTotal / 60), endMin: maxTotal % 60 };
  }
  return { endHour: endH, endMin: endM };
}

// ── 시간 스피너 ───────────────────────────────────────────────────────────────
function TimeSpinner({
  hour,
  min,
  onHourChange,
  onMinChange,
}: {
  hour: number;
  min: number;
  onHourChange: (h: number) => void;
  onMinChange: (m: number) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {/* 시 */}
      <div className="flex flex-col items-center">
        <button
          className="text-gray-300 hover:text-gray-500 transition-colors px-2"
          onClick={() => onHourChange((hour + 1) % 24)}
        >
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path
              d="M1 7l5-5 5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <span className="text-2xl font-bold text-gray-800 w-10 text-center tabular-nums">
          {String(hour).padStart(2, "0")}
        </span>
        <button
          className="text-gray-300 hover:text-gray-500 transition-colors px-2"
          onClick={() => onHourChange((hour + 23) % 24)}
        >
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path
              d="M1 1l5 5 5-5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <span className="text-2xl font-bold text-gray-400 mb-0.5">:</span>

      {/* 분 */}
      <div className="flex flex-col items-center">
        <button
          className="text-gray-300 hover:text-gray-500 transition-colors px-2"
          onClick={() => onMinChange((min + 1) % 60)}
        >
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path
              d="M1 7l5-5 5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <span className="text-2xl font-bold text-gray-800 w-10 text-center tabular-nums">
          {String(min).padStart(2, "0")}
        </span>
        <button
          className="text-gray-300 hover:text-gray-500 transition-colors px-2"
          onClick={() => onMinChange((min + 59) % 60)}
        >
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path
              d="M1 1l5 5 5-5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ── 편집 패널 (추가 / 수정 공통) ─────────────────────────────────────────────
function EditPanel({
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
      {/* 요일 선택 */}
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

      {/* 시간 설정 */}
      <div className="flex items-center justify-center gap-4">
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-400 mb-1">시작 시간</span>
          <TimeSpinner
            hour={draft.startHour}
            min={draft.startMin}
            onHourChange={setStartHour}
            onMinChange={setStartMin}
          />
        </div>
        <span className="text-xl text-gray-300 mt-4">~</span>
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-400 mb-1">종료 시간</span>
          <TimeSpinner
            hour={draft.endHour}
            min={draft.endMin}
            onHourChange={setEndHour}
            onMinChange={setEndMin}
          />
        </div>
      </div>

      {/* 안내 문구 */}
      <div className="mt-4 space-y-1">
        <p className="text-xs text-gray-400">
          • 요일 설정은 시작일 기준입니다.
        </p>
        <p className="text-xs text-gray-400">
          • 차단 시간은 최대 24시간까지만 설정할 수 있습니다.
        </p>
      </div>

      {/* 버튼 */}
      <div className="flex gap-2 mt-4">
        {mode === "add" ? (
          <>
            <button
              onClick={() => onConfirm(draft)}
              className="flex-1 py-2.5 rounded-full text-sm font-semibold text-white transition-opacity active:opacity-80"
              style={{ backgroundColor: "#678BF7" }}
            >
              정책 추가하기
            </button>
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-full text-sm font-semibold text-gray-500 border border-gray-200 transition-colors hover:bg-gray-50"
            >
              취소하기
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onConfirm({ ...draft, enabled: true })}
              className="flex-1 py-2.5 rounded-full text-sm font-semibold text-white transition-opacity active:opacity-80"
              style={{ backgroundColor: "#678BF7" }}
            >
              정책 수정하기
            </button>
            <button
              onClick={onDelete}
              className="flex-1 py-2.5 rounded-full text-sm font-semibold text-white transition-opacity active:opacity-80"
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

// ── 정책 아이템 ───────────────────────────────────────────────────────────────
function PolicyItem({
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
      {/* 요약 행 */}
      <div
        className="flex items-start gap-3 cursor-pointer py-1"
        onClick={() => setOpen((v) => !v)}
      >
        {/* 반복 타입 뱃지 */}
        <span
          className="flex-shrink-0 mt-0.5 px-2 py-0.5 rounded-md text-xs font-semibold"
          style={{ backgroundColor: "#EEF2FF", color: "#678BF7" }}
        >
          {policy.repeatType}
        </span>

        {/* 시간 + 요일 */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800">
            {formatTime(policy.startHour, policy.startMin)} ~{" "}
            {formatTime(policy.endHour, policy.endMin)}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {formatDays(policy.days)}
          </p>
        </div>

        {/* 토글 */}
        <div onClick={(e) => e.stopPropagation()}>
          <Toggle checked={policy.enabled} onChange={onToggle} />
        </div>
      </div>

      {/* 편집 패널 (아코디언) */}
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

// ── BlockPolicyManager (최종 export) ─────────────────────────────────────────
let nextId = 100;

export default function BlockPolicyManager({
  initialPolicies = [],
  onSave,
}: Props) {
  const [policies, setPolicies] = useState<BlockPolicy[]>(initialPolicies);
  const [showAddPanel, setShowAddPanel] = useState(false);

  const newDraft = (): BlockPolicy => ({
    id: ++nextId,
    repeatType: "반복",
    startHour: 22,
    startMin: 0,
    endHour: 7,
    endMin: 0,
    days: ["월", "수", "금"],
    enabled: true,
  });

  const handleAdd = (p: BlockPolicy) => {
    const updated = [...policies, p];
    setPolicies(updated);
    setShowAddPanel(false);
    onSave?.(updated);
  };

  const handleUpdate = (id: number, p: BlockPolicy) => {
    const updated = policies.map((m) => (m.id === id ? p : m));
    setPolicies(updated);
    onSave?.(updated);
  };

  const handleDelete = (id: number) => {
    const updated = policies.filter((m) => m.id !== id);
    setPolicies(updated);
    onSave?.(updated);
  };

  const handleToggle = (id: number, enabled: boolean) => {
    const updated = policies.map((m) => (m.id === id ? { ...m, enabled } : m));
    setPolicies(updated);
    onSave?.(updated);
  };

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
      <h2 className="text-base font-bold text-gray-800 mb-4">반복 차단 정책</h2>

      {/* 정책 목록 */}
      <div className="flex flex-col divide-y divide-gray-100">
        {policies.map((policy) => (
          <div key={policy.id} className="py-2 first:pt-0 last:pb-0">
            <PolicyItem
              policy={policy}
              onUpdate={(p) => handleUpdate(policy.id, p)}
              onDelete={() => handleDelete(policy.id)}
              onToggle={(enabled) => handleToggle(policy.id, enabled)}
            />
          </div>
        ))}
      </div>

      {/* 추가 패널 */}
      {showAddPanel && (
        <div className="mt-2">
          <EditPanel
            policy={newDraft()}
            mode="add"
            onConfirm={handleAdd}
            onCancel={() => setShowAddPanel(false)}
          />
        </div>
      )}

      {/* 차단 일정 추가 버튼 */}
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
