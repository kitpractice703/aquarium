/**
 * 일정(스케줄) 공개 조회 API
 *
 * 홈 화면 프로그램 섹션에서 날짜별 공연·체험 스케줄을 가져온다.
 * 파일명은 exhibitionApi이나 실제로는 통합 스케줄 조회 엔드포인트를 사용한다.
 */
import { api } from "./axios";

/**
 * 날짜별 스케줄 목록 조회 (공개 엔드포인트, 인증 불필요).
 * @param date YYYY-MM-DD 형식 날짜
 * @returns 공연·체험 스케줄 혼합 배열 (useHomeData에서 ScheduleData 형식으로 정규화)
 */
export const getSchedulesByDate = async (date: string) => {
  const res = await api.get(`/schedules?date=${date}`);
  return res.data;
};
