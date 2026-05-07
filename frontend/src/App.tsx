import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import AdminLayout from "./components/layout/AdminLayout";
import AdminRoute from "./components/admin/AdminRoute";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import MyPage from "./pages/MyPage";
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminSchedules from "./pages/Admin/Schedules";
import AdminReservations from "./pages/Admin/Reservations";
import AdminUsers from "./pages/Admin/Users";
import AdminReviews from "./pages/Admin/Reviews";
import AdminPrograms from "./pages/Admin/Programs";
import AdminExhibitions from "./pages/Admin/Exhibitions";

/**
 * 전체 라우트 구성
 *
 * /admin/*: AdminRoute(ADMIN 권한 검사) → AdminLayout(사이드바) → 관리자 하위 페이지
 *   - /admin 진입 시 /admin/dashboard 로 자동 리다이렉트
 * /*: Layout(헤더·푸터) → 일반 사용자 페이지
 *
 * 레이아웃과 인증 로직을 라우트 레벨에서 분리해
 * 각 페이지 컴포넌트가 UI에만 집중할 수 있도록 구성했다.
 */
function App() {
  return (
    <Routes>
      <Route
        path="/admin/*"
        element={
          <AdminRoute>
            <AdminLayout>
              <Routes>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="schedules" element={<AdminSchedules />} />
                <Route path="reservations" element={<AdminReservations />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="reviews" element={<AdminReviews />} />
                <Route path="programs" element={<AdminPrograms />} />
                <Route path="exhibitions" element={<AdminExhibitions />} />
              </Routes>
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/*"
        element={
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/mypage" element={<MyPage />} />
            </Routes>
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;
