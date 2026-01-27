import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import styled from "styled-components";
import Home from "./pages/Home";
import Program from "./pages/Program";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
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
  align-items: center; /* 가로 중앙 정렬 */
`;

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <LayoutWrapper>
        <Header />
        <MainContent>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/program" element={<Program />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </MainContent>
        <Footer />
      </LayoutWrapper>
    </Router>
  );
}
export default App;
