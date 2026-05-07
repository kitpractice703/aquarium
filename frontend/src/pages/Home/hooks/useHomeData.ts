/**
 * 홈 화면 데이터 페칭 훅
 *
 * 날짜별 스케줄, 최신 리뷰, 내 예약 목록을 병렬로 불러온다.
 * - 스케줄: selectedDate 변경 시마다 재조회
 * - 리뷰·예약: 마운트 시 1회 조회 (isLoggedIn 변화 시 예약 재조회)
 *
 * 백엔드 스케줄 응답은 필드명이 일정하지 않을 수 있어
 * RawScheduleItem → ScheduleData 정규화를 이 훅에서 처리한다.
 */
import { useState, useEffect } from "react";
import { getSchedulesByDate } from "../../../api/exhibitionApi";
import { getReviews } from "../../../api/reviewApi";
import { getMyReservations } from "../../../api/reservationApi";
import type { ReviewData, ReservationData, ScheduleData } from "../../../types/api";

/** 백엔드 스케줄 응답의 원시 타입 (필드명이 버전마다 다를 수 있음) */
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

/**
 * @param isLoggedIn 로그인 여부 - true일 때만 내 예약 목록을 조회한다
 * @param selectedDate YYYY-MM-DD 형식 선택 날짜
 */
export const useHomeData = (isLoggedIn: boolean, selectedDate: string) => {
  const [schedules, setSchedules] = useState<ScheduleData[]>([]);
  const [recentReviews, setRecentReviews] = useState<ReviewData[]>([]);
  const [myReservations, setMyReservations] = useState<ReservationData[]>([]);

  // selectedDate가 바뀔 때마다 해당 날짜의 스케줄을 다시 불러온다.
  useEffect(() => {
    if (!selectedDate) return;

    const fetchSchedules = async () => {
      try {
        const rawSchedules = await getSchedulesByDate(selectedDate);
        const safeSchedules = Array.isArray(rawSchedules) ? rawSchedules : [];

        // 백엔드 응답 필드명 변동에 대응하기 위해 옵셔널 체이닝으로 다중 경로를 처리한다.
        const mappedSchedules: ScheduleData[] = safeSchedules.map((item: RawScheduleItem) => ({
          id: item.scheduleId ?? item.id ?? 0,
          programId: item.programId ?? 0,
          title: item.programTitle || item.title || "프로그램",
          place: item.location || item.place || "메인홀",
          time: item.time || (item.startTime
            ? item.startTime.includes("T")
              ? item.startTime.split("T")[1].substring(0, 5)  // ISO 8601 형식
              : item.startTime                                  // "HH:mm" 형식
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

  // 마운트 시 최신 리뷰 5건을 불러오고, 로그인 상태이면 내 예약도 함께 조회한다.
  useEffect(() => {
    const fetchOtherData = async () => {
      try {
        const reviewData = await getReviews(0, 5);
        // 페이지네이션 응답(content 필드)과 배열 응답 모두 대응한다.
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
