import styled from "styled-components";

export const Container = styled.div`
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

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr; /* 좌우 너비 1:1 유지 */
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

  /* 높이 설정 유지 */
  height: 100%;
  min-height: 600px;

  display: flex;
  flex-direction: column;
`;

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
`;

export const TicketCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
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
