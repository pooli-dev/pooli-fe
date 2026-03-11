/**
 * 토글 스위치 컴포넌트
 *
 * @example
 * // 기본 사용
 * const [isOn, setIsOn] = useState(false);
 * <Toggle checked={isOn} onChange={setIsOn} />
 *
 * @example
 * // 비활성화 상태
 * <Toggle checked={true} onChange={() => {}} disabled />
 */

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

export default function Toggle({
  checked,
  onChange,
  disabled = false,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
}: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`
        relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-200 ease-in-out
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
      style={{
        background: checked
          ? "linear-gradient(135deg, rgba(147, 174, 255, 0.9), rgba(99, 139, 247, 0.8))"
          : "linear-gradient(135deg, rgba(220, 220, 220, 0.9), rgba(180, 180, 180, 0.7))",
        boxShadow: checked
          ? "inset 0 1px 3px rgba(255,255,255,0.4), 0 2px 8px rgba(103, 139, 247, 0.3)"
          : "inset 0 1px 3px rgba(255,255,255,0.4), 0 2px 6px rgba(0,0,0,0.1)",
        border: checked
          ? "1px solid rgba(255,255,255,0.5)"
          : "1px solid rgba(255,255,255,0.6)",
        backdropFilter: "blur(4px)",
      }}
    >
      <span
        className={`
          inline-block h-6 w-6 transform rounded-full transition-transform duration-200 ease-in-out
          ${checked ? "translate-x-7" : "translate-x-1"}
        `}
        style={{
          background: checked
            ? "linear-gradient(135deg, rgba(255,255,255,0.5), rgba(220,230,255,0.9))"
            : "linear-gradient(135deg, rgba(255,255,255,0.5), rgba(240,240,240,0.9))",
          boxShadow:
            "0 2px 6px rgba(0,0,0,0.15), inset 0 1px 2px rgba(255,255,255,0.8)",
        }}
      />
    </button>
  );
}
