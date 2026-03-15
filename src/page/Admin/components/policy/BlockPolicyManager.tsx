import { useState, useRef, useEffect, useCallback } from "react";
import GlassCard from "@/components/common/GlassCard";
import Toggle from "@/components/common/Toggle";
import { blockService } from "@/api";
import type { RepeatBlockPolicy, RepeatBlockDay } from "@/api/services/blockService";
import { getErrorMessage } from "@/api/client";
import ConfirmModal from "@/components/common/ConfirmModal";

type DayKey = "월" | "화" | "수" | "목" | "금" | "토" | "일";
const DAYS: DayKey[] = ["월", "화", "수", "목", "금", "토", "일"];

const DAY_MAP: Record<DayKey, RepeatBlockDay['dayOfWeek']> = {
  "월": "MON", "화": "TUE", "수": "WED", "목": "THU", "금": "FRI", "토": "SAT", "일": "SUN"
};

const DAY_MAP_REVERSE: Record<RepeatBlockDay['dayOfWeek'], DayKey> = {
  "MON": "월", "TUE": "화", "WED": "수", "THU": "목", "FRI": "금", "SAT": "토", "SUN": "일"
};

type BlockPolicy = {
  id: number;
  startHour: number;
  startMin: number;
  endHour: number;
  endMin: number;
  days: DayKey[];
  enabled: boolean;
};

type Props = {
  lineId: number;
  onPolicyChange?: () => void;
};

function formatTime(h: number, m: number) {
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function formatDays(days: DayKey[]) {
  return days.join(", ") + " 적용됨";
}

function clampEndTime(
  startH: number,
  startM: number,
  endH: number,
  endM: number,
) {
  const startTotal = startH * 60 + startM;
  const endTotal = endH * 60 + endM;
  const diff =
    endTotal >= startTotal
      ? endTotal - startTotal
      : endTotal + 1440 - startTotal;
  if (diff > 24 * 60) {
    const maxTotal = (startTotal + 24 * 60) % (24 * 60);
    return { endHour: Math.floor(maxTotal / 60), endMin: maxTotal % 60 };
  }
  return { endHour: endH, endMin: endM };
}

// ── 드럼롤 스크롤 피커 ────────────────────────────────────────────────────────
const ITEM_HEIGHT = 40;
const VISIBLE_COUNT = 5;

function ScrollPicker({
  values,
  selected,
  onChange,
}: {
  values: number[];
  selected: number;
  onChange: (v: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);

  const scrollToValue = useCallback(
    (val: number, smooth = true) => {
      const el = containerRef.current;
      if (!el) return;
      const idx = values.indexOf(val);
      el.scrollTo({
        top: idx * ITEM_HEIGHT,
        behavior: smooth ? "smooth" : "auto",
      });
    },
    [values],
  );

  useEffect(() => {
    scrollToValue(selected, false);
  }, [scrollToValue, selected]);

  const handleScroll = () => {
    if (isScrolling.current) return;
    const el = containerRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollTop / ITEM_HEIGHT);
    const snapped = values[Math.min(Math.max(idx, 0), values.length - 1)];
    if (snapped !== selected) onChange(snapped);
  };

  const handleScrollEnd = () => {
    const el = containerRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollTop / ITEM_HEIGHT);
    const snapped = values[Math.min(Math.max(idx, 0), values.length - 1)];
    isScrolling.current = true;
    scrollToValue(snapped);
    setTimeout(() => {
      isScrolling.current = false;
    }, 300);
    if (snapped !== selected) onChange(snapped);
  };

  return (
    <div
      className="relative"
      style={{ width: 48, height: ITEM_HEIGHT * VISIBLE_COUNT }}
    >
      {/* 선택 영역 하이라이트 */}
      <div
        className="absolute left-0 right-0 pointer-events-none rounded-xl"
        style={{
          top: ITEM_HEIGHT * Math.floor(VISIBLE_COUNT / 2),
          height: ITEM_HEIGHT,
          backgroundColor: "rgba(103, 139, 247, 0.12)",
          border: "1.5px solid rgba(103, 139, 247, 0.25)",
        }}
      />
      {/* 위아래 페이드 */}
      <div
        className="absolute inset-x-0 top-0 h-16 pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(248,249,255,1), transparent)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-16 pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(to top, rgba(248,249,255,1), transparent)",
        }}
      />

      <div
        ref={containerRef}
        className="h-full overflow-y-scroll"
        style={{ scrollSnapType: "y mandatory", scrollbarWidth: "none" }}
        onScroll={handleScroll}
        onScrollCapture={handleScroll}
        onMouseUp={handleScrollEnd}
        onTouchEnd={handleScrollEnd}
      >
        {/* 상단 패딩 */}
        {Array.from({ length: Math.floor(VISIBLE_COUNT / 2) }).map((_, i) => (
          <div key={`top-${i}`} style={{ height: ITEM_HEIGHT }} />
        ))}
        {values.map((val) => (
          <div
            key={val}
            onClick={() => {
              onChange(val);
              scrollToValue(val);
            }}
            className="flex items-center justify-center cursor-pointer transition-all"
            style={{
              height: ITEM_HEIGHT,
              scrollSnapAlign: "center",
              fontSize: val === selected ? 22 : 16,
              fontWeight: val === selected ? 700 : 400,
              color: val === selected ? "#678BF7" : "#9CA3AF",
            }}
          >
            {String(val).padStart(2, "0")}
          </div>
        ))}
        {/* 하단 패딩 */}
        {Array.from({ length: Math.floor(VISIBLE_COUNT / 2) }).map((_, i) => (
          <div key={`bot-${i}`} style={{ height: ITEM_HEIGHT }} />
        ))}
      </div>
    </div>
  );
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINS = Array.from({ length: 60 }, (_, i) => i);

