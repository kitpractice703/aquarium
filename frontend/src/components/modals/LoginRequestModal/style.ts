/** 로그인 필요 안내 모달 스타일 */
import styled from "styled-components";

export const Container = styled.div`
  text-align: center;
  padding: 20px 0;
`;

export const Message = styled.p`
  font-size: 18px;
  color: #fff;
  margin-bottom: 30px;
  line-height: 1.5;
`;

export const Button = styled.button`
  padding: 12px 30px;
  background: var(--accent-cyan);
  border: none;
  border-radius: 5px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  color: #000;
  transition: 0.3s;

  &:hover {
    background: #fff;
    transform: translateY(-2px);
  }
`;
