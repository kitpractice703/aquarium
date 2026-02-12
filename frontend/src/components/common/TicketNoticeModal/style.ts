/** 관람권 미보유 안내 모달 스타일 */
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 30px 20px;
  animation: ${fadeIn} 0.3s ease-out;
`;

/** 메인 메시지: 관람권 강조 (시안 색상) */
export const Message = styled.p`
  font-size: 18px;
  color: #fff;
  margin-bottom: 10px;
  line-height: 1.6;

  strong {
    color: var(--accent-cyan);
    font-weight: bold;
  }
`;

export const SubMessage = styled.p`
  font-size: 14px;
  color: var(--text-gray);
  margin-bottom: 30px;
  white-space: pre-line;
`;

/** 관람권 예매 유도 버튼: 호버 시 상승 + 글로우 */
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
  box-shadow: 0 4px 15px rgba(0, 242, 255, 0.2);

  &:hover {
    background: #fff;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 242, 255, 0.4);
  }
`;
