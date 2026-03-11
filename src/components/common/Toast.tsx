// components/common/Toast.tsx

/* 
사용법
import { useToastStore } from "@/store/toastStore";

const { show } = useToastStore();

// 정책 저장 성공
const handleSave = async () => {
  await savePolicy(data);
  show("정책이 저장되었습니다.");
};

// 권한 적용
const handleApply = async () => {
  await applyPermissions(data);
  show("권한이 적용되었습니다.");
};

// 실패
show("저장에 실패했습니다. 다시 시도해주세요.", "error");

// 정보
show("변경사항이 없습니다.", "info");

*/

import { useToastStore } from "@/store/toastStore";

const ICONS = {
  success: "✓",
  error: "✕",
  info: "i",
};

const COLORS = {
  success: { bg: "#E8F5E9", border: "#A5D6A7", text: "#2E7D32" },
  error: { bg: "#FFEBEE", border: "#EF9A9A", text: "#C62828" },
  info: { bg: "#E3F2FD", border: "#90CAF9", text: "#1565C0" },
};

export default function Toast() {
  const { toasts, hide } = useToastStore();

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 w-[360px] max-w-[calc(100vw-32px)]">
      {toasts.map((toast) => {
        const color = COLORS[toast.type];
        return (
          <div
            key={toast.id}
            onClick={() => hide(toast.id)}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-md cursor-pointer transition-all"
            style={{
              backgroundColor: color.bg,
              border: `1px solid ${color.border}`,
            }}
          >
            <span className="font-bold text-sm" style={{ color: color.text }}>
              {ICONS[toast.type]}
            </span>
            <span className="text-sm font-medium" style={{ color: color.text }}>
              {toast.message}
            </span>
          </div>
        );
      })}
    </div>
  );
}
