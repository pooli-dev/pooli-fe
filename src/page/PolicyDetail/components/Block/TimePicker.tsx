import ScrollPicker from "./ScrollPicker";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINS = Array.from({ length: 60 }, (_, i) => i);

export default function TimePicker({
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
