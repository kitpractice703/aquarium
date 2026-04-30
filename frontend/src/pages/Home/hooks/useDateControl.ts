import { useState } from "react";

const getLocalYMD = (d: Date): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const buildWeekDays = () => {
  const today = new Date();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - today.getDay());

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
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
