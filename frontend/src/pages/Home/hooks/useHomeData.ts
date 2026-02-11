import { useState, useEffect } from "react";
import { api } from "../../../api/axios";
import type { ReviewData, ReservationDto } from "../../../types/api";

export interface ScheduleItemData {
  id: number;
  programId: number;
  title: string;
  place: string;
  time: string;
  status: string;
  date: string;
  price: number;
}

// ✅ [사수 코멘트]
// 데이터 로딩 로직을 한곳에 모았습니다.
// 이제 컴포넌트에서는 useHomeData() 한 줄이면 데이터를 가져올 수 있습니다.
export const useHomeData = (isLoggedIn: boolean) => {
  const [schedules, setSchedules] = useState<ScheduleItemData[]>([]);
  const [recentReviews, setRecentReviews] = useState<ReviewData[]>([]);
  const [myReservations, setMyReservations] = useState<ReservationDto[]>([]);

  // 날짜 포맷 헬퍼 (내부 사용)
  const getLocalYMD = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. 스케줄 로드
        try {
          const scheduleRes = await api.get("/schedules");
          const rawSchedules = Array.isArray(scheduleRes.data)
            ? scheduleRes.data
            : [];

          const mappedSchedules = rawSchedules.map((item: any) => ({
            id: item.scheduleId || item.id, // DTO 필드명 대응
            programId: item.programId,
            title: item.programTitle || item.title || "프로그램",
            place: item.location || item.place || "메인홀",
            time: item.startTime
              ? item.startTime.includes("T")
                ? item.startTime.split("T")[1].substring(0, 5)
                : item.time
              : "00:00",
            status: item.isClosed ? "closed" : "open",
            date: item.date || getLocalYMD(new Date()),
            price: item.price || 0,
          }));
          setSchedules(mappedSchedules);
        } catch (e) {
          console.error("스케줄 로드 실패:", e);
        }

        // 2. 후기 로드
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

        // 3. 내 예약 로드 (로그인 시)
        if (isLoggedIn) {
          try {
            const myRes = await api.get<ReservationDto[]>("/reservations/me");
            setMyReservations(myRes.data);
          } catch (e) {
            console.error("예약 목록 로드 실패", e);
          }
        }
      } catch (error) {
        console.error("전체 데이터 로딩 중 에러:", error);
      }
    };

    fetchData();
  }, [isLoggedIn]);

  return { schedules, recentReviews, myReservations };
};
