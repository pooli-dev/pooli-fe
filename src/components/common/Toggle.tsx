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
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

export default function Toggle({ checked, onChange, disabled = false, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledby }: ToggleProps) {
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
        relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 ease-in-out
        ${checked ? 'bg-[#7B9EFF]/80' : 'bg-[#D0D0D0]'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <span
        className={`
          inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out
          ${checked ? 'translate-x-7' : 'translate-x-1'}
        `}
      />
    </button>
  );
}
