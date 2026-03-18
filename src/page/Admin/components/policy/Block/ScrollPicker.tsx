import { useRef, useEffect, useCallback } from "react";

const ITEM_HEIGHT = 40;
const VISIBLE_COUNT = 5;

export default function ScrollPicker({
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
      <div
        className="absolute left-0 right-0 pointer-events-none rounded-xl"
        style={{
          top: ITEM_HEIGHT * Math.floor(VISIBLE_COUNT / 2),
          height: ITEM_HEIGHT,
          backgroundColor: "rgba(103, 139, 247, 0.12)",
          border: "1.5px solid rgba(103, 139, 247, 0.25)",
        }}
      />
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
        {Array.from({ length: Math.floor(VISIBLE_COUNT / 2) }).map((_, i) => (
          <div key={`bot-${i}`} style={{ height: ITEM_HEIGHT }} />
        ))}
      </div>
    </div>
  );
}
