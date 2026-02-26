/**
 * RangeSlider 공용 컴포넌트
 * 
 * 사용 방법:
 * <RangeSlider 
 *   value={500}
 *   onChange={(value) => console.log(value)}
 *   min={0}
 *   max={5000}
 *   step={100}
 *   disabled={false}
 * />
 */

interface RangeSliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  disabled?: boolean;
}

export default function RangeSlider({ 
  value, 
  onChange, 
  min, 
  max, 
  step = 1,
  disabled = false 
}: RangeSliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="relative w-full">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        style={{
          background: `linear-gradient(to right, #678BF7 0%, #9A9CEA ${percentage}%, #E5E7EB ${percentage}%, #E5E7EB 100%)`
        }}
      />
      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(217, 217, 217, 0.2);
          border: 2px solid white;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(217, 217, 217, 0.2);
          border: 2px solid white;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        input[type="range"]:disabled::-webkit-slider-thumb {
          background: #9CA3AF;
        }
        input[type="range"]:disabled::-moz-range-thumb {
          background: #9CA3AF;
        }
      `}</style>
    </div>
  );
}
