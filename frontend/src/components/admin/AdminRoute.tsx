/**
 * 관리자 전용 라우트 보호 컴포넌트 (RBAC)
 *
 * 인증 상태 로딩 완료 → 로그인 여부 → ADMIN 권한 순서로 검사한다.
 * 세 조건을 모두 통과한 경우에만 자식 컴포넌트를 렌더링한다.
 */
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, isAdmin, isLoading } = useAuth();

  // 토큰 검증이 완료되기 전에 리다이렉트하면 로그인 사용자가 튕기는 현상이 발생한다.
  if (isLoading) return null;
  // 미인증 사용자는 회원가입·로그인 진입점으로 이동한다.
  if (!isLoggedIn) return <Navigate to="/signup" replace />;
  // 로그인은 되었지만 ADMIN 권한이 없는 경우 홈으로 차단한다.
  if (!isAdmin) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default AdminRoute;
