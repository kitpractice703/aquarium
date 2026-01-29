import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // [추가] 페이지 이동 훅
import { api } from "../../api/axios";
import { useAuth } from "../../context/AuthContext"; // [추가] 로그인 상태 훅
import type { ScheduleData, ReviewData } from "../../types/api";

import HeroSection from "../../components/HeroSection";
import KakaoMap from "../../components/common/KakaoMap";
import ThemeSection from "../../components/common/ThemeSection";
import FaqModal from "../../components/common/FaqModal";
import ReviewModal from "../../components/common/ReviewModal";
import BookingModal from "../../components/common/BookingModal";
import ProgramBookingModal from "../../components/common/ProgramBookingModal";
import CommonModal from "../../components/common/Modal"; // [추가] 안내 모달용

import vrImage from "../../assets/images/vr_driving.jpeg";
import feedingImage from "../../assets/images/feeding.jpg";

import * as S from "./style";

// [상수 함수 1] 한국 시간 기준 YYYY-MM-DD 변환
const getLocalYMD = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// [상수 함수 2] 이번 주 월~일 날짜 배열 생성
const getDaysArray = () => {
  const days = [];
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0(일) ~ 6(토)

  // 오늘이 일요일(0)이면 6일 전이 월요일, 아니면 (요일-1)일 전이 월요일
  const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const monday = new Date(today);
  monday.setDate(today.getDate() - diffToMonday);

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);

    days.push({
      fullDate: getLocalYMD(d),
      date: d.getDate(),
      day: weekDays[d.getDay()],
      isMonday: d.getDay() === 1,
    });
  }
  return days;
};

const Home = () => {
  const navigate = useNavigate(); // [추가]
  const { isLoggedIn } = useAuth(); // [추가] 로그인 상태 가져오기

  const [schedules, setSchedules] = useState<ScheduleData[]>([]);
  const [reviews, setReviews] = useState<ReviewData[]>([]);

  const [dates, setDates] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");

  // 모달 상태들
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isAdmissionModalOpen, setIsAdmissionModalOpen] = useState(false);
  const [isLoginNoticeOpen, setIsLoginNoticeOpen] = useState(false); // [추가] 로그인 안내 모달

  const [selectedProgram, setSelectedProgram] = useState<{
    id: number;
    title: string;
    price: number;
  } | null>(null);

  // [핵심] 로그인 체크 함수 (Guard)
  // 로그인이 안 되어 있으면 모달을 띄우고 false 반환, 되어 있으면 true 반환
  const checkLogin = () => {
    if (!isLoggedIn) {
      setIsLoginNoticeOpen(true);
      return false;
    }
    return true;
  };

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

  // 2. 날짜 초기화
  useEffect(() => {
    const dayList = getDaysArray();
    setDates(dayList);

    const todayStr = getLocalYMD(new Date());
    const hasToday = dayList.find((d) => d.fullDate === todayStr);
    setSelectedDate(hasToday ? todayStr : dayList[0].fullDate);
  }, []);

  const handleReviewClick = (reviewId: number) => {
    alert(`${reviewId}번 게시글 상세 페이지로 이동합니다. (구현 예정)`);
  };

  // 3. [수정] 프로그램 예약 버튼 핸들러 (로그인 체크 적용)
  const handleProgramClick = (
    status: string,
    program: { id: number; title: string; price: number },
  ) => {
    if (status !== "open") {
      alert("현재 예매 가능한 상태가 아닙니다.");
      return;
    }
    // 로그인 체크 통과 시에만 실행
    if (checkLogin()) {
      setSelectedProgram(program);
    }
  };

  // 4. [수정] 메인 배너 버튼 핸들러 (관람권 예매)
  const handleHeroBooking = () => {
    if (checkLogin()) {
      setIsAdmissionModalOpen(true);
    }
  };

  // 5. [수정] 스케줄 클릭 핸들러 (공연 예매)
  const handleScheduleClick = (status: string) => {
    if (status === "open") {
      if (checkLogin()) {
        setIsAdmissionModalOpen(true);
      }
    }
  };

  // 선택된 날짜와 일치하는 스케줄만 필터링
  const filteredSchedules = schedules.filter(
    (item) => item.date === selectedDate,
  );

  return (
    <>
      {/* [수정] HeroSection에 로그인 체크 핸들러 전달 */}
      <HeroSection onBookClick={handleHeroBooking} />

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
                {/* 프로그램 1 */}
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

                {/* 프로그램 2 */}
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
                {/* 월요일 휴관 안내 */}
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
                  // 스케줄 목록
                  filteredSchedules.map((item) => (
                    <S.ScheduleItem key={item.id}>
                      <div className="time">{item.time}</div>
                      <div className="info">
                        <div className="title">{item.title}</div>
                        <div className="place">{item.place}</div>
                      </div>
                      <div
                        className={`status ${item.status}`}
                        /* [수정] 스케줄 클릭 시 로그인 체크 핸들러 사용 */
                        onClick={() => handleScheduleClick(item.status)}
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

      {/* 기존 모달들 */}
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

      {/* [신규 추가] 로그인 필요 안내 모달 */}
      <CommonModal
        isOpen={isLoginNoticeOpen}
        onClose={() => setIsLoginNoticeOpen(false)}
        title="알림"
      >
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <p style={{ fontSize: "18px", color: "#fff", marginBottom: "30px" }}>
            로그인 후 이용 가능합니다.
          </p>
          <button
            onClick={() => {
              setIsLoginNoticeOpen(false); // 모달 닫고
              navigate("/login"); // 로그인 페이지로 이동
            }}
            style={{
              padding: "12px 30px",
              background: "var(--accent-cyan)",
              border: "none",
              borderRadius: "5px",
              fontWeight: "bold",
              fontSize: "16px",
              cursor: "pointer",
              color: "#000",
            }}
          >
            로그인 하러가기
          </button>
        </div>
      </CommonModal>
    </>
  );
};

export default Home;
