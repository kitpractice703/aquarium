import styled from "styled-components";

// HTML의 <footer> 태그에 해당하는 스타일 컴포넌트입니다.
export const FooterContainer = styled.footer`
  width: 100%;

  /* [요청하신 디자인 반영] */
  padding: 50px; /* 위아래 여백 */
  text-align: center; /* 텍스트 중앙 정렬 */
  background-color: #05080f; /* 아주 어두운 남색 배경 */
  color: #555; /* 텍스트 색상 (회색) */
  font-size: 14px; /* 글자 크기 */

  /* [기존 프로젝트 환경 유지를 위한 설정] */
  /* 내용이 짧아도 푸터가 화면 바닥에 붙도록 유지합니다. (Mentor's Tip) */
  margin-top: auto;

  /* 내부 <p> 태그 간의 간격을 살짝 조정하고 싶다면 아래를 추가할 수 있습니다. 
     현재는 HTML 기본 동작(block)을 따릅니다. */
  p {
    margin-bottom: 5px; /* 줄 간격 확보 */
  }

  /* 마지막 p 태그는 마진 제거 */
  p:last-child {
    margin-bottom: 0;
  }
`;
