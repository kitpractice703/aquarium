import { useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import * as S from "./style";

const MENU_ITEMS = [
  { path: "/admin/dashboard", label: "대시보드" },
  { path: "/admin/schedules", label: "공연 일정 관리" },
  { path: "/admin/reservations", label: "예약 관리" },
  { path: "/admin/users", label: "회원 관리" },
  { path: "/admin/reviews", label: "후기 관리" },
  { path: "/admin/programs", label: "프로그램 관리" },
  { path: "/admin/exhibitions", label: "전시 관리" },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { logout, username } = useAuth();

  return (
    <S.Container>
      <S.Sidebar>
        <S.Logo>나쿠아리움 관리자</S.Logo>
        <S.Nav>
          {MENU_ITEMS.map((item) => (
            <S.NavItem
              key={item.path}
              to={item.path}
              $active={location.pathname === item.path}
            >
              {item.label}
            </S.NavItem>
          ))}
        </S.Nav>
        <S.SidebarFooter>
          <S.SiteLink to="/" target="_blank">
            사이트 바로가기 →
          </S.SiteLink>
          <div style={{ fontSize: 12, color: "#5a7a9a", marginBottom: 8 }}>
            {username}
          </div>
          <S.LogoutBtn onClick={logout}>로그아웃</S.LogoutBtn>
        </S.SidebarFooter>
      </S.Sidebar>
      <S.Main>
        <S.Content>{children}</S.Content>
      </S.Main>
    </S.Container>
  );
};

export default AdminLayout;
