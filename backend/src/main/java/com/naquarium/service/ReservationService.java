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

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final PerformanceScheduleRepository performanceScheduleRepository;
    private final ProgramRepository programRepository;

    @Transactional
    public void createAdmissionReservation(String email, ReservationRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자 정보를 찾을 수 없습니다."));

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

    @Transactional(readOnly = true)
    public List<ReservationDto> getMyReservations(String email) {
        return reservationRepository.findByUser_EmailOrderByReservedAtDesc(email)
                .stream()
                .map(ReservationDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public void reserveProgram(String email, ProgramReservationRequest request) {
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
    }
}
