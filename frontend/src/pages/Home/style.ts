/** 홈 페이지 공통 스타일 */
import styled from "styled-components";

/** 정보 항목: 라벨-값 한 줄 표시 (AboutSection 등에서 사용) */
export const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 10px;
  font-size: 16px;
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
  span:first-child {
    color: #ddd;
  }
  span:last-child {
    font-weight: bold;
    color: #fff;
  }
`;
