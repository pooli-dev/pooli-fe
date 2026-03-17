import { useNavigate } from "react-router-dom";
import { useSettingStore } from "../../store/settingStore";
import { authService, getErrorMessage } from "../../api";
import ModeSettings from "./components/ModeSettings";
import NotificationSettings from "./components/NotificationSettings";

export default function Setting() {
  const navigate = useNavigate();
  const darkMode = useSettingStore((state) => state.darkMode);

  const handleLogout = async () => {
    try {
      await authService.logout();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.error("로그아웃 에러:", getErrorMessage(error));
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <div className="px-6 pb-[60px]">
      <ModeSettings />
      <NotificationSettings />

      <div className="flex justify-center mb-3">
        <button
          onClick={handleLogout}
          className={`px-12 py-3 text-[#FF6B6B] font-medium rounded-2xl bg-white shadow-sm hover:bg-red-50 transition-colors ${darkMode ? "invert" : ""}`}
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}
