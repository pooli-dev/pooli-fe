import { Navigate } from "react-router-dom";
import { useUserStore } from "@/store/userStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const userInfo = useUserStore((state) => state.userInfo);

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
