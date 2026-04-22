package com.naquarium.controller;

import com.naquarium.config.TestSecurityConfig;
import com.naquarium.dto.ProgramReservationRequest;
import com.naquarium.dto.ReservationRequest;
import com.naquarium.service.ReservationService;
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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.mockito.BDDMockito.willThrow;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * ReservationController 단위 테스트 (@WebMvcTest)
 * - TestSecurityConfig: CSRF 비활성 + anyRequest().permitAll()
 * - 테스트 대상: 입장권 예약, 내 예약 조회, 프로그램 예약
 * - 가격 계산 검증은 ReservationServiceTest에서 담당
 */
@WebMvcTest(ReservationController.class)
@Import(TestSecurityConfig.class)
class ReservationControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;

    @MockitoBean ReservationService reservationService;

    // ─────────────────────────────────────────────
    // POST /api/reservations (입장권 예약)
    // ─────────────────────────────────────────────

    @Test
    @WithMockUser(username = "user@test.com")
    @DisplayName("입장권 예약 성공 - 200 반환")
    void createReservation_success() throws Exception {
        willDoNothing().given(reservationService).createAdmissionReservation(any(), any());

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
        given(reservationService.getMyReservations("user@test.com")).willReturn(List.of());

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
    @DisplayName("프로그램 예약 성공 - 200 반환")
    void reserveProgram_success() throws Exception {
        willDoNothing().given(reservationService).reserveProgram(any(), any());

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
    }

    @Test
    @WithMockUser(username = "user@test.com")
    @DisplayName("프로그램 예약 실패 - 입장권 없으면 400 반환")
    void reserveProgram_noAdmission_returns400() throws Exception {
        willThrow(new IllegalArgumentException("해당 날짜의 입장권(관람권)이 없습니다. 입장권을 먼저 예매해주세요."))
                .given(reservationService).reserveProgram(any(), any());

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
}
