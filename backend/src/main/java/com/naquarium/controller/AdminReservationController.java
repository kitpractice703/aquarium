package com.naquarium.controller;

import com.naquarium.dto.AdminReservationDto;
import com.naquarium.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/reservations")
@RequiredArgsConstructor
public class AdminReservationController {

    private final AdminService adminService;

    @GetMapping
    public ResponseEntity<List<AdminReservationDto>> getReservations(
            @RequestParam(required = false) String date,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(adminService.getAllReservations(date, status, search));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<String> cancelReservation(@PathVariable Long id) {
        adminService.cancelReservation(id);
        return ResponseEntity.ok("예약이 취소되었습니다.");
    }
}
