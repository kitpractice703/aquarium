package com.naquarium.dto;

import com.naquarium.entity.Reservation;
import lombok.Getter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * 사용자 마이페이지 예약 조회 응답 DTO
 *
 * 입장권 예약과 프로그램 예약 두 가지를 단일 형식으로 변환한다.
 * 연관 엔티티 로딩 실패(LazyLoading 예외)에 대비한 방어 로직을 포함한다.
 *
 * 프로그램 정보 조회 우선순위:
 *   1. reservation.program (직접 참조)
 *   2. reservation.schedule.program (레거시 데이터 호환)
 *   3. 없으면 "Naquarium 관람권" (입장권) 기본값
 */
@Getter
public class ReservationDto {
    private static final Logger log = LoggerFactory.getLogger(ReservationDto.class);
    private Long id;
    private String ticketNumber;
    private String programTitle;
    private String programType;
    private LocalDateTime startTime;
    private String visitDate;
    private String visitTime;
    private String location;
    private String status;

    public ReservationDto(Reservation reservation) {
        this.id = reservation.getId();
        this.status = reservation.getStatus() != null ? reservation.getStatus().name() : "CONFIRMED";
        this.visitDate = reservation.getVisitDate();
        this.visitTime = reservation.getVisitTime();

        // 티켓 번호 생성: T{yyyyMMdd}-{5자리 ID}
        if (reservation.getReservedAt() != null) {
            String datePart = reservation.getReservedAt().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            this.ticketNumber = String.format("T%s-%05d", datePart, reservation.getId());
        } else {
            this.ticketNumber = String.format("T-%05d", reservation.getId());
        }

        // 프로그램 정보 로딩 (LazyLoading 예외 방어)
        try {
            // 1순위: Program 직접 참조 (체험/공연 모두 지원)
            if (reservation.getProgram() != null) {
                this.programTitle = reservation.getProgram().getTitle();
                if (reservation.getProgram().getType() != null) {
                    this.programType = reservation.getProgram().getType().name();
                }
            }

            // 2순위: Schedule 경유 (공연 예약, 레거시 데이터 호환)
            if (reservation.getSchedule() != null) {
                this.startTime = reservation.getSchedule().getStartTime();
                this.location = reservation.getSchedule().getLocation();

                // program이 없는 레거시 데이터: schedule → program 경유
                if (this.programTitle == null && reservation.getSchedule().getProgram() != null) {
                    this.programTitle = reservation.getSchedule().getProgram().getTitle();
                    if (reservation.getSchedule().getProgram().getType() != null) {
                        this.programType = reservation.getSchedule().getProgram().getType().name();
                    }
                }
            }
        } catch (Exception e) {
            log.error("예약 DTO 변환 중 오류 (reservationId={}): {}", reservation.getId(), e.getMessage());
        }

        // 프로그램 정보가 없으면 기본 입장권으로 설정
        if (this.programTitle == null) {
            this.programTitle = "Naquarium 관람권";
            this.programType = "ADMISSION";
        }
    }
}