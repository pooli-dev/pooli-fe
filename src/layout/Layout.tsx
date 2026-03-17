import type { ReactNode } from "react";
import { useSettingStore } from "../store/settingStore";
import backgroundImg from "../assets/img/background.png";
import Toast from "@/components/common/Toast";
import StatusBar from "@/components/StatusBar";
import Header from "@/components/Header";
import BottomBar from "@/components/BottomBar";

interface LayoutProps {
  children: ReactNode;
}

/**
 * 레이아웃 컴포넌트
 * 전체 페이지 레이아웃과 배경을 제공합니다.
 * @param children - 자식 컴포넌트
 * @returns 레이아웃 JSX
 */
export default function Layout({ children }: LayoutProps) {
  const darkMode = useSettingStore((state) => state.darkMode);
  const largeTextMode = useSettingStore((state) => state.largeTextMode);

  return (
    // 1. 전체 화면을 고정하고 스크롤을 막습니다.
    <div
      className={`flex justify-center h-[100dvh] overflow-hidden bg-[#f5f5f5] font-sans ${darkMode ? "dark" : ""}`}
    >
      <div
        className={`relative w-[480px] max-w-full min-w-[330px] h-full flex flex-col bg-no-repeat bg-top transition-all duration-300 ${darkMode ? "invert" : ""} ${largeTextMode ? "large-text-content" : ""}`}
        style={{
          backgroundImage: `url(${backgroundImg})`,
          backgroundSize: "100% auto",
        }}
      >
        {/* 2. 상단 고정 (StatusBar + Header) */}
        <div className="flex-none z-[100] w-full">
          <StatusBar />
          <Header />
        </div>

        <Toast />

        {/* 3. 메인 스크롤 영역: min-h-0이 중요합니다. flex 자식의 최소 높이를 0으로 풀어야 내부 스크롤이 잡힙니다. */}
        <main className="flex-1 overflow-y-auto relative px-2 custom-scrollbar min-h-0">
          {/* pt-10 정도로 늘려서 차트가 헤더를 침범하지 못하게 물리적 공간을 확보하세요. */}
          <div className="pt-5 pb-10">{children}</div>
        </main>

        {/* 4. 하단 고정 바: 이 영역이 main 밖으로 완벽히 분리되어야 스크롤바가 침범하지 않습니다. */}
        <nav className="flex-none z-[100] w-full bg-white">
          <BottomBar />
        </nav>
      </div>
    </div>
  );
}
