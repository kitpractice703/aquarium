package com.aquarium.Naquarium.controller;

import com.aquarium.Naquarium.dto.ProgramReservationRequest;
import com.aquarium.Naquarium.dto.ReservationDto;
import com.aquarium.Naquarium.dto.ReservationRequest;
import com.aquarium.Naquarium.entity.ProgramSchedule; // 추가
import com.aquarium.Naquarium.entity.Reservation;
import com.aquarium.Naquarium.entity.User;
import com.aquarium.Naquarium.repository.ProgramScheduleRepository; // 추가
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

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final ProgramScheduleRepository programScheduleRepository; // [추가]

    // ... (getEmail 메서드 기존 유지) ...
    private String getEmail(Authentication auth) {
        if (auth instanceof OAuth2AuthenticationToken) {
            OAuth2AuthenticationToken oauth2 = (OAuth2AuthenticationToken) auth;
            return oauth2.getPrincipal().getAttribute("email");
        }
        return auth.getName();
    }

    // 1. 관람 예매 생성 (기존 코드 유지)
    @PostMapping
    public ResponseEntity<String> createReservation(@RequestBody ReservationRequest request) {
        // ... (기존 코드 유지) ...
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

    // 2. 내 예약 목록 조회 (기존 코드 유지)
    @GetMapping("/me")
    @Transactional(readOnly = true)
    public ResponseEntity<List<ReservationDto>> getMyReservations() {
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
    }

    // 3. [수정됨] 프로그램 예약 (이제 진짜로 DB에 저장합니다!)
    @PostMapping("/programs")
    @Transactional // 트랜잭션 추가
    public ResponseEntity<?> reserveProgram(@RequestBody ProgramReservationRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        String email = getEmail(auth);

        // 1. 입장권 확인
        boolean hasAdmission = reservationRepository.existsByUserEmailAndVisitDate(email, request.getVisitDate());
        if (!hasAdmission) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("해당 날짜의 입장권(관람권)이 없습니다. 입장권을 먼저 예매해주세요.");
        }

        // 2. 유저 정보 가져오기
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("유저 정보 없음"));

        // 3. 프로그램 정보 가져오기 (연결을 위해 아무 스케줄이나 하나 가져옴)
        // 주의: 실제로는 정확한 schedule_id를 찾아야 하지만, 데모에서는 Program 정보를 얻기 위해
        // 해당 프로그램의 첫 번째 스케줄을 빌려와서 연결합니다. (제목/이미지 확보용)
        ProgramSchedule proxySchedule = programScheduleRepository.findByProgramId(request.getProgramId())
                .stream().findFirst()
                .orElse(null);
        // 스케줄이 아예 없으면 null (이 경우 제목이 '관람권'으로 나올 수 있으니 주의)

        // 4. 예약 생성 및 저장
        // 가격 계산 (단순화: 1인당 가격 * 인원수. 실제로는 프로그램 가격을 DB에서 가져와야 함)
        // 여기서는 편의상 프론트에서 알고 있는 가격 로직을 따르거나, Program 엔티티 가격을 조회해야 합니다.
        // *데모용* : 일단 0원으로 저장하거나, 스케줄이 있다면 스케줄의 프로그램 가격을 씁니다.
        int price = 0;
        if (proxySchedule != null && proxySchedule.getProgram() != null) {
            price = proxySchedule.getProgram().getPrice() * request.getCount();
        }

        Reservation reservation = Reservation.builder()
                .user(user)
                .schedule(proxySchedule) // 프로그램 정보(제목/이미지)를 위해 연결
                .visitDate(request.getVisitDate()) // 실제 방문 날짜 (유저 선택)
                .visitTime(request.getVisitTime()) // 실제 방문 시간 (유저 선택)
                .adultCount(request.getCount())    // 프로그램은 구분 없이 총 인원으로
                .teenCount(0)
                .totalPrice(price)
                .status(Reservation.ReservationStatus.CONFIRMED)
                .build();

        reservationRepository.save(reservation);

        return ResponseEntity.ok("프로그램 예약이 완료되었습니다!");
    }
}