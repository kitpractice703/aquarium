import { useState, useEffect } from "react";
import { getSchedulesByDate } from "../../../api/exhibitionApi";
import { getReviews } from "../../../api/reviewApi";
import { getMyReservations } from "../../../api/reservationApi";
import type { ReviewData, ReservationDto, ScheduleData } from "../../../types/api";

interface RawScheduleItem {
  scheduleId?: number;
  id?: number;
  programId?: number;
  programTitle?: string;
  title?: string;
  location?: string;
  place?: string;
  time?: string;
  startTime?: string;
  status?: string;
  isClosed?: boolean;
  date?: string;
  price?: number;
}

export const useHomeData = (isLoggedIn: boolean, selectedDate: string) => {
  const [schedules, setSchedules] = useState<ScheduleData[]>([]);
  const [recentReviews, setRecentReviews] = useState<ReviewData[]>([]);
  const [myReservations, setMyReservations] = useState<ReservationDto[]>([]);

  useEffect(() => {
    if (!selectedDate) return;

    const fetchSchedules = async () => {
      try {
        const rawSchedules = await getSchedulesByDate(selectedDate);
        const safeSchedules = Array.isArray(rawSchedules) ? rawSchedules : [];

        // 백엔드 응답 필드명 차이를 프론트엔드 ScheduleData 형식으로 정규화
        const mappedSchedules: ScheduleData[] = safeSchedules.map((item: RawScheduleItem) => ({
          id: item.scheduleId ?? item.id ?? 0,
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
        }));

        setSchedules(mappedSchedules);
      } catch (e) {
        console.error("스케줄 로드 실패:", e);
      }
    };

    fetchSchedules();
  }, [selectedDate]);

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
