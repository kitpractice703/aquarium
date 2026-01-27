import * as S from "./style";

const Footer = () => {
  return (
    <S.FooterContainer>
      <S.Inner>
        <S.Info>
          <S.Logo>NAQUARIUM</S.Logo>
          <S.Text>
            인천광역시 계양구 아쿠아로 123 (계산동)
            <br />
            대표전화: 032-000-0000 | 팩스: 032-111-1111
            <br />
            이메일: contact@naquarium.com
          </S.Text>
          <S.Copyright>© 2026 NAQUARIUM. All rights reserved.</S.Copyright>
        </S.Info>

        <S.SocialLinks>
          {/* 실제 아이콘 대신 텍스트로 대체 (나중에 아이콘 라이브러리 쓰면 교체) */}
          <S.Icon>Insta</S.Icon>
          <S.Icon>Yout</S.Icon>
          <S.Icon>Blog</S.Icon>
        </S.SocialLinks>
      </S.Inner>
    </S.FooterContainer>
  );
};

export default Footer;
