package com.naquarium.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class DashboardStatsDto {
    private long todayReservations;
    private long weekSchedules;
    private long totalUsers;
    private List<AdminReviewDto> recentReviews;
}
