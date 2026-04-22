package com.naquarium.controller;

import com.naquarium.dto.ProgramReservationRequest;
import com.naquarium.dto.ReservationRequest;
import com.naquarium.service.ReservationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;

/** 예약 컨트롤러 - 입장권 예약, 프로그램 예약(입장권 보유 필수), 내 예약 조회 */
@Slf4j
@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    private String getEmail(Authentication auth) {
        if (auth instanceof OAuth2AuthenticationToken) {
            OAuth2AuthenticationToken oauth2 = (OAuth2AuthenticationToken) auth;
            return oauth2.getPrincipal().getAttribute("email");
        }
        return auth.getName();
    }

    @PostMapping
    public ResponseEntity<String> createReservation(@RequestBody ReservationRequest request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || auth.getName().equals("anonymousUser")) {
                return ResponseEntity.status(401).body("로그인이 필요합니다.");
            }
            reservationService.createAdmissionReservation(getEmail(auth), request);
            return ResponseEntity.ok("예약이 성공적으로 완료되었습니다!");
        } catch (Exception e) {
            log.error("Failed to create reservation", e);
            return ResponseEntity.status(500).body("예약 처리 중 오류가 발생했습니다.");
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyReservations() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || auth.getName().equals("anonymousUser")) {
                return ResponseEntity.status(401).build();
            }
            return ResponseEntity.ok(reservationService.getMyReservations(getEmail(auth)));
        } catch (Exception e) {
            log.error("Failed to fetch reservations for user", e);
            return ResponseEntity.status(500).body("예매 조회 중 오류가 발생했습니다.");
        }
    }

    @PostMapping("/programs")
    public ResponseEntity<?> reserveProgram(@RequestBody ProgramReservationRequest request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || auth.getName().equals("anonymousUser")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
            }
            reservationService.reserveProgram(getEmail(auth), request);
            return ResponseEntity.ok("프로그램 예약이 완료되었습니다!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("예약 처리 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
}
