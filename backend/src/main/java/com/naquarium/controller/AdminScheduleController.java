package com.naquarium.controller;

import com.naquarium.dto.AdminScheduleDto;
import com.naquarium.dto.AdminScheduleRequest;
import com.naquarium.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * 관리자 스케줄 관리 컨트롤러 (/api/admin/schedules/**)
 *
 * PERFORMANCE / EXPERIENCE 타입을 쿼리 파라미터(type)로 구분하며,
 * 서비스에서 타입에 맞는 테이블을 분기 처리한다.
 *
 * - GET    /api/admin/schedules           목록 조회 (날짜 필터 선택)
 * - POST   /api/admin/schedules           스케줄 생성
 * - PUT    /api/admin/schedules/{id}      스케줄 수정
 * - DELETE /api/admin/schedules/{id}      스케줄 삭제
 * - PATCH  /api/admin/schedules/{id}/toggle  운영 중단·재개 토글
 */
@RestController
@RequestMapping("/api/admin/schedules")
@RequiredArgsConstructor
public class AdminScheduleController {

    private final AdminService adminService;

    /**
     * GET /api/admin/schedules - 스케줄 목록 조회
     * @param date 날짜 필터 (ISO 8601). null이면 전체 조회
     */
    @GetMapping
    public ResponseEntity<List<AdminScheduleDto>> getSchedules(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(adminService.getAllSchedules(date));
    }

    /** POST /api/admin/schedules - 스케줄 생성 */
    @PostMapping
    public ResponseEntity<String> createSchedule(@RequestBody AdminScheduleRequest request) {
        adminService.createSchedule(request);
        return ResponseEntity.ok("일정이 추가되었습니다.");
    }

    /**
     * PUT /api/admin/schedules/{id} - 스케줄 수정
     * @param type "PERFORMANCE" | "EXPERIENCE"
     */
    @PutMapping("/{id}")
    public ResponseEntity<String> updateSchedule(
            @PathVariable Long id,
            @RequestParam String type,
            @RequestBody AdminScheduleRequest request) {
        adminService.updateSchedule(id, type, request);
        return ResponseEntity.ok("일정이 수정되었습니다.");
    }

    /**
     * DELETE /api/admin/schedules/{id} - 스케줄 삭제
     * @param type "PERFORMANCE" | "EXPERIENCE"
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSchedule(
            @PathVariable Long id,
            @RequestParam String type) {
        adminService.deleteSchedule(id, type);
        return ResponseEntity.ok("일정이 삭제되었습니다.");
    }

    /**
     * PATCH /api/admin/schedules/{id}/toggle - 운영 중단·재개 토글
     * isClosed 플래그를 반전해 예약 가능 여부를 제어한다.
     *
     * @param type "PERFORMANCE" | "EXPERIENCE"
     */
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<String> toggleSchedule(
            @PathVariable Long id,
            @RequestParam String type) {
        adminService.toggleSchedule(id, type);
        return ResponseEntity.ok("마감 상태가 변경되었습니다.");
    }
}
