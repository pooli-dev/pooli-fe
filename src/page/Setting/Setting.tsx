import { useNavigate } from "react-router-dom";
import { authService, getErrorMessage } from "../../api";
import ModeSettings from "./components/ModeSettings";
import NotificationSettings from "./components/NotificationSettings";
import { motion } from "framer-motion";
import {
  itemVariants,
  pageTransition,
  pageVariants,
} from "@/utils/pageAnimation";

export default function Setting() {
  const navigate = useNavigate();

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
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      transition={pageTransition}
      className="px-4 pb-2"
    >
      <motion.div
        variants={itemVariants}
        transition={{ ...pageTransition, delay: 0.1 }}
      >
        <ModeSettings />
      </motion.div>

      <motion.div
        variants={itemVariants}
        transition={{ ...pageTransition, delay: 0.2 }}
      >
        <NotificationSettings />
      </motion.div>

      <motion.div
        variants={itemVariants}
        transition={{ ...pageTransition, delay: 0.3 }}
        className="flex justify-center"
      >
        <button
          onClick={handleLogout}
          className={`px-12 py-3 text-[#FF6B6B] font-medium rounded-2xl bg-white shadow-sm hover:bg-red-50 transition-colors`}
        >
          로그아웃
        </button>
      </motion.div>
    </motion.div>
  );
}
