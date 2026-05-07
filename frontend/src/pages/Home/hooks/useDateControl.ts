/**
 * 홈 화면 날짜 탭 상태 관리 훅
 *
 * 이번 주 일요일~토요일 7일을 계산하고,
 * 기본 선택 날짜를 오늘로 설정한다.
 * 월요일(isMonday)은 휴관일로 표시하기 위해 별도 플래그를 포함한다.
 */
import { useState } from "react";

/**
 * Date 객체를 로컬 시간 기준 "YYYY-MM-DD" 문자열로 변환한다.
 * toISOString()은 UTC 기준이라 자정 근처에서 날짜가 달라질 수 있어
 * getFullYear/Month/Date를 직접 사용한다.
 */
const getLocalYMD = (d: Date): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * 이번 주(일~토) 7일의 날짜 배열을 생성한다.
 * 오늘 날짜에서 getDay()로 일요일 기준 오프셋을 구해 주의 시작일을 계산한다.
 */
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
  // 날짜 배열은 마운트 시 1회만 생성하면 되므로 초기화 함수로 전달한다.
  const [dates] = useState(buildWeekDays);

  // 오늘 날짜가 이번 주 배열에 없으면 첫 번째 날짜를 기본값으로 사용한다.
  const [selectedDate, setSelectedDate] = useState(() => {
    const days = buildWeekDays();
    const todayStr = getLocalYMD(new Date());
    return days.find((d) => d.fullDate === todayStr)?.fullDate ?? days[0].fullDate;
  });

  return { dates, selectedDate, setSelectedDate };
};
