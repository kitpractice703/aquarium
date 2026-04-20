package com.naquarium.controller;

import com.naquarium.dto.ProgramReservationRequest;
import com.naquarium.dto.ReservationDto;
import com.naquarium.dto.ReservationRequest;
import com.naquarium.entity.PerformanceSchedule;
import com.naquarium.entity.Program;
import com.naquarium.entity.Reservation;
import com.naquarium.entity.User;
import com.naquarium.repository.PerformanceScheduleRepository;
import com.naquarium.repository.ProgramRepository;
import com.naquarium.repository.ReservationRepository;
import com.naquarium.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

/** 예약 컨트롤러 - 입장권 예약, 프로그램 예약(입장권 보유 필수), 내 예약 조회 */
@Slf4j
@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final PerformanceScheduleRepository performanceScheduleRepository;
    private final ProgramRepository programRepository;

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
            log.error("Failed to create reservation", e);
            return ResponseEntity.status(500).body("예약 처리 중 오류가 발생했습니다.");
        }
    }

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
            List<ReservationDto> dto = reservations.stream()
                    .map(ReservationDto::new)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            log.error("Failed to fetch reservations for user", e);
            return ResponseEntity.status(500).body("예매 조회 중 오류가 발생했습니다.");
        }
    }

    @PostMapping("/programs")
    @Transactional
    public ResponseEntity<?> reserveProgram(@RequestBody ProgramReservationRequest request) {
        try {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName().equals("anonymousUser")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        String email = getEmail(auth);

        // 입장권 보유 여부 확인 (동일 날짜에 CONFIRMED 상태의 예약이 있는지 검사)
        boolean hasAdmission = reservationRepository.existsByUserEmailAndVisitDateAndStatus(
                email, request.getVisitDate(), Reservation.ReservationStatus.CONFIRMED);
        if (!hasAdmission) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("해당 날짜의 입장권(관람권)이 없습니다. 입장권을 먼저 예매해주세요.");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("유저 정보 없음"));

        Program program = programRepository.findById(request.getProgramId())
                .orElseThrow(() -> new RuntimeException("프로그램을 찾을 수 없습니다."));

        int price = program.getPrice() * request.getCount();

        // 공연이면 선택한 날짜+시간에 맞는 schedule 연결, 체험이면 null
        PerformanceSchedule schedule = null;
        if (program.getType() == Program.ProgramType.PERFORMANCE) {
            DateTimeFormatter timeFmt = DateTimeFormatter.ofPattern("HH:mm");
            schedule = performanceScheduleRepository.findByProgramId(request.getProgramId())
                    .stream()
                    .filter(s -> s.getStartTime().toLocalDate().toString().equals(request.getVisitDate())
                            && s.getStartTime().format(timeFmt).equals(request.getVisitTime()))
                    .findFirst()
                    .orElse(null);
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
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("예약 처리 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
}