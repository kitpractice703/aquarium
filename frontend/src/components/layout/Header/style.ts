/** Header 컴포넌트 스타일 */
import styled from "styled-components";

export const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  padding: 0 20px;

  background: rgba(10, 15, 28, 0.9);
  backdrop-filter: blur(10px);
  z-index: 1000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  display: flex;
  justify-content: center;
  align-items: center;
`;

export const HeaderContent = styled.div`
  width: 100%;
  max-width: 1200px;
  height: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: var(--accent-cyan);
  letter-spacing: 1px;
  cursor: pointer;
`;

export const Gnb = styled.nav`
  display: flex;
  gap: 30px;
  align-items: center;

  a {
    font-size: 16px;
    font-weight: 500;
    color: #fff;
    cursor: pointer;
    text-decoration: none;
    transition: color 0.3s;
  }

  a:hover {
    color: var(--accent-cyan);
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const UserNameSpan = styled.span`
  color: var(--accent-cyan);
`;

export const TicketLink = styled.span`
  color: var(--accent-cyan);
  font-weight: bold;
  margin-left: 10px;
  cursor: pointer;
`;

export const UserMenu = styled.div`
  display: flex;
  gap: 15px;
  font-size: 14px;
  color: var(--text-gray);

  white-space: nowrap; /* 텍스트 줄바꿈 방지 */

  span {
    cursor: pointer;
    transition: 0.3s;
  }
  span:hover {
    color: #fff;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const InputGroup = styled.div`
  margin-bottom: 20px;
  text-align: left;
`;
export const Label = styled.label`
  display: block;
  color: var(--text-gray);
  margin-bottom: 8px;
  font-size: 14px;
`;
export const InputBox = styled.input`
  width: 100%;
  padding: 12px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  color: #fff;
  font-size: 16px;
  &:focus {
    outline: none;
    border-color: var(--accent-cyan);
  }
`;
export const BtnAction = styled.button`
  width: 100%;
  padding: 15px;
  background: var(--accent-cyan);
  color: #000;
  border: none;
  font-weight: bold;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  &:hover {
    background: #00dbe6;
  }
`;

export const GoogleBtn = styled.button`
  width: 100%;
  padding: 15px;
  margin-top: 15px;
  background: #fff;
  color: #333;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: 0.3s;
  &:hover {
    background: #f1f1f1;
  }
`;

export const BookingButton = styled.button`
  background: var(--accent-cyan);
  color: #000;
  border: none;
  padding: 8px 18px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s;
  margin-left: 10px;

  &:hover {
    background: #fff;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 219, 230, 0.3);
  }
`;

/* ──────────── 모바일 반응형 컴포넌트 ──────────── */

export const HamburgerButton = styled.button<{ $isOpen: boolean }>`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  z-index: 1100;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 36px;
  height: 36px;

  span {
    display: block;
    width: 22px;
    height: 2px;
    background: #fff;
    border-radius: 2px;
    transition: all 0.3s ease;
  }

  /* 열림 상태: X 모양 */
  ${(props) =>
    props.$isOpen &&
    `
    span:nth-child(1) {
      transform: translateY(7px) rotate(45deg);
    }
    span:nth-child(2) {
      opacity: 0;
    }
    span:nth-child(3) {
      transform: translateY(-7px) rotate(-45deg);
    }
  `}

  @media (max-width: 768px) {
    display: flex;
  }
`;

export const MobileOverlay = styled.div<{ $isOpen: boolean }>`
  display: none;

  @media (max-width: 768px) {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 1000;
    opacity: ${(props) => (props.$isOpen ? 1 : 0)};
    visibility: ${(props) => (props.$isOpen ? "visible" : "hidden")};
    transition: opacity 0.3s, visibility 0.3s;
  }
`;

export const MobileMenu = styled.nav<{ $isOpen: boolean }>`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    right: 0;
    width: 260px;
    height: 100vh;
    background: rgba(10, 15, 28, 0.97);
    backdrop-filter: blur(20px);
    border-left: 1px solid rgba(255, 255, 255, 0.1);
    z-index: 1050;
    padding: 80px 30px 30px;
    gap: 0;
    transform: translateX(${(props) => (props.$isOpen ? "0" : "100%")});
    transition: transform 0.3s ease;
  }

  a, .mobile-menu-item {
    display: block;
    padding: 16px 0;
    font-size: 17px;
    font-weight: 500;
    color: #fff;
    cursor: pointer;
    text-decoration: none;
    transition: color 0.3s;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }

  a:hover, .mobile-menu-item:hover {
    color: var(--accent-cyan);
  }

  .mobile-menu-item.accent {
    color: var(--accent-cyan);
    font-weight: bold;
  }
`;

export const MobileNavDivider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 12px 0;
`;

export const MobileCloseButton = styled.button`
  position: absolute;
  top: 22px;
  right: 22px;
  background: none;
  border: none;
  color: #fff;
  font-size: 28px;
  cursor: pointer;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s;
  line-height: 1;

  &:hover {
    color: var(--accent-cyan);
  }
`;


