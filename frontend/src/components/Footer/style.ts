import styled from "styled-components";

export const FooterContainer = styled.footer`
  width: 100%;
  padding: 50px 20px;
  background-color: #05080f; /* 아주 어두운 남색 */
  color: #555;
  font-size: 14px;
  flex-shrink: 0; /* 화면이 작아져도 찌그러지지 않음 */

  /* [핵심] 내부 콘텐츠 중앙 정렬 */
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;
