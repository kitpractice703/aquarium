package com.naquarium.dto;

import com.naquarium.entity.Reservation;
import lombok.Getter;

import java.time.format.DateTimeFormatter;

/**
 * 관리자 예약 목록 응답 DTO
 *
 * 예약자 정보, 프로그램/스케줄 정보, 금액, 상태를 하나의 응답으로 통합한다.
 * 티켓 번호는 예약 시각(yyyyMMdd)과 ID를 조합해 생성한다 (예: T20240507-00123).
 */
@Getter
public class AdminReservationDto {
    private Long id;
    private String ticketNumber;
    private String userEmail;
    private String userName;
    private String programTitle;
    private String programType;
    private String visitDate;
    private String visitTime;
    private String location;
    private int adultCount;
    private int teenCount;
    private int totalPrice;
    private String status;
    private String reservedAt;

    public AdminReservationDto(Reservation r) {
        this.id = r.getId();
        this.status = r.getStatus() != null ? r.getStatus().name() : "CONFIRMED";
        this.visitDate = r.getVisitDate();
        this.visitTime = r.getVisitTime();
        this.adultCount = r.getAdultCount();
        this.teenCount = r.getTeenCount();
        this.totalPrice = r.getTotalPrice();

        if (r.getReservedAt() != null) {
            String datePart = r.getReservedAt().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            this.ticketNumber = String.format("T%s-%05d", datePart, r.getId());
            this.reservedAt = r.getReservedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
        } else {
            this.ticketNumber = String.format("T-%05d", r.getId());
            this.reservedAt = "";
        }

        if (r.getUser() != null) {
            this.userEmail = r.getUser().getEmail();
            this.userName = r.getUser().getUsername();
        }

        if (r.getProgram() != null) {
            this.programTitle = r.getProgram().getTitle();
            this.programType = r.getProgram().getType() != null ? r.getProgram().getType().name() : null;
        } else if (r.getSchedule() != null && r.getSchedule().getProgram() != null) {
            this.programTitle = r.getSchedule().getProgram().getTitle();
            this.programType = r.getSchedule().getProgram().getType() != null
                    ? r.getSchedule().getProgram().getType().name() : null;
            this.location = r.getSchedule().getLocation();
        }

        if (this.programTitle == null) {
            this.programTitle = "Naquarium 관람권";
            this.programType = "ADMISSION";
        }
    }
}
