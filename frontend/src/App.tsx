import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 👇 이 부분(페이지 불러오기)이 빠져서 에러가 난 것입니다. 꼭 넣어주세요!
import Home from "./pages/Home";
import Program from "./pages/Program";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  return (
    // basename 설정은 그대로 유지합니다 (GitHub Pages 배포 필수 설정)
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/program" element={<Program />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}
export default App;
