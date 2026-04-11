package com.naquarium.repository;

import com.naquarium.entity.Program;
import com.naquarium.entity.Reservation;
import com.naquarium.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * ReservationRepository 단위 테스트 (@DataJpaTest)
 * - H2 인메모리 DB로 커스텀 JPQL 쿼리 검증
 * - 핵심 검증 대상:
 *   1. findByUser_EmailOrderByReservedAtDesc – FETCH JOIN + 최신순 정렬
 *   2. existsByUserEmailAndVisitDateAndStatus – program IS NULL 조건 (입장권 전용)
 */
@DataJpaTest
class ReservationRepositoryTest {

    @Autowired ReservationRepository reservationRepository;
    @Autowired UserRepository userRepository;
    @Autowired ProgramRepository programRepository;

    private User user;

    @BeforeEach
    void setUp() {
        user = userRepository.save(User.builder()
                .email("res@test.com")
                .username("예약자")
                .password("pw")
                .role(User.Role.USER)
                .provider("local")
                .build());
    }

    // ─────────────────────────────────────────────
    // findByUser_EmailOrderByReservedAtDesc
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("이메일로 예약 조회 - 해당 사용자의 예약만 반환")
    void findByUser_Email_returnsOnlyMatchingUser() {
        User otherUser = userRepository.save(User.builder()
                .email("other@test.com").username("타인").password("pw")
                .role(User.Role.USER).provider("local").build());

        reservationRepository.save(makeAdmission(user, "2026-04-10"));
        reservationRepository.save(makeAdmission(otherUser, "2026-04-11"));

        List<Reservation> result = reservationRepository
                .findByUser_EmailOrderByReservedAtDesc("res@test.com");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getVisitDate()).isEqualTo("2026-04-10");
    }

    @Test
    @DisplayName("예약이 없으면 빈 리스트 반환")
    void findByUser_Email_noReservations_returnsEmpty() {
        List<Reservation> result = reservationRepository
                .findByUser_EmailOrderByReservedAtDesc("res@test.com");

        assertThat(result).isEmpty();
    }

    // ─────────────────────────────────────────────
    // existsByUserEmailAndVisitDateAndStatus (program IS NULL 검증)
    // ─────────────────────────────────────────────

    @Test
    @DisplayName("입장권 예약(program=null) 존재 시 true 반환")
    void existsByAdmission_admissionPresent_returnsTrue() {
        reservationRepository.save(makeAdmission(user, "2026-04-10"));

        boolean result = reservationRepository.existsByUserEmailAndVisitDateAndStatus(
                "res@test.com", "2026-04-10", Reservation.ReservationStatus.CONFIRMED);

        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("같은 날짜 프로그램 예약만 있을 때(입장권 없음) false 반환 – program IS NULL 핵심 검증")
    void existsByAdmission_programReservationOnly_returnsFalse() {
        Program prog = new Program();
        prog.setTitle("체험 프로그램");
        prog.setPrice(15000);
        prog.setType(Program.ProgramType.EXPERIENCE);
        programRepository.save(prog);

        // program이 있는 예약 → 입장권이 아님
        reservationRepository.save(Reservation.builder()
                .user(user)
                .program(prog)
                .visitDate("2026-04-10")
                .adultCount(1).teenCount(0)
                .totalPrice(15000)
                .status(Reservation.ReservationStatus.CONFIRMED)
                .build());

        boolean result = reservationRepository.existsByUserEmailAndVisitDateAndStatus(
                "res@test.com", "2026-04-10", Reservation.ReservationStatus.CONFIRMED);

        // program IS NULL 조건이 없으면 true가 되어버리는 버그를 방지
        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("예약이 없으면 false 반환")
    void existsByAdmission_noReservation_returnsFalse() {
        boolean result = reservationRepository.existsByUserEmailAndVisitDateAndStatus(
                "res@test.com", "2026-04-10", Reservation.ReservationStatus.CONFIRMED);

        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("CANCELLED 상태의 입장권은 false 반환")
    void existsByAdmission_cancelledStatus_returnsFalse() {
        reservationRepository.save(Reservation.builder()
                .user(user)
                .visitDate("2026-04-10")
                .adultCount(1).teenCount(0)
                .totalPrice(35000)
                .status(Reservation.ReservationStatus.CANCELLED)
                .build());

        boolean result = reservationRepository.existsByUserEmailAndVisitDateAndStatus(
                "res@test.com", "2026-04-10", Reservation.ReservationStatus.CONFIRMED);

        assertThat(result).isFalse();
    }

    // ─────────────────────────────────────────────
    // 헬퍼
    // ─────────────────────────────────────────────

    private Reservation makeAdmission(User u, String visitDate) {
        return Reservation.builder()
                .user(u)
                .visitDate(visitDate)
                .adultCount(2).teenCount(0)
                .totalPrice(70000)
                .status(Reservation.ReservationStatus.CONFIRMED)
                .build();
    }
}
