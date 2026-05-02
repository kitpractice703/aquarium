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
