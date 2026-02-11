import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

// Hooks
import { useHomeData } from "./hooks/useHomeData";
import { useDateControl } from "./hooks/useDateControl";
import type { ScheduleData } from "../../types/api";

// Sub-Components
import HeroSection from "../../components/HeroSection";
import ThemeSection from "../../components/common/ThemeSection";
import AboutSection from "../Home/";
import ProgramSection from "./components/ProgramSection";
import CommunitySection from "./components/CommunitySection";

// Modals
import FaqModal from "../../components/common/FaqModal";
import ReviewModal from "../../components/common/ReviewModal";
import BookingModal from "../../components/common/BookingModal";
import ProgramBookingModal from "../../components/common/ProgramBookingModal";
import LoginRequestModal from "../../components/common/LoginRequestModal";
import LoginModal from "../../components/common/LoginModal";
import TicketNoticeModal from "../../components/common/TicketNoticeModal";

const Home = () => {
  const { isLoggedIn } = useAuth();

  // 1. 비즈니스 로직 (Hooks 사용)
  const { schedules, recentReviews, myReservations } = useHomeData(isLoggedIn);
  const { dates, selectedDate, setSelectedDate } = useDateControl();

  // 2. 모달 상태 관리 (페이지 레벨 상태)
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

  // 3. 핸들러 함수들
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

  const handleProgramClick = (program: {
    id: number;
    title: string;
    price: number;
  }) => {
    if (checkLogin()) setSelectedProgram(program);
  };

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

      {/* --- Global Modals --- */}
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
          fixedDate={selectedProgram.fixedDate}
          fixedTime={selectedProgram.fixedTime}
          myReservations={myReservations}
          onRequireTicket={() => {
            setSelectedProgram(null);
            setIsTicketNoticeOpen(true);
          }}
        />
      )}

      <TicketNoticeModal
        isOpen={isTicketNoticeOpen}
        onClose={() => setIsTicketNoticeOpen(false)}
        onConfirm={() => {
          setIsTicketNoticeOpen(false);
          setIsAdmissionModalOpen(true);
        }}
      />

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
