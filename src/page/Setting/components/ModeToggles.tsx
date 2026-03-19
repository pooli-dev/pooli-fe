interface ModeToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function LargeTextToggle({ checked, onChange }: ModeToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label="큰글씨 모드"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-200 ${
        checked ? 'bg-[#7B9EFF]' : 'bg-[#E0E0E0]'
      }`}
    >
      <span
        className={`inline-flex h-7 w-7 transform items-center justify-center rounded-full bg-white shadow-lg transition-transform duration-200 ${
          checked ? 'translate-x-8' : 'translate-x-1'
        }`}
      >
        <span className={`font-bold ${checked ? 'text-[#7B9EFF]' : 'text-[#999999]'}`} style={{ fontSize: checked ? '1.25em' : '1em' }}>{checked ? 'A' : 'a'}</span>
      </span>
    </button>
  );
}
