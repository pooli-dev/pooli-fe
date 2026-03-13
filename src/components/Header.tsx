import { useLocation, useNavigate } from "react-router-dom";
import { useAlarmStore } from "../store/alarmStore";
import { useSettingStore } from "../store/settingStore";
import { useUserStore } from "../store/userStore";
import logo from "../assets/img/logo.svg";
import alarmIcon from "../assets/icon/alarm-icon.png";
import settingIcon from "../assets/icon/setting-icon.png";

interface HeaderProps {
  showAlarm?: boolean;
  showSetting?: boolean;
}

/**
 * 헤더 컴포넌트
 * 로고, 페이지 제목, 알림, 설정 아이콘을 표시합니다.
 * @param showAlarm - 알림 아이콘 표시 여부
 * @param showSetting - 설정 아이콘 표시 여부
 * @returns 헤더 JSX
 */
export default function Header({
  showAlarm = true,
  showSetting = true,
}: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const unreadCount = useAlarmStore(
    (state) => state.alarms.filter((a) => !a.isRead).length,
  );
  const darkMode = useSettingStore((state) => state.darkMode);
  const userInfo = useUserStore((state) => state.userInfo);

  const isHome = location.pathname === "/main";
  const isAlarm = location.pathname === "/alarm";
  const isSetting = location.pathname === "/setting";

  /**
   * 현재 경로에 따른 페이지 제목 반환
   * @returns 페이지 제목
   */
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/support":
        return "고객지원";
      case "/policy":
        return "정책페이지";
      case "/alarm":
        return "알림";
      case "/setting":
        return "설정";
      case "/detail": {
        const userName = location.state?.userName || userInfo?.userName || "";
        return userName ? `${userName} 상세페이지` : "상세페이지";
      }
      case "/policy-detail":
        return "구성원 정책제어";
      case "/shared-data":
        return "공유 데이터 담기";
      default:
        return "";
    }
  };

  const showBackButton = !isHome;
  const showAlarmIcon = showAlarm && !isAlarm;
  const showSettingIcon = showSetting && !isSetting;

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[480px] max-w-full flex justify-between items-center px-5 h-20 pt-[env(safe-area-inset-top)] z-[100] ">
      <div className="flex items-center w-20">
        {showBackButton && (
          <button
            type="button"
            aria-label="뒤로 가기"
            className={`p-1 bg-transparent border-none cursor-pointer flex items-center justify-center ${darkMode ? "invert" : ""}`}
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate("/");
              }
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="#333333"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="flex-1 flex justify-center items-center">
        {isHome ? (
          <img
            src={logo}
            alt="Pooli"
            className={`h-16 ${darkMode ? "invert" : ""}`}
          />
        ) : (
          <h1
            className="font-semibold text-[#333333] m-0"
            style={{ fontSize: "1.2rem" }}
          >
            {getPageTitle()}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-3 w-20 justify-end">
        {showAlarmIcon && (
          <button
            type="button"
            aria-label="알림"
            className={`relative cursor-pointer flex items-center justify-center w-12 h-12 rounded-full shrink-0 border-[3px] border-white ${darkMode ? "bg-white invert" : "bg-gradient-to-b from-white/0 to-white/100 to-42%"}`}
            onClick={() => navigate("/alarm")}
          >
            <img src={alarmIcon} alt="" className="w-6 h-6" />
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-[#FF0000] rounded-full flex items-center justify-center">
                <span className="text-white text-[10px] font-bold leading-none">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              </div>
            )}
          </button>
        )}
        {showSettingIcon && (
          <button
            type="button"
            aria-label="설정"
            className={`cursor-pointer flex items-center justify-center w-12 h-12 rounded-full shrink-0 border-[3px] border-white ${darkMode ? "bg-white invert" : "bg-gradient-to-b from-white/0 to-white/100 to-42%"}`}
            onClick={() => navigate("/setting")}
          >
            <img src={settingIcon} alt="" className="w-6 h-6" />
          </button>
        )}
      </div>
    </header>
  );
}
