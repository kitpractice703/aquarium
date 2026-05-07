package com.naquarium.controller;

import com.naquarium.dto.DashboardStatsDto;
import com.naquarium.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 관리자 대시보드 컨트롤러 (/api/admin/**)
 *
 * SecurityConfig에서 /api/admin/** 는 ADMIN 역할만 접근 가능하도록 설정되어 있다.
 *
 * - GET /api/admin/dashboard  대시보드 통계 조회
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    /**
     * GET /api/admin/dashboard - 오늘 예약 수, 이번 주 스케줄 수, 전체 회원 수, 최근 리뷰 5건
     */
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsDto> getDashboard() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }
}
