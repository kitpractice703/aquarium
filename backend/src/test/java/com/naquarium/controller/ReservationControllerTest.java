package com.naquarium.controller;

import com.naquarium.config.TestSecurityConfig;
import com.naquarium.dto.ProgramReservationRequest;
import com.naquarium.dto.ReservationRequest;
import com.naquarium.entity.Program;
import com.naquarium.entity.Reservation;
import com.naquarium.entity.User;
import com.naquarium.repository.PerformanceScheduleRepository;
import com.naquarium.repository.ProgramRepository;
import com.naquarium.repository.ReservationRepository;
import com.naquarium.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * ReservationController 단위 테스트 (@WebMvcTest)
 * - TestSecurityConfig: CSRF 비활성 + anyRequest().permitAll()
 * - 테스트 대상: 입장권 예약(가격 계산), 내 예약 조회, 프로그램 예약
 * - 핵심 검증: 입장권 없이 프로그램 예약 시 400, 가격 계산 정확성
 */
@WebMvcTest(ReservationController.class)
@Import(TestSecurityConfig.class)
class ReservationControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;

    @MockitoBean ReservationRepository reservationRepository;
    @MockitoBean UserRepository userRepository;
    @MockitoBean PerformanceScheduleRepository performanceScheduleRepository;
    @MockitoBean ProgramRepository programRepository;

    // ─────────────────────────────────────────────
    // POST /api/reservations (입장권 예약)
    // ─────────────────────────────────────────────

    @Test
    @WithMockUser(username = "user@test.com")
    @DisplayName("입장권 예약 성공 - 대인 2명 + 소인 1명 = 99,000원 계산")
    void createReservation_success_priceCalculation() throws Exception {
        User user = buildUser("user@test.com");
        given(userRepository.findByEmail("user@test.com")).willReturn(Optional.of(user));

        ReservationRequest req = new ReservationRequest();
        req.setVisitDate("2026-04-10");
        req.setVisitTime("10:00");
        req.setAdultCount(2);
        req.setTeenCount(1);

        mockMvc.perform(post("/api/reservations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(content().string("예약이 성공적으로 완료되었습니다!"));

        // 가격 검증: 2 × 35,000 + 1 × 29,000 = 99,000원
        org.mockito.Mockito.verify(reservationRepository).save(
                argThat(r -> r.getTotalPrice() == 99000)
        );
    }

    @Test
    @DisplayName("입장권 예약 - 비로그인 시 401 반환")
    void createReservation_anonymous_returns401() throws Exception {
        ReservationRequest req = new ReservationRequest();
        req.setVisitDate("2026-04-10");
        req.setAdultCount(1);

        mockMvc.perform(post("/api/reservations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized());
    }

    // ─────────────────────────────────────────────
    // GET /api/reservations/me
    // ─────────────────────────────────────────────

    @Test
    @WithMockUser(username = "user@test.com")
    @DisplayName("내 예약 조회 - 로그인 상태면 200 반환")
    void getMyReservations_authenticated_returns200() throws Exception {
        given(reservationRepository.findByUser_EmailOrderByReservedAtDesc("user@test.com"))
                .willReturn(List.of());

        mockMvc.perform(get("/api/reservations/me"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("내 예약 조회 - 비로그인 시 401 반환")
    void getMyReservations_anonymous_returns401() throws Exception {
        mockMvc.perform(get("/api/reservations/me"))
                .andExpect(status().isUnauthorized());
    }

    // ─────────────────────────────────────────────
    // POST /api/reservations/programs (프로그램 예약)
    // ─────────────────────────────────────────────

    @Test
    @WithMockUser(username = "user@test.com")
    @DisplayName("프로그램 예약 성공 - 체험 프로그램, 입장권 보유 확인 후 예약")
    void reserveProgram_experience_success() throws Exception {
        User user = buildUser("user@test.com");
        given(userRepository.findByEmail("user@test.com")).willReturn(Optional.of(user));

        given(reservationRepository.existsByUserEmailAndVisitDateAndStatus(
                eq("user@test.com"), eq("2026-04-10"), eq(Reservation.ReservationStatus.CONFIRMED)))
                .willReturn(true);

        Program prog = new Program();
        prog.setTitle("먹이주기 체험");
        prog.setPrice(15000);
        prog.setType(Program.ProgramType.EXPERIENCE);
        given(programRepository.findById(1L)).willReturn(Optional.of(prog));

        ProgramReservationRequest req = new ProgramReservationRequest();
        req.setProgramId(1L);
        req.setVisitDate("2026-04-10");
        req.setVisitTime("11:00");
        req.setCount(2);

        mockMvc.perform(post("/api/reservations/programs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(content().string("프로그램 예약이 완료되었습니다!"));

        // 가격 검증: 15,000 × 2 = 30,000원
        org.mockito.Mockito.verify(reservationRepository).save(
                argThat(r -> r.getTotalPrice() == 30000)
        );
    }

    @Test
    @WithMockUser(username = "user@test.com")
    @DisplayName("프로그램 예약 실패 - 입장권 없으면 400 반환")
    void reserveProgram_noAdmission_returns400() throws Exception {
        given(reservationRepository.existsByUserEmailAndVisitDateAndStatus(
                any(), any(), any()))
                .willReturn(false);

        ProgramReservationRequest req = new ProgramReservationRequest();
        req.setProgramId(1L);
        req.setVisitDate("2026-04-10");
        req.setVisitTime("11:00");
        req.setCount(1);

        mockMvc.perform(post("/api/reservations/programs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("프로그램 예약 - 비로그인 시 401 반환")
    void reserveProgram_anonymous_returns401() throws Exception {
        ProgramReservationRequest req = new ProgramReservationRequest();
        req.setProgramId(1L);
        req.setVisitDate("2026-04-10");
        req.setCount(1);

        mockMvc.perform(post("/api/reservations/programs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized());
    }

    // ─────────────────────────────────────────────
    // 헬퍼
    // ─────────────────────────────────────────────

    private User buildUser(String email) {
        return User.builder()
                .email(email).username("테스터")
                .password("pw").role(User.Role.USER).provider("local")
                .build();
    }
}
