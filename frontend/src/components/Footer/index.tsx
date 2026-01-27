import * as S from "./style";

const Footer = () => {
  return (
    // S.FooterContainer는 HTML의 <footer> 태그 역할을 합니다.
    <S.FooterContainer>
      {/* 저작권 표시 문구 */}
      <p>Copyright © 2026 NAQUARIUM ARCHIVE. All Rights Reserved.</p>

      {/* 사업자 정보 및 주소 (HTML 그대로 적용) */}
      <p>
        인천광역시 부평구 가상의 주소 | 대표: 허담 | 사업자등록번호:
        000-00-00000
      </p>
    </S.FooterContainer>
  );
};

export default Footer;
