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

  const handleProgramClick = (program: { id: number; title: string; price: number }) => {
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
            setSelectedProgram(null);
            setIsTicketNoticeOpen(true);
          }}
        />
      )}

      {/* 관람권 미보유 안내 → 확인 시 관람권 예약 모달로 전환 */}
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
