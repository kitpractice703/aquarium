/** 푸터 스타일 */
import styled from "styled-components";

/** 푸터 컨테이너: 최하단 고정, 어두운 남색 배경 */
export const FooterContainer = styled.footer`
  width: 100%;
  padding: 50px 20px;
  background-color: #05080f;
  color: #555;
  font-size: 14px;
  flex-shrink: 0; /* 화면이 작아져도 찌그러지지 않음 */

  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;
