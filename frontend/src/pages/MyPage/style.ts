import styled from "styled-components";

export const Container = styled.div`
  padding-top: 100px; /* 헤더 공간 확보 */
  min-height: 80vh;
  background-color: #0b111e;
  color: #fff;
  display: flex;
  justify-content: center;
`;

export const Inner = styled.div`
  width: 90%;
  max-width: 800px;
`;

export const Title = styled.h2`
  font-size: 32px;
  margin-bottom: 40px;
  text-align: center;

  span {
    color: var(--accent-cyan);
  }
`;

export const TicketList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const TicketCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: 0.3s;

  &:hover {
    border-color: var(--accent-cyan);
    background: rgba(0, 242, 255, 0.05);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
`;

export const TicketInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  .date {
    font-size: 14px;
    color: var(--accent-cyan);
    font-weight: bold;
  }
  .title {
    font-size: 20px;
    font-weight: bold;
  }
  .details {
    font-size: 14px;
    color: #aaa;
  }
`;

export const TicketStatus = styled.div<{ $status: string }>`
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  background: ${(props) =>
    props.$status === "CONFIRMED"
      ? "rgba(0, 255, 136, 0.2)"
      : "rgba(255, 99, 132, 0.2)"};
  color: ${(props) => (props.$status === "CONFIRMED" ? "#00ff88" : "#ff6384")};
`;

export const EmptyMsg = styled.div`
  text-align: center;
  padding: 50px;
  color: #888;
  font-size: 16px;
`;
