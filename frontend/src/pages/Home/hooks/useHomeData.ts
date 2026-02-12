/**
 * 홈페이지 데이터 로딩 커스텀 훅
 * - 날짜별 스케줄 조회 (GET /api/schedules?date=)
 * - 최근 리뷰 5건 조회 (GET /api/posts/reviews?page=0&size=5)
 * - 로그인 시 내 예약 목록 조회 (GET /api/reservations/me)
 */
import { useState, useEffect } from "react";
import { api } from "../../../api/axios";
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
        const scheduleRes = await api.get(`/schedules?date=${selectedDate}`);
        const rawSchedules = Array.isArray(scheduleRes.data)
          ? scheduleRes.data
          : [];

        /** 백엔드 응답을 프론트엔드 ScheduleData 형식으로 매핑 */
        const mappedSchedules: ScheduleData[] = rawSchedules.map(
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
        const reviewRes = await api.get<any>("/posts/reviews?page=0&size=5");
        const reviews = reviewRes.data.content
          ? reviewRes.data.content
          : Array.isArray(reviewRes.data)
            ? reviewRes.data
            : [];
        setRecentReviews(reviews);
      } catch (e) {
        console.error("후기 로드 실패:", e);
      }

      /** 로그인 상태에서만 내 예약 조회 (관람권 보유 확인용) */
      if (isLoggedIn) {
        try {
          const myRes = await api.get<ReservationDto[]>("/reservations/me");
          setMyReservations(myRes.data);
        } catch (e) {
          console.error("예약 목록 로드 실패", e);
        }
      }
    };

    fetchOtherData();
  }, [isLoggedIn]);

  return { schedules, recentReviews, myReservations };
};
