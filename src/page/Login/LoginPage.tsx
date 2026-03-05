import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GradientButton from "../Main/components/GradientButton";
import { useSettingStore } from "../../store/settingStore";
import logo from "../../assets/img/logo.svg";
import backgroundImg from "../../assets/img/background.png";
import loginBg1 from "../../assets/img/loginBg1.png";
import loginBg2 from "../../assets/img/loginBg2.png";
import loginBg3 from "../../assets/img/loginBg3.png";
import { useNavigate } from "react-router-dom";

const backgrounds = [loginBg1, loginBg2, loginBg3];

export default function LoginPage() {
  const [currentBg, setCurrentBg] = useState(0);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const darkMode = useSettingStore((state) => state.darkMode);
  const largeTextMode = useSettingStore((state) => state.largeTextMode);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const navigate = useNavigate();

  const handleLogin = () => {
    console.log("로그인:", { userId, password });
    navigate("/");
  };

  return (
    // Layout과 동일한 래퍼 구조
    <div
      className={`flex justify-center min-h-screen bg-[#f5f5f5] font-sans ${darkMode ? "dark" : ""}`}
    >
      <div
        className={`relative w-[480px] max-w-full min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat ${darkMode ? "invert" : ""} ${largeTextMode ? "text-[1.25em]" : ""}`}
        style={{ backgroundImage: `url(${backgroundImg})` }}
      >
        {/* 슬라이딩 배경 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBg}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgrounds[currentBg]})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </AnimatePresence>

        {/* 콘텐츠 */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8">
          {/* 로고 */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img src={logo} alt="Pooli" className="w-32 h-32" />
          </motion.div>

          {/* 입력 폼 */}
          <motion.div
            className="w-full max-w-sm space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">
                아이디
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="기존 LG U+ 가입한 아이디를 입력하세요."
                className="w-full px-4 py-4 rounded-2xl border-0 bg-white/70 backdrop-blur-md text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">
                비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력해 주세요."
                className="w-full px-4 py-4 rounded-2xl border-0 bg-white/70 backdrop-blur-md text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
              />
            </div>
          </motion.div>

          {/* 로그인 버튼 */}
          <motion.div
            className="max-w-sm mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <GradientButton
              onClick={handleLogin}
              bgColor="#678BF7"
              gradientFrom="#A8C8FF"
              gradientTo="#678BF7"
              width={120} // 좌우 패딩
              height={16} // 상하 패딩
            >
              <span className="text-lg font-semibold">로그인</span>
            </GradientButton>
          </motion.div>

          {/* 추가 링크 */}
          <motion.div
            className="mt-8 flex gap-6 text-sm text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <button className="hover:text-blue-600 transition-colors">
              아이디 찾기
            </button>
            <span className="text-gray-400">|</span>
            <button className="hover:text-blue-600 transition-colors">
              비밀번호 찾기
            </button>
            <span className="text-gray-400">|</span>
            <button className="hover:text-blue-600 transition-colors">
              회원가입
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
