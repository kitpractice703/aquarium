import styled from "styled-components";

export const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

export const StatCard = styled.div`
  background: #0f2040;
  border: 1px solid #1a2f52;
  border-radius: 10px;
  padding: 20px 24px;
`;

export const StatLabel = styled.div`
  font-size: 12px;
  color: #5a7a9a;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
`;

export const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #00d4ff;
`;
