/**
 * 루트 컴포넌트 - 페이지 라우팅 정의
 * - "/" : 메인 홈 페이지
 * - "/signup" : 회원가입 페이지
 * - "/mypage" : 마이페이지 (로그인 필요)
 * - Layout: 공통 헤더/푸터를 감싸는 레이아웃 컴포넌트
 */
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import MyPage from "./pages/MyPage";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/mypage" element={<MyPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
