import { useEffect, useState } from "react";

// usePieChartSize.ts
export function usePieChartSize() {
  const calc = () => {
    const vw = window.innerWidth;
    if (vw >= 1400) return { size: 320, strokeWidth: 25 };
    if (vw >= 768)
      return {
        size: Math.round(Math.min(vw * 0.5, 460)),
        strokeWidth: Math.round(Math.min(vw * 0.04, 40)), // vw의 3%, 최대 40
      };
    return { size: 320, strokeWidth: 25 };
  };

  const [chart, setChart] = useState(calc);

  useEffect(() => {
    const handler = () => setChart(calc());
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return chart;
}
