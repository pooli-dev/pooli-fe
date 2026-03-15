import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "../layout/Layout";
import Support from "../page/Support/Support";
import Policy from "../page/Policy/Policy";
import Main from "@/page/Main/MainPage";
import Alarm from "../page/Alarm";
import Setting from "../page/Setting/Setting";
import Detail from "../page/Detail/DetailPage";
import PolicyDetail from "../page/PolicyDetail/PolicyDetail";
import NotFound from "../page/NotFound";
import SharedData from "../page/SharedData/SharedData";
import StatusBar from "../components/StatusBar";
import Header from "../components/Header";
import BottomBar from "../components/BottomBar";
import AdminLayout from "../page/Admin/AdminLayout";
import PolicyManagement from "../page/Admin/PolicyManagement";
import UserManagement from "../page/Admin/UserManagement";
import InquiryManagement from "../page/Admin/InquiryManagement";
import NotificationManagement from "../page/Admin/NotificationManagement";
import Login from "@/page/Login/LoginPage";
import AdminLogin from "@/page/Admin/AdminLoginPage";
import Log from "@/page/Log/LogPage";
import { getAppType } from "@/utils/domain";
import ProtectedRoute from "./ProtectedRoute";

// 어드민용 인증 체크 (토큰 기반)
function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("accessToken");
  const adminAuth = localStorage.getItem("adminAuthenticated");
  if (!token && !adminAuth) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}

export default function Router() {
  const appType = getAppType();

  // Admin 도메인 라우팅
  if (appType === 'admin') {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route path="/admin" element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }>
            <Route index element={<PolicyManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="inquiries" element={<InquiryManagement />} />
            <Route path="notifications" element={<NotificationManagement />} />
          </Route>

          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }

  // User 도메인 라우팅
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <StatusBar />
                <Header />
                <Routes>
                  <Route path="/main" element={<Main />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/policy" element={<Policy />} />
                  <Route path="/alarm" element={<Alarm />} />
                  <Route path="/setting" element={<Setting />} />
                  <Route path="/detail" element={<Detail />} />
                  <Route path="/policy-detail" element={<PolicyDetail />} />
                  <Route path="/shared-data" element={<SharedData />} />
                  <Route path="/404" element={<NotFound />} />
                  <Route path="/log" element={<Log />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
                <BottomBar />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
