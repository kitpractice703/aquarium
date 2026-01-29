import { useState, useEffect } from "react";
import { api } from "../../api/axios";
import type { ScheduleData, ReviewData } from "../../types/api";

import HeroSection from "../../components/HeroSection";
import KakaoMap from "../../components/common/KakaoMap";
import ThemeSection from "../../components/common/ThemeSection";
import FaqModal from "../../components/common/FaqModal";
import ReviewModal from "../../components/common/ReviewModal";
import BookingModal from "../../components/common/BookingModal";
import ProgramBookingModal from "../../components/common/ProgramBookingModal";

import vrImage from "../../assets/images/vr_driving.jpeg";
import feedingImage from "../../assets/images/feeding.jpg";

import * as S from "./style";

// [수정 1] UTC가 아닌 '내 컴퓨터(한국) 시간' 기준으로 YYYY-MM-DD 문자열을 만드는 함수
// 이게 없으면 새벽 시간에 날짜가 하루 전으로 밀리는 문제가 발생합니다.
const getLocalYMD = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// [수정 2] 이번 주 월요일 ~ 일요일 계산 로직 (한국 시간 기준)
const getDaysArray = () => {
  const days = [];
  const today = new Date(); // 현재 시스템 시간
  const dayOfWeek = today.getDay(); // 0(일) ~ 6(토)

  // 오늘이 일요일(0)이면 6일 전이 월요일, 아니면 (요일-1)일 전이 월요일
  // 예: 목요일(4) -> 3일 전이 월요일
  const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const monday = new Date(today);
  monday.setDate(today.getDate() - diffToMonday);

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);

    days.push({
      fullDate: getLocalYMD(d), // YYYY-MM-DD (한국 시간)
      date: d.getDate(),
      day: weekDays[d.getDay()],
      isMonday: d.getDay() === 1,
    });
  }
  return days;
};

const Home = () => {
  const [schedules, setSchedules] = useState<ScheduleData[]>([]);
  const [reviews, setReviews] = useState<ReviewData[]>([]);

  const [dates, setDates] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isAdmissionModalOpen, setIsAdmissionModalOpen] = useState(false);

  const [selectedProgram, setSelectedProgram] = useState<{
    id: number;
    title: string;
    price: number;
  } | null>(null);

  // 1. 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const scheduleRes = await api.get<ScheduleData[]>("/schedules");
        setSchedules(scheduleRes.data);
        const reviewRes = await api.get<ReviewData[]>("/posts/reviews");
        setReviews(reviewRes.data);
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      }
    };
    fetchData();
  }, []);

  // 2. 날짜 초기화 (오늘 날짜가 이번 주에 포함되어 있으면 오늘을 선택)
  useEffect(() => {
    const dayList = getDaysArray();
    setDates(dayList);

    const todayStr = getLocalYMD(new Date());
    // 이번 주 목록 중에 오늘 날짜가 있는지 확인
    const hasToday = dayList.find((d) => d.fullDate === todayStr);

    // 있으면 오늘, 없으면(혹시 모를 상황) 월요일을 기본 선택
    setSelectedDate(hasToday ? todayStr : dayList[0].fullDate);
  }, []);

  const handleReviewClick = (reviewId: number) => {
    alert(`${reviewId}번 게시글 상세 페이지로 이동합니다.`);
  };

  const handleProgramClick = (
    status: string,
    program: { id: number; title: string; price: number },
  ) => {
    if (status === "open") {
      setSelectedProgram(program);
    } else {
      alert("현재 예매 가능한 상태가 아닙니다.");
    }
  };

  // [수정 3] 선택된 날짜와 일치하는 스케줄만 필터링
  // 백엔드에서 받은 date 문자열과 프론트에서 만든 selectedDate 문자열을 비교합니다.
  const filteredSchedules = schedules.filter(
    (item) => item.date === selectedDate,
  );

  return (
    <>
      <HeroSection onBookClick={() => setIsAdmissionModalOpen(true)} />

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
            <br />
            <br />
            현실과 환상이 공존하는 이곳에서, 잊혀진 바다의 이야기를 들어보세요.
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
                    marginTop: "15px",
                    fontSize: "16px",
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  📍 인천광역시 부평구 가상의 주소
                </p>
                <p
                  style={{
                    marginTop: "5px",
                    fontSize: "14px",
                    color: "var(--text-gray)",
                  }}
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
                      handleProgramClick("open", {
                        id: 101,
                        title: "가상 심해 다이빙",
                        price: 15000,
                      })
                    }
                    style={{
                      marginTop: "10px",
                      padding: "8px 16px",
                      cursor: "pointer",
                      background: "var(--accent-cyan)",
                      border: "none",
                      borderRadius: "5px",
                      fontWeight: "bold",
                    }}
                  >
                    예약하기
                  </button>
                </S.ExperienceItem>
                <S.ExperienceItem>
                  <img src={feedingImage} alt="Feeding" />
                  <h4>아쿠아리스트 먹이 주기</h4>
                  <p>
                    전문 아쿠아리스트와 함께 메인 수조의 물고기들에게 직접
                    먹이를 줍니다.
                  </p>
                  <button
                    onClick={() =>
                      handleProgramClick("open", {
                        id: 102,
                        title: "먹이주기 체험",
                        price: 20000,
                      })
                    }
                    style={{
                      marginTop: "10px",
                      padding: "8px 16px",
                      cursor: "pointer",
                      background: "var(--accent-cyan)",
                      border: "none",
                      borderRadius: "5px",
                      fontWeight: "bold",
                    }}
                  >
                    예약하기
                  </button>
                </S.ExperienceItem>
              </S.ExperienceList>
            </S.ProgramCol>

            <S.ProgramCol>
              <h3 id="schedule-start">공연 시간표</h3>
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
                {/* 월요일인 경우 휴관 안내 */}
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
                ) : filteredSchedules.length > 0 ? (
                  // 스케줄이 있는 경우
                  filteredSchedules.map((item) => (
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
                            setIsAdmissionModalOpen(true);
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
                  // 스케줄이 없는 경우
                  <div
                    style={{
                      padding: "30px",
                      textAlign: "center",
                      color: "#888",
                    }}
                  >
                    해당 날짜에는 예정된 공연 일정이 없습니다.
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
                      style={{ cursor: "pointer" }}
                      onClick={() => handleReviewClick(review.id)}
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
        isOpen={isAdmissionModalOpen}
        onClose={() => setIsAdmissionModalOpen(false)}
      />

      {selectedProgram && (
        <ProgramBookingModal
          isOpen={!!selectedProgram}
          onClose={() => setSelectedProgram(null)}
          programTitle={selectedProgram.title}
          programId={selectedProgram.id}
          price={selectedProgram.price}
        />
      )}
    </>
  );
};

export default Home;
