package com.naquarium.service;

import com.naquarium.dto.ProgramReservationRequest;
import com.naquarium.dto.ReservationRequest;
import com.naquarium.entity.Program;
import com.naquarium.entity.Reservation;
import com.naquarium.entity.User;
import com.naquarium.repository.PerformanceScheduleRepository;
import com.naquarium.repository.ProgramRepository;
import com.naquarium.repository.ReservationRepository;
import com.naquarium.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

/**
 * ReservationService 단위 테스트
 * - 가격 계산 정확성, 입장권 보유 검증 등 비즈니스 로직 집중 검증
 */
@ExtendWith(MockitoExtension.class)
class ReservationServiceTest {

    @Mock ReservationRepository reservationRepository;
    @Mock UserRepository userRepository;
    @Mock PerformanceScheduleRepository performanceScheduleRepository;
    @Mock ProgramRepository programRepository;
    @InjectMocks ReservationService reservationService;

    private User user;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .email("user@test.com").username("테스터")
                .password("pw").role(User.Role.USER).provider("local")
                .build();
    }

    // ─────────────────────────────────────────────
    // createAdmissionReservation 테스트
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("입장권 가격 계산 - 대인 2명 + 소인 1명 = 99,000원")
    void createAdmissionReservation_priceCalculation() {
        given(userRepository.findByEmail("user@test.com")).willReturn(Optional.of(user));

        ReservationRequest req = new ReservationRequest();
        req.setVisitDate("2026-04-10");
        req.setVisitTime("10:00");
        req.setAdultCount(2);
        req.setTeenCount(1);

        reservationService.createAdmissionReservation("user@test.com", req);

        ArgumentCaptor<Reservation> captor = ArgumentCaptor.forClass(Reservation.class);
        verify(reservationRepository).save(captor.capture());
        assertThat(captor.getValue().getTotalPrice()).isEqualTo(99000);
    }

    @Test
    @DisplayName("입장권 가격 계산 - 대인만 3명 = 105,000원")
    void createAdmissionReservation_adultOnly_priceCalculation() {
        given(userRepository.findByEmail("user@test.com")).willReturn(Optional.of(user));

        ReservationRequest req = new ReservationRequest();
        req.setVisitDate("2026-04-10");
        req.setVisitTime("10:00");
        req.setAdultCount(3);
        req.setTeenCount(0);

        reservationService.createAdmissionReservation("user@test.com", req);

        ArgumentCaptor<Reservation> captor = ArgumentCaptor.forClass(Reservation.class);
        verify(reservationRepository).save(captor.capture());
        assertThat(captor.getValue().getTotalPrice()).isEqualTo(105000);
    }

    // ─────────────────────────────────────────────
    // reserveProgram 테스트
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("프로그램 예약 실패 - 입장권 없으면 IllegalArgumentException 발생")
    void reserveProgram_noAdmission_throwsException() {
        given(reservationRepository.existsByUserEmailAndVisitDateAndStatus(
                "user@test.com", "2026-04-10", Reservation.ReservationStatus.CONFIRMED))
                .willReturn(false);

        ProgramReservationRequest req = new ProgramReservationRequest();
        req.setProgramId(1L);
        req.setVisitDate("2026-04-10");
        req.setVisitTime("11:00");
        req.setCount(1);

        assertThatThrownBy(() -> reservationService.reserveProgram("user@test.com", req))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("입장권");
    }

    @Test
    @DisplayName("체험 프로그램 예약 가격 계산 - 단가 × 수량")
    void reserveProgram_experience_priceCalculation() {
        given(reservationRepository.existsByUserEmailAndVisitDateAndStatus(
                "user@test.com", "2026-04-10", Reservation.ReservationStatus.CONFIRMED))
                .willReturn(true);
        given(userRepository.findByEmail("user@test.com")).willReturn(Optional.of(user));

        Program program = new Program();
        program.setTitle("먹이주기 체험");
        program.setPrice(15000);
        program.setType(Program.ProgramType.EXPERIENCE);
        given(programRepository.findById(1L)).willReturn(Optional.of(program));

        ProgramReservationRequest req = new ProgramReservationRequest();
        req.setProgramId(1L);
        req.setVisitDate("2026-04-10");
        req.setVisitTime("11:00");
        req.setCount(2);

        reservationService.reserveProgram("user@test.com", req);

        ArgumentCaptor<Reservation> captor = ArgumentCaptor.forClass(Reservation.class);
        verify(reservationRepository).save(captor.capture());
        assertThat(captor.getValue().getTotalPrice()).isEqualTo(30000);
    }
}
