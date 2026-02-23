import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../layout/Layout";
import Home from "../page/Home";
import Support from "../page/Support";
import Policy from "../page/Policy";
import Alarm from "../page/Alarm";
import Setting from "../page/Setting";
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
          <Route path="/" element={<Home />} />
          <Route path="/support" element={<Support />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="/alarm" element={<Alarm />} />
          <Route path="/setting" element={<Setting />} />
        </Routes>
        <BottomBar />
      </Layout>
    </BrowserRouter>
  );
}
