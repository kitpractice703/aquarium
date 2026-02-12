package com.aquarium.Naquarium.dto;

import com.aquarium.Naquarium.entity.Reservation;
import lombok.Getter;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * 예약 응답 DTO (마이페이지 예약 내역 표시용)
 * - Reservation 엔티티를 프론트엔드에 필요한 형태로 변환
 * - 입장권/프로그램 예약 모두 처리 (schedule 유무로 구분)
 */
@Getter
public class ReservationDto {
    private Long id;
    /** 티켓 번호 (예: T20260212-00001) */
    private String ticketNumber;
    private String programTitle;
    /** 프로그램 유형: ADMISSION(입장권), PERFORMANCE(공연), EXPERIENCE(체험) */
    private String programType;
    private LocalDateTime startTime;
    private String visitDate;
    private String visitTime;
    private String location;
    private String status;
    private String imageUrl;

    /**
     * Reservation 엔티티 → DTO 변환 생성자
     * - 티켓 번호: 예약일 + 예약ID로 자동 생성
     * - schedule이 null이면 입장권(ADMISSION)으로 기본 설정
     */
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

        // 프로그램 스케줄 정보 로딩 (LazyLoading 예외 방어)
        try {
            if (reservation.getSchedule() != null) {
                this.startTime = reservation.getSchedule().getStartTime();
                this.location = reservation.getSchedule().getLocation();

                if (reservation.getSchedule().getProgram() != null) {
                    this.programTitle = reservation.getSchedule().getProgram().getTitle();
                    this.imageUrl = reservation.getSchedule().getProgram().getImageUrl();

                    if (reservation.getSchedule().getProgram().getType() != null) {
                        this.programType = reservation.getSchedule().getProgram().getType().name();
                    }
                }
            }
        } catch (Exception e) {
        }

        // 프로그램 정보가 없으면 기본 입장권으로 설정
        if (this.programTitle == null) {
            this.programTitle = "Naquarium 관람권";
            this.programType = "ADMISSION";
        }
    }
}