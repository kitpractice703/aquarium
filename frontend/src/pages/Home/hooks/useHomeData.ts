/**
 * 홈페이지 데이터 로딩 커스텀 훅
 * - exhibitionApi: 날짜별 스케줄 조회
 * - reviewApi: 최근 리뷰 5건 조회
 * - reservationApi: 로그인 시 내 예약 목록 조회 (관람권 보유 확인)
 */
import { useState, useEffect } from "react";
import { getSchedulesByDate } from "../../../api/exhibitionApi";
import { getReviews } from "../../../api/reviewApi";
import { getMyReservations } from "../../../api/reservationApi";
import type {
  ReviewData,
  ReservationDto,
  ScheduleData,
} from "../../../types/api";

export const useHomeData = (isLoggedIn: boolean, selectedDate: string) => {
  const [schedules, setSchedules] = useState<ScheduleData[]>([]);
  const [recentReviews, setRecentReviews] = useState<ReviewData[]>([]);
  const [myReservations, setMyReservations] = useState<ReservationDto[]>([]);

  /** 선택된 날짜에 해당하는 공연 스케줄 조회 */
  useEffect(() => {
    if (!selectedDate) return;

    const fetchSchedules = async () => {
      try {
        const rawSchedules = await getSchedulesByDate(selectedDate);
        const safeSchedules = Array.isArray(rawSchedules)
          ? rawSchedules
          : [];

        /** 백엔드 응답을 프론트엔드 ScheduleData 형식으로 매핑 */
        const mappedSchedules: ScheduleData[] = safeSchedules.map(
          (item: any) => ({
            id: item.scheduleId || item.id,
            programId: item.programId,
            title: item.programTitle || item.title || "프로그램",
            place: item.location || item.place || "메인홀",
            time: item.time || (item.startTime
              ? item.startTime.includes("T")
                ? item.startTime.split("T")[1].substring(0, 5)
                : item.startTime
              : "00:00"),
            status: item.status || (item.isClosed ? "closed" : "open"),
            date: item.date || selectedDate,
            price: item.price || 0,
          }),
        );
        setSchedules(mappedSchedules);
      } catch (e) {
        console.error("스케줄 로드 실패:", e);
      }
    };

    fetchSchedules();
  }, [selectedDate]);

  /** 최근 리뷰 + 내 예약 조회 (로그인 상태 변경 시) */
  useEffect(() => {
    const fetchOtherData = async () => {
      try {
        const reviewData = await getReviews(0, 5);
        const reviews = reviewData.content
          ? reviewData.content
          : Array.isArray(reviewData)
            ? reviewData
            : [];
        setRecentReviews(reviews);
      } catch (e) {
        console.error("후기 로드 실패:", e);
      }

      /** 로그인 상태에서만 내 예약 조회 (관람권 보유 확인용) */
      if (isLoggedIn) {
        try {
          const reservations = await getMyReservations();
          setMyReservations(reservations);
        } catch (e) {
          console.error("예약 목록 로드 실패", e);
        }
      }
    };

    fetchOtherData();
  }, [isLoggedIn]);

  return { schedules, recentReviews, myReservations };
};
