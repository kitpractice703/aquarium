import { useState, useEffect } from "react";
import { api } from "../../api/axios";
import type { ScheduleData, ReviewData } from "../../types/api";

import HeroSection from "../../components/HeroSection";
import KakaoMap from "../../components/common/KakaoMap";
import ThemeSection from "../../components/common/ThemeSection";
import FaqModal from "../../components/common/FaqModal";
import ReviewModal from "../../components/common/ReviewModal";
import BookingModal from "../../components/common/BookingModal";
import vrImage from "../../assets/images/vr_driving.jpeg";
import feedingImage from "../../assets/images/feeding.jpg";

import * as S from "./style";

// 날짜 계산 유틸리티 함수 (기존 유지)
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

const Home = () => {
  // [2] 백엔드 데이터를 담을 State 생성
  const [schedules, setSchedules] = useState<ScheduleData[]>([]);
  const [reviews, setReviews] = useState<ReviewData[]>([]);

  // any 타입 대신 명시적인 타입을 사용하는 것이 좋으나, 현재는 로직 유지를 위해 둡니다.
  const [dates, setDates] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // [3] 페이지가 열릴 때 백엔드에서 데이터 가져오기 (Fetch)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // [MODIFIED] api 호출 시 제네릭 타입 명시 (axios 설정에 따라 다를 수 있으나 명시 추천)
        // api는 import 해온 axios 인스턴스입니다.
        const scheduleRes = await api.get<ScheduleData[]>("/schedules");
        setSchedules(scheduleRes.data);

        const reviewRes = await api.get<ReviewData[]>("/posts/reviews");
        setReviews(reviewRes.data);
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
        // [ADDED] 에러 발생 시 사용자에게 보여줄 UI 처리가 필요할 수 있습니다. (예: 빈 배열 유지)
      }
    };

    fetchData();
  }, []);

  // 날짜 초기화 로직 (기존 유지)
  useEffect(() => {
    const dayList = getDaysArray();
    setDates(dayList);
    const todayStr = new Date().toISOString().split("T")[0];
    const hasToday = dayList.find((d) => d.fullDate === todayStr);
    setSelectedDate(hasToday ? todayStr : dayList[0].fullDate);
  }, []);

  // 후기 클릭 핸들러 (기존 유지)
  const handleReviewClick = (reviewId: number) => {
    alert(`${reviewId}번 게시글 상세 페이지로 이동합니다.`);
  };

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
                  <span>청소년 (13세~18세)</span> <span>31,000원</span>
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
                  <img src={vrImage} alt="VR" />
                  <h4>가상 심해 다이빙 (VR)</h4>
                  <p>
                    실제 물에 들어가지 않고도 심해 3,000m를 탐험하는 VR
                    체험입니다. 대왕오징어와의 조우를 경험하세요.
                  </p>
                </S.ExperienceItem>
                <S.ExperienceItem>
                  <img src={feedingImage} alt="Feeding" />
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
                id="schedule-start"
                style={{
                  marginBottom: "20px",
                  color: "var(--accent-cyan)",
                  borderLeft: "4px solid var(--accent-cyan)",
                  paddingLeft: "15px",
                  scrollMarginTop: "100px",
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
                ) : schedules.length > 0 ? (
                  schedules.map((item) => (
                    <S.ScheduleItem key={item.id}>
                      <div className="time">{item.time}</div>
                      <div className="info">
                        <div className="title">{item.title}</div>
                        <div className="place">{item.place}</div>
                      </div>
                      <div
                        className={`status ${item.status}`}
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
                ) : (
                  <div
                    style={{
                      padding: "30px",
                      textAlign: "center",
                      color: "#888",
                    }}
                  >
                    등록된 공연 일정이 없습니다.
                  </div>
                )}
              </div>
            </S.ProgramCol>
          </S.ProgramLayout>
        </S.Container>
      </S.Section>

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

            <S.CommBox>
              <S.CommTitle
                onClick={() => setIsReviewModalOpen(true)}
                style={{ cursor: "pointer" }}
              >
                관람 후기 <span>more</span>
              </S.CommTitle>

              <S.CommList>
                {reviews.length > 0 ? (
                  reviews.slice(0, 5).map((review) => (
                    <li
                      key={review.id}
                      onClick={() => handleReviewClick(review.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <span>{review.title}</span>{" "}
                      <span style={{ color: "#ffdd57" }}>
                        ★ {review.rating.toFixed(1)}
                      </span>
                    </li>
                  ))
                ) : (
                  <li style={{ color: "#888", textAlign: "center" }}>
                    아직 등록된 후기가 없습니다.
                  </li>
                )}
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
