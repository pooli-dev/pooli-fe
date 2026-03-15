import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GradientButton from "../../components/common/GradientButton";
import logo from "../../assets/img/logo.svg";
import backgroundImg from "../../assets/img/background.png";
import loginBg1 from "../../assets/img/loginBg1.png";
import loginBg2 from "../../assets/img/loginBg2.png";
import loginBg3 from "../../assets/img/loginBg3.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { authService } from "../../api";
import { getErrorMessage } from "../../api/client";

const backgrounds = [loginBg1, loginBg2, loginBg3];

export default function AdminLoginPage() {
  const [currentBg, setCurrentBg] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const adminAuth = localStorage.getItem("adminAuthenticated");
    if (token || adminAuth) navigate("/admin", { replace: true });
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      const response = await authService.adminLogin({ email, password });
      if (response.status === 200 || response.success) {
        if (response.data && typeof response.data === "object") {
          if ("accessToken" in response.data && response.data.accessToken)
            localStorage.setItem("accessToken", response.data.accessToken);
          if ("refreshToken" in response.data && response.data.refreshToken)
            localStorage.setItem("refreshToken", response.data.refreshToken);
          if ("user" in response.data && response.data.user)
            localStorage.setItem("user", JSON.stringify(response.data.user));
        }
        localStorage.setItem("adminAuthenticated", "true");
        localStorage.setItem("adminEmail", email);
        navigate("/admin");
      } else {
        setError(response.message || "로그인에 실패했습니다.");
      }
    } catch (err) {
      const msg = getErrorMessage(err);
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) setError("이메일 또는 비밀번호가 올바르지 않습니다.");
        else if (err.response?.status === 403) setError("관리자 권한이 없는 계정입니다.");
        else setError(msg || "로그인에 실패했습니다.");
      } else {
        setError(msg || "로그인에 실패했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="flex justify-center min-h-[100dvh] bg-[#f5f5f5] font-sans">
      <div
        className="relative w-full min-h-[100dvh] overflow-hidden bg-cover bg-center bg-no-repeat"
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
          {/* 로고 */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img src={logo} alt="Pooli" className="w-32 h-32" />
          </motion.div>

          {/* 관리자 로그인 타이틀 */}
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h1 className="text-2xl font-semibold text-gray-900">관리자 로그인</h1>
            <p className="text-gray-600 text-sm mt-1">관리자 계정으로 로그인해주세요</p>
          </motion.div>

          {/* 입력 폼 */}
          <motion.div
            className="w-full max-w-sm space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="관리자 이메일을 입력하세요"
                className="w-full px-4 py-4 rounded-2xl border-0 bg-white/70 backdrop-blur-md text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="비밀번호를 입력해 주세요"
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
              width={120}
              height={16}
              disabled={isLoading}
            >
              <span className="text-lg font-semibold">
                {isLoading ? "로그인 중..." : "관리자 로그인"}
              </span>
            </GradientButton>
          </motion.div>

          {/* 하단 카피라이트 */}
          <motion.p
            className="text-gray-500 text-xs mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            © Pooli. 관리자 전용 페이지입니다.
          </motion.p>
        </div>
      </div>
    </div>
  );
}
