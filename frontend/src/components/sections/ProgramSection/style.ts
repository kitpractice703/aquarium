/** 프로그램 & 일정 섹션 스타일 */
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

/** 프로그램 2열 레이아웃: 체험(좌) + 시간표(우), 모바일 1열 */
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

/** 체험 프로그램 카드: 호버 시 이미지 확대 */
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

/** 날짜 슬라이더: 가로 스크롤 */
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

/** 날짜 아이템: 선택 시 시안, 월요일(휴관일) 빨간색 표시 */
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

/** 스케줄 아이템: 시간 / 공연명+장소 / 상태 배지 (open/closed/ready) */
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

    /* 예매 가능: 시안 배지 */
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

    /* 마감: 빨간 배지 */
    &.closed {
      background: rgba(255, 107, 107, 0.1);
      color: #ff6b6b;
      border: 1px solid #ff6b6b;
      cursor: default;
    }
    /* 준비 중: 회색 배지 */
    &.ready {
      background: rgba(255, 255, 255, 0.1);
      color: #aaa;
      border: 1px solid #555;
      cursor: default;
    }
  }
`;

/** 예약하기 버튼 */
export const Btn1 = styled.button`
  margin-top: 10px;
  padding: 8px 16px;
  cursor: pointer;
  background: var(--accent-cyan);
  border: none;
  border-radius: 5px;
  font-weight: bold;

  transition: 0.3s;
  &:hover {
    filter: brightness(1.1);
    transform: translateY(-2px);
  }
`;

/** 빈 일정 안내 */
export const NoPerformances = styled.div`
  padding: 30px;
  textalign: center;
  color: #888;
`;

/** 휴관일 안내: 빨간색 텍스트 */
export const ClosedNotice = styled.div`
  text-align: center;
  padding: 50px 0;
  color: #ff6b6b;

  h3 {
    margin: 0;
    font-size: 20px;
    color: inherit;
  }

  p {
    margin-top: 10px;
    font-size: 14px;
    color: var(--text-gray, #888);
  }
`;
