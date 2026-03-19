import type { SlideData } from "./slides";
import alarmScreen from "@/assets/img/screenshot6.png";
import settingScreen from "@/assets/img/screenshot9.png";
import inquiryScreen from "@/assets/img/screenshot10.png";
import { useEffect, useState } from "react";

interface MockUIProps {
  mockType: SlideData["mockType"];
}

export function NotificationMock() {
  const screens = [alarmScreen, settingScreen, inquiryScreen];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % screens.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl">
      {screens.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0 }}
        />
      ))}
    </div>
  );
}

export default function MockUI({ mockType }: MockUIProps) {
  switch (mockType) {
    case "welcome":
      return (
        <div className="flex flex-col items-center justify-center h-full gap-3">
          <div className="w-20 h-20 rounded-full bg-white/30 flex items-center justify-center text-4xl">
            👋
          </div>
          <p className="text-white/60 text-sm">환영합니다!</p>
        </div>
      );

    case "main":
      return (
        <div className="flex flex-col items-center gap-3 p-5 w-full">
          <div className="w-20 h-20 rounded-full bg-white/40 flex items-center justify-center text-lg font-bold text-gray-700">
            43%
          </div>
          <div className="flex gap-2">
            {["기본 100GB", "추가 45GB"].map((tag) => (
              <span
                key={tag}
                className="bg-white/25 rounded-full text-white/80 text-xs px-3 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-end gap-1.5 h-16">
            {[35, 50, 42, 28, 55].map((h, i) => (
              <div
                key={i}
                className="w-6 bg-white/35 rounded-t"
                style={{ height: `${h}px` }}
              />
            ))}
          </div>
        </div>
      );

    case "members":
      return (
        <div className="flex flex-col gap-3 p-5 w-full">
          {[32, 21, 15].map((pct, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/45 shrink-0" />
              <div className="flex-1 h-3 bg-white/30 rounded-full" />
              <span className="text-white/70 text-xs">{pct}%</span>
            </div>
          ))}
        </div>
      );

    case "detail":
      return (
        <div className="flex flex-col items-center gap-2 p-5 w-full">
          <div className="flex items-end gap-1.5 h-20 w-full justify-center">
            {[40, 55, 70, 45, 60, 35, 50].map((h, i) => (
              <div
                key={i}
                className="w-4 bg-white/35 rounded-t"
                style={{ height: `${h}px` }}
              />
            ))}
          </div>
          <div className="w-full flex flex-col gap-2 mt-1">
            <div className="h-2.5 bg-white/30 rounded-full w-4/5" />
            <div className="h-2.5 bg-white/30 rounded-full w-3/5" />
          </div>
        </div>
      );

    case "apps":
      return (
        <div className="flex flex-col gap-3 p-5 w-full">
          {[
            { gb: "4.2GB", w: "75%" },
            { gb: "3.1GB", w: "55%" },
            { gb: "1.8GB", w: "35%" },
          ].map(({ gb, w }, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-white/40 shrink-0" />
              <div
                className="h-2 bg-white/35 rounded-full"
                style={{ width: w, flex: "none" }}
              />
              <span className="text-white/70 text-xs ml-auto">{gb}</span>
            </div>
          ))}
        </div>
      );

    case "policy":
      return (
        <div className="flex flex-col gap-3 p-5 w-full">
          <div className="h-4 bg-white/30 rounded-full w-full" />
          <div className="flex gap-2">
            <div className="flex-1 h-8 bg-white/30 rounded-lg" />
            <div className="flex-1 h-8 bg-white/30 rounded-lg" />
          </div>
          <div className="h-2.5 bg-white/25 rounded-full w-[85%]" />
          <div className="h-2.5 bg-white/25 rounded-full w-[70%]" />
        </div>
      );

    case "notification":
      return <NotificationMock />;

    case "permission":
      return (
        <div className="flex flex-col items-center gap-3 p-5 w-full">
          <span className="bg-yellow-400/20 border border-yellow-400/40 rounded-full text-yellow-300 text-xs px-3 py-1">
            대표자 전용
          </span>
          <div className="w-full flex flex-col gap-2">
            <div className="h-3 bg-white/30 rounded-full w-[90%]" />
            <div className="h-3 bg-white/30 rounded-full w-[70%]" />
          </div>
        </div>
      );

    case "control":
      return (
        <div className="flex flex-col items-center gap-3 p-5 w-full">
          <span className="bg-yellow-400/20 border border-yellow-400/40 rounded-full text-yellow-300 text-xs px-3 py-1">
            대표자 전용
          </span>
          <div className="w-full flex flex-col gap-3">
            {[true, false].map((on, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-2.5 bg-white/30 rounded-full w-1/2" />
                <div
                  className={`w-8 h-4 rounded-full ${
                    on ? "bg-blue-400/60" : "bg-white/25"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      );

    case "start":
      return (
        <div className="flex flex-col items-center justify-center h-full gap-2">
          <p className="text-white/50 text-sm">준비 완료!</p>
        </div>
      );

    default:
      return null;
  }
}
