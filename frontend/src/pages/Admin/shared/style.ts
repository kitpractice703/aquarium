import styled from "styled-components";

export const PageTitle = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: #e0e8f0;
  margin: 0 0 24px;
`;

export const Card = styled.div`
  background: #0f2040;
  border: 1px solid #1a2f52;
  border-radius: 10px;
  padding: 24px;
  margin-bottom: 20px;
`;

export const FilterRow = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: center;
`;

export const Input = styled.input`
  padding: 8px 12px;
  background: #0a1628;
  border: 1px solid #1a2f52;
  border-radius: 6px;
  color: #e0e8f0;
  font-size: 13px;
  outline: none;
  &::placeholder { color: #4a6a8a; }
  &:focus { border-color: #00d4ff; }
`;

export const Select = styled.select`
  padding: 8px 12px;
  background: #0a1628;
  border: 1px solid #1a2f52;
  border-radius: 6px;
  color: #e0e8f0;
  font-size: 13px;
  outline: none;
  cursor: pointer;
  &:focus { border-color: #00d4ff; }
  option { background: #0a1628; }
`;

export const Btn = styled.button<{ $variant?: "primary" | "danger" | "warning" | "ghost" }>`
  padding: 7px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.15s;

  ${({ $variant = "ghost" }) => {
    switch ($variant) {
      case "primary":
        return `background:#00d4ff;color:#060e1d;border-color:#00d4ff;&:hover{background:#00b8d9;}`;
      case "danger":
        return `background:transparent;color:#ff4757;border-color:#ff4757;&:hover{background:rgba(255,71,87,0.12);}`;
      case "warning":
        return `background:transparent;color:#ffa502;border-color:#ffa502;&:hover{background:rgba(255,165,2,0.12);}`;
      default:
        return `background:transparent;color:#8aacc8;border-color:#1a2f52;&:hover{border-color:#8aacc8;color:#e0e8f0;}`;
    }
  }}
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
`;

export const Th = styled.th`
  padding: 10px 12px;
  text-align: left;
  color: #5a7a9a;
  font-weight: 600;
  border-bottom: 1px solid #1a2f52;
  white-space: nowrap;
`;

export const Td = styled.td`
  padding: 11px 12px;
  color: #c0d4e8;
  border-bottom: 1px solid #101e36;
  vertical-align: middle;
`;

export const Tr = styled.tr`
  &:hover td { background: rgba(255,255,255,0.02); }
  &:last-child td { border-bottom: none; }
`;

export const Badge = styled.span<{ $color?: string }>`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  background: ${({ $color }) => $color ? `${$color}22` : "#1a2f52"};
  color: ${({ $color }) => $color ?? "#8aacc8"};
  border: 1px solid ${({ $color }) => $color ? `${$color}44` : "#1a2f52"};
`;

export const EmptyRow = styled.tr`
  td {
    text-align: center;
    padding: 40px;
    color: #4a6a8a;
  }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const Modal = styled.div`
  background: #0f2040;
  border: 1px solid #1a2f52;
  border-radius: 12px;
  padding: 28px;
  width: 480px;
  max-width: 95vw;
  max-height: 85vh;
  overflow-y: auto;
`;

export const ModalTitle = styled.h2`
  font-size: 17px;
  font-weight: 700;
  color: #e0e8f0;
  margin: 0 0 20px;
`;

export const FormGroup = styled.div`
  margin-bottom: 14px;
  label {
    display: block;
    font-size: 12px;
    color: #5a7a9a;
    margin-bottom: 5px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  padding: 8px 12px;
  background: #0a1628;
  border: 1px solid #1a2f52;
  border-radius: 6px;
  color: #e0e8f0;
  font-size: 13px;
  outline: none;
  resize: vertical;
  min-height: 80px;
  box-sizing: border-box;
  &:focus { border-color: #00d4ff; }
`;

export const ModalActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 20px;
`;


export const DateWrapper = styled.div`
  display: flex;
  align-items: stretch;
  input {
    border-radius: 6px 0 0 6px;
    border-right: none;
  }
`;

export const CalendarBtn = styled.button`
  padding: 0 9px;
  background: #0a1628;
  border: 1px solid #1a2f52;
  border-radius: 0 6px 6px 0;
  color: #5a7a9a;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: color 0.15s, border-color 0.15s;
  &:hover {
    color: #00d4ff;
    border-color: #00d4ff;
  }
`;
