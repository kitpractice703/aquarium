import { useState, useEffect } from "react";
import HeroSection from "../../components/HeroSection";
import KakaoMap from "../../components/common/KakaoMap";
import ThemeSection from "../../components/common/ThemeSection";
import FaqModal from "../../components/common/FaqModal";
import ReviewModal from "../../components/common/ReviewModal";
import BookingModal from "../../components/common/BookingModal";
import * as S from "./style";

const getDaysArray = () => {
  const days = [];
  const today = new Date();
  const dayOfWeek = today.getDay();
  const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - diffToMonday);
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push({
      fullDate: d.toISOString().split("T")[0],
      date: d.getDate(),
      day: weekDays[d.getDay()],
      isMonday: d.getDay() === 1,
    });
  }
  return days;
};

const SCHEDULE_DATA = [
  {
    time: "11:00",
    title: "돌고래의 꿈 (Digital)",
    place: "오션 아레나",
    status: "closed",
  },
  {
    time: "13:00",
    title: "바다사자 식사시간",
    place: "해변 공원",
    status: "open",
  },
  { time: "14:00", title: "심해의 빛 쇼", place: "딥 블루 홀", status: "open" },
  {
    time: "16:00",
    title: "펭귄 생태 설명회",
    place: "극지방 존",
    status: "open",
  },
  {
    time: "19:00",
    title: "나이트 라군 파티",
    place: "중앙 광장",
    status: "ready",
  },
];

