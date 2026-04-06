/** 공연 시간표 날짜 슬라이더 - 현재 주(월~일) 날짜 생성 및 선택 상태 관리 */
import { useState } from "react";

const getLocalYMD = (d: Date): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const buildWeekDays = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  // 일요일(0)은 6일 전이 월요일, 나머지는 (요일 - 1)일 전
  const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - diffToMonday);

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      fullDate: getLocalYMD(d),
      date: d.getDate(),
      day: weekDays[d.getDay()],
      isMonday: d.getDay() === 1,
    };
  });
};

export const useDateControl = () => {
  const [dates] = useState(buildWeekDays);

  const [selectedDate, setSelectedDate] = useState(() => {
    const days = buildWeekDays();
    const todayStr = getLocalYMD(new Date());
    return days.find((d) => d.fullDate === todayStr)?.fullDate ?? days[0].fullDate;
  });

  return { dates, selectedDate, setSelectedDate };
};
