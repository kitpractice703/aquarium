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

@RestController
@RequestMapping("/api/admin/schedules")
@RequiredArgsConstructor
public class AdminScheduleController {

    private final AdminService adminService;

    @GetMapping
    public ResponseEntity<List<AdminScheduleDto>> getSchedules(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(adminService.getAllSchedules(date));
    }

    @PostMapping
    public ResponseEntity<String> createSchedule(@RequestBody AdminScheduleRequest request) {
        adminService.createSchedule(request);
        return ResponseEntity.ok("일정이 추가되었습니다.");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateSchedule(
            @PathVariable Long id,
            @RequestParam String type,
            @RequestBody AdminScheduleRequest request) {
        adminService.updateSchedule(id, type, request);
        return ResponseEntity.ok("일정이 수정되었습니다.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSchedule(
            @PathVariable Long id,
            @RequestParam String type) {
        adminService.deleteSchedule(id, type);
        return ResponseEntity.ok("일정이 삭제되었습니다.");
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<String> toggleSchedule(
            @PathVariable Long id,
            @RequestParam String type) {
        adminService.toggleSchedule(id, type);
        return ResponseEntity.ok("마감 상태가 변경되었습니다.");
    }
}
