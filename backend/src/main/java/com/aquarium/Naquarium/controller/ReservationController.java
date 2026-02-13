package com.aquarium.Naquarium.controller;

import com.aquarium.Naquarium.dto.ProgramReservationRequest;
import com.aquarium.Naquarium.dto.ReservationDto;
import com.aquarium.Naquarium.dto.ReservationRequest;
import com.aquarium.Naquarium.entity.PerformanceSchedule;
import com.aquarium.Naquarium.entity.Program;
import com.aquarium.Naquarium.entity.Reservation;
import com.aquarium.Naquarium.entity.User;
import com.aquarium.Naquarium.repository.PerformanceScheduleRepository;
import com.aquarium.Naquarium.repository.ProgramRepository;
import com.aquarium.Naquarium.repository.ReservationRepository;
import com.aquarium.Naquarium.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 예약 컨트롤러
 * - 입장권 예약: POST /api/reservations
 * - 프로그램 예약: POST /api/reservations/programs (입장권 보유 필수)
 * - 내 예약 조회: GET /api/reservations/me
 */
@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final PerformanceScheduleRepository performanceScheduleRepository;
    private final ProgramRepository programRepository;

    /** 인증 정보에서 이메일 추출 (일반/OAuth2 분기) */
    private String getEmail(Authentication auth) {
        if (auth instanceof OAuth2AuthenticationToken) {
            OAuth2AuthenticationToken oauth2 = (OAuth2AuthenticationToken) auth;
            return oauth2.getPrincipal().getAttribute("email");
        }
        return auth.getName();
    }

    /**
     * 입장권 예약 (관람권만 구매)
     * - 가격 계산: 대인 35,000원, 소인 29,000원
     * - schedule 없이 예약 (입장권은 프로그램과 무관)
     */
    @PostMapping
    public ResponseEntity<String> createReservation(@RequestBody ReservationRequest request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || auth.getName().equals("anonymousUser")) {
                return ResponseEntity.status(401).body("로그인이 필요합니다.");
            }
            String email = getEmail(auth);
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("사용자 정보를 찾을 수 없습니다."));

            int calculatedPrice = (request.getAdultCount() * 35000) + (request.getTeenCount() * 29000);

            Reservation reservation = Reservation.builder()
                    .user(user)
                    .visitDate(request.getVisitDate())
                    .visitTime(request.getVisitTime())
                    .adultCount(request.getAdultCount())
                    .teenCount(request.getTeenCount())
                    .totalPrice(calculatedPrice)
                    .status(Reservation.ReservationStatus.CONFIRMED)
                    .build();

            reservationRepository.save(reservation);
            return ResponseEntity.ok("예약이 성공적으로 완료되었습니다!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error");
        }
    }

    /** 내 예약 내역 조회 (마이페이지용, 최신순) */
    @GetMapping("/me")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getMyReservations() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || auth.getName().equals("anonymousUser")) {
                return ResponseEntity.status(401).build();
            }
            String email = getEmail(auth);
            List<Reservation> reservations = reservationRepository.findByUser_EmailOrderByReservedAtDesc(email);
            List<ReservationDto> dtos = reservations.stream()
                    .map(ReservationDto::new)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("예매 조회 실패: " + e.getMessage());
        }
    }

    /**
     * 프로그램(공연/체험) 예약
     * - 선행 조건: 해당 날짜에 입장권(관람권)이 이미 예매되어 있어야 함
     * - Program을 직접 조회하여 가격 계산 (count × 단가)
     * - 공연이면 schedule 연결, 체험이면 schedule null
     */
    @PostMapping("/programs")
    @Transactional
    public ResponseEntity<?> reserveProgram(@RequestBody ProgramReservationRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        String email = getEmail(auth);

        // 입장권 보유 여부 확인 (동일 날짜에 기존 예약이 있는지 검사)
        boolean hasAdmission = reservationRepository.existsByUserEmailAndVisitDate(email, request.getVisitDate());
        if (!hasAdmission) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("해당 날짜의 입장권(관람권)이 없습니다. 입장권을 먼저 예매해주세요.");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("유저 정보 없음"));

        // Program 직접 조회
        Program program = programRepository.findById(request.getProgramId())
                .orElseThrow(() -> new RuntimeException("프로그램을 찾을 수 없습니다."));

        // 프로그램 가격 계산 (인원수 × 단가)
        int price = program.getPrice() * request.getCount();

        // 공연이면 schedule 연결, 체험이면 null
        PerformanceSchedule schedule = null;
        if (program.getType() == Program.ProgramType.PERFORMANCE) {
            schedule = performanceScheduleRepository.findByProgramId(request.getProgramId())
                    .stream().findFirst().orElse(null);
        }

        Reservation reservation = Reservation.builder()
                .user(user)
                .program(program)
                .schedule(schedule)
                .visitDate(request.getVisitDate())
                .visitTime(request.getVisitTime())
                .adultCount(request.getCount())
                .teenCount(0)
                .totalPrice(price)
                .status(Reservation.ReservationStatus.CONFIRMED)
                .build();

        reservationRepository.save(reservation);

        return ResponseEntity.ok("프로그램 예약이 완료되었습니다!");
    }
}