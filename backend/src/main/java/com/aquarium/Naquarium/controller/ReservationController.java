package com.aquarium.Naquarium.controller;

import com.aquarium.Naquarium.dto.ReservationDto; // [IMPORT] DTO 추가
import com.aquarium.Naquarium.dto.ReservationRequest;
import com.aquarium.Naquarium.entity.Reservation;
import com.aquarium.Naquarium.entity.User;
import com.aquarium.Naquarium.repository.ReservationRepository;
import com.aquarium.Naquarium.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;

    // 1. [기존] 예약 생성 (POST) - 유지
    @PostMapping
    public ResponseEntity<String> createReservation(@RequestBody ReservationRequest request) {
        // ... (기존 코드 그대로 유지) ...
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName().equals("anonymousUser")) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        int calculatedPrice = (request.getAdultCount() * 35000) + (request.getTeenCount() * 28000);

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
    }

    // 2. [추가] 내 예약 목록 조회 (GET)
    @GetMapping("/me")
    public ResponseEntity<List<ReservationDto>> getMyReservations() {
        // (1) 현재 로그인한 사용자 확인
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName().equals("anonymousUser")) {
            return ResponseEntity.status(401).build();
        }

        // (2) 이메일로 예약 내역 찾기 (Repository에 만들어둔 메서드 활용)
        List<Reservation> reservations = reservationRepository.findByUser_EmailOrderByReservedAtDesc(auth.getName());

        // (3) 엔티티 -> DTO 변환해서 반환
        List<ReservationDto> dtos = reservations.stream()
                .map(ReservationDto::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }
}