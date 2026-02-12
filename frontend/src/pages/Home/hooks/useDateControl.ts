/**
 * 날짜 슬라이더 제어 커스텀 훅
 * - 현재 주(월~일) 7일 날짜 생성
 * - 오늘 날짜 자동 선택 (해당 주에 포함된 경우)
 * - ProgramSection의 날짜 슬라이더에서 사용
 */
import { useState, useEffect } from "react";

export const useDateControl = () => {
  const [dates, setDates] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");

  /** 날짜를 YYYY-MM-DD 형식으로 변환 */
  const getLocalYMD = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  /** 마운트 시 현재 주의 월~일 날짜 생성 */
  useEffect(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    /** 현재 요일에서 월요일까지의 차이 계산 */
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(today);
    monday.setDate(today.getDate() - diffToMonday);

    const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
    const tempDays = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);

      tempDays.push({
        fullDate: getLocalYMD(d),
        date: d.getDate(),
        day: weekDays[d.getDay()],
        isMonday: d.getDay() === 1, // 월요일 = 휴관일 표시
      });
    }

    setDates(tempDays);

    /** 오늘이 이번 주에 포함되면 오늘 선택, 아니면 첫 날짜 */
    const todayStr = getLocalYMD(new Date());
    const hasToday = tempDays.find((d) => d.fullDate === todayStr);
    setSelectedDate(hasToday ? todayStr : tempDays[0].fullDate);
  }, []);

  return { dates, selectedDate, setSelectedDate };
};
