import { useState } from "react";
import CircleProgress from "../Main/components/PieChart";

export default function Main() {
  const [value, setValue] = useState(65);

  return (
    // 전체 영역
    <div className="min-h-dvh flex items-center justify-center">
      {/* 그래프와 텍스트를 감싸는 영역 */}
      <div className="flex flex-col items-center gap-4">
        <CircleProgress value={value} />

        <input
          className="w-64"
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
        />
      </div>
    </div>
  );
}
