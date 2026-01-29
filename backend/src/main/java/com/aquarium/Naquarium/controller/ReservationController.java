package com.aquarium.Naquarium.controller;

import com.aquarium.Naquarium.dto.ProgramReservationRequest;
import com.aquarium.Naquarium.dto.ReservationDto;
import com.aquarium.Naquarium.dto.ReservationRequest;
import com.aquarium.Naquarium.entity.Reservation;
import com.aquarium.Naquarium.entity.User;
import com.aquarium.Naquarium.repository.ReservationRepository;
import com.aquarium.Naquarium.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken; // [필수 Import]
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;

    // [핵심] 로그인 방식에 따라 이메일을 정확하게 추출하는 메서드
    private String getEmail(Authentication auth) {
        // 1. 구글(OAuth2) 로그인인 경우
        if (auth instanceof OAuth2AuthenticationToken) {
            OAuth2AuthenticationToken oauth2 = (OAuth2AuthenticationToken) auth;
            // 구글이 준 정보 꾸러미에서 "email"만 쏙 꺼냅니다.
            return oauth2.getPrincipal().getAttribute("email");
        }
        // 2. 일반(이메일) 로그인인 경우 -> getName()이 곧 이메일입니다.
        return auth.getName();
    }

    // 1. 관람 예매 생성
    @PostMapping
    public ResponseEntity<String> createReservation(@RequestBody ReservationRequest request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || auth.getName().equals("anonymousUser")) {
                return ResponseEntity.status(401).body("로그인이 필요합니다.");
            }

            // [변경] getEmail() 메서드로 진짜 이메일을 가져옵니다.
            String email = getEmail(auth);
            System.out.println(">>> 예매 요청 유저 이메일: " + email); // [로그 확인용]

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
            System.out.println(">>> 예매 저장 성공! ID: " + reservation.getId());

            return ResponseEntity.ok("예약이 성공적으로 완료되었습니다!");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("예매 처리 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    // 2. 내 예약 목록 조회
    @GetMapping("/me")
    public ResponseEntity<List<ReservationDto>> getMyReservations() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName().equals("anonymousUser")) {
            return ResponseEntity.status(401).build();
        }

        // [변경] 여기도 getEmail()로 이메일을 가져와서 조회합니다.
        String email = getEmail(auth);
        List<Reservation> reservations = reservationRepository.findByUser_EmailOrderByReservedAtDesc(email);

        List<ReservationDto> dtos = reservations.stream()
                .map(ReservationDto::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    // 3. 프로그램 예약
    @PostMapping("/programs")
    public ResponseEntity<?> reserveProgram(@RequestBody ProgramReservationRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        // [변경] 프로그램 예약도 이메일 추출 방식 적용
        String email = getEmail(auth);

        // 1. 해당 날짜에 입장권(Reservation)이 있는지 확인
        boolean hasAdmission = reservationRepository.existsByUserEmailAndVisitDate(email, request.getVisitDate());

        if (!hasAdmission) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("해당 날짜의 입장권(관람권)이 없습니다. 입장권을 먼저 예매해주세요.");
        }

        // 2. 프로그램 예약 진행 (간소화)
        // 실제로는 프로그램 예약 테이블에 저장해야 하지만, 여기서는 성공 응답만 보냅니다.
        return ResponseEntity.ok("프로그램 예약이 완료되었습니다!");
    }
}