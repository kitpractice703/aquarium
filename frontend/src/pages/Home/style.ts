import styled from "styled-components";

export const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 10px;
  font-size: 16px; /* 폰트 크기 약간 증가 */
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
