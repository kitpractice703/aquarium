import styled from "styled-components";

export const Section = styled.section`
  width: 100%;
  padding: 100px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  background-color: var(--bg-dark);
  display: flex;
  justify-content: center;
`;

export const Container = styled.div`
  width: 100%;
  max-width: 1200px;
`;

export const SectionTitle = styled.h2`
  font-size: 36px;
  text-align: center;
  margin-bottom: 30px;
  color: var(--accent-cyan);
`;

export const ProgramLayout = styled.div`
  display: flex;
  gap: 40px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const ProgramCol = styled.div`
  flex: 1;
  background: var(--bg-card);
  padding: 40px;
  border-radius: 20px;
  min-height: 500px;
`;

export const ExperienceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

export const ExperienceItem = styled.div`
  display: flex;
  flex-direction: column;
  img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 10px;
    margin-bottom: 15px;
    transition: transform 0.3s;
  }
  &:hover img {
    transform: scale(1.02);
  }
  h4 {
    margin-bottom: 8px;
    color: #fff;
    font-size: 18px;
  }
  p {
    font-size: 14px;
    color: var(--text-gray);
    line-height: 1.5;
  }
`;

export const DateSlider = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 10px;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  &::-webkit-scrollbar {
    height: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 10px;
  }
`;

export const DateItem = styled.div<{ $active: boolean; $isMonday: boolean }>`
  min-width: 60px;
  padding: 10px 5px;
  text-align: center;
  border-radius: 10px;
  cursor: pointer;
  background: ${(props) =>
    props.$active ? "var(--accent-cyan)" : "transparent"};
  color: ${(props) =>
    props.$active ? "#000" : props.$isMonday ? "#ff6b6b" : "#888"};
  border: ${(props) =>
    props.$isMonday && !props.$active
      ? "1px solid rgba(255, 107, 107, 0.3)"
      : "1px solid transparent"};
  transition: 0.3s;

  &:hover {
    background: ${(props) =>
      props.$active ? "var(--accent-cyan)" : "rgba(255,255,255,0.1)"};
    color: ${(props) => (props.$active ? "#000" : "#fff")};
  }
  .day {
    font-size: 12px;
    margin-bottom: 5px;
  }
  .date {
    font-size: 18px;
    font-weight: bold;
  }
`;

export const ScheduleItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.02);
    padding-left: 10px;
  }
  .time {
    font-size: 18px;
    font-weight: bold;
    color: #fff;
    width: 80px;
  }
  .info {
    flex: 1;
    text-align: left;
  }
  .title {
    font-size: 16px;
    color: #fff;
    margin-bottom: 5px;
  }
  .place {
    font-size: 13px;
    color: var(--text-gray);
  }

  .status {
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: bold;
    min-width: 70px;
    text-align: center;

    &.open {
      background: rgba(0, 242, 255, 0.1);
      color: var(--accent-cyan);
      border: 1px solid var(--accent-cyan);
      cursor: pointer;
      &:hover {
        background: var(--accent-cyan);
        color: #000;
      }
    }

    &.closed {
      background: rgba(255, 107, 107, 0.1);
      color: #ff6b6b;
      border: 1px solid #ff6b6b;
      cursor: default;
    }
    &.ready {
      background: rgba(255, 255, 255, 0.1);
      color: #aaa;
      border: 1px solid #555;
      cursor: default;
    }
  }
`;
