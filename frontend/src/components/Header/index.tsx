/**
 * 헤더 컴포넌트
 * - 로고, 네비게이션(소개/테마전시/프로그램/커뮤니티/예매하기), 사용자 메뉴
 * - 로그인 상태에 따라 UI 분기 (로그인/회원가입 ↔ 사용자명/로그아웃)
 * - 모달 관리: 예매, 로그인, 비밀번호 재설정, 로그인 요청 안내
 */
import * as S from "./style";
import BookingModal from "../common/BookingModal";
import LoginRequestModal from "../common/LoginRequestModal";
import LoginModal from "../common/LoginModal";
import PasswordResetModal from "../common/PasswordResetModal";
import { useHeaderLogic } from "./hooks/useHeaderLogic";

const Header = () => {
  const {
    isLoggedIn,
    username,
    logout,
    modalType,
    setModalType,
    isBookingOpen,
    setIsBookingOpen,
    isResetOpen,
    setIsResetOpen,
    closeModal,
    handleBookingClick,
    handleTicketCheck,
    openResetModal,
    switchResetToLogin,
    handleNavClick,
    navigate,
  } = useHeaderLogic();

  return (
    <>
      <S.HeaderWrapper>
        <S.HeaderContent>
          {/* 로고: 클릭 시 홈으로 이동 + 상단으로 스크롤 */}
          <S.Logo onClick={() => { navigate("/"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>NAQUARIUM</S.Logo>

          {/* 메인 내비게이션 (768px 이하에서 숨김) */}
          <S.Gnb>
            <a onClick={() => handleNavClick("about")}>소개</a>
            <a onClick={() => handleNavClick("themes")}>테마전시</a>
            <a onClick={() => handleNavClick("programs")}>프로그램</a>
            <a onClick={() => handleNavClick("community")}>커뮤니티</a>
            <S.BookingButton onClick={handleBookingClick}>
              예매하기
            </S.BookingButton>
          </S.Gnb>

          {/* 사용자 메뉴: 로그인 상태에 따라 분기 */}
          <S.UserMenu>
            {isLoggedIn ? (
              <>
                <span style={{ color: "var(--accent-cyan)" }}>
                  {username}님
                </span>
                <span onClick={logout}>로그아웃</span>
              </>
            ) : (
              <>
                <span onClick={() => setModalType("LOGIN")}>로그인</span>
                <span onClick={() => navigate("/signup")}>회원가입</span>
              </>
            )}

            <span
              onClick={handleTicketCheck}
              style={{
                color: "var(--accent-cyan)",
                fontWeight: "bold",
                marginLeft: "10px",
                cursor: "pointer",
              }}
            >
              {isLoggedIn ? "마이페이지" : "예매확인"}
            </span>
          </S.UserMenu>
        </S.HeaderContent>
      </S.HeaderWrapper>

      {/* 예매 모달 */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      {/* 로그인 모달 */}
      <LoginModal
        isOpen={modalType === "LOGIN"}
        onClose={closeModal}
        onOpenSignup={() => {
          closeModal();
          navigate("/signup");
        }}
        onOpenReset={openResetModal}
      />

      {/* 비밀번호 재설정 모달 */}
      <PasswordResetModal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onSwitchToLogin={switchResetToLogin}
      />

      {/* 로그인 필요 안내 모달 */}
      <LoginRequestModal
        isOpen={modalType === "NOTICE"}
        onClose={() => setModalType(null)}
        onConfirm={() => setModalType("LOGIN")}
      />
    </>
  );
};

export default Header;
