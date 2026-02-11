import * as S from "./style";
import vrImage from "../../../../assets/images/vr_driving.jpeg";
import feedingImage from "../../../../assets/images/feeding.jpg";
import type { ScheduleItemData } from "../hooks/useHomeData";

interface Props {
  dates: any[];
  selectedDate: string;
  onDateChange: (date: string) => void;
  schedules: ScheduleItemData[];
  onProgramClick: (program: {
    id: number;
    title: string;
    price: number;
  }) => void;
  onScheduleClick: (item: ScheduleItemData) => void;
}

const ProgramSection = ({
  dates,
  selectedDate,
  onDateChange,
  schedules,
  onProgramClick,
  onScheduleClick,
}: Props) => {
  // 선택된 날짜에 맞는 스케줄 필터링
  const filteredSchedules = schedules.filter(
    (item) => item.date === selectedDate,
  );
  const isMonday = dates.find((d) => d.fullDate === selectedDate)?.isMonday;

  return (
    <S.Section id="programs">
      <S.Container>
        <S.SectionTitle>프로그램 & 일정</S.SectionTitle>
        <S.ProgramLayout>
          {/* 체험 프로그램 */}
          <S.ProgramCol>
            <h3>체험 프로그램</h3>
            <S.ExperienceList>
              <S.ExperienceItem>
                <img src={vrImage} alt="VR" />
                <h4>가상 심해 다이빙 (VR)</h4>
                <p>
                  실제 물에 들어가지 않고도 심해 3,000m를 탐험하는 VR
                  체험입니다.
                </p>
                <button
                  onClick={() =>
                    onProgramClick({
                      id: 101,
                      title: "가상 심해 다이빙",
                      price: 15000,
                    })
                  }
                >
                  예약하기
                </button>
              </S.ExperienceItem>
              <S.ExperienceItem>
                <img src={feedingImage} alt="Feeding" />
                <h4>아쿠아리스트 먹이 주기</h4>
                <p>
                  전문 아쿠아리스트와 함께 메인 수조의 물고기들에게 직접 먹이를
                  줍니다.
                </p>
                <button
                  onClick={() =>
                    onProgramClick({
                      id: 102,
                      title: "먹이주기 체험",
                      price: 20000,
                    })
                  }
                >
                  예약하기
                </button>
              </S.ExperienceItem>
            </S.ExperienceList>
          </S.ProgramCol>

          {/* 공연 시간표 */}
          <S.ProgramCol>
            <h3 id="schedule-start">공연 시간표</h3>
            <S.DateSlider>
              {dates.map((d) => (
                <S.DateItem
                  key={d.fullDate}
                  $active={selectedDate === d.fullDate}
                  $isMonday={d.isMonday}
                  onClick={() => onDateChange(d.fullDate)}
                >
                  <div className="day">{d.day}</div>
                  <div className="date">{d.date}</div>
                </S.DateItem>
              ))}
            </S.DateSlider>

            <div>
              {isMonday ? (
                <div className="empty-msg closed">
                  <h3>오늘은 정기 휴관일입니다.</h3>
                  <p>매월 첫째 주 월요일은 시설 점검을 위해 쉽니다.</p>
                </div>
              ) : filteredSchedules.length > 0 ? (
                filteredSchedules.map((item) => (
                  <S.ScheduleItem key={item.id}>
                    <div className="time">{item.time}</div>
                    <div className="info">
                      <div className="title">{item.title}</div>
                      <div className="place">{item.place}</div>
                    </div>
                    <div
                      className={`status ${item.status}`}
                      onClick={() => onScheduleClick(item)}
                    >
                      {item.status === "closed"
                        ? "마감"
                        : item.status === "open"
                          ? "예매가능"
                          : "준비중"}
                    </div>
                  </S.ScheduleItem>
                ))
              ) : (
                <div className="empty-msg">
                  해당 날짜에는 예정된 공연 일정이 없습니다.
                </div>
              )}
            </div>
          </S.ProgramCol>
        </S.ProgramLayout>
      </S.Container>
    </S.Section>
  );
};

export default ProgramSection;
