/**
 * 홈 페이지
 *
 * 섹션 구성: HeroSection → AboutSection → ThemeSection → ProgramSection → CommunitySection
 *
 * 모달 흐름:
 * - 비로그인 사용자가 예매·리뷰 등 인증이 필요한 액션을 시도하면
 *   LoginRequestModal → LoginModal 순으로 유도한다.
 * - 프로그램 예매 시 해당 날짜 입장권이 없으면
 *   ProgramBookingModal → TicketNoticeModal → BookingModal(입장권) 순으로 연결한다.
 */
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useHomeData } from "./hooks/useHomeData";
import { useDateControl } from "./hooks/useDateControl";
import type { ScheduleData } from "../../types/api";

import HeroSection from "../../components/layout/HeroSection";
import ThemeSection from "../../components/sections/ThemeSection";
import AboutSection from "../../components/sections/AboutSection";
import ProgramSection from "../../components/sections/ProgramSection";
import CommunitySection from "../../components/sections/CommunitySection";

import FaqModal from "../../components/modals/FaqModal";
import ReviewModal from "../../components/modals/ReviewModal";
import BookingModal from "../../components/modals/BookingModal";
import ProgramBookingModal from "../../components/modals/ProgramBookingModal";
import LoginRequestModal from "../../components/modals/LoginRequestModal";
import LoginModal from "../../components/modals/LoginModal";
import TicketNoticeModal from "../../components/modals/TicketNoticeModal";

const Home = () => {
  const { isLoggedIn } = useAuth();
  const { dates, selectedDate, setSelectedDate } = useDateControl();
  const { schedules, recentReviews, myReservations } = useHomeData(isLoggedIn, selectedDate);

  const [isTicketNoticeOpen, setIsTicketNoticeOpen] = useState(false);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isAdmissionModalOpen, setIsAdmissionModalOpen] = useState(false);
  const [isLoginNoticeOpen, setIsLoginNoticeOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [faqIndex, setFaqIndex] = useState<number | null>(null);

  const [selectedProgram, setSelectedProgram] = useState<{
    id: number;
    title: string;
    price: number;
    fixedDate?: string;
    fixedTime?: string;
  } | null>(null);

  /**
   * 인증이 필요한 액션 실행 전 로그인 여부를 확인한다.
   * 비로그인 상태이면 LoginRequestModal을 열고 false를 반환해 이후 동작을 중단한다.
   */
  const checkLogin = () => {
    if (!isLoggedIn) {
      setIsLoginNoticeOpen(true);
      return false;
    }
    return true;
  };

  const handleHeroBooking = () => {
    if (checkLogin()) setIsAdmissionModalOpen(true);
  };

  /** 홈 프로그램 카드 클릭 시 프로그램 정보를 저장하고 예매 모달을 연다 */
  const handleProgramClick = (program: { id: number; title: string; price: number }) => {
    if (checkLogin()) setSelectedProgram(program);
  };

  /**
   * 홈 스케줄 항목 클릭 시 날짜·시간이 고정된 채로 예매 모달을 연다.
   * status가 "open"이 아닌 항목(closed, 만석 등)은 클릭을 차단한다.
   * price가 0인 경우 기본값 20,000원을 사용한다.
   */
  const handleScheduleClick = (item: ScheduleData) => {
    if (item.status !== "open") return;
    if (checkLogin()) {
      setSelectedProgram({
        id: item.programId,
        title: item.title,
        price: item.price > 0 ? item.price : 20000,
        fixedDate: item.date,
        fixedTime: item.time,
      });
    }
  };

  return (
    <>
      <HeroSection onBookClick={handleHeroBooking} />
      <AboutSection />
      <ThemeSection />

      <ProgramSection
        dates={dates}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        schedules={schedules}
        onProgramClick={handleProgramClick}
        onScheduleClick={handleScheduleClick}
      />

      <CommunitySection
        reviews={recentReviews}
        onOpenFaq={() => setIsFaqModalOpen(true)}
        onOpenReview={() => setIsReviewModalOpen(true)}
        faqIndex={faqIndex}
        onToggleFaq={(idx) => setFaqIndex(faqIndex === idx ? null : idx)}
      />

      <FaqModal isOpen={isFaqModalOpen} onClose={() => setIsFaqModalOpen(false)} />
      <ReviewModal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} />
      <BookingModal isOpen={isAdmissionModalOpen} onClose={() => setIsAdmissionModalOpen(false)} />

      {selectedProgram && (
        <ProgramBookingModal
          isOpen={!!selectedProgram}
          onClose={() => setSelectedProgram(null)}
          programTitle={selectedProgram.title}
          programId={selectedProgram.id}
          price={selectedProgram.price}
          fixedDate={selectedProgram.fixedDate}
          fixedTime={selectedProgram.fixedTime}
          myReservations={myReservations}
          onRequireTicket={() => {
            // 입장권 없이 프로그램 예매 시도 → 입장권 안내 모달로 연결
            setSelectedProgram(null);
            setIsTicketNoticeOpen(true);
          }}
        />
      )}

      {/* 입장권 필요 안내 → 확인 시 BookingModal(입장권)로 이동 */}
      <TicketNoticeModal
        isOpen={isTicketNoticeOpen}
        onClose={() => setIsTicketNoticeOpen(false)}
        onConfirm={() => {
          setIsTicketNoticeOpen(false);
          setIsAdmissionModalOpen(true);
        }}
      />

      {/* 비로그인 액션 차단 → 확인 시 로그인 모달로 이동 */}
      <LoginRequestModal
        isOpen={isLoginNoticeOpen}
        onClose={() => setIsLoginNoticeOpen(false)}
        onConfirm={() => {
          setIsLoginNoticeOpen(false);
          setIsLoginModalOpen(true);
        }}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onOpenSignup={() => {
          setIsLoginModalOpen(false);
          window.location.href = "/signup";
        }}
        onOpenReset={() => {
          setIsLoginModalOpen(false);
          alert("상단 메뉴의 '로그인' -> '비밀번호 찾기'를 이용해주세요.");
        }}
      />
    </>
  );
};

export default Home;
