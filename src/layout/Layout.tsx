import type { ReactNode } from "react";
import { useSettingStore } from "../store/settingStore";
import backgroundImg from "../assets/img/background.png";
import Toast from "@/components/common/Toast";
import StatusBar from "@/components/StatusBar";
import Header from "@/components/Header";

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
    <div
      className={`flex justify-center min-h-screen bg-[#f5f5f5] font-sans ${darkMode ? "dark" : ""}`}
    >
      <div
        className={`relative w-[480px] max-w-full min-w-[330px] min-h-[100dvh] pb-[env(safe-area-inset-bottom)] flex flex-col bg-cover bg-center bg-no-repeat transition-all duration-300 ${darkMode ? "invert" : ""} ${largeTextMode ? "large-text-content" : ""}`}
        style={{
          backgroundImage: `url(${backgroundImg})`,
          backgroundSize: "480px auto", // 너비를 고정하여 계산 오차 방지
          backgroundAttachment: "fixed",
        }}
      >
        <div
          className="sticky top-0 z-[100] w-full bg-cover bg-top bg-no-repeat"
          style={{
            backgroundImage: `url(${backgroundImg})`,
          }}
        >
          <StatusBar />
          <Header />
        </div>

        <Toast />
        <main className="flex-1 mt-3">{children}</main>
      </div>
    </div>
  );
}
