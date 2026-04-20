import * as S from "./style";
import BookingModal from "../../modals/BookingModal";
import LoginRequestModal from "../../modals/LoginRequestModal";
import LoginModal from "../../modals/LoginModal";
import PasswordResetModal from "../../modals/PasswordResetModal";
import { useHeaderLogic } from "./hooks/useHeader";

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
    mobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
  } = useHeaderLogic();

  return (
    <>
      <S.HeaderWrapper>
        <S.HeaderContent>
          <S.Logo onClick={() => { navigate("/"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
            NAQUARIUM
          </S.Logo>

          <S.Gnb>
            <a onClick={() => handleNavClick("about")}>소개</a>
            <a onClick={() => handleNavClick("themes")}>테마전시</a>
            <a onClick={() => handleNavClick("programs")}>프로그램</a>
            <a onClick={() => handleNavClick("community")}>커뮤니티</a>
            <S.BookingButton onClick={handleBookingClick}>예매하기</S.BookingButton>
          </S.Gnb>

          <S.UserMenu>
            {isLoggedIn ? (
              <>
                <S.UserNameSpan>{username}님</S.UserNameSpan>
                <span onClick={logout}>로그아웃</span>
              </>
            ) : (
              <>
                <span onClick={() => setModalType("LOGIN")}>로그인</span>
                <span onClick={() => navigate("/signup")}>회원가입</span>
              </>
            )}
            <S.TicketLink onClick={handleTicketCheck}>
              {isLoggedIn ? "마이페이지" : "예매확인"}
            </S.TicketLink>
          </S.UserMenu>

          <S.HamburgerButton $isOpen={mobileMenuOpen} onClick={toggleMobileMenu}>
            <span /><span /><span />
          </S.HamburgerButton>
        </S.HeaderContent>
      </S.HeaderWrapper>

      <S.MobileOverlay $isOpen={mobileMenuOpen} onClick={closeMobileMenu} />
      <S.MobileMenu $isOpen={mobileMenuOpen}>
        <S.MobileCloseButton onClick={closeMobileMenu}>✕</S.MobileCloseButton>
        <a onClick={() => handleNavClick("about")}>소개</a>
        <a onClick={() => handleNavClick("themes")}>테마전시</a>
        <a onClick={() => handleNavClick("programs")}>프로그램</a>
        <a onClick={() => handleNavClick("community")}>커뮤니티</a>
        <div className="mobile-menu-item accent" onClick={handleBookingClick}>예매하기</div>
        <S.MobileNavDivider />
        {isLoggedIn ? (
          <>
            <div className="mobile-menu-item accent">{username}님</div>
            <div className="mobile-menu-item" onClick={() => { closeMobileMenu(); logout(); }}>로그아웃</div>
          </>
        ) : (
          <>
            <div className="mobile-menu-item" onClick={() => { closeMobileMenu(); setModalType("LOGIN"); }}>로그인</div>
            <div className="mobile-menu-item" onClick={() => { closeMobileMenu(); navigate("/signup"); }}>회원가입</div>
          </>
        )}
        <div className="mobile-menu-item accent" onClick={handleTicketCheck}>
          {isLoggedIn ? "마이페이지" : "예매확인"}
        </div>
      </S.MobileMenu>

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />

      <LoginModal
        isOpen={modalType === "LOGIN"}
        onClose={closeModal}
        onOpenSignup={() => { closeModal(); navigate("/signup"); }}
        onOpenReset={openResetModal}
      />

      <PasswordResetModal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onSwitchToLogin={switchResetToLogin}
      />

      <LoginRequestModal
        isOpen={modalType === "NOTICE"}
        onClose={() => setModalType(null)}
        onConfirm={() => setModalType("LOGIN")}
      />
    </>
  );
};

export default Header;
