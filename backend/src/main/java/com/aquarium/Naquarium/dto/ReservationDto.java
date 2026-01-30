package com.aquarium.Naquarium.dto;

import com.aquarium.Naquarium.entity.Reservation;
import lombok.Getter;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Getter
public class ReservationDto {
    private Long id;
    private String ticketNumber; // [원복] 사용자 요청 로직 유지 (T20260130-00001 형식)
    private String programTitle;
    private String programType;  // [핵심] 프론트엔드 뱃지([체험], [공연]) 노출을 위한 필드
    private LocalDateTime startTime;
    private String visitDate;
    private String visitTime;    // [추가] 프론트엔드 타입 정의와 일치시키기 위해 추가
    private String location;
    private String status;
    private String imageUrl;

    public ReservationDto(Reservation reservation) {
        this.id = reservation.getId();
        this.status = reservation.getStatus().name();
        this.visitDate = reservation.getVisitDate();
        this.visitTime = reservation.getVisitTime(); // [추가] 방문 시간 매핑

        // [원복] 티켓 번호 생성 로직 유지
        if (reservation.getReservedAt() != null) {
            String datePart = reservation.getReservedAt().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            this.ticketNumber = String.format("T%s-%05d", datePart, reservation.getId());
        } else {
            this.ticketNumber = String.format("T-%05d", reservation.getId());
        }

        // 스케줄이 있는 경우 (체험/공연 프로그램)
        if (reservation.getSchedule() != null) {
            this.startTime = reservation.getSchedule().getStartTime();
            this.location = reservation.getSchedule().getLocation();

            if (reservation.getSchedule().getProgram() != null) {
                this.programTitle = reservation.getSchedule().getProgram().getTitle();
                this.imageUrl = reservation.getSchedule().getProgram().getImageUrl();

                // [핵심 기능] DB의 ProgramType(EXPERIENCE/PERFORMANCE)을 DTO에 담아 보냅니다.
                // 이 값이 있으면 프론트엔드에서 자동으로 [체험] 또는 [공연] 뱃지를 붙여줍니다.
                this.programType = reservation.getSchedule().getProgram().getType().name();
            }
        }

        // [원복] 스케줄이 없는 경우 (일반 관람권 처리 로직 유지)
        if (this.programTitle == null) {
            this.programTitle = "Naquarium 관람권";
            this.programType = "ADMISSION";
        }
    }
}