// ── 시간 피커 ─────────────────────────────────────────────────────────────────
function TimePicker({
  label,
  hour,
  min,
  onHourChange,
  onMinChange,
}: {
  label: string;
  hour: number;
  min: number;
  onHourChange: (h: number) => void;
  onMinChange: (m: number) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs text-gray-400">{label}</span>
      <div className="flex items-center gap-1">
        <ScrollPicker values={HOURS} selected={hour} onChange={onHourChange} />
        <span className="text-2xl font-bold text-gray-300 pb-1">:</span>
        <ScrollPicker values={MINS} selected={min} onChange={onMinChange} />
      </div>
    </div>
  );
}

// ── 편집 패널 ─────────────────────────────────────────────────────────────────
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

      {/* 시간 피커 */}
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

      {/* 안내 */}
      <div className="mt-4 space-y-1">
        <p className="text-xs text-gray-400 text-left">
          • 요일 설정은 시작일 기준입니다.
        </p>
        <p className="text-xs text-gray-400 text-left">
          • 차단 시간은 최대 24시간까지만 설정할 수 있습니다.
        </p>
      </div>

      {/* 버튼 */}
      <div className="flex gap-2 mt-4">
        {mode === "add" ? (
          <>
            <button
              onClick={() => onConfirm(draft)}
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

// ── BlockPolicyManager ────────────────────────────────────────────────────────
let nextId = 100;

export default function BlockPolicyManager({ lineId, onPolicyChange }: Props) {
  const [policies, setPolicies] = useState<BlockPolicy[]>([]);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState<{ show: boolean; message: string; onConfirm: () => void }>({
    show: false, message: '', onConfirm: () => {}
  });

  useEffect(() => {
    loadPolicies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineId]);

  const loadPolicies = async () => {
    setLoading(true);
    try {
      const res = await blockService.getRepeatBlockPolicies(lineId);
      setPolicies(res.data.map(convertToDraft));
    } catch (err) {
      console.error('반복 차단 정책 조회 실패:', err);
      alert(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const convertToDraft = (rp: RepeatBlockPolicy): BlockPolicy => {
    const firstDay = rp.days[0];
    const [startH, startM] = firstDay.startAt.split(':').map(Number);
    const [endH, endM] = firstDay.endAt.split(':').map(Number);
    return {
      id: rp.repeatBlockId,
      startHour: startH,
      startMin: startM,
      endHour: endH,
      endMin: endM,
      days: rp.days.map(d => DAY_MAP_REVERSE[d.dayOfWeek]),
      enabled: rp.isActive
    };
  };

  const convertToAPI = (draft: BlockPolicy): RepeatBlockDay[] => {
    const formatTime = (h: number, m: number) => 
      `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
    
    return draft.days.map(day => ({
      dayOfWeek: DAY_MAP[day],
      startAt: formatTime(draft.startHour, draft.startMin),
      endAt: formatTime(draft.endHour, draft.endMin),
    }));
  };

  const updatePolicyOptimistically = async (
    id: number,
    updater: (policies: BlockPolicy[]) => BlockPolicy[],
    apiCall: () => Promise<{ data: RepeatBlockPolicy }>,
    successMessage?: string
  ) => {
    const prevPolicies = [...policies];
    setPolicies(updater(policies));
    
    try {
      const response = await apiCall();
      if (response?.data) {
        const updated = convertToDraft(response.data);
        setPolicies(prev => prev.map(p => p.id === id ? updated : p));
      }
      if (successMessage) console.log(successMessage);
      onPolicyChange?.();
    } catch (err) {
      console.error('작업 실패:', err);
      setPolicies(prevPolicies);
      alert(getErrorMessage(err));
    }
  };

  const newDraft = (): BlockPolicy => ({
    id: ++nextId,
    startHour: 22,
    startMin: 0,
    endHour: 7,
    endMin: 0,
    days: ["월", "수", "금"],
    enabled: true,
  });

  const handleAdd = async (p: BlockPolicy) => {
    try {
      const response = await blockService.createRepeatBlockPolicy({
        lineId,
        isActive: true,
        days: convertToAPI(p)
      });
      setPolicies([...policies, convertToDraft(response.data)]);
      setShowAddPanel(false);
      onPolicyChange?.();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const handleUpdate = (id: number, p: BlockPolicy) => {
    updatePolicyOptimistically(
      id,
      policies => policies.map(policy => policy.id === id ? p : policy),
      () => blockService.updateRepeatBlockPolicy(id, {
        lineId,
        repeatBlockId: id,
        isActive: p.enabled,
        days: convertToAPI(p)
      }),
      '수정 성공'
    );
  };

  const handleDelete = (id: number) => {
    setConfirmModal({
      show: true,
      message: '이 차단 일정을 삭제하시겠습니까?',
      onConfirm: async () => {
        const prevPolicies = [...policies];
        setPolicies(policies.filter(p => p.id !== id));
        setConfirmModal({ show: false, message: '', onConfirm: () => {} });
        
        try {
          await blockService.deleteRepeatBlockPolicy(id);
          onPolicyChange?.();
        } catch (err) {
          console.error('삭제 실패:', err);
          setPolicies(prevPolicies);
          alert(getErrorMessage(err));
        }
      }
    });
  };

  const handleToggle = (id: number, enabled: boolean) => {
    const policy = policies.find(p => p.id === id);
    if (!policy) return;
    
    updatePolicyOptimistically(
      id,
      policies => policies.map(p => p.id === id ? { ...p, enabled } : p),
      () => blockService.updateRepeatBlockPolicy(id, {
        lineId,
        repeatBlockId: id,
        isActive: enabled,
        days: convertToAPI(policy)
      }),
      '토글 성공'
    );
  };

  if (loading) {
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
        <div className="text-center py-4 text-gray-400">불러오는 중...</div>
      </GlassCard>
    );
  }

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
            <PolicyItem
              policy={policy}
              onUpdate={(p) => handleUpdate(policy.id, p)}
              onDelete={() => handleDelete(policy.id)}
              onToggle={(enabled) => handleToggle(policy.id, enabled)}
            />
          </div>
        ))}
      </div>
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

      {confirmModal.show && (
        <ConfirmModal
          isOpen={confirmModal.show}
          message={confirmModal.message}
          onConfirm={confirmModal.onConfirm}
          onClose={() => setConfirmModal({ show: false, message: '', onConfirm: () => {} })}
        />
      )}
    </GlassCard>
  );
}
