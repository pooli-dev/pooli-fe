import { Navigate } from "react-router-dom";
import { useUserStore } from "@/store/userStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const userInfo = useUserStore((state) => state.userInfo);
  const token = localStorage.getItem("accessToken");

  // userInfo가 있거나 토큰이 있으면 인증된 것으로 판단
  if (!userInfo && !token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