const Home = () => {
  const [dates, setDates] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    const dayList = getDaysArray();
    setDates(dayList);
    const todayStr = new Date().toISOString().split("T")[0];
    const hasToday = dayList.find((d) => d.fullDate === todayStr);
    setSelectedDate(hasToday ? todayStr : dayList[0].fullDate);
  }, []);

  return (
    <>
      <HeroSection />

      <S.Section id="about">
        <S.Container>
          <S.SectionTitle>아쿠아리움 소개</S.SectionTitle>
          <S.IntroDesc>
            Naquarium Archive는 사라져가는 바다의 기억을 영원히 보존하는{" "}
            <span>디지털 해저 기지</span>입니다.
            <br />
            수심 3,000m 아래 숨겨진 미지의 생태계와 멸종 위기종을
            <br />
            가장 생생한 기술로 복원하여 여러분께 선보입니다.
          </S.IntroDesc>

          <S.AboutGrid>
            <div>
              <h4
                style={{
                  marginBottom: "15px",
                  color: "#fff",
                  paddingLeft: "5px",
                }}
              >
                이용 안내
              </h4>
              <S.InfoBox>
                <S.InfoItem>
                  <span>성인 (19세 이상)</span> <span>35,000원</span>
                </S.InfoItem>
                <S.InfoItem>
                  <span>청소년 (13세~18세)</span> <span>28,000원</span>
                </S.InfoItem>
                <S.InfoItem>
                  <span>운영 시간</span> <span>10:00 - 22:00</span>
                </S.InfoItem>
                <S.InfoItem style={{ border: "none", color: "#ff6b6b" }}>
                  <span>휴관일</span> <span>매월 첫째주 월요일</span>
                </S.InfoItem>
              </S.InfoBox>
            </div>
            <div>
              <h4
                style={{
                  marginBottom: "15px",
                  color: "#fff",
                  paddingLeft: "5px",
                }}
              >
                찾아오시는 길
              </h4>
              <S.MapWrapper>
                <KakaoMap />
              </S.MapWrapper>
              <S.DescArea>
                <p
                  style={{
                    marginTop: "10px",
                    fontSize: "15px",
                    color: "var(--text-gray)",
                  }}
                >
                  📍 인천광역시 계양구 아라뱃길 해저 2터미널
                </p>
                <p
                  style={{ marginTop: "5px", fontSize: "14px", color: "#555" }}
                >
                  (주차: 지하 2층 ~ 4층 무료 이용 가능)
                </p>
              </S.DescArea>
            </div>
          </S.AboutGrid>
        </S.Container>
      </S.Section>

      <ThemeSection />

      <S.Section id="programs">
        <S.Container>
          <S.SectionTitle>프로그램 & 일정</S.SectionTitle>
          <S.ProgramLayout>
            <S.ProgramCol>
              <h3
                style={{
                  marginBottom: "30px",
                  color: "var(--accent-cyan)",
                  borderLeft: "4px solid var(--accent-cyan)",
                  paddingLeft: "15px",
                }}
              >
                체험 프로그램
              </h3>
              <S.ExperienceList>
                <S.ExperienceItem>
                  <img
                    src="https://placehold.co/500x200/222/FFF?text=VR+Diving"
                    alt="VR"
                  />
                  <h4>가상 심해 다이빙 (VR)</h4>
                  <p>
                    실제 물에 들어가지 않고도 심해 3,000m를 탐험하는 VR
                    체험입니다. 대왕오징어와의 조우를 경험하세요.
                  </p>
                </S.ExperienceItem>
                <S.ExperienceItem>
                  <img
                    src="https://placehold.co/500x200/333/FFF?text=Feeding"
                    alt="Feeding"
                  />
                  <h4>아쿠아리스트 먹이 주기</h4>
                  <p>
                    전문 아쿠아리스트와 함께 메인 수조의 물고기들에게 직접
                    먹이를 주며 교감할 수 있는 특별한 시간입니다.
                  </p>
                </S.ExperienceItem>
              </S.ExperienceList>
            </S.ProgramCol>

            <S.ProgramCol>
              <h3
                style={{
                  marginBottom: "20px",
                  color: "var(--accent-cyan)",
                  borderLeft: "4px solid var(--accent-cyan)",
                  paddingLeft: "15px",
                }}
              >
                공연 시간표
              </h3>
              <S.DateSlider>
                {dates.map((d) => (
                  <S.DateItem
                    key={d.fullDate}
                    $active={selectedDate === d.fullDate}
                    $isMonday={d.isMonday}
                    onClick={() => setSelectedDate(d.fullDate)}
                  >
                    <div className="day">{d.day}</div>
                    <div className="date">{d.date}</div>
                  </S.DateItem>
                ))}
              </S.DateSlider>
              <div>
                {dates.find((d) => d.fullDate === selectedDate)?.isMonday ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "50px 0",
                      color: "#ff6b6b",
                    }}
                  >
                    <h3>오늘은 정기 휴관일입니다.</h3>
                    <p
                      style={{
                        marginTop: "10px",
                        fontSize: "14px",
                        color: "#888",
                      }}
                    >
                      매월 첫째 주 월요일은 시설 점검을 위해 쉽니다.
                    </p>
                  </div>
                ) : (
                  SCHEDULE_DATA.map((item, idx) => (
                    <S.ScheduleItem key={idx}>
                      <div className="time">{item.time}</div>
                      <div className="info">
                        <div className="title">{item.title}</div>
                        <div className="place">{item.place}</div>
                      </div>
                      <div
                        className={`status ${item.status}`}
                        // [추가] 예매가능(open)일 때만 클릭 이벤트 연결
                        onClick={() => {
                          if (item.status === "open")
                            setIsBookingModalOpen(true);
                        }}
                      >
                        {item.status === "closed"
                          ? "마감"
                          : item.status === "open"
                            ? "예매가능"
                            : "준비중"}
                      </div>
                    </S.ScheduleItem>
                  ))
                )}
              </div>
            </S.ProgramCol>
          </S.ProgramLayout>
        </S.Container>
      </S.Section>

      {/* [삭제됨] BookingSection 제거 */}

      <S.Section id="community">
        <S.Container>
          <S.SectionTitle>커뮤니티</S.SectionTitle>
          <S.CommunityGrid>
            <S.CommBox
              onClick={() => setIsFaqModalOpen(true)}
              style={{ cursor: "pointer" }}
            >
              <S.CommTitle>
                자주 묻는 질문 <span>+</span>
              </S.CommTitle>
              {[
                "예매 취소는 언제까지 가능한가요?",
                "주차장 이용 안내",
                "음식물 반입이 되나요?",
              ].map((text, idx) => (
                <S.FaqItem
                  key={idx}
                  $active={false}
                  style={{ pointerEvents: "none" }}
                >
                  <div className="question">Q. {text}</div>
                </S.FaqItem>
              ))}
            </S.CommBox>

            <S.CommBox
              onClick={() => setIsReviewModalOpen(true)}
              style={{ cursor: "pointer" }}
            >
              <S.CommTitle>
                관람 후기 <span>more</span>
              </S.CommTitle>
              <S.CommList>
                <li>
                  <span>[포토] 빛의 바다 아름다워요!</span>{" "}
                  <span style={{ color: "#ffdd57" }}>★ 5.0</span>
                </li>
                <li>
                  <span>아이들이 VR 좋아하네요.</span>{" "}
                  <span style={{ color: "#ffdd57" }}>★ 4.5</span>
                </li>
                <li>
                  <span>돌고래 공연 감동적...</span>{" "}
                  <span style={{ color: "#ffdd57" }}>★ 5.0</span>
                </li>
                <li>
                  <span>주말엔 사람이 많네요.</span>{" "}
                  <span style={{ color: "#ffdd57" }}>★ 4.0</span>
                </li>
                <li>
                  <span>재방문 의사 있습니다!</span>{" "}
                  <span style={{ color: "#ffdd57" }}>★ 5.0</span>
                </li>
              </S.CommList>
            </S.CommBox>
          </S.CommunityGrid>
        </S.Container>
      </S.Section>

      <FaqModal
        isOpen={isFaqModalOpen}
        onClose={() => setIsFaqModalOpen(false)}
      />
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </>
  );
};

export default Home;
