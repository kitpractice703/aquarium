package com.naquarium.service;

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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 예약 서비스
 *
 * 입장권(종일권) 예매와 프로그램(체험·공연) 예매 두 가지 흐름을 처리한다.
 *
 * 핵심 비즈니스 규칙:
 * - 프로그램 예매 시 해당 날짜에 유효한 입장권(CONFIRMED, program=null)이 있어야 한다.
 * - 입장권 단가: 성인 35,000원 / 청소년 29,000원
 * - 공연 예매는 스케줄 참조를 연결하고, 체험 예매는 스케줄 참조 없이 저장한다.
 */
@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final PerformanceScheduleRepository performanceScheduleRepository;
    private final ProgramRepository programRepository;

    /**
     * 입장권(종일권) 예매 생성.
     * 성인/청소년 인원 수에 단가를 곱해 총액을 계산한다.
     *
     * @param email   현재 로그인 사용자 이메일
     * @param request 방문 날짜·시간·인원 요청
     */
    @Transactional
    public void createAdmissionReservation(String email, ReservationRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자 정보를 찾을 수 없습니다."));

        // 입장권 단가: 성인 35,000원 / 청소년 29,000원
        int totalPrice = (request.getAdultCount() * 35000) + (request.getTeenCount() * 29000);

        Reservation reservation = Reservation.builder()
                .user(user)
                .visitDate(request.getVisitDate())
                .visitTime(request.getVisitTime())
                .adultCount(request.getAdultCount())
                .teenCount(request.getTeenCount())
                .totalPrice(totalPrice)
                .status(Reservation.ReservationStatus.CONFIRMED)
                .build();

        reservationRepository.save(reservation);
    }

    /**
     * 내 예약 목록 조회 (최신순).
     * fetch join으로 연관 엔티티를 한 번에 로드해 N+1 문제를 방지한다.
     *
     * @param email 현재 로그인 사용자 이메일
     * @return 예약 DTO 목록 (모든 상태 포함)
     */
    @Transactional(readOnly = true)
    public List<ReservationDto> getMyReservations(String email) {
        return reservationRepository.findByUser_EmailOrderByReservedAtDesc(email)
                .stream()
                .map(ReservationDto::new)
                .collect(Collectors.toList());
    }

    /**
     * 프로그램(체험·공연) 예매 생성.
     *
     * 사전 조건: 해당 날짜에 유효한 입장권(program=null, CONFIRMED)이 존재해야 한다.
     * 공연 예매의 경우 날짜·시간이 일치하는 스케줄을 조회해 연결한다.
     * 체험 예매는 스케줄 참조 없이 저장한다 (스케줄 테이블이 별도이므로).
     *
     * @param email   현재 로그인 사용자 이메일
     * @param request 프로그램 ID·날짜·시간·인원 요청
     * @throws IllegalArgumentException 입장권 미보유 시
     */
    @Transactional
    public void reserveProgram(String email, ProgramReservationRequest request) {
        // 입장권(program IS NULL) 보유 여부 확인 - 프로그램 예매의 선행 조건
        boolean hasAdmission = reservationRepository.existsByUserEmailAndVisitDateAndStatus(
                email, request.getVisitDate(), Reservation.ReservationStatus.CONFIRMED);
        if (!hasAdmission) {
            throw new IllegalArgumentException("해당 날짜의 입장권(관람권)이 없습니다. 입장권을 먼저 예매해주세요.");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("유저 정보 없음"));

        Program program = programRepository.findById(request.getProgramId())
                .orElseThrow(() -> new RuntimeException("프로그램을 찾을 수 없습니다."));

        int price = program.getPrice() * request.getCount();

        // 공연 타입만 스케줄을 연결한다. 체험은 별도 스케줄 테이블 참조 구조가 다르다.
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
                .adultCount(request.getCount())  // 프로그램 예매는 단일 인원 수 사용
                .teenCount(0)
                .totalPrice(price)
                .status(Reservation.ReservationStatus.CONFIRMED)
                .build();

        reservationRepository.save(reservation);
    }
}
