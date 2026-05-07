package com.naquarium.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

/**
 * 관리자 대시보드 통계 응답 DTO
 *
 * 오늘 예약 건수, 이번 주 스케줄 수(공연+체험), 전체 회원 수, 최근 리뷰 5건을 포함한다.
 */
@Getter
@AllArgsConstructor
public class DashboardStatsDto {
    private long todayReservations;
    private long weekSchedules;
    private long totalUsers;
    private List<AdminReviewDto> recentReviews;
}
