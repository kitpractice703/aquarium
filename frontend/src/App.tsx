import { Routes, Route } from "react-router-dom"; // [수정] Router, BrowserRouter 제거
import styled from "styled-components";
import Home from "./pages/Home";
import Program from "./pages/Program";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyPage from "./pages/MyPage"; // [추가] 마이페이지 컴포넌트 임포트
import Header from "./components/Header";
import Footer from "./components/Footer";

// [레이아웃] 화면 전체를 감싸는 래퍼
const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
`;

// [본문] 헤더/푸터 사이 영역이 남은 공간을 모두 차지
const MainContent = styled.main`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

function App() {
  return (
    // [중요] 여기에 <Router>가 있으면 안 됩니다! (main.tsx에 이미 있음)
    <LayoutWrapper>
      <Header />
      <MainContent>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/programs" element={<Program />} />{" "}
          {/* url 경로 'programs'로 통일 권장 */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/mypage" element={<MyPage />} />{" "}
          {/* 마이페이지 경로 추가 */}
        </Routes>
      </MainContent>
      <Footer />
    </LayoutWrapper>
  );
}

export default App;
