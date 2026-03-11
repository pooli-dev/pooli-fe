interface ModeToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function DarkModeToggle({ checked, onChange }: ModeToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label="다크 모드"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-200 ${
        checked ? 'bg-[#4A5568]' : 'bg-[#E0E0E0]'
      }`}
    >
      <span
        className={`inline-flex h-7 w-7 transform items-center justify-center rounded-full bg-white shadow-lg transition-transform duration-200 ${
          checked ? 'translate-x-8' : 'translate-x-1'
        }`}
      >
        {checked ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#4A5568" stroke="#4A5568" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="4" fill="#FDB813" stroke="#FDB813" strokeWidth="2"/>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="#FDB813" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )}
      </span>
    </button>
  );
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

export function ChildModeToggle({ checked, onChange }: ModeToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label="어린이 모드"
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
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="11" r="8" stroke={checked ? '#7B9EFF' : '#999999'} strokeWidth="2" fill="none"/>
          <circle cx="9" cy="10" r="1.2" fill={checked ? '#7B9EFF' : '#999999'}/>
          <circle cx="15" cy="10" r="1.2" fill={checked ? '#7B9EFF' : '#999999'}/>
          <circle cx="7" cy="12" r="1.5" fill={checked ? '#FFB3BA' : '#E0E0E0'} opacity="0.6"/>
          <circle cx="17" cy="12" r="1.5" fill={checked ? '#FFB3BA' : '#E0E0E0'} opacity="0.6"/>
          <circle cx="12" cy="14" r="1" fill={checked ? '#7B9EFF' : '#999999'}/>
          <path d="M8 5c0-1 1-2 2-2M12 3c0-1 0-1.5 0-1.5M16 5c0-1-1-2-2-2" stroke={checked ? '#7B9EFF' : '#999999'} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </span>
    </button>
  );
}
