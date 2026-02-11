import { useState, useEffect } from "react";

// ✅ [사수 코멘트]
// 날짜 계산 로직이 Home 컴포넌트를 너무 많이 차지하고 있었습니다.
// "날짜 관련은 얘가 담당해!"라고 위임하는 겁니다.
export const useDateControl = () => {
  const [dates, setDates] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const getLocalYMD = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
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
        isMonday: d.getDay() === 1,
      });
    }

    setDates(tempDays);

    // 오늘 날짜 선택 (없으면 첫 번째 날짜)
    const todayStr = getLocalYMD(new Date());
    const hasToday = tempDays.find((d) => d.fullDate === todayStr);
    setSelectedDate(hasToday ? todayStr : tempDays[0].fullDate);
  }, []);

  return { dates, selectedDate, setSelectedDate };
};
