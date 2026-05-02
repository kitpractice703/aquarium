import styled from "styled-components";
import { Link } from "react-router-dom";

export const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: #0a1628;
  font-family: "Pretendard", "Apple SD Gothic Neo", sans-serif;
`;

export const Sidebar = styled.aside`
  width: 240px;
  min-height: 100vh;
  background: #060e1d;
  display: flex;
  flex-direction: column;
  padding: 0;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
  border-right: 1px solid #1a2f52;
`;

export const Logo = styled.div`
  padding: 24px 20px;
  font-size: 15px;
  font-weight: 700;
  color: #00d4ff;
  letter-spacing: -0.3px;
  border-bottom: 1px solid #1a2f52;
`;

export const Nav = styled.nav`
  flex: 1;
  padding: 12px 0;
  overflow-y: auto;
`;

export const NavItem = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  padding: 11px 20px;
  font-size: 14px;
  color: ${({ $active }) => ($active ? "#00d4ff" : "#8aacc8")};
  background: ${({ $active }) => ($active ? "rgba(0,212,255,0.08)" : "transparent")};
  border-left: 3px solid ${({ $active }) => ($active ? "#00d4ff" : "transparent")};
  text-decoration: none;
  transition: all 0.15s;

  &:hover {
    color: #e0e8f0;
    background: rgba(255, 255, 255, 0.04);
  }
`;

export const SidebarFooter = styled.div`
  padding: 16px 20px;
  border-top: 1px solid #1a2f52;
`;

export const SiteLink = styled(Link)`
  display: block;
  font-size: 12px;
  color: #5a7a9a;
  text-decoration: none;
  margin-bottom: 10px;
  &:hover { color: #8aacc8; }
`;

export const LogoutBtn = styled.button`
  width: 100%;
  padding: 9px 0;
  background: transparent;
  border: 1px solid #1a2f52;
  border-radius: 6px;
  color: #8aacc8;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
  &:hover {
    background: rgba(255, 71, 87, 0.1);
    border-color: #ff4757;
    color: #ff4757;
  }
`;

export const Main = styled.main`
  margin-left: 240px;
  flex: 1;
  min-height: 100vh;
  background: #0a1628;
`;

export const Content = styled.div`
  padding: 32px;
`;
