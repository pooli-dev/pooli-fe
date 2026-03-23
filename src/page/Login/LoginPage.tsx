import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GradientButton from "../../components/common/GradientButton";
import logo from "../../assets/img/logo.svg";
import backgroundImg from "../../assets/img/background.png";
import loginBg1 from "../../assets/img/loginBg1.png";
import loginBg2 from "../../assets/img/loginBg2.png";
import loginBg3 from "../../assets/img/loginBg3.png";
import { useNavigate } from "react-router-dom";
import { authService } from "../../api";
import { userService } from "../../api";
import { getErrorMessage } from "../../api";
import { useUserStore } from "../../store/userStore";
import { getAppType } from "../../utils/domain";

const backgrounds = [loginBg1, loginBg2, loginBg3];

export default function LoginPage() {
  const [currentBg, setCurrentBg] = useState(0);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const setUserInfo = useUserStore((state) => state.setUserInfo);
  const appType = getAppType();
  const homePath = appType === "admin" ? "/admin" : "/main";

  // 이미 로그인되어 있으면 홈으로 리다이렉트
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate(homePath, { replace: true });
    }
  }, [navigate, homePath]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async () => {
    if (!userId || !password) {
      setError("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await authService.login({ email: userId, password });

      // 200 응답이면 성공으로 처리 (백엔드가 빈 응답을 보낼 수 있음)
      if (response.status === 200 || response.success) {
        // 토큰이 있으면 저장 (data가 객체인 경우에만)
        if (response.data && typeof response.data === "object") {
          if ("accessToken" in response.data && response.data.accessToken) {
            localStorage.setItem("accessToken", response.data.accessToken);
          }
          if ("refreshToken" in response.data && response.data.refreshToken) {
            localStorage.setItem("refreshToken", response.data.refreshToken);
          }
          if ("user" in response.data && response.data.user) {
            localStorage.setItem("user", JSON.stringify(response.data.user));
          }
        }

        // 내 정보 가져와서 store에 저장
        const { data } = await userService.getMyInfo();
        setUserInfo(data);

        navigate(homePath);
      } else {
        setError(response.message || "로그인에 실패했습니다.");
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-[#f5f5f5] font-sans">
      <div
        className="relative w-full desktop:w-[480px] max-w-full min-h-[100dvh] overflow-hidden bg-cover bg-center bg-no-repeat"
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
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] px-8">
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img src={logo} alt="Pooli" className="w-32 h-32" />
          </motion.div>

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
                onKeyPress={handleKeyPress}
                placeholder="기존 LG U+ 가입한 아이디를 입력하세요."
                className="w-full px-4 py-4 rounded-2xl border-0 bg-white/70 backdrop-blur-md text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                disabled={isLoading}
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
                onKeyPress={handleKeyPress}
                placeholder="비밀번호를 입력해 주세요."
                className="w-full px-4 py-4 rounded-2xl border-0 bg-white/70 backdrop-blur-md text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 py-2 px-4 rounded-lg">
                {error}
              </div>
            )}
          </motion.div>

          <motion.div
            className="max-w-sm mt-12 w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <GradientButton
              fullWidth
              onClick={handleLogin}
              bgColor="#678BF7"
              gradientFrom="#A8C8FF"
              gradientTo="#678BF7"
              disabled={isLoading}
              buttonClassName="py-4 text-lg font-semibold"
              borderRadius={15}
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </GradientButton>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
