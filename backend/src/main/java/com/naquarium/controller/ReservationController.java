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

/**
 * 예약 컨트롤러 (/api/reservations/**)
 *
 * - POST /api/reservations           입장권(종일권) 예매 (로그인 필요)
 * - GET  /api/reservations/me        내 예약 목록 조회 (로그인 필요)
 * - POST /api/reservations/programs  프로그램 예매 (로그인 필요, 입장권 선행 필수)
 *
 * OAuth2 로그인 사용자는 SecurityContext의 인증 타입이 다르므로
 * getEmail() 헬퍼로 이메일을 일관되게 추출한다.
 */
@Slf4j
@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    /**
     * SecurityContext에서 이메일을 추출한다.
     * OAuth2 로그인(OAuth2AuthenticationToken): 사용자 속성 맵에서 email을 가져온다.
     * 일반 로그인(UsernamePasswordAuthenticationToken): getName()이 이메일을 반환한다.
     */
    private String getEmail(Authentication auth) {
        if (auth instanceof OAuth2AuthenticationToken) {
            OAuth2AuthenticationToken oauth2 = (OAuth2AuthenticationToken) auth;
            return oauth2.getPrincipal().getAttribute("email");
        }
        return auth.getName();
    }

    /**
     * POST /api/reservations - 입장권(종일권) 예매
     *
     * @return 200 OK | 401 Unauthorized | 500 Internal Server Error
     */
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

    /**
     * GET /api/reservations/me - 내 예약 목록 조회 (전체 상태 포함)
     *
     * @return 200 OK (예약 목록) | 401 Unauthorized | 500 Internal Server Error
     */
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

    /**
     * POST /api/reservations/programs - 프로그램(체험·공연) 예매
     * 해당 날짜 입장권이 없으면 400을 반환하며, 프론트에서 입장권 구매 안내로 연결된다.
     *
     * @return 200 OK | 400 Bad Request (입장권 미보유 등) | 401 Unauthorized | 500 Internal Server Error
     */
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
