package com.naquarium.controller;

import com.naquarium.dto.AdminReservationDto;
import com.naquarium.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 관리자 예약 관리 컨트롤러 (/api/admin/reservations/**)
 *
 * - GET   /api/admin/reservations           전체 예약 목록 조회 (필터 지원)
 * - PATCH /api/admin/reservations/{id}/cancel  예약 강제 취소
 */
@RestController
@RequestMapping("/api/admin/reservations")
@RequiredArgsConstructor
public class AdminReservationController {

    private final AdminService adminService;

    /**
     * GET /api/admin/reservations - 전체 예약 목록 조회
     * 날짜·상태·이메일/이름으로 필터링하며, 모두 선택 파라미터다.
     *
     * @param date   YYYY-MM-DD 날짜 필터
     * @param status "CONFIRMED" | "CANCELLED"
     * @param search 이메일 또는 이름 검색어
     */
    @GetMapping
    public ResponseEntity<List<AdminReservationDto>> getReservations(
            @RequestParam(required = false) String date,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(adminService.getAllReservations(date, status, search));
    }

    /**
     * PATCH /api/admin/reservations/{id}/cancel - 예약 강제 취소
     * 데이터를 삭제하지 않고 status를 CANCELLED로 변경한다.
     */
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<String> cancelReservation(@PathVariable Long id) {
        adminService.cancelReservation(id);
        return ResponseEntity.ok("예약이 취소되었습니다.");
    }
}
