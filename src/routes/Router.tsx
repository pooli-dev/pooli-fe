import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "../layout/Layout";
import Home from "../page/Home";
import Support from "../page/Support";
import Policy from "../page/Policy/Policy";
import Main from "@/page/Main/MainPage";
import Alarm from "../page/Alarm";
import Setting from "../page/Setting";
import Detail from "../page/Detail";
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
import Log from "@/page/Log/LogPage";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Routes - 별도 레이아웃 */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<PolicyManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="inquiries" element={<InquiryManagement />} />
          <Route path="notifications" element={<NotificationManagement />} />
        </Route>

        {/* 레이아웃 없는 페이지 */}
        <Route path="/login" element={<Login />} />

        {/* User Routes - 기존 레이아웃 */}
        <Route
          path="/*"
          element={
            <Layout>
              <StatusBar />
              <Header />
              <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/home" element={<Home />} />
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
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
