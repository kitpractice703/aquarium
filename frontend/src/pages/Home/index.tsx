/**
 * 홈 페이지 컴포넌트 (메인 페이지)
 * - Hero → About → Theme → Program → Community 섹션 순서 렌더링
 * - 각 섹션에서 발생하는 모달(FAQ, 리뷰, 예약, 결제 등) 상태 관리
 * - 비로그인 사용자의 예약 시도 시 LoginRequestModal → LoginModal 흐름
 * - 관람권 미보유 시 TicketNoticeModal → BookingModal 흐름
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

  /** 날짜 슬라이더 관련 상태 */
  const { dates, selectedDate, setSelectedDate } = useDateControl();
  /** 스케줄, 리뷰, 내 예약 데이터 */
  const { schedules, recentReviews, myReservations } = useHomeData(isLoggedIn, selectedDate);

  /* ── 모달 상태 관리 ── */
  const [isTicketNoticeOpen, setIsTicketNoticeOpen] = useState(false);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isAdmissionModalOpen, setIsAdmissionModalOpen] = useState(false);
  const [isLoginNoticeOpen, setIsLoginNoticeOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [faqIndex, setFaqIndex] = useState<number | null>(null);

  /** 선택된 프로그램 정보 (ProgramBookingModal용) */
  const [selectedProgram, setSelectedProgram] = useState<{
    id: number;
    title: string;
    price: number;
    fixedDate?: string;
    fixedTime?: string;
  } | null>(null);

  /** 로그인 여부 확인 (비로그인 시 안내 모달) */
  const checkLogin = () => {
    if (!isLoggedIn) {
      setIsLoginNoticeOpen(true);
      return false;
    }
    return true;
  };

  /** Hero 섹션 예매 버튼 → 관람권 예약 모달 */
  const handleHeroBooking = () => {
    if (checkLogin()) setIsAdmissionModalOpen(true);
  };

  /** 체험 프로그램 카드 클릭 → 프로그램 예약 모달 */
  const handleProgramClick = (program: {
    id: number;
    title: string;
    price: number;
  }) => {
    if (checkLogin()) setSelectedProgram(program);
  };

  /** 시간표 스케줄 클릭 → 날짜/시간 고정된 프로그램 예약 */
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

      {/* FAQ 모달 */}
      <FaqModal
        isOpen={isFaqModalOpen}
        onClose={() => setIsFaqModalOpen(false)}
      />
      {/* 리뷰 모달 */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />
      {/* 관람권 예약 모달 */}
      <BookingModal
        isOpen={isAdmissionModalOpen}
        onClose={() => setIsAdmissionModalOpen(false)}
      />

      {/* 프로그램 예약 모달 */}
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
            setSelectedProgram(null);
            setIsTicketNoticeOpen(true);
          }}
        />
      )}

      {/* 관람권 미보유 안내 → 확인 시 관람권 예약으로 전환 */}
      <TicketNoticeModal
        isOpen={isTicketNoticeOpen}
        onClose={() => setIsTicketNoticeOpen(false)}
        onConfirm={() => {
          setIsTicketNoticeOpen(false);
          setIsAdmissionModalOpen(true);
        }}
      />

      {/* 비로그인 안내 → 확인 시 로그인 모달 */}
      <LoginRequestModal
        isOpen={isLoginNoticeOpen}
        onClose={() => setIsLoginNoticeOpen(false)}
        onConfirm={() => {
          setIsLoginNoticeOpen(false);
          setIsLoginModalOpen(true);
        }}
      />

      {/* 로그인 모달 */}
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
