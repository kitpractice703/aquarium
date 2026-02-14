/** 마이페이지 스타일 */
import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  padding-top: 100px;
  min-height: 100vh;
  background-color: #0b111e;
  color: #fff;
  display: flex;
  justify-content: center;
  padding-bottom: 80px;
`;

export const Inner = styled.div`
  width: 90%;
  max-width: 1800px;
  margin: 0 auto;
`;

export const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 50px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 20px;
`;

export const Title = styled.h2`
  font-size: 36px;
  color: #fff;
  font-weight: 700;
  letter-spacing: 2px;
`;

/** 2열 그리드: 정보 관리(좌) + 예매 내역(우), 모바일 1열 */
export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: stretch;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const Section = styled.div`
  background: var(--bg-card);
  padding: 40px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  min-height: 600px;
  max-height: 700px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

/** 섹션 제목: 좌측 시안 바 */
export const SectionTitle = styled.h3`
  font-size: 22px;
  margin-bottom: 30px;
  color: var(--accent-cyan);
  border-left: 4px solid var(--accent-cyan);
  padding-left: 15px;

  span {
    font-size: 14px;
    color: var(--text-gray);
    margin-left: 5px;
    font-weight: normal;
  }
`;

export const InfoForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 14px;
    color: var(--text-gray);
  }

  input {
    padding: 14px;
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: #fff;
    font-size: 15px;

    &:focus {
      outline: none;
      border-color: var(--accent-cyan);
    }
    &:disabled {
      color: #777;
      cursor: not-allowed;
    }
  }
`;

/** 정보 수정 버튼: 호버 시 시안 전환 */
export const UpdateButton = styled.button`
  width: 100%;
  margin-top: 20px;
  padding: 15px;
  background: #333;
  color: #fff;
  border: 1px solid #555;
  border-radius: 8px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background: var(--accent-cyan);
    color: #000;
    border-color: var(--accent-cyan);
  }
`;

export const TicketList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-right: 8px;

  /* 커스텀 스크롤바 */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 242, 255, 0.3);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 242, 255, 0.5);
  }
`;

/** 예매 카드: 프로그램 타입에 따라 배경/보더 색상 구분 */
export const TicketCard = styled.div<{ $isProgram?: boolean }>`
  background: ${(props) =>
    props.$isProgram
      ? "rgba(100, 100, 255, 0.1)"
      : "rgba(255, 255, 255, 0.03)"};
  border: 1px solid
    ${(props) =>
      props.$isProgram
        ? "rgba(100, 100, 255, 0.3)"
        : "rgba(255, 255, 255, 0.1)"};

  border-radius: 12px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: 0.3s;
  min-width: 0;

  &:hover {
    border-color: var(--accent-cyan);
    background: rgba(0, 242, 255, 0.05);
  }
`;

export const TicketInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
  min-width: 0;

  .res-number {
    font-size: 12px;
    color: var(--accent-cyan);
    font-weight: bold;
  }

  .title {
    font-size: 18px;
    font-weight: bold;
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .details {
    font-size: 13px;
    color: #aaa;
    display: flex;
    gap: 10px;

    @media (max-width: 400px) {
      flex-direction: column;
      gap: 2px;
    }
  }
`;

/** 예매 상태 배지: CONFIRMED=초록, 그 외=빨간 */
export const TicketStatus = styled.div<{ $status: string }>`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: bold;
  white-space: nowrap;
  flex-shrink: 0;
  margin-left: 15px;

  background: ${(props) =>
    props.$status === "CONFIRMED"
      ? "rgba(0, 255, 136, 0.15)"
      : "rgba(255, 99, 132, 0.15)"};
  color: ${(props) => (props.$status === "CONFIRMED" ? "#00ff88" : "#ff6384")};
  border: 1px solid
    ${(props) => (props.$status === "CONFIRMED" ? "#00ff88" : "#ff6384")};
`;

export const EmptyMsg = styled.div`
  text-align: center;
  padding: 40px;
  color: #888;
  font-size: 16px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
`;

export const LoadingWrapper = styled.div`
  padding-top: 100px;
  text-align: center;
  color: white;
  font-size: 18px;
`;

/** 프로그램 타입 배지: 공연(빨강) / 체험(노랑) */
export const Badge = styled.span<{ $type: "PERFORMANCE" | "EXPERIENCE" }>`
  margin-right: 6px;
  font-weight: bold;

  color: ${(props) => (props.$type === "PERFORMANCE" ? "#ff6b6b" : "#ffdd57")};
`;
