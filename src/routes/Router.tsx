import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "../layout/Layout";
import Home from "../page/Home";
import Support from "../page/Support";
import Policy from "../page/Policy";
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

export default function Router() {
  return (
    <BrowserRouter>
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
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
        <BottomBar />
      </Layout>
    </BrowserRouter>
  );
}
