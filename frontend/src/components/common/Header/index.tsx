import { useState } from "react";
import * as S from "./style";
import CommonModal from "../Modal";

const Header = () => {
  const [modalType, setModalType] = useState<"LOGIN" | "SIGNUP" | null>(null);

  const closeModal = () => setModalType(null);

  return (
    <>
      <S.HeaderContainer>
        <S.Logo onClick={() => window.scrollTo(0, 0)}>NAQUARIUM</S.Logo>
        <S.Gnb>
          <a href="#about">소개</a>
          <a href="#themes">테마 전시</a>
          <a href="#programs">프로그램</a>
          <a href="#community">커뮤니티</a>
        </S.Gnb>
        <S.UserMenu>
          <span onClick={() => setModalType("LOGIN")}>로그인</span>
          <span onClick={() => setModalType("SIGNUP")}>회원가입</span>
          <span style={{ color: "var(--accent-cyan)", fontWeight: "bold" }}>
            예매확인
          </span>
        </S.UserMenu>
      </S.HeaderContainer>

      {/* 로그인 모달 */}
      <CommonModal
        isOpen={modalType === "LOGIN"}
        onClose={closeModal}
        title="로그인"
      >
        <S.InputGroup>
          <S.Label>이메일</S.Label>
          <S.InputBox type="text" placeholder="example@email.com" />
        </S.InputGroup>
        <S.InputGroup>
          <S.Label>비밀번호</S.Label>
          <S.InputBox type="password" placeholder="••••••••" />
        </S.InputGroup>
        <S.BtnAction onClick={() => alert("로그인 처리 (백엔드 연동 예정)")}>
          로그인
        </S.BtnAction>
      </CommonModal>

      {/* 회원가입 모달 */}
      <CommonModal
        isOpen={modalType === "SIGNUP"}
        onClose={closeModal}
        title="회원가입"
      >
        <S.InputGroup>
          <S.Label>이름</S.Label>
          <S.InputBox type="text" placeholder="홍길동" />
        </S.InputGroup>
        <S.InputGroup>
          <S.Label>이메일</S.Label>
          <S.InputBox type="text" placeholder="example@email.com" />
        </S.InputGroup>
        <S.InputGroup>
          <S.Label>비밀번호</S.Label>
          <S.InputBox type="password" placeholder="••••••••" />
        </S.InputGroup>
        <S.BtnAction onClick={() => alert("회원가입 처리 (백엔드 연동 예정)")}>
          가입하기
        </S.BtnAction>
      </CommonModal>
    </>
  );
};

export default Header;